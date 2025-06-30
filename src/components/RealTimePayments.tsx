
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign, Clock, CheckCircle, CreditCard } from "lucide-react";
import { format } from "date-fns";

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  payment_method: string;
  processed_at: string | null;
  created_at: string;
  bookings: {
    booking_date: string;
    booking_time: string;
    service_type: string;
  };
}

interface RealTimePaymentsProps {
  barberId: string;
}

export const RealTimePayments = ({ barberId }: RealTimePaymentsProps) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPayments();
    
    // Set up real-time subscription for payments
    const channel = supabase
      .channel('payments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'real_time_payments',
          filter: `barber_id=eq.${barberId}`
        },
        (payload) => {
          console.log('Real-time payment update:', payload);
          fetchPayments(); // Refresh the payments list
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [barberId]);

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('real_time_payments')
        .select(`
          *,
          bookings:booking_id (
            booking_date,
            booking_time,
            service_type
          )
        `)
        .eq('barber_id', barberId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setPayments(data || []);
    } catch (error: any) {
      console.error('Error fetching payments:', error);
      toast({
        title: "Error",
        description: "Failed to load payments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      default:
        return <CreditCard className="h-4 w-4 text-blue-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-500/30 text-green-400';
      case 'pending':
        return 'border-yellow-500/30 text-yellow-400';
      case 'failed':
        return 'border-red-500/30 text-red-400';
      default:
        return 'border-blue-500/30 text-blue-400';
    }
  };

  const totalEarnings = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  if (loading) {
    return (
      <Card className="bg-black border-green-500/30">
        <CardContent className="p-6 text-center text-green-400">
          Loading payments...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black border-green-500/30">
      <CardHeader>
        <CardTitle className="text-green-400 flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Real-Time Payments
          <Badge variant="outline" className="ml-auto border-green-500/30">
            ${totalEarnings.toFixed(2)} earned
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {payments.length === 0 ? (
          <div className="text-center text-green-300/60 py-8">
            <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No payments yet. Start accepting bookings!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className={`border rounded-lg p-4 ${getStatusColor(payment.status)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(payment.status)}
                    <span className="font-semibold">
                      ${payment.amount.toFixed(2)}
                    </span>
                    <Badge variant="outline" className={`text-xs ${getStatusColor(payment.status)}`}>
                      {payment.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-sm text-green-300/80">
                    {format(new Date(payment.created_at), 'MMM d, h:mm a')}
                  </div>
                </div>
                
                {payment.bookings && (
                  <div className="text-sm text-green-300/80">
                    Service: {payment.bookings.service_type} • 
                    Date: {format(new Date(payment.bookings.booking_date), 'MMM d')} at {payment.bookings.booking_time}
                  </div>
                )}
                
                <div className="text-xs text-green-300/60 mt-1">
                  Payment ID: {payment.id.slice(0, 8)}...
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
