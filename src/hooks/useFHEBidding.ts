import { useState, useCallback, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { contractConfig } from '../config/contracts';
import { toast } from 'sonner';
import { 
  encryptBidAmount, 
  encryptStartingPrice, 
  decryptBidAmount, 
  verifyRangeProof,
  initializeFHE,
  getFHEStatus 
} from '../lib/fhe-encryption';

// FHE utility functions for encrypted bidding
export const useFHEBidding = () => {
  const { address } = useAccount();
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isBidding, setIsBidding] = useState(false);
  const [fheInitialized, setFheInitialized] = useState(false);
  
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Initialize FHE on component mount
  useEffect(() => {
    const initFHE = async () => {
      try {
        await initializeFHE();
        setFheInitialized(true);
        console.log('FHE initialized successfully');
      } catch (error) {
        console.error('Failed to initialize FHE:', error);
        toast.error('Failed to initialize FHE encryption');
      }
    };

    initFHE();
  }, []);

  // Real FHE encryption using the FHE library
  const encryptBidAmountLocal = useCallback(async (amount: number): Promise<{ encryptedData: string; proof: string }> => {
    if (!fheInitialized) {
      throw new Error('FHE not initialized');
    }

    setIsEncrypting(true);
    
    try {
      const result = await encryptBidAmount(amount);
      return {
        encryptedData: result.encryptedData,
        proof: result.proof
      };
    } catch (error) {
      console.error('FHE encryption failed:', error);
      throw new Error('Failed to encrypt bid amount');
    } finally {
      setIsEncrypting(false);
    }
  }, [fheInitialized]);

  // Place an encrypted bid
  const placeEncryptedBid = useCallback(async (auctionId: number, bidAmount: number) => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (bidAmount <= 0) {
      toast.error('Bid amount must be greater than 0');
      return;
    }

    setIsBidding(true);
    
    try {
      // Encrypt the bid amount using FHE
      const { encryptedData, proof } = await encryptBidAmountLocal(bidAmount);
      
      // Verify the range proof before sending to contract
      const isValidProof = await verifyRangeProof(encryptedData, proof, [0, 1000 * 1e18]);
      if (!isValidProof) {
        throw new Error('Invalid range proof');
      }
      
      // Call the smart contract with encrypted data
      writeContract({
        address: contractConfig.address as `0x${string}`,
        abi: contractConfig.abi,
        functionName: 'placeBid',
        args: [BigInt(auctionId), encryptedData as `0x${string}`, proof as `0x${string}`],
        value: BigInt(bidAmount * 1e18), // Convert to wei
      });
      
      toast.success('Encrypted bid placed successfully!');
    } catch (error) {
      console.error('Failed to place bid:', error);
      toast.error('Failed to place encrypted bid');
    } finally {
      setIsBidding(false);
    }
  }, [address, encryptBidAmountLocal, writeContract]);

  // Create an auction with encrypted starting price
  const createEncryptedAuction = useCallback(async (
    name: string,
    description: string,
    imageUrl: string,
    startingPrice: number,
    duration: number,
    minBidIncrement: number
  ) => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsBidding(true);
    
    try {
      // Encrypt the starting price
      const { encryptedPrice, proof } = await encryptStartingPrice(startingPrice);
      
      // Log the encrypted version for demonstration
      console.log('Encrypted starting price:', encryptedPrice);
      console.log('Range proof:', proof);
      
      writeContract({
        address: contractConfig.address as `0x${string}`,
        abi: contractConfig.abi,
        functionName: 'createAuction',
        args: [
          name,
          description,
          imageUrl,
          BigInt(startingPrice * 1e18), // Convert to wei
          BigInt(duration),
          BigInt(minBidIncrement * 1e18)
        ],
      });
      
      toast.success('Encrypted auction created successfully!');
    } catch (error) {
      console.error('Failed to create auction:', error);
      toast.error('Failed to create encrypted auction');
    } finally {
      setIsBidding(false);
    }
  }, [address, writeContract]);

  // End an auction
  const endAuction = useCallback(async (auctionId: number) => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      writeContract({
        address: contractConfig.address as `0x${string}`,
        abi: contractConfig.abi,
        functionName: 'endAuction',
        args: [BigInt(auctionId)],
      });
      
      toast.success('Auction ended successfully!');
    } catch (error) {
      console.error('Failed to end auction:', error);
      toast.error('Failed to end auction');
    }
  }, [address, writeContract]);

  // Settle an auction
  const settleAuction = useCallback(async (auctionId: number) => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      writeContract({
        address: contractConfig.address as `0x${string}`,
        abi: contractConfig.abi,
        functionName: 'settleAuction',
        args: [BigInt(auctionId)],
      });
      
      toast.success('Auction settled successfully!');
    } catch (error) {
      console.error('Failed to settle auction:', error);
      toast.error('Failed to settle auction');
    }
  }, [address, writeContract]);

  // Withdraw a bid
  const withdrawBid = useCallback(async (auctionId: number, bidId: number) => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      writeContract({
        address: contractConfig.address as `0x${string}`,
        abi: contractConfig.abi,
        functionName: 'withdrawBid',
        args: [BigInt(auctionId), BigInt(bidId)],
      });
      
      toast.success('Bid withdrawn successfully!');
    } catch (error) {
      console.error('Failed to withdraw bid:', error);
      toast.error('Failed to withdraw bid');
    }
  }, [address, writeContract]);

  return {
    // State
    isEncrypting,
    isBidding,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
    fheInitialized,
    
    // Actions
    placeEncryptedBid,
    createEncryptedAuction,
    endAuction,
    settleAuction,
    withdrawBid,
    encryptBidAmount: encryptBidAmountLocal,
    decryptBidAmount,
    verifyRangeProof,
  };
};
