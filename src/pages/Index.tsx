
import { motion } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { BarberGrid } from "@/components/BarberGrid";
import { BookingModal } from "@/components/BookingModal";
import { AIChat } from "@/components/AIChat";
import { BlogSection } from "@/components/BlogSection";
import { FeedbackChatroom } from "@/components/FeedbackChatroom";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useState } from "react";

const Index = () => {
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isChatroomOpen, setIsChatroomOpen] = useState(false);

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
        
        {/* Main content with AI Chat sidebar */}
        <div className="flex flex-col lg:flex-row gap-8 px-6">
          <div className="flex-1">
            <BarberGrid onBookBarber={handleBookBarber} />
          </div>
          
          {/* AI Chat - Fixed position on larger screens, inline on mobile */}
          <div className="lg:sticky lg:top-6 lg:h-fit lg:w-80">
            <AIChat />
          </div>
        </div>
        
        <BlogSection />
      </div>

      {/* Floating Chatroom Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 left-6 z-50"
      >
        <Button
          onClick={() => setIsChatroomOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-14 h-14 shadow-lg shadow-blue-500/25"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </motion.div>

      <BookingModal 
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        barber={selectedBarber}
      />

      <FeedbackChatroom
        isOpen={isChatroomOpen}
        onClose={() => setIsChatroomOpen(false)}
      />
    </div>
  );
};

export default Index;
