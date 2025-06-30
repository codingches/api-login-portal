
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CreditCard, Loader2 } from "lucide-react";

// Initialize Stripe with publishable key
const stripePromise = loadStripe("pk_test_51RfghWQucmTpJKpfF6o4lnL4GRQlGm4cl0DTcqYnABk4X6nqiolV5z748Fvskjx3ICDdjW0FS6wXIUqtoKEvr2p300rIGDB4G8");

interface PaymentFormProps {
  bookingId: string;
  amount: number;
  onPaymentSuccess: () => void;
}

const PaymentForm = ({ bookingId, amount, onPaymentSuccess }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      // Create payment method
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (paymentMethodError) {
        throw new Error(paymentMethodError.message);
      }

      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Not authenticated");
      }

      // Process payment through our edge function
      const { data, error } = await supabase.functions.invoke('process-real-time-payment', {
        body: {
          bookingId,
          amount,
          paymentMethodId: paymentMethod.id,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error);

      toast({
        title: "Payment Successful!",
        description: `Payment of $${amount.toFixed(2)} processed successfully.`,
      });

      onPaymentSuccess();
      
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to process payment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-black border-green-500/30">
      <CardHeader>
        <CardTitle className="text-green-400 flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Pay ${amount.toFixed(2)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 border border-green-500/30 rounded-lg bg-black">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#10b981',
                    '::placeholder': {
                      color: '#6b7280',
                    },
                  },
                },
              }}
            />
          </div>
          
          <Button
            type="submit"
            disabled={!stripe || loading}
            className="w-full bg-green-500 hover:bg-green-600 text-black font-mono"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                PROCESSING...
              </>
            ) : (
              `PAY $${amount.toFixed(2)}`
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export const StripePaymentForm = (props: PaymentFormProps) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  );
};
