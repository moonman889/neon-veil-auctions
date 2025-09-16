import { useCallback, useState } from 'react';
import { useReadContract, useAccount } from 'wagmi';
import { contractConfig } from '../config/contracts';
import { decryptBidAmount } from '../lib/fhe-encryption';

// Hook for reading encrypted contract data
export const useContractData = () => {
  const { address } = useAccount();
  const [decryptedData, setDecryptedData] = useState<Record<string, any>>({});

  // Read auction counter
  const { data: auctionCounter, refetch: refetchAuctionCounter } = useReadContract({
    address: contractConfig.address as `0x${string}`,
    abi: contractConfig.abi,
    functionName: 'auctionCounter',
  });

  // Read auction information
  const getAuctionInfo = useCallback(async (auctionId: number) => {
    try {
      const { data } = await useReadContract({
        address: contractConfig.address as `0x${string}`,
        abi: contractConfig.abi,
        functionName: 'getAuctionInfo',
        args: [BigInt(auctionId)],
      });

      if (data) {
        const [
          name,
          description,
          imageUrl,
          startingPrice,
          currentBid,
          bidCount,
          isActive,
          isEnded,
          isVerified,
          seller,
          currentBidder,
          startTime,
          endTime,
          minBidIncrement
        ] = data as any[];

        return {
          auctionId,
          name,
          description,
          imageUrl,
          startingPrice: Number(startingPrice),
          currentBid: Number(currentBid),
          bidCount: Number(bidCount),
          isActive,
          isEnded,
          isVerified,
          seller,
          currentBidder,
          startTime: Number(startTime),
          endTime: Number(endTime),
          minBidIncrement: Number(minBidIncrement)
        };
      }
    } catch (error) {
      console.error('Failed to get auction info:', error);
      throw error;
    }
  }, []);

  // Read bid information
  const getBidInfo = useCallback(async (bidId: number) => {
    try {
      const { data } = await useReadContract({
        address: contractConfig.address as `0x${string}`,
        abi: contractConfig.abi,
        functionName: 'getBidInfo',
        args: [BigInt(bidId)],
      });

      if (data) {
        const [amount, bidder, timestamp, isWithdrawn] = data as any[];
        return {
          bidId,
          amount: Number(amount),
          bidder,
          timestamp: Number(timestamp),
          isWithdrawn
        };
      }
    } catch (error) {
      console.error('Failed to get bid info:', error);
      throw error;
    }
  }, []);

  // Read auction result
  const getAuctionResult = useCallback(async (auctionId: number) => {
    try {
      const { data } = await useReadContract({
        address: contractConfig.address as `0x${string}`,
        abi: contractConfig.abi,
        functionName: 'getAuctionResult',
        args: [BigInt(auctionId)],
      });

      if (data) {
        const [finalPrice, winner, isSettled, settlementTime] = data as any[];
        return {
          auctionId,
          finalPrice: Number(finalPrice),
          winner,
          isSettled,
          settlementTime: Number(settlementTime)
        };
      }
    } catch (error) {
      console.error('Failed to get auction result:', error);
      throw error;
    }
  }, []);

  // Read user reputation
  const getUserReputation = useCallback(async (userAddress: string) => {
    try {
      const { data } = await useReadContract({
        address: contractConfig.address as `0x${string}`,
        abi: contractConfig.abi,
        functionName: 'getUserReputation',
        args: [userAddress as `0x${string}`],
      });

      return data ? Number(data) : 0;
    } catch (error) {
      console.error('Failed to get user reputation:', error);
      return 0;
    }
  }, []);

  // Read seller reputation
  const getSellerReputation = useCallback(async (sellerAddress: string) => {
    try {
      const { data } = await useReadContract({
        address: contractConfig.address as `0x${string}`,
        abi: contractConfig.abi,
        functionName: 'getSellerReputation',
        args: [sellerAddress as `0x${string}`],
      });

      return data ? Number(data) : 0;
    } catch (error) {
      console.error('Failed to get seller reputation:', error);
      return 0;
    }
  }, []);

  // Decrypt and cache encrypted data
  const decryptAndCache = useCallback(async (key: string, encryptedData: string) => {
    try {
      if (decryptedData[key]) {
        return decryptedData[key];
      }

      const decrypted = await decryptBidAmount(encryptedData);
      setDecryptedData(prev => ({
        ...prev,
        [key]: decrypted
      }));
      
      return decrypted;
    } catch (error) {
      console.error('Failed to decrypt data:', error);
      throw error;
    }
  }, [decryptedData]);

  // Get all auctions with decrypted data
  const getAllAuctions = useCallback(async () => {
    try {
      const auctions = [];
      const totalAuctions = Number(auctionCounter) || 0;

      for (let i = 0; i < totalAuctions; i++) {
        try {
          const auctionInfo = await getAuctionInfo(i);
          auctions.push(auctionInfo);
        } catch (error) {
          console.error(`Failed to get auction ${i}:`, error);
        }
      }

      return auctions;
    } catch (error) {
      console.error('Failed to get all auctions:', error);
      return [];
    }
  }, [auctionCounter, getAuctionInfo]);

  // Get active auctions
  const getActiveAuctions = useCallback(async () => {
    try {
      const allAuctions = await getAllAuctions();
      return allAuctions.filter(auction => auction.isActive && !auction.isEnded);
    } catch (error) {
      console.error('Failed to get active auctions:', error);
      return [];
    }
  }, [getAllAuctions]);

  // Get user's auctions
  const getUserAuctions = useCallback(async (userAddress?: string) => {
    try {
      const targetAddress = userAddress || address;
      if (!targetAddress) return [];

      const allAuctions = await getAllAuctions();
      return allAuctions.filter(auction => 
        auction.seller.toLowerCase() === targetAddress.toLowerCase()
      );
    } catch (error) {
      console.error('Failed to get user auctions:', error);
      return [];
    }
  }, [address, getAllAuctions]);

  // Get user's bids
  const getUserBids = useCallback(async (userAddress?: string) => {
    try {
      const targetAddress = userAddress || address;
      if (!targetAddress) return [];

      // This would require iterating through all bids
      // In a real implementation, you might want to add a mapping for user bids
      const bids = [];
      // Implementation would depend on contract structure
      
      return bids;
    } catch (error) {
      console.error('Failed to get user bids:', error);
      return [];
    }
  }, [address]);

  return {
    // State
    auctionCounter,
    decryptedData,
    
    // Actions
    getAuctionInfo,
    getBidInfo,
    getAuctionResult,
    getUserReputation,
    getSellerReputation,
    decryptAndCache,
    getAllAuctions,
    getActiveAuctions,
    getUserAuctions,
    getUserBids,
    
    // Refetch functions
    refetchAuctionCounter,
  };
};
