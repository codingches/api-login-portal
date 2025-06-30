
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Scissors, MapPin, DollarSign, Twitter, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface BarberRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BarberRegistrationModal = ({ isOpen, onClose }: BarberRegistrationModalProps) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    businessName: '',
    location: '',
    specialty: '',
    pricing: '',
    xHandle: '',
    phone: ''
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First register the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            user_type: 'barber'
          }
        }
      });

      if (authError) throw authError;

      // Then create barber profile
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('barber_profiles')
          .insert({
            user_id: authData.user.id,
            business_name: formData.businessName,
            location: formData.location,
            specialty: formData.specialty,
            pricing: formData.pricing,
            x_handle: formData.xHandle,
            phone: formData.phone,
            status: 'pending_payment'
          });

        if (profileError) throw profileError;

        // Here you would typically redirect to Stripe for payment
        // For now, we'll simulate successful registration
        setRegistrationComplete(true);
        
        toast({
          title: "[BARBER_REGISTERED]",
          description: "Registration successful! Payment processing next.",
        });
      }
    } catch (error: any) {
      toast({
        title: "[ERROR]",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setStep(1);
    setRegistrationComplete(false);
    setFormData({
      email: '',
      password: '',
      fullName: '',
      businessName: '',
      location: '',
      specialty: '',
      pricing: '',
      xHandle: '',
      phone: ''
    });
  };

  const handleClose = () => {
    resetModal();
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
            className="w-full max-w-2xl"
          >
            <Card className="bg-black border-green-500 shadow-2xl shadow-green-500/20">
              <CardHeader className="border-b border-green-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Scissors className="h-6 w-6 text-green-400" />
                    <CardTitle className="text-green-400 font-mono">
                      [BARBER_REGISTRATION] - $20
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
              </CardHeader>

              <CardContent className="p-6">
                {!registrationComplete ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Step indicators */}
                    <div className="flex items-center justify-center gap-4 mb-6">
                      {[1, 2, 3].map((num) => (
                        <div
                          key={num}
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm border-2 ${
                            step >= num
                              ? 'bg-green-500 border-green-500 text-black'
                              : 'border-green-500/50 text-green-500'
                          }`}
                        >
                          {num}
                        </div>
                      ))}
                    </div>

                    {step === 1 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                      >
                        <div className="text-center mb-4">
                          <h3 className="text-green-400 font-mono text-lg mb-2">[ACCOUNT_INFO]</h3>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="fullName" className="text-green-400 font-mono">FULL_NAME</Label>
                          <Input
                            id="fullName"
                            value={formData.fullName}
                            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                            className="bg-black/50 border-green-500/50 text-white font-mono"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-green-400 font-mono">EMAIL</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="bg-black/50 border-green-500/50 text-white font-mono"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="password" className="text-green-400 font-mono">PASSWORD</Label>
                          <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            className="bg-black/50 border-green-500/50 text-white font-mono"
                            required
                          />
                        </div>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                      >
                        <div className="text-center mb-4">
                          <h3 className="text-green-400 font-mono text-lg mb-2">[BUSINESS_INFO]</h3>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="businessName" className="text-green-400 font-mono">BUSINESS_NAME</Label>
                          <Input
                            id="businessName"
                            value={formData.businessName}
                            onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                            className="bg-black/50 border-green-500/50 text-white font-mono"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="location" className="text-green-400 font-mono">LOCATION</Label>
                          <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                            className="bg-black/50 border-green-500/50 text-white font-mono"
                            placeholder="City, Country"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="specialty" className="text-green-400 font-mono">SPECIALTY</Label>
                          <Input
                            id="specialty"
                            value={formData.specialty}
                            onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                            className="bg-black/50 border-green-500/50 text-white font-mono"
                            placeholder="e.g., Classic Cuts, Beard Styling"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="pricing" className="text-green-400 font-mono">BASE_PRICING</Label>
                          <Input
                            id="pricing"
                            value={formData.pricing}
                            onChange={(e) => setFormData({...formData, pricing: e.target.value})}
                            className="bg-black/50 border-green-500/50 text-white font-mono"
                            placeholder="e.g., $45, €35"
                            required
                          />
                        </div>
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                      >
                        <div className="text-center mb-4">
                          <h3 className="text-green-400 font-mono text-lg mb-2">[CONTACT_INFO]</h3>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-green-400 font-mono">PHONE_NUMBER</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="bg-black/50 border-green-500/50 text-white font-mono"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="xHandle" className="text-green-400 font-mono">X_HANDLE (Optional)</Label>
                          <div className="relative">
                            <Twitter className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                            <Input
                              id="xHandle"
                              value={formData.xHandle}
                              onChange={(e) => setFormData({...formData, xHandle: e.target.value})}
                              className="bg-black/50 border-green-500/50 text-white font-mono pl-10"
                              placeholder="@your_handle"
                            />
                          </div>
                        </div>
                        
                        <div className="bg-green-500/10 border border-green-500/30 p-4 rounded font-mono">
                          <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="h-4 w-4 text-green-400" />
                            <span className="text-green-400">REGISTRATION_FEE: $20</span>
                          </div>
                          <p className="text-green-300 text-sm">
                            One-time fee to join the Zidon network and access real-time booking system.
                          </p>
                        </div>
                      </motion.div>
                    )}

                    <div className="flex justify-between pt-6">
                      {step > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setStep(step - 1)}
                          className="border-green-500 text-green-400 font-mono"
                        >
                          [BACK]
                        </Button>
                      )}
                      
                      {step < 3 ? (
                        <Button
                          type="button"
                          onClick={() => setStep(step + 1)}
                          className="bg-green-500 hover:bg-green-600 text-black font-mono ml-auto"
                        >
                          [NEXT]
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          disabled={loading}
                          className="bg-green-500 hover:bg-green-600 text-black font-mono ml-auto"
                        >
                          {loading ? '[PROCESSING...]' : '[REGISTER_&_PAY]'}
                        </Button>
                      )}
                    </div>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-green-400 font-mono mb-2">
                      [REGISTRATION_COMPLETE]
                    </h3>
                    <p className="text-green-300 font-mono mb-6">
                      Welcome to the Zidon Network!<br/>
                      Your profile is now being processed.
                    </p>
                    <Button
                      onClick={handleClose}
                      className="bg-green-500 hover:bg-green-600 text-black font-mono"
                    >
                      [CLOSE]
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
