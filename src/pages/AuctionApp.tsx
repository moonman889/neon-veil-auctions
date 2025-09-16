import { Button } from "@/components/ui/button";
import { AuctionCard } from "@/components/AuctionCard";
import { EncryptedAuctionCard } from "@/components/EncryptedAuctionCard";
import { CreateEncryptedAuction } from "@/components/CreateEncryptedAuction";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Shield, Lock } from "lucide-react";
import { useState } from 'react';

// Mock data for auctions
const mockAuctions = [
  {
    id: "1",
    title: "Digital Metamorphosis #001",
    description: "Abstract digital art with flowing neon elements",
    currentBid: 2.4,
    bidProgress: 75,
    timeLeft: "2h 34m",
    image: "/placeholder.svg",
    isEncrypted: true,
  },
  {
    id: "2", 
    title: "Cyber Phoenix Rising",
    description: "Futuristic creature emerging from digital flames",
    currentBid: 1.8,
    bidProgress: 45,
    timeLeft: "4h 12m",
    image: "/placeholder.svg",
    isEncrypted: true,
  },
  {
    id: "3",
    title: "Neon Dreams Collection",
    description: "Limited series of cyberpunk landscapes",
    currentBid: 3.2,
    bidProgress: 90,
    timeLeft: "1h 45m", 
    image: "/placeholder.svg",
    isEncrypted: false,
  },
  {
    id: "4",
    title: "Quantum Reality #42",
    description: "Mind-bending quantum art visualization",
    currentBid: 1.5,
    bidProgress: 35,
    timeLeft: "6h 18m",
    image: "/placeholder.svg",
    isEncrypted: true,
  },
  {
    id: "5",
    title: "Electric Symphony",
    description: "Musical waves transformed into visual art",
    currentBid: 2.8,
    bidProgress: 65,
    timeLeft: "3h 7m",
    image: "/placeholder.svg",
    isEncrypted: false,
  },
  {
    id: "6",
    title: "Digital Genesis",
    description: "The birth of a new digital universe",
    currentBid: 4.1,
    bidProgress: 85,
    timeLeft: "1h 23m",
    image: "/placeholder.svg",
    isEncrypted: true,
  },
];

const AuctionApp = () => {
  const { isConnected } = useAccount();
  const [showCreateAuction, setShowCreateAuction] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* App Header */}
      <header className="glass-card mx-4 mt-4 p-4 sticky top-4 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Link 
              to="/"
              className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden md:inline">Back to Home</span>
            </Link>
            <div className="w-8 h-8 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-lg animate-glow"></div>
            <h1 className="text-xl font-bold text-gradient-neon">Neon Veil Auctions</h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#live-auctions" className="text-foreground hover:text-primary transition-colors">
              Live Auctions
            </a>
            <a href="#featured" className="text-foreground hover:text-primary transition-colors">
              Featured
            </a>
            <a href="#my-bids" className="text-foreground hover:text-primary transition-colors">
              My Bids
            </a>
          </nav>
          
          <ConnectButton />
        </div>
      </header>

      {/* Wallet Connection Notice */}
      {!isConnected && (
        <div className="mx-4 mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg backdrop-blur-md">
          <div className="text-center text-amber-300">
            <p className="text-sm">Connect your wallet to participate in auctions</p>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-card p-4 text-center">
              <div className="text-2xl font-bold text-gradient-neon">{mockAuctions.length}</div>
              <div className="text-sm text-muted-foreground">Live Auctions</div>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="text-2xl font-bold text-gradient-neon">24.7</div>
              <div className="text-sm text-muted-foreground">Total Volume (ETH)</div>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="text-2xl font-bold text-gradient-neon">156</div>
              <div className="text-sm text-muted-foreground">Active Bidders</div>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="text-2xl font-bold text-gradient-neon">89%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="default" size="sm">All Auctions</Button>
              <Button variant="outline" size="sm">Ending Soon</Button>
              <Button variant="outline" size="sm">Recently Added</Button>
              <Button variant="outline" size="sm">High Activity</Button>
            </div>
            
            {isConnected && (
              <Button 
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-background"
                onClick={() => setShowCreateAuction(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Encrypted Auction
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Live Auctions */}
      <section id="live-auctions" className="px-4 pb-16">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gradient-neon">
              Live Auctions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover unique NFTs with encrypted bidding. Watch the bid meters pulse with activity 
              while bids remain hidden until the final reveal.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockAuctions.map((auction) => (
              auction.isEncrypted ? (
                <EncryptedAuctionCard 
                  key={auction.id}
                  auctionId={parseInt(auction.id)}
                  name={auction.title}
                  description={auction.description}
                  imageUrl={auction.image}
                  currentBid={auction.currentBid}
                  bidCount={Math.floor(Math.random() * 20) + 1}
                  isActive={true}
                  isEnded={false}
                  seller="0x0000000000000000000000000000000000000000"
                  endTime={Date.now() + (parseInt(auction.timeLeft.split('h')[0]) * 3600 + parseInt(auction.timeLeft.split('h')[1].split('m')[0]) * 60) * 1000}
                  minBidIncrement={0.01}
                />
              ) : (
                <AuctionCard key={auction.id} {...auction} />
              )
            ))}
          </div>
          
          <div className="text-center">
            <Button 
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-background px-8"
            >
              Load More Auctions
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section id="featured" className="py-16 px-4 bg-card/10">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gradient-neon">
              Featured
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Handpicked premium NFTs and exclusive collections from top creators in the space.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockAuctions.slice(0, 3).map((auction) => (
              <AuctionCard key={`featured-${auction.id}`} {...auction} />
            ))}
          </div>
        </div>
      </section>

      {/* Create Auction Modal */}
      {showCreateAuction && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="bg-slate-900/95 backdrop-blur-md rounded-lg border border-slate-700/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Shield className="h-6 w-6 text-cyan-400" />
                  Create Encrypted Auction
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateAuction(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </Button>
              </div>
              <CreateEncryptedAuction />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionApp;