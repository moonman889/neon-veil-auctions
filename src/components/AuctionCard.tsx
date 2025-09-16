import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";

interface AuctionCardProps {
  id: string;
  title: string;
  description: string;
  currentBid: number;
  bidProgress: number;
  timeLeft: string;
  image: string;
  isEncrypted: boolean;
}

export const AuctionCard = ({ 
  title, 
  description, 
  currentBid, 
  bidProgress, 
  timeLeft, 
  image, 
  isEncrypted 
}: AuctionCardProps) => {
  const [bidAnimation, setBidAnimation] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setBidAnimation(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Card className="glass-card overflow-hidden group hover:shadow-2xl transition-all duration-300 animate-glow">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute top-4 right-4">
          {isEncrypted ? (
            <div className="flex items-center space-x-1 bg-neon-purple/20 backdrop-blur-md px-3 py-1 rounded-full">
              <EyeOff className="w-3 h-3 text-neon-purple" />
              <span className="text-xs text-neon-purple font-medium">Encrypted</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1 bg-neon-green/20 backdrop-blur-md px-3 py-1 rounded-full">
              <Eye className="w-3 h-3 text-neon-green" />
              <span className="text-xs text-neon-green font-medium">Live</span>
            </div>
          )}
        </div>
      </div>

      <CardContent className="p-6 space-y-4">
        <div>
          <h3 className="font-bold text-lg text-foreground group-hover:text-gradient-neon transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Current Bid</span>
            <span className="font-bold text-primary">{currentBid} ETH</span>
          </div>

          {/* Animated Bid Meter */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Bid Activity</span>
              <span>{bidProgress}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full transition-all duration-2000 ${bidAnimation ? 'animate-bid-meter' : 'w-0'}`}
                style={{"--meter-width": `${bidProgress}%`} as React.CSSProperties}
              />
            </div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-accent">
              <Clock className="w-3 h-3" />
              <span>{timeLeft}</span>
            </div>
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-neon-magenta to-neon-purple hover:from-neon-purple hover:to-neon-cyan text-background font-medium animate-pulse-neon"
            >
              Place Bid
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};