
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Shield, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface VerificationBadgeProps {
  barberId: string;
  isVerified: boolean;
  isOwner?: boolean;
}

export const VerificationBadge = ({ barberId, isVerified, isOwner = false }: VerificationBadgeProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleVerificationPayment = async () => {
    setIsLoading(true);
    try {
      // Create verification payment record
      const { data, error } = await supabase
        .from('verification_payments')
        .insert({
          barber_id: barberId,
          amount: 200, // $2.00
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      // In a real app, you would integrate with Stripe here
      // For now, we'll simulate the payment process
      toast({
        title: "Verification Payment",
        description: "Verification payment of $2.00 initiated. You will be contacted to complete payment.",
      });

      setIsOpen(false);
    } catch (error: any) {
      console.error('Error initiating verification payment:', error);
      toast({
        title: "Error",
        description: "Failed to initiate verification payment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerified) {
    return (
      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
        <Shield className="h-3 w-3 mr-1" />
        Verified
      </Badge>
    );
  }

  if (!isOwner) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-green-500/30 text-green-400">
          <Shield className="h-4 w-4 mr-2" />
          Get Verified
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black border-green-500/30">
        <DialogHeader>
          <DialogTitle className="text-green-400">Get Verified Badge</DialogTitle>
          <DialogDescription className="text-green-300/80">
            Get a verified badge for your barber profile to build trust with clients.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-green-400 font-semibold">Verification Badge</h3>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <Check className="h-3 w-3 mr-1" />
                $2.00
              </Badge>
            </div>
            <ul className="space-y-2 text-green-300/80 text-sm">
              <li>• Build trust with potential clients</li>
              <li>• Stand out from unverified barbers</li>
              <li>• One-time verification fee</li>
              <li>• Instant badge activation</li>
            </ul>
          </div>
          
          <Button 
            onClick={handleVerificationPayment}
            disabled={isLoading}
            className="w-full bg-green-500 hover:bg-green-600 text-black"
          >
            {isLoading ? 'Processing...' : 'Pay $2.00 for Verification'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
