// Contract configuration for Neon Veil Auctions
export const contractConfig = {
  // Contract address on Sepolia testnet (to be updated after deployment)
  address: import.meta.env.VITE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
  
  // Contract ABI (simplified version - full ABI will be generated after compilation)
  abi: [
    // Events
    'event AuctionCreated(uint256 indexed auctionId, address indexed seller, string name)',
    'event BidPlaced(uint256 indexed auctionId, uint256 indexed bidId, address indexed bidder, uint32 amount)',
    'event AuctionEnded(uint256 indexed auctionId, address indexed winner, uint32 finalPrice)',
    'event AuctionSettled(uint256 indexed auctionId, address indexed winner, uint32 finalPrice)',
    'event BidWithdrawn(uint256 indexed auctionId, uint256 indexed bidId, address indexed bidder)',
    'event ReputationUpdated(address indexed user, uint32 reputation)',
    
    // Functions
    'function createAuction(string memory _name, string memory _description, string memory _imageUrl, uint256 _startingPrice, uint256 _duration, uint256 _minBidIncrement) external returns (uint256)',
    'function placeBid(uint256 auctionId, bytes calldata bidAmount, bytes calldata inputProof) external payable returns (uint256)',
    'function endAuction(uint256 auctionId) external',
    'function settleAuction(uint256 auctionId) external',
    'function withdrawBid(uint256 auctionId, uint256 bidId) external',
    'function getAuctionInfo(uint256 auctionId) external view returns (string memory, string memory, string memory, uint8, uint8, uint8, bool, bool, bool, address, address, uint256, uint256, uint256)',
    'function getBidInfo(uint256 bidId) external view returns (uint8, address, uint256, bool)',
    'function getAuctionResult(uint256 auctionId) external view returns (uint8, address, bool, uint256)',
    'function getUserReputation(address user) external view returns (uint8)',
    'function getSellerReputation(address seller) external view returns (uint8)',
  ] as const,
  
  // Contract deployment block (to be updated after deployment)
  deploymentBlock: 0,
} as const;
