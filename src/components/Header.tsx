import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Link } from "react-router-dom";
import { FHEStatusCompact } from './FHEStatusIndicator';

export const Header = () => {
  return (
    <header className="glass-card mx-4 mt-4 p-4 sticky top-4 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Link to="/" className="flex items-center space-x-4 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-lg animate-glow"></div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gradient-neon">Neon Veil Auctions</h1>
            <FHEStatusCompact />
          </div>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#auctions" className="text-foreground hover:text-primary transition-colors">
            Live Auctions
          </a>
          <a href="#featured" className="text-foreground hover:text-primary transition-colors">
            Featured
          </a>
          <a href="#about" className="text-foreground hover:text-primary transition-colors">
            How It Works
          </a>
        </nav>
        
        <ConnectButton />
      </div>
    </header>
  );
};