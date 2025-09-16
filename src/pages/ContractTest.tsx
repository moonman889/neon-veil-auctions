import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useFHEBidding } from '@/hooks/useFHEBidding';
import { useContractData } from '@/hooks/useContractData';
import { useContractEvents } from '@/hooks/useContractEvents';
import { FHEStatusIndicator, FHEInfoPanel } from '@/components/FHEStatusIndicator';
import { useAccount } from 'wagmi';
import { 
  Zap, 
  Lock, 
  Activity, 
  CheckCircle, 
  AlertCircle, 
  Play, 
  Pause, 
  RotateCcw,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner';

export const ContractTest = () => {
  const { address, isConnected } = useAccount();
  const { 
    placeEncryptedBid, 
    createEncryptedAuction, 
    endAuction, 
    settleAuction,
    isBidding, 
    isEncrypting, 
    fheInitialized,
    encryptBidAmount,
    decryptBidAmount
  } = useFHEBidding();
  
  const { 
    auctionCounter, 
    getAllAuctions, 
    getActiveAuctions,
    getUserAuctions 
  } = useContractData();
  
  const { 
    events, 
    getEventStats, 
    getRecentEvents,
    clearEvents 
  } = useContractEvents();

  const [testAmount, setTestAmount] = useState('1.0');
  const [testAuctionId, setTestAuctionId] = useState('0');
  const [encryptedData, setEncryptedData] = useState<string>('');
  const [decryptedData, setDecryptedData] = useState<number | null>(null);
  const [showEncryptedData, setShowEncryptedData] = useState(false);
  const [auctions, setAuctions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load auctions on component mount
  useEffect(() => {
    const loadAuctions = async () => {
      setIsLoading(true);
      try {
        const allAuctions = await getAllAuctions();
        setAuctions(allAuctions);
      } catch (error) {
        console.error('Failed to load auctions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isConnected) {
      loadAuctions();
    }
  }, [isConnected, getAllAuctions]);

  const handleTestEncryption = async () => {
    try {
      const amount = parseFloat(testAmount);
      if (isNaN(amount) || amount <= 0) {
        toast.error('Please enter a valid amount');
        return;
      }

      const result = await encryptBidAmount(amount);
      setEncryptedData(result.encryptedData);
      toast.success('Data encrypted successfully!');
    } catch (error) {
      console.error('Encryption test failed:', error);
      toast.error('Encryption test failed');
    }
  };

  const handleTestDecryption = async () => {
    if (!encryptedData) {
      toast.error('No encrypted data to decrypt');
      return;
    }

    try {
      const decrypted = await decryptBidAmount(encryptedData);
      setDecryptedData(decrypted);
      toast.success('Data decrypted successfully!');
    } catch (error) {
      console.error('Decryption test failed:', error);
      toast.error('Decryption test failed');
    }
  };

  const handleTestBid = async () => {
    try {
      const auctionId = parseInt(testAuctionId);
      const amount = parseFloat(testAmount);
      
      if (isNaN(auctionId) || isNaN(amount)) {
        toast.error('Please enter valid auction ID and amount');
        return;
      }

      await placeEncryptedBid(auctionId, amount);
    } catch (error) {
      console.error('Bid test failed:', error);
      toast.error('Bid test failed');
    }
  };

  const handleCreateTestAuction = async () => {
    try {
      await createEncryptedAuction(
        'Test Auction',
        'This is a test auction for FHE integration',
        '/placeholder.svg',
        0.1,
        3600, // 1 hour
        0.01
      );
    } catch (error) {
      console.error('Auction creation test failed:', error);
      toast.error('Auction creation test failed');
    }
  };

  const eventStats = getEventStats();
  const recentEvents = getRecentEvents();

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Wallet Not Connected</h2>
            <p className="text-slate-400">
              Please connect your wallet to test contract integration
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gradient-neon">Contract Integration Test</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Test FHE encryption, contract calls, and real-time event monitoring
          </p>
        </div>

        {/* FHE Status */}
        <div className="grid md:grid-cols-2 gap-6">
          <FHEStatusIndicator showDetails={true} />
          <FHEInfoPanel />
        </div>

        {/* Contract Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-cyan-400">{auctionCounter?.toString() || '0'}</div>
              <div className="text-sm text-slate-400">Total Auctions</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{auctions.length}</div>
              <div className="text-sm text-slate-400">Loaded Auctions</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">{eventStats.total}</div>
              <div className="text-sm text-slate-400">Total Events</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-400">{recentEvents.length}</div>
              <div className="text-sm text-slate-400">Recent Events</div>
            </CardContent>
          </Card>
        </div>

        {/* FHE Encryption Test */}
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Lock className="h-5 w-5 text-cyan-400" />
              FHE Encryption Test
            </CardTitle>
            <CardDescription>
              Test FHE encryption and decryption functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Input
                type="number"
                placeholder="Amount to encrypt"
                value={testAmount}
                onChange={(e) => setTestAmount(e.target.value)}
                className="flex-1"
                step="0.01"
                min="0"
              />
              <Button
                onClick={handleTestEncryption}
                disabled={!fheInitialized || isEncrypting}
                className="bg-cyan-500 hover:bg-cyan-600 text-white"
              >
                {isEncrypting ? 'Encrypting...' : 'Encrypt'}
              </Button>
            </div>
            
            {encryptedData && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowEncryptedData(!showEncryptedData)}
                  >
                    {showEncryptedData ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <span className="text-sm text-slate-400">Encrypted Data:</span>
                </div>
                <div className="bg-slate-800/50 p-3 rounded border border-slate-700/50">
                  <code className="text-xs text-slate-300 break-all">
                    {showEncryptedData ? encryptedData : '🔒 Encrypted data hidden'}
                  </code>
                </div>
                <Button
                  onClick={handleTestDecryption}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  Decrypt
                </Button>
                {decryptedData !== null && (
                  <div className="text-green-400 font-semibold">
                    Decrypted: {decryptedData} ETH
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contract Interaction Test */}
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-400" />
              Contract Interaction Test
            </CardTitle>
            <CardDescription>
              Test contract function calls with FHE encryption
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Auction ID</label>
                <Input
                  type="number"
                  placeholder="Auction ID"
                  value={testAuctionId}
                  onChange={(e) => setTestAuctionId(e.target.value)}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Bid Amount (ETH)</label>
                <Input
                  type="number"
                  placeholder="Bid amount"
                  value={testAmount}
                  onChange={(e) => setTestAmount(e.target.value)}
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handleTestBid}
                disabled={!fheInitialized || isBidding}
                className="bg-purple-500 hover:bg-purple-600 text-white"
              >
                {isBidding ? 'Placing Bid...' : 'Test Encrypted Bid'}
              </Button>
              
              <Button
                onClick={handleCreateTestAuction}
                disabled={!fheInitialized || isBidding}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Create Test Auction
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Event Monitoring */}
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-400" />
              Real-time Event Monitoring
            </CardTitle>
            <CardDescription>
              Monitor contract events in real-time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2">
                <Badge variant="default" className="bg-green-500/20 text-green-400">
                  {eventStats.auctionCreated} Created
                </Badge>
                <Badge variant="default" className="bg-blue-500/20 text-blue-400">
                  {eventStats.bidPlaced} Bids
                </Badge>
                <Badge variant="default" className="bg-purple-500/20 text-purple-400">
                  {eventStats.auctionEnded} Ended
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={clearEvents}
                className="border-slate-600 text-slate-300"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear Events
              </Button>
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {recentEvents.length === 0 ? (
                <div className="text-center text-slate-400 py-8">
                  No recent events. Try interacting with the contract to see events here.
                </div>
              ) : (
                recentEvents.map((event, index) => (
                  <div
                    key={index}
                    className="bg-slate-800/50 p-3 rounded border border-slate-700/50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {event.type}
                        </Badge>
                        <span className="text-sm text-slate-300">
                          {event.type === 'AuctionCreated' && `Auction ${event.auctionId} created`}
                          {event.type === 'BidPlaced' && `Bid placed on auction ${event.auctionId}`}
                          {event.type === 'AuctionEnded' && `Auction ${event.auctionId} ended`}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
