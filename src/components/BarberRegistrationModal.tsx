
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Scissors, Terminal, MapPin, Phone, DollarSign, User, Twitter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface BarberRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BarberRegistrationModal = ({ isOpen, onClose }: BarberRegistrationModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    location: '',
    specialty: '',
    pricing: '',
    xHandle: '',
    phone: ''
  });
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "[AUTH_REQUIRED]",
        description: "Please login to register as a barber",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('barber_profiles')
        .insert({
          user_id: user?.id,
          business_name: formData.businessName,
          location: formData.location,
          specialty: formData.specialty,
          pricing: formData.pricing,
          x_handle: formData.xHandle || null,
          phone: formData.phone,
          status: 'pending_payment'
        });

      if (error) throw error;

      toast({
        title: "[REGISTRATION_SUCCESS]",
        description: "Profile created! Payment processing will be implemented next.",
      });

      setFormData({
        businessName: '',
        location: '',
        specialty: '',
        pricing: '',
        xHandle: '',
        phone: ''
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "[REGISTRATION_ERROR]",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      businessName: '',
      location: '',
      specialty: '',
      pricing: '',
      xHandle: '',
      phone: ''
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <Card className="bg-black border-green-500 shadow-2xl shadow-green-500/20">
              <CardHeader className="border-b border-green-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Terminal className="h-6 w-6 text-green-400" />
                    <CardTitle className="text-green-400 font-mono">
                      [BARBER_REGISTRATION]
                    </CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClose}
                    className="text-green-400 hover:text-green-300"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="text-green-300/80 font-mono text-sm">
                  Join the elite barber network - $20 signup fee
                </div>
              </CardHeader>

              <CardContent className="p-6">
                {!isAuthenticated ? (
                  <div className="text-center py-8">
                    <p className="text-green-400 font-mono mb-4">
                      [AUTHENTICATION_REQUIRED]
                    </p>
                    <p className="text-green-300/80 font-mono text-sm">
                      Please login to register as a barber
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessName" className="text-green-400 font-mono">BUSINESS_NAME</Label>
                      <div className="relative">
                        <Scissors className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                        <Input
                          id="businessName"
                          type="text"
                          value={formData.businessName}
                          onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                          className="bg-black/50 border-green-500/50 text-white font-mono pl-10"
                          placeholder="Enter your business name"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-green-400 font-mono">LOCATION</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                        <Input
                          id="location"
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          className="bg-black/50 border-green-500/50 text-white font-mono pl-10"
                          placeholder="City, State"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="specialty" className="text-green-400 font-mono">SPECIALTY</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                        <Input
                          id="specialty"
                          type="text"
                          value={formData.specialty}
                          onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                          className="bg-black/50 border-green-500/50 text-white font-mono pl-10"
                          placeholder="e.g., Fades, Beard Styling, Classic Cuts"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pricing" className="text-green-400 font-mono">PRICING</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                        <Input
                          id="pricing"
                          type="text"
                          value={formData.pricing}
                          onChange={(e) => setFormData({...formData, pricing: e.target.value})}
                          className="bg-black/50 border-green-500/50 text-white font-mono pl-10"
                          placeholder="e.g., $25-50"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-green-400 font-mono">PHONE</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="bg-black/50 border-green-500/50 text-white font-mono pl-10"
                          placeholder="(555) 123-4567"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="xHandle" className="text-green-400 font-mono">X_HANDLE (OPTIONAL)</Label>
                      <div className="relative">
                        <Twitter className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                        <Input
                          id="xHandle"
                          type="text"
                          value={formData.xHandle}
                          onChange={(e) => setFormData({...formData, xHandle: e.target.value})}
                          className="bg-black/50 border-green-500/50 text-white font-mono pl-10"
                          placeholder="your_handle"
                        />
                      </div>
                    </div>

                    <div className="border border-green-500/30 bg-green-500/10 p-4 rounded-lg">
                      <p className="text-green-400 font-mono text-sm mb-2">
                        [PAYMENT_NOTICE]
                      </p>
                      <p className="text-green-300/80 font-mono text-xs">
                        Registration fee: $20. Payment processing will be implemented next.
                        Your profile will be set to 'pending_payment' status.
                      </p>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-green-500 hover:bg-green-600 text-black font-mono font-bold"
                    >
                      {loading ? '[PROCESSING...]' : '[REGISTER_BARBER]'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
