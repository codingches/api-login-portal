
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Calendar, Clock, Scissors, Terminal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Barber {
  id: string;
  business_name: string;
  location: string;
  specialty: string;
  pricing: string;
  x_handle: string | null;
  phone: string;
  status: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  barber: Barber | null;
}

export const BookingModal = ({ isOpen, onClose, barber }: BookingModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bookingDate: '',
    bookingTime: '',
    serviceType: ''
  });
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  const serviceTypes = [
    'Haircut', 'Beard Trim', 'Haircut + Beard', 'Styling', 'Consultation'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "[AUTH_REQUIRED]",
        description: "Please login to book an appointment",
        variant: "destructive",
      });
      return;
    }

    if (!barber) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('bookings')
        .insert({
          user_id: user?.id,
          barber_id: barber.id,
          booking_date: formData.bookingDate,
          booking_time: formData.bookingTime,
          service_type: formData.serviceType,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "[BOOKING_SUCCESS]",
        description: `Appointment booked with ${barber.business_name}!`,
      });

      setFormData({ bookingDate: '', bookingTime: '', serviceType: '' });
      onClose();
    } catch (error: any) {
      toast({
        title: "[BOOKING_ERROR]",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ bookingDate: '', bookingTime: '', serviceType: '' });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <AnimatePresence>
      {isOpen && barber && (
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
            className="w-full max-w-md"
          >
            <Card className="bg-black border-green-500 shadow-2xl shadow-green-500/20">
              <CardHeader className="border-b border-green-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Terminal className="h-6 w-6 text-green-400" />
                    <CardTitle className="text-green-400 font-mono">
                      [BOOKING_SYSTEM]
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
                <div className="text-green-300 font-mono text-sm">
                  Booking with: {barber.business_name}
                </div>
              </CardHeader>

              <CardContent className="p-6">
                {!isAuthenticated ? (
                  <div className="text-center py-8">
                    <p className="text-green-400 font-mono mb-4">
                      [AUTHENTICATION_REQUIRED]
                    </p>
                    <p className="text-green-300/80 font-mono text-sm">
                      Please login to book an appointment
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bookingDate" className="text-green-400 font-mono">DATE</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                        <Input
                          id="bookingDate"
                          type="date"
                          min={today}
                          value={formData.bookingDate}
                          onChange={(e) => setFormData({...formData, bookingDate: e.target.value})}
                          className="bg-black/50 border-green-500/50 text-white font-mono pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bookingTime" className="text-green-400 font-mono">TIME</Label>
                      <Select
                        value={formData.bookingTime}
                        onValueChange={(value) => setFormData({...formData, bookingTime: value})}
                        required
                      >
                        <SelectTrigger className="bg-black/50 border-green-500/50 text-white font-mono">
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-green-500" />
                            <SelectValue placeholder="Select time" />
                          </div>
                        </SelectTrigger>
                        <SelectContent className="bg-black border-green-500">
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time} className="text-green-400 font-mono">
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="serviceType" className="text-green-400 font-mono">SERVICE</Label>
                      <Select
                        value={formData.serviceType}
                        onValueChange={(value) => setFormData({...formData, serviceType: value})}
                        required
                      >
                        <SelectTrigger className="bg-black/50 border-green-500/50 text-white font-mono">
                          <div className="flex items-center">
                            <Scissors className="mr-2 h-4 w-4 text-green-500" />
                            <SelectValue placeholder="Select service" />
                          </div>
                        </SelectTrigger>
                        <SelectContent className="bg-black border-green-500">
                          {serviceTypes.map((service) => (
                            <SelectItem key={service} value={service} className="text-green-400 font-mono">
                              {service}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-green-500 hover:bg-green-600 text-black font-mono font-bold"
                    >
                      {loading ? '[PROCESSING...]' : '[CONFIRM_BOOKING]'}
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
