
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StripePaymentForm } from "./StripePaymentForm";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  amount: number;
  serviceType: string;
  onPaymentSuccess: () => void;
}

export const PaymentModal = ({ 
  isOpen, 
  onClose, 
  bookingId, 
  amount, 
  serviceType,
  onPaymentSuccess 
}: PaymentModalProps) => {
  const handlePaymentSuccess = () => {
    onPaymentSuccess();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border-green-500/30 text-green-400">
        <DialogHeader>
          <DialogTitle className="font-mono">
            [PAYMENT_PROCESSING] - {serviceType}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-green-300/80">
            <p>Service: {serviceType}</p>
            <p>Amount: ${amount.toFixed(2)}</p>
            <p className="text-sm text-green-300/60 mt-2">
              Your payment will be processed securely through Stripe
            </p>
          </div>
          
          <StripePaymentForm
            bookingId={bookingId}
            amount={amount}
            onPaymentSuccess={handlePaymentSuccess}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
