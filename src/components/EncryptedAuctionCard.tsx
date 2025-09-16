import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useFHEBidding } from '@/hooks/useFHEBidding';
import { useContractData } from '@/hooks/useContractData';
import { useContractEvents } from '@/hooks/useContractEvents';
import { useAccount } from 'wagmi';
import { Lock, Eye, EyeOff, Clock, User, Shield, Activity } from 'lucide-react';
import { toast } from 'sonner';

interface EncryptedAuctionCardProps {
  auctionId: number;
  name: string;
  description: string;
  imageUrl: string;
  currentBid: number;
  bidCount: number;
  isActive: boolean;
  isEnded: boolean;
  seller: string;
  endTime: number;
  minBidIncrement: number;
}

export const EncryptedAuctionCard = ({
  auctionId,
  name,
  description,
  imageUrl,
  currentBid,
  bidCount,
  isActive,
  isEnded,
  seller,
  endTime,
  minBidIncrement,
}: EncryptedAuctionCardProps) => {
  const { address } = useAccount();
  const { placeEncryptedBid, isBidding, isEncrypting, fheInitialized } = useFHEBidding();
  const { getEventsForAuction } = useContractEvents();
  const [bidAmount, setBidAmount] = useState('');
  const [showBidForm, setShowBidForm] = useState(false);
  const [isEncrypted, setIsEncrypted] = useState(true);
  const [auctionEvents, setAuctionEvents] = useState<any[]>([]);
  const [realTimeBidCount, setRealTimeBidCount] = useState(bidCount);

  const timeLeft = endTime - Date.now();
  const hoursLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60)));
  const minutesLeft = Math.max(0, Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)));

  // Update real-time bid count from events
  useEffect(() => {
    const events = getEventsForAuction(auctionId);
    setAuctionEvents(events);
    
    const bidEvents = events.filter(event => event.type === 'BidPlaced');
    setRealTimeBidCount(bidEvents.length);
  }, [auctionId, getEventsForAuction]);

  const handlePlaceBid = async () => {
    if (!fheInitialized) {
      toast.error('FHE encryption not initialized. Please wait...');
      return;
    }

    const amount = parseFloat(bidAmount);
    if (amount <= currentBid + minBidIncrement) {
      toast.error(`Bid must be at least ${currentBid + minBidIncrement} ETH`);
      return;
    }

    try {
      await placeEncryptedBid(auctionId, amount);
      setBidAmount('');
      setShowBidForm(false);
    } catch (error) {
      console.error('Failed to place bid:', error);
      toast.error('Failed to place encrypted bid');
    }
  };

  const toggleEncryption = () => {
    setIsEncrypted(!isEncrypted);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50 backdrop-blur-sm">
      <CardHeader className="relative">
        <div className="flex items-center justify-between mb-2">
          <Badge variant={isActive ? "default" : "secondary"} className="bg-green-500/20 text-green-400 border-green-500/30">
            {isActive ? "Live" : isEnded ? "Ended" : "Inactive"}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleEncryption}
            className="text-slate-400 hover:text-white"
          >
            {isEncrypted ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        
        <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
          <Shield className="h-5 w-5 text-cyan-400" />
          {name}
        </CardTitle>
        
        <CardDescription className="text-slate-300">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Auction Image */}
        <div className="relative">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-48 object-cover rounded-lg"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
          <div className="absolute top-2 right-2">
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
              <Lock className="h-3 w-3 mr-1" />
              FHE Encrypted
            </Badge>
          </div>
        </div>

        {/* Auction Details */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">Current Bid:</span>
            <span className="text-white font-semibold">
              {isEncrypted ? "🔒 Encrypted" : `${currentBid} ETH`}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">Bid Count:</span>
            <span className="text-white font-semibold flex items-center gap-2">
              {isEncrypted ? "🔒 Encrypted" : realTimeBidCount}
              {auctionEvents.length > 0 && (
                <Activity className="h-4 w-4 text-green-400 animate-pulse" />
              )}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">Time Left:</span>
            <span className="text-white font-semibold flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {hoursLeft}h {minutesLeft}m
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">Seller:</span>
            <span className="text-white font-semibold flex items-center gap-1">
              <User className="h-4 w-4" />
              {seller.slice(0, 6)}...{seller.slice(-4)}
            </span>
          </div>
        </div>

        {/* Bid Form */}
        {isActive && !isEnded && address && address !== seller && (
          <div className="space-y-3">
            {!showBidForm ? (
              <Button
                onClick={() => setShowBidForm(true)}
                disabled={!fheInitialized}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white disabled:opacity-50"
              >
                <Lock className="h-4 w-4 mr-2" />
                {fheInitialized ? 'Place Encrypted Bid' : 'Initializing FHE...'}
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder={`Min: ${currentBid + minBidIncrement} ETH`}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="flex-1"
                    step="0.01"
                    min={currentBid + minBidIncrement}
                  />
                  <span className="text-slate-400 text-sm">ETH</span>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={handlePlaceBid}
                    disabled={isBidding || isEncrypting || !bidAmount}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white"
                  >
                    {isEncrypting ? (
                      <>
                        <Lock className="h-4 w-4 mr-2 animate-spin" />
                        Encrypting...
                      </>
                    ) : isBidding ? (
                      <>
                        <Lock className="h-4 w-4 mr-2 animate-pulse" />
                        Placing Bid...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Place Encrypted Bid
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => setShowBidForm(false)}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Encryption Status */}
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
          <div className="flex items-center gap-2 text-sm">
            <Shield className="h-4 w-4 text-cyan-400" />
            <span className="text-slate-300">
              All bid data is encrypted using FHE technology
            </span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Your bid amount remains private until auction completion
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
