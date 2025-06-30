
import { motion } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { BarberGrid } from "@/components/BarberGrid";
import { BookingModal } from "@/components/BookingModal";
import { useState } from "react";

const Index = () => {
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const handleBookBarber = (barber: any) => {
    setSelectedBarber(barber);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      {/* Matrix-style background pattern */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 opacity-20">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute text-green-500 text-xs animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            >
              {Math.random() > 0.5 ? "01" : "10"}
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10">
        <Navigation />
        <HeroSection />
        <BarberGrid onBookBarber={handleBookBarber} />
      </div>

      <BookingModal 
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        barber={selectedBarber}
      />
    </div>
  );
};

export default Index;
