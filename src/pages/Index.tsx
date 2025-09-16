import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Users } from "lucide-react";
import { AuctionCard } from "@/components/AuctionCard";
import { Header } from "@/components/Header";
import heroImage from "@/assets/hero-auction.jpg";

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
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Cyberpunk auction house"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            <span className="text-gradient-neon">Trustless Auctions</span>
            <br />
            <span className="text-foreground">with Hidden Bids</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the future of NFT auctions where bids remain encrypted until the very end, 
            preventing sniping and ensuring fair market discovery.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-purple hover:to-neon-magenta text-background font-semibold animate-glow px-8"
            >
              Explore Auctions
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-background px-8"
            >
              How It Works
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-6 text-center space-y-4 animate-glow">
              <Shield className="w-12 h-12 text-neon-cyan mx-auto" />
              <h3 className="text-xl font-bold text-foreground">Encrypted Bidding</h3>
              <p className="text-muted-foreground">
                All bids are encrypted until auction ends, preventing manipulation and ensuring fair outcomes.
              </p>
            </div>
            
            <div className="glass-card p-6 text-center space-y-4 animate-pulse-neon">
              <Zap className="w-12 h-12 text-neon-magenta mx-auto" />
              <h3 className="text-xl font-bold text-foreground">Anti-Sniping</h3>
              <p className="text-muted-foreground">
                No more last-second bid wars. True market value discovery through hidden bidding.
              </p>
            </div>
            
            <div className="glass-card p-6 text-center space-y-4 animate-glow">
              <Users className="w-12 h-12 text-neon-purple mx-auto" />
              <h3 className="text-xl font-bold text-foreground">Community Driven</h3>
              <p className="text-muted-foreground">
                Built by collectors, for collectors. Transparent, fair, and community-first approach.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section id="featured" className="py-16 px-4 bg-card/10">
        <div className="max-w-6xl mx-auto space-y-8">
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

      {/* How It Works */}
      <section id="about" className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gradient-neon">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-full flex items-center justify-center mx-auto text-background font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-bold text-foreground">Submit Encrypted Bid</h3>
              <p className="text-muted-foreground">
                Place your bid using our encryption system. Your bid amount remains completely hidden from other participants.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-12 h-12 bg-gradient-to-br from-neon-magenta to-neon-purple rounded-full flex items-center justify-center mx-auto text-background font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-bold text-foreground">Watch Activity Meters</h3>
              <p className="text-muted-foreground">
                Monitor bid activity through animated meters while all actual bid amounts stay encrypted until auction end.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-12 h-12 bg-gradient-to-br from-neon-purple to-neon-cyan rounded-full flex items-center justify-center mx-auto text-background font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-bold text-foreground">Fair Reveal & Win</h3>
              <p className="text-muted-foreground">
                When time expires, all bids are revealed simultaneously. Highest bidder wins in a truly fair environment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Auctions */}
      <section id="auctions" className="py-16 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
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
              <AuctionCard key={auction.id} {...auction} />
            ))}
          </div>
          
          <div className="text-center">
            <Button 
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-background px-8"
            >
              View All Auctions
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card/20 backdrop-blur-md border-t border-border/30 py-8 px-4 mt-20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-lg animate-glow"></div>
            <span className="text-xl font-bold text-gradient-neon">CryptoVault</span>
          </div>
          <p className="text-muted-foreground">
            The future of confidential NFT auctions. Built with trust, powered by transparency.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;