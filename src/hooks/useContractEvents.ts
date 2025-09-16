import { useEffect, useState, useCallback } from 'react';
import { useWatchContractEvent, useAccount } from 'wagmi';
import { contractConfig } from '../config/contracts';
import { toast } from 'sonner';

// Hook for listening to contract events
export const useContractEvents = () => {
  const { address } = useAccount();
  const [events, setEvents] = useState<any[]>([]);

  // Listen to AuctionCreated events
  useWatchContractEvent({
    address: contractConfig.address as `0x${string}`,
    abi: contractConfig.abi,
    eventName: 'AuctionCreated',
    onLogs(logs) {
      logs.forEach((log) => {
        const event = {
          type: 'AuctionCreated',
          auctionId: Number(log.args.auctionId),
          seller: log.args.seller,
          name: log.args.name,
          timestamp: Date.now(),
          blockNumber: log.blockNumber,
          transactionHash: log.transactionHash,
        };
        
        setEvents(prev => [event, ...prev.slice(0, 99)]); // Keep last 100 events
        toast.success(`New auction created: ${log.args.name}`);
      });
    },
  });

  // Listen to BidPlaced events
  useWatchContractEvent({
    address: contractConfig.address as `0x${string}`,
    abi: contractConfig.abi,
    eventName: 'BidPlaced',
    onLogs(logs) {
      logs.forEach((log) => {
        const event = {
          type: 'BidPlaced',
          auctionId: Number(log.args.auctionId),
          bidId: Number(log.args.bidId),
          bidder: log.args.bidder,
          amount: Number(log.args.amount), // This will be 0 due to FHE encryption
          timestamp: Date.now(),
          blockNumber: log.blockNumber,
          transactionHash: log.transactionHash,
        };
        
        setEvents(prev => [event, ...prev.slice(0, 99)]);
        
        // Only show toast if it's not the current user's bid
        if (log.args.bidder !== address) {
          toast.info(`New bid placed on auction ${log.args.auctionId}`);
        }
      });
    },
  });

  // Listen to AuctionEnded events
  useWatchContractEvent({
    address: contractConfig.address as `0x${string}`,
    abi: contractConfig.abi,
    eventName: 'AuctionEnded',
    onLogs(logs) {
      logs.forEach((log) => {
        const event = {
          type: 'AuctionEnded',
          auctionId: Number(log.args.auctionId),
          winner: log.args.winner,
          finalPrice: Number(log.args.finalPrice), // This will be 0 due to FHE encryption
          timestamp: Date.now(),
          blockNumber: log.blockNumber,
          transactionHash: log.transactionHash,
        };
        
        setEvents(prev => [event, ...prev.slice(0, 99)]);
        toast.success(`Auction ${log.args.auctionId} ended! Winner: ${log.args.winner.slice(0, 6)}...`);
      });
    },
  });

  // Listen to AuctionSettled events
  useWatchContractEvent({
    address: contractConfig.address as `0x${string}`,
    abi: contractConfig.abi,
    eventName: 'AuctionSettled',
    onLogs(logs) {
      logs.forEach((log) => {
        const event = {
          type: 'AuctionSettled',
          auctionId: Number(log.args.auctionId),
          winner: log.args.winner,
          finalPrice: Number(log.args.finalPrice), // This will be 0 due to FHE encryption
          timestamp: Date.now(),
          blockNumber: log.blockNumber,
          transactionHash: log.transactionHash,
        };
        
        setEvents(prev => [event, ...prev.slice(0, 99)]);
        toast.success(`Auction ${log.args.auctionId} settled!`);
      });
    },
  });

  // Listen to BidWithdrawn events
  useWatchContractEvent({
    address: contractConfig.address as `0x${string}`,
    abi: contractConfig.abi,
    eventName: 'BidWithdrawn',
    onLogs(logs) {
      logs.forEach((log) => {
        const event = {
          type: 'BidWithdrawn',
          auctionId: Number(log.args.auctionId),
          bidId: Number(log.args.bidId),
          bidder: log.args.bidder,
          timestamp: Date.now(),
          blockNumber: log.blockNumber,
          transactionHash: log.transactionHash,
        };
        
        setEvents(prev => [event, ...prev.slice(0, 99)]);
        
        if (log.args.bidder === address) {
          toast.info(`Your bid withdrawn from auction ${log.args.auctionId}`);
        }
      });
    },
  });

  // Listen to ReputationUpdated events
  useWatchContractEvent({
    address: contractConfig.address as `0x${string}`,
    abi: contractConfig.abi,
    eventName: 'ReputationUpdated',
    onLogs(logs) {
      logs.forEach((log) => {
        const event = {
          type: 'ReputationUpdated',
          user: log.args.user,
          reputation: Number(log.args.reputation), // This will be 0 due to FHE encryption
          timestamp: Date.now(),
          blockNumber: log.blockNumber,
          transactionHash: log.transactionHash,
        };
        
        setEvents(prev => [event, ...prev.slice(0, 99)]);
        
        if (log.args.user === address) {
          toast.info('Your reputation has been updated');
        }
      });
    },
  });

  // Get events by type
  const getEventsByType = useCallback((type: string) => {
    return events.filter(event => event.type === type);
  }, [events]);

  // Get events for a specific auction
  const getEventsForAuction = useCallback((auctionId: number) => {
    return events.filter(event => 
      event.auctionId === auctionId || 
      (event.type === 'AuctionCreated' && event.auctionId === auctionId)
    );
  }, [events]);

  // Get events for current user
  const getUserEvents = useCallback(() => {
    if (!address) return [];
    
    return events.filter(event => 
      event.bidder === address || 
      event.seller === address || 
      event.winner === address || 
      event.user === address
    );
  }, [events, address]);

  // Get recent events (last 24 hours)
  const getRecentEvents = useCallback(() => {
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    return events.filter(event => event.timestamp > oneDayAgo);
  }, [events]);

  // Clear events
  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  // Get event statistics
  const getEventStats = useCallback(() => {
    const stats = {
      total: events.length,
      auctionCreated: getEventsByType('AuctionCreated').length,
      bidPlaced: getEventsByType('BidPlaced').length,
      auctionEnded: getEventsByType('AuctionEnded').length,
      auctionSettled: getEventsByType('AuctionSettled').length,
      bidWithdrawn: getEventsByType('BidWithdrawn').length,
      reputationUpdated: getEventsByType('ReputationUpdated').length,
    };
    
    return stats;
  }, [events, getEventsByType]);

  return {
    // State
    events,
    
    // Actions
    getEventsByType,
    getEventsForAuction,
    getUserEvents,
    getRecentEvents,
    clearEvents,
    getEventStats,
  };
};
