import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useFHEBidding } from '@/hooks/useFHEBidding';
import { useAccount } from 'wagmi';
import { Lock, Plus, Zap, Clock, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

export const CreateEncryptedAuction = () => {
  const { address } = useAccount();
  const { createEncryptedAuction, isBidding, isEncrypting } = useFHEBidding();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    startingPrice: '',
    duration: '',
    minBidIncrement: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    // Validation
    if (!formData.name.trim()) {
      toast.error('Auction name is required');
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error('Auction description is required');
      return;
    }
    
    if (!formData.startingPrice || parseFloat(formData.startingPrice) <= 0) {
      toast.error('Starting price must be greater than 0');
      return;
    }
    
    if (!formData.duration || parseInt(formData.duration) <= 0) {
      toast.error('Duration must be greater than 0');
      return;
    }
    
    if (!formData.minBidIncrement || parseFloat(formData.minBidIncrement) <= 0) {
      toast.error('Minimum bid increment must be greater than 0');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await createEncryptedAuction(
        formData.name.trim(),
        formData.description.trim(),
        formData.imageUrl.trim() || '/placeholder.svg',
        parseFloat(formData.startingPrice),
        parseInt(formData.duration) * 3600, // Convert hours to seconds
        parseFloat(formData.minBidIncrement)
      );
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        imageUrl: '',
        startingPrice: '',
        duration: '',
        minBidIncrement: '',
      });
      
      toast.success('Encrypted auction created successfully!');
    } catch (error) {
      console.error('Failed to create auction:', error);
      toast.error('Failed to create auction');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!address) {
    return (
      <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <Zap className="h-16 w-16 text-cyan-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h3>
          <p className="text-slate-400">
            Please connect your wallet to create encrypted auctions
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
          <Lock className="h-6 w-6 text-cyan-400" />
          Create Encrypted Auction
        </CardTitle>
        <CardDescription className="text-slate-300">
          Create a new auction with FHE-encrypted bidding for maximum privacy
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Auction Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">Auction Name *</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter auction name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe your auction item"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 min-h-[100px]"
              required
            />
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="text-white">Image URL</Label>
            <Input
              id="imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={formData.imageUrl}
              onChange={(e) => handleInputChange('imageUrl', e.target.value)}
              className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
            />
          </div>

          {/* Starting Price and Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startingPrice" className="text-white flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Starting Price (ETH) *
              </Label>
              <Input
                id="startingPrice"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.1"
                value={formData.startingPrice}
                onChange={(e) => handleInputChange('startingPrice', e.target.value)}
                className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="text-white flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Duration (Hours) *
              </Label>
              <Input
                id="duration"
                type="number"
                min="1"
                placeholder="24"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
                required
              />
            </div>
          </div>

          {/* Minimum Bid Increment */}
          <div className="space-y-2">
            <Label htmlFor="minBidIncrement" className="text-white">Minimum Bid Increment (ETH) *</Label>
            <Input
              id="minBidIncrement"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.01"
              value={formData.minBidIncrement}
              onChange={(e) => handleInputChange('minBidIncrement', e.target.value)}
              className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
              required
            />
          </div>

          {/* Encryption Info */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-cyan-400 mt-0.5" />
              <div>
                <h4 className="text-white font-semibold mb-1">FHE Encryption</h4>
                <p className="text-slate-300 text-sm">
                  Your auction will use Fully Homomorphic Encryption to protect all bid data. 
                  Bidders' amounts remain encrypted until the auction ends, ensuring complete privacy.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || isBidding || isEncrypting}
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white py-3"
          >
            {isEncrypting ? (
              <>
                <Lock className="h-5 w-5 mr-2 animate-spin" />
                Encrypting Auction Data...
              </>
            ) : isBidding ? (
              <>
                <Lock className="h-5 w-5 mr-2 animate-pulse" />
                Creating Encrypted Auction...
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 mr-2" />
                Create Encrypted Auction
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
