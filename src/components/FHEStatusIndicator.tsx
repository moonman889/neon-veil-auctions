import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { getFHEStatus } from '../lib/fhe-encryption';

interface FHEStatusIndicatorProps {
  className?: string;
  showDetails?: boolean;
}

export const FHEStatusIndicator = ({ className = '', showDetails = false }: FHEStatusIndicatorProps) => {
  const [status, setStatus] = useState<{
    isInitialized: boolean;
    instance: any;
  }>({ isInitialized: false, instance: null });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkStatus = () => {
      const fheStatus = getFHEStatus();
      setStatus(fheStatus);
      setIsLoading(false);
    };

    // Check status immediately
    checkStatus();

    // Check status every 5 seconds
    const interval = setInterval(checkStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <Badge variant="secondary" className={`flex items-center gap-2 ${className}`}>
        <Loader2 className="h-3 w-3 animate-spin" />
        <span className="text-xs">Initializing FHE...</span>
      </Badge>
    );
  }

  if (!status.isInitialized) {
    return (
      <Badge variant="destructive" className={`flex items-center gap-2 ${className}`}>
        <AlertCircle className="h-3 w-3" />
        <span className="text-xs">FHE Not Ready</span>
      </Badge>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge variant="default" className="flex items-center gap-2 bg-green-500/20 text-green-400 border-green-500/30">
        <CheckCircle className="h-3 w-3" />
        <span className="text-xs">FHE Active</span>
      </Badge>
      
      {showDetails && (
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <Shield className="h-3 w-3" />
          <span>Privacy Protected</span>
        </div>
      )}
    </div>
  );
};

// Compact version for headers
export const FHEStatusCompact = ({ className = '' }: { className?: string }) => {
  const [status, setStatus] = useState<{
    isInitialized: boolean;
    instance: any;
  }>({ isInitialized: false, instance: null });

  useEffect(() => {
    const checkStatus = () => {
      const fheStatus = getFHEStatus();
      setStatus(fheStatus);
    };

    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {status.isInitialized ? (
        <Lock className="h-4 w-4 text-green-400" />
      ) : (
        <Lock className="h-4 w-4 text-red-400" />
      )}
    </div>
  );
};

// Detailed FHE information panel
export const FHEInfoPanel = () => {
  const [status, setStatus] = useState<{
    isInitialized: boolean;
    instance: any;
  }>({ isInitialized: false, instance: null });

  useEffect(() => {
    const checkStatus = () => {
      const fheStatus = getFHEStatus();
      setStatus(fheStatus);
    };

    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
      <div className="flex items-center gap-2 mb-3">
        <Shield className="h-5 w-5 text-cyan-400" />
        <h3 className="text-white font-semibold">FHE Encryption Status</h3>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-slate-300">Status:</span>
          <span className={`font-semibold ${status.isInitialized ? 'text-green-400' : 'text-red-400'}`}>
            {status.isInitialized ? 'Active' : 'Inactive'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-slate-300">Encryption:</span>
          <span className="text-green-400 font-semibold">Fully Homomorphic</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-slate-300">Privacy Level:</span>
          <span className="text-cyan-400 font-semibold">Maximum</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-slate-300">Data Protection:</span>
          <span className="text-green-400 font-semibold">End-to-End</span>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-slate-700/50">
        <p className="text-xs text-slate-400">
          All bid amounts and sensitive data are encrypted using FHE technology, 
          ensuring complete privacy while maintaining blockchain transparency.
        </p>
      </div>
    </div>
  );
};
