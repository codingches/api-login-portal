
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Calendar, Clock, User, Phone, Mail, CheckCircle } from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  barber: any;
}

export const BookingModal = ({ isOpen, onClose, barber }: BookingModalProps) => {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    service: ''
  });

  const [isBooking, setIsBooking] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooking(true);
    
    // Simulate real-time booking
    setTimeout(() => {
      setIsBooking(false);
      setBookingConfirmed(true);
    }, 2000);
  };

  const resetModal = () => {
    setStep(1);
    setBookingConfirmed(false);
    setBookingData({
      name: '',
      phone: '',
      email: '',
      date: '',
      time: '',
      service: ''
    });
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!barber) return null;

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
                    <div className="text-2xl">{barber.avatar}</div>
                    <div>
                      <CardTitle className="text-green-400 font-mono">
                        BOOKING: {barber.name}
                      </CardTitle>
                      <p className="text-green-300 text-sm font-mono">
                        {barber.location} • {barber.specialty}
                      </p>
                    </div>
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
                {!bookingConfirmed ? (
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
                          <h3 className="text-green-400 font-mono text-lg mb-2">[PERSONAL_INFO]</h3>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-green-400 font-mono">FULL_NAME</Label>
                          <Input
                            id="name"
                            value={bookingData.name}
                            onChange={(e) => setBookingData({...bookingData, name: e.target.value})}
                            className="bg-black/50 border-green-500/50 text-white font-mono"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-green-400 font-mono">PHONE_NUMBER</Label>
                          <Input
                            id="phone"
                            value={bookingData.phone}
                            onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                            className="bg-black/50 border-green-500/50 text-white font-mono"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-green-400 font-mono">EMAIL_ADDRESS</Label>
                          <Input
                            id="email"
                            type="email"
                            value={bookingData.email}
                            onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
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
                          <h3 className="text-green-400 font-mono text-lg mb-2">[SCHEDULE_APPOINTMENT]</h3>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="date" className="text-green-400 font-mono">PREFERRED_DATE</Label>
                          <Input
                            id="date"
                            type="date"
                            value={bookingData.date}
                            onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                            className="bg-black/50 border-green-500/50 text-white font-mono"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="time" className="text-green-400 font-mono">PREFERRED_TIME</Label>
                          <select
                            id="time"
                            value={bookingData.time}
                            onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                            className="w-full p-2 bg-black/50 border border-green-500/50 text-white font-mono rounded"
                            required
                          >
                            <option value="">SELECT_TIME</option>
                            <option value="09:00">09:00 AM</option>
                            <option value="10:00">10:00 AM</option>
                            <option value="11:00">11:00 AM</option>
                            <option value="14:00">02:00 PM</option>
                            <option value="15:00">03:00 PM</option>
                            <option value="16:00">04:00 PM</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="service" className="text-green-400 font-mono">SERVICE_TYPE</Label>
                          <select
                            id="service"
                            value={bookingData.service}
                            onChange={(e) => setBookingData({...bookingData, service: e.target.value})}
                            className="w-full p-2 bg-black/50 border border-green-500/50 text-white font-mono rounded"
                            required
                          >
                            <option value="">SELECT_SERVICE</option>
                            <option value="haircut">HAIRCUT ({barber.price})</option>
                            <option value="beard">BEARD_TRIM (+$15)</option>
                            <option value="combo">COMBO_DEAL (+$20)</option>
                          </select>
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
                          <h3 className="text-green-400 font-mono text-lg mb-2">[CONFIRM_BOOKING]</h3>
                        </div>
                        
                        <div className="bg-green-500/10 border border-green-500/30 p-4 rounded font-mono">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-green-400">BARBER:</div>
                              <div className="text-white">{barber.name}</div>
                            </div>
                            <div>
                              <div className="text-green-400">CLIENT:</div>
                              <div className="text-white">{bookingData.name}</div>
                            </div>
                            <div>
                              <div className="text-green-400">DATE:</div>
                              <div className="text-white">{bookingData.date}</div>
                            </div>
                            <div>
                              <div className="text-green-400">TIME:</div>
                              <div className="text-white">{bookingData.time}</div>
                            </div>
                            <div>
                              <div className="text-green-400">SERVICE:</div>
                              <div className="text-white">{bookingData.service.toUpperCase()}</div>
                            </div>
                            <div>
                              <div className="text-green-400">PRICE:</div>
                              <div className="text-white">{barber.price}</div>
                            </div>
                          </div>
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
                          disabled={isBooking}
                          className="bg-green-500 hover:bg-green-600 text-black font-mono ml-auto"
                        >
                          {isBooking ? '[PROCESSING...]' : '[CONFIRM_BOOKING]'}
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
                      [BOOKING_CONFIRMED]
                    </h3>
                    <p className="text-green-300 font-mono mb-6">
                      Your appointment with {barber.name} has been confirmed!<br/>
                      You will receive a confirmation message shortly.
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
