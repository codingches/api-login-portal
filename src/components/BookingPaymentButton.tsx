
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PaymentModal } from "./PaymentModal";
import { CreditCard } from "lucide-react";

interface BookingPaymentButtonProps {
  booking: {
    id: string;
    service_type: string;
    status: string;
  };
  amount: number;
  onPaymentSuccess: () => void;
}

export const BookingPaymentButton = ({ 
  booking, 
  amount, 
  onPaymentSuccess 
}: BookingPaymentButtonProps) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  if (booking.status === 'completed') {
    return (
      <Button disabled className="bg-green-500/20 text-green-400">
        <CreditCard className="h-4 w-4 mr-2" />
        Paid
      </Button>
    );
  }

  return (
    <>
      <Button
        onClick={() => setShowPaymentModal(true)}
        className="bg-green-500 hover:bg-green-600 text-black font-mono"
      >
        <CreditCard className="h-4 w-4 mr-2" />
        Pay ${amount.toFixed(2)}
      </Button>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        bookingId={booking.id}
        amount={amount}
        serviceType={booking.service_type}
        onPaymentSuccess={onPaymentSuccess}
      />
    </>
  );
};
