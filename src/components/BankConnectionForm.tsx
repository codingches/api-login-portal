
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CreditCard, Shield, CheckCircle } from "lucide-react";

interface BankConnectionFormProps {
  barberProfile: any;
  onSuccess: () => void;
}

export const BankConnectionForm = ({ barberProfile, onSuccess }: BankConnectionFormProps) => {
  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Not authenticated");
      }

      const { data, error } = await supabase.functions.invoke('connect-bank-account', {
        body: {
          accountNumber,
          routingNumber,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error);

      toast({
        title: "Success",
        description: "Bank account connected successfully!",
      });

      onSuccess();
      
    } catch (error: any) {
      console.error('Bank connection error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to connect bank account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (barberProfile.bank_account_number) {
    return (
      <Card className="bg-black border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Bank Account Connected
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-green-400">
              <CreditCard className="h-5 w-5" />
              <div>
                <div className="font-semibold">Account: {barberProfile.bank_account_number}</div>
                <div className="text-green-300/80 text-sm">
                  Routing: {barberProfile.bank_routing_number}
                </div>
                <div className="text-yellow-400 text-sm">
                  {barberProfile.bank_account_verified ? "✓ Verified" : "⏳ Pending Verification"}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black border-green-500/30">
      <CardHeader>
        <CardTitle className="text-green-400 flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Connect Bank Account
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2 text-green-300/80 text-sm mb-4">
            <Shield className="h-4 w-4" />
            <span>Your bank information is encrypted and secure</span>
          </div>
          
          <div>
            <Label htmlFor="routing" className="text-green-300">Routing Number</Label>
            <Input
              id="routing"
              type="text"
              value={routingNumber}
              onChange={(e) => setRoutingNumber(e.target.value)}
              placeholder="Enter 9-digit routing number"
              className="bg-black border-green-500/30 text-green-400"
              maxLength={9}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="account" className="text-green-300">Account Number</Label>
            <Input
              id="account"
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Enter account number"
              className="bg-black border-green-500/30 text-green-400"
              required
            />
          </div>
          
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-black font-mono"
          >
            {loading ? "CONNECTING..." : "CONNECT BANK ACCOUNT"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
