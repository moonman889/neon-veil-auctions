import { useContract, useContractRead, useContractWrite, useAccount } from 'wagmi';
import { contractConfig } from '../config/contracts';

export function useNeonVeilContract() {
  return useContract({
    address: contractConfig.address as `0x${string}`,
    abi: contractConfig.abi,
  });
}

export function useAuctionInfo(auctionId: number) {
  return useContractRead({
    address: contractConfig.address as `0x${string}`,
    abi: contractConfig.abi,
    functionName: 'getAuctionInfo',
    args: [BigInt(auctionId)],
  });
}

export function useBidInfo(bidId: number) {
  return useContractRead({
    address: contractConfig.address as `0x${string}`,
    abi: contractConfig.abi,
    functionName: 'getBidInfo',
    args: [BigInt(bidId)],
  });
}

export function useAuctionResult(auctionId: number) {
  return useContractRead({
    address: contractConfig.address as `0x${string}`,
    abi: contractConfig.abi,
    functionName: 'getAuctionResult',
    args: [BigInt(auctionId)],
  });
}

export function useUserReputation(userAddress: string) {
  return useContractRead({
    address: contractConfig.address as `0x${string}`,
    abi: contractConfig.abi,
    functionName: 'getUserReputation',
    args: [userAddress as `0x${string}`],
  });
}

export function useCreateAuction() {
  return useContractWrite({
    address: contractConfig.address as `0x${string}`,
    abi: contractConfig.abi,
    functionName: 'createAuction',
  });
}

export function usePlaceBid() {
  return useContractWrite({
    address: contractConfig.address as `0x${string}`,
    abi: contractConfig.abi,
    functionName: 'placeBid',
  });
}

export function useEndAuction() {
  return useContractWrite({
    address: contractConfig.address as `0x${string}`,
    abi: contractConfig.abi,
    functionName: 'endAuction',
  });
}

export function useSettleAuction() {
  return useContractWrite({
    address: contractConfig.address as `0x${string}`,
    abi: contractConfig.abi,
    functionName: 'settleAuction',
  });
}

export function useWithdrawBid() {
  return useContractWrite({
    address: contractConfig.address as `0x${string}`,
    abi: contractConfig.abi,
    functionName: 'withdrawBid',
  });
}
