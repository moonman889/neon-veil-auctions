import { Button } from "@/components/ui/button";
import { Wallet, LogOut } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";

interface WalletConnectProps {
  variant?: "default" | "outline";
  className?: string;
}

export const WalletConnect = ({ variant = "default", className = "" }: WalletConnectProps) => {
  const { address, isConnected, isConnecting, balance, connectWallet, disconnectWallet } = useWallet();

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-2">
        <div className="hidden md:flex flex-col items-end text-sm">
          <span className="text-foreground font-medium">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
          <span className="text-muted-foreground">
            {balance ? `${parseFloat(balance).toFixed(4)} ETH` : "0 ETH"}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={disconnectWallet}
          className={`border-primary text-primary hover:bg-primary hover:text-background ${className}`}
        >
          <LogOut className="w-4 h-4 md:mr-2" />
          <span className="hidden md:inline">Disconnect</span>
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant={variant}
      onClick={connectWallet}
      disabled={isConnecting}
      className={variant === "default" 
        ? `bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-purple hover:to-neon-magenta text-background font-semibold animate-glow ${className}`
        : `border-primary text-primary hover:bg-primary hover:text-background ${className}`
      }
    >
      <Wallet className="w-4 h-4 mr-2" />
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
};