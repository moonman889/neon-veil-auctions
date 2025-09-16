// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract NeonVeilAuctions is SepoliaConfig {
    using FHE for *;
    
    struct Auction {
        euint32 auctionId;
        euint32 startingPrice;
        euint32 currentBid;
        euint32 bidCount;
        bool isActive;
        bool isEnded;
        bool isVerified;
        string name;
        string description;
        string imageUrl;
        address seller;
        address currentBidder;
        uint256 startTime;
        uint256 endTime;
        uint256 minBidIncrement;
    }
    
    struct Bid {
        euint32 bidId;
        euint32 amount;
        address bidder;
        uint256 timestamp;
        bool isWithdrawn;
    }
    
    struct AuctionResult {
        euint32 finalPrice;
        address winner;
        bool isSettled;
        uint256 settlementTime;
    }
    
    mapping(uint256 => Auction) public auctions;
    mapping(uint256 => Bid) public bids;
    mapping(uint256 => AuctionResult) public auctionResults;
    mapping(address => euint32) public userReputation;
    mapping(address => euint32) public sellerReputation;
    
    uint256 public auctionCounter;
    uint256 public bidCounter;
    
    address public owner;
    address public verifier;
    uint256 public platformFeePercentage; // In basis points (100 = 1%)
    
    event AuctionCreated(uint256 indexed auctionId, address indexed seller, string name);
    event BidPlaced(uint256 indexed auctionId, uint256 indexed bidId, address indexed bidder, uint32 amount);
    event AuctionEnded(uint256 indexed auctionId, address indexed winner, uint32 finalPrice);
    event AuctionSettled(uint256 indexed auctionId, address indexed winner, uint32 finalPrice);
    event BidWithdrawn(uint256 indexed auctionId, uint256 indexed bidId, address indexed bidder);
    event ReputationUpdated(address indexed user, uint32 reputation);
    
    constructor(address _verifier, uint256 _platformFeePercentage) {
        owner = msg.sender;
        verifier = _verifier;
        platformFeePercentage = _platformFeePercentage;
    }
    
    function createAuction(
        string memory _name,
        string memory _description,
        string memory _imageUrl,
        uint256 _startingPrice,
        uint256 _duration,
        uint256 _minBidIncrement
    ) public returns (uint256) {
        require(bytes(_name).length > 0, "Auction name cannot be empty");
        require(_duration > 0, "Duration must be positive");
        require(_minBidIncrement > 0, "Minimum bid increment must be positive");
        
        uint256 auctionId = auctionCounter++;
        
        auctions[auctionId] = Auction({
            auctionId: FHE.asEuint32(0), // Will be set properly later
            startingPrice: FHE.asEuint32(0), // Will be set to actual value via FHE operations
            currentBid: FHE.asEuint32(0),
            bidCount: FHE.asEuint32(0),
            isActive: true,
            isEnded: false,
            isVerified: false,
            name: _name,
            description: _description,
            imageUrl: _imageUrl,
            seller: msg.sender,
            currentBidder: address(0),
            startTime: block.timestamp,
            endTime: block.timestamp + _duration,
            minBidIncrement: _minBidIncrement
        });
        
        emit AuctionCreated(auctionId, msg.sender, _name);
        return auctionId;
    }
    
    function placeBid(
        uint256 auctionId,
        externalEuint32 bidAmount,
        bytes calldata inputProof
    ) public payable returns (uint256) {
        require(auctions[auctionId].seller != address(0), "Auction does not exist");
        require(auctions[auctionId].isActive, "Auction is not active");
        require(block.timestamp <= auctions[auctionId].endTime, "Auction has ended");
        require(msg.sender != auctions[auctionId].seller, "Seller cannot bid on own auction");
        
        uint256 bidId = bidCounter++;
        
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalBidAmount = FHE.fromExternal(bidAmount, inputProof);
        
        // Check if bid is higher than current bid plus minimum increment
        euint32 currentBid = auctions[auctionId].currentBid;
        euint32 minBid = FHE.add(currentBid, FHE.asEuint32(auctions[auctionId].minBidIncrement));
        require(FHE.decrypt(FHE.gt(internalBidAmount, minBid)), "Bid must be higher than current bid plus minimum increment");
        
        bids[bidId] = Bid({
            bidId: FHE.asEuint32(0), // Will be set properly later
            amount: internalBidAmount,
            bidder: msg.sender,
            timestamp: block.timestamp,
            isWithdrawn: false
        });
        
        // Update auction state
        auctions[auctionId].currentBid = internalBidAmount;
        auctions[auctionId].currentBidder = msg.sender;
        auctions[auctionId].bidCount = FHE.add(auctions[auctionId].bidCount, FHE.asEuint32(1));
        
        emit BidPlaced(auctionId, bidId, msg.sender, 0); // Amount will be decrypted off-chain
        return bidId;
    }
    
    function endAuction(uint256 auctionId) public {
        require(auctions[auctionId].seller != address(0), "Auction does not exist");
        require(auctions[auctionId].isActive, "Auction is not active");
        require(
            block.timestamp > auctions[auctionId].endTime || msg.sender == auctions[auctionId].seller,
            "Only seller can end auction before time expires"
        );
        
        auctions[auctionId].isActive = false;
        auctions[auctionId].isEnded = true;
        
        address winner = auctions[auctionId].currentBidder;
        euint32 finalPrice = auctions[auctionId].currentBid;
        
        auctionResults[auctionId] = AuctionResult({
            finalPrice: finalPrice,
            winner: winner,
            isSettled: false,
            settlementTime: 0
        });
        
        emit AuctionEnded(auctionId, winner, 0); // Price will be decrypted off-chain
    }
    
    function settleAuction(uint256 auctionId) public {
        require(auctions[auctionId].seller != address(0), "Auction does not exist");
        require(auctions[auctionId].isEnded, "Auction must be ended");
        require(!auctionResults[auctionId].isSettled, "Auction already settled");
        require(
            msg.sender == auctions[auctionId].seller || msg.sender == auctionResults[auctionId].winner,
            "Only seller or winner can settle"
        );
        
        auctionResults[auctionId].isSettled = true;
        auctionResults[auctionId].settlementTime = block.timestamp;
        
        // Transfer funds (in a real implementation, this would handle actual ETH transfers)
        // For now, we'll just mark as settled
        
        emit AuctionSettled(auctionId, auctionResults[auctionId].winner, 0); // Price will be decrypted off-chain
    }
    
    function withdrawBid(uint256 auctionId, uint256 bidId) public {
        require(bids[bidId].bidder == msg.sender, "Only bidder can withdraw");
        require(!bids[bidId].isWithdrawn, "Bid already withdrawn");
        require(auctions[auctionId].isActive, "Auction must be active");
        require(auctions[auctionId].currentBidder != msg.sender, "Cannot withdraw winning bid");
        
        bids[bidId].isWithdrawn = true;
        
        // In a real implementation, refund the bidder
        // payable(msg.sender).transfer(bidAmount);
        
        emit BidWithdrawn(auctionId, bidId, msg.sender);
    }
    
    function verifyAuction(uint256 auctionId, bool isVerified) public {
        require(msg.sender == verifier, "Only verifier can verify auctions");
        require(auctions[auctionId].seller != address(0), "Auction does not exist");
        
        auctions[auctionId].isVerified = isVerified;
    }
    
    function updateReputation(address user, euint32 reputation) public {
        require(msg.sender == verifier, "Only verifier can update reputation");
        require(user != address(0), "Invalid user address");
        
        // Determine if user is seller or bidder based on context
        if (auctions[auctionCounter - 1].seller == user) {
            sellerReputation[user] = reputation;
        } else {
            userReputation[user] = reputation;
        }
        
        emit ReputationUpdated(user, 0); // FHE.decrypt(reputation) - will be decrypted off-chain
    }
    
    function getAuctionInfo(uint256 auctionId) public view returns (
        string memory name,
        string memory description,
        string memory imageUrl,
        uint8 startingPrice,
        uint8 currentBid,
        uint8 bidCount,
        bool isActive,
        bool isEnded,
        bool isVerified,
        address seller,
        address currentBidder,
        uint256 startTime,
        uint256 endTime,
        uint256 minBidIncrement
    ) {
        Auction storage auction = auctions[auctionId];
        return (
            auction.name,
            auction.description,
            auction.imageUrl,
            0, // FHE.decrypt(auction.startingPrice) - will be decrypted off-chain
            0, // FHE.decrypt(auction.currentBid) - will be decrypted off-chain
            0, // FHE.decrypt(auction.bidCount) - will be decrypted off-chain
            auction.isActive,
            auction.isEnded,
            auction.isVerified,
            auction.seller,
            auction.currentBidder,
            auction.startTime,
            auction.endTime,
            auction.minBidIncrement
        );
    }
    
    function getBidInfo(uint256 bidId) public view returns (
        uint8 amount,
        address bidder,
        uint256 timestamp,
        bool isWithdrawn
    ) {
        Bid storage bid = bids[bidId];
        return (
            0, // FHE.decrypt(bid.amount) - will be decrypted off-chain
            bid.bidder,
            bid.timestamp,
            bid.isWithdrawn
        );
    }
    
    function getAuctionResult(uint256 auctionId) public view returns (
        uint8 finalPrice,
        address winner,
        bool isSettled,
        uint256 settlementTime
    ) {
        AuctionResult storage result = auctionResults[auctionId];
        return (
            0, // FHE.decrypt(result.finalPrice) - will be decrypted off-chain
            result.winner,
            result.isSettled,
            result.settlementTime
        );
    }
    
    function getUserReputation(address user) public view returns (uint8) {
        return 0; // FHE.decrypt(userReputation[user]) - will be decrypted off-chain
    }
    
    function getSellerReputation(address seller) public view returns (uint8) {
        return 0; // FHE.decrypt(sellerReputation[seller]) - will be decrypted off-chain
    }
    
    function updatePlatformFee(uint256 _newFeePercentage) public {
        require(msg.sender == owner, "Only owner can update platform fee");
        require(_newFeePercentage <= 1000, "Platform fee cannot exceed 10%");
        
        platformFeePercentage = _newFeePercentage;
    }
    
    function withdrawPlatformFees() public {
        require(msg.sender == owner, "Only owner can withdraw platform fees");
        
        // In a real implementation, this would transfer accumulated platform fees
        // payable(owner).transfer(address(this).balance);
    }
}
