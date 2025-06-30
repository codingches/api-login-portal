
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, MapPin, Clock, Wifi } from "lucide-react";

const barbers = [
  {
    id: 1,
    name: "ALEX_RAZOR",
    location: "New York, USA",
    rating: 4.9,
    status: "ONLINE",
    specialty: "Classic Cuts",
    price: "$45",
    avatar: "🧔",
    nextAvailable: "2:30 PM"
  },
  {
    id: 2,
    name: "MARIO_BLADE",
    location: "Rome, Italy",
    rating: 4.8,
    status: "ONLINE",
    specialty: "Beard Styling",
    price: "€35",
    avatar: "👨‍🦲",
    nextAvailable: "3:15 PM"
  },
  {
    id: 3,
    name: "YUKI_SHARP",
    location: "Tokyo, Japan",
    rating: 5.0,
    status: "BUSY",
    specialty: "Modern Fades",
    price: "¥4800",
    avatar: "👨",
    nextAvailable: "5:00 PM"
  },
  {
    id: 4,
    name: "HASSAN_CUT",
    location: "Dubai, UAE",
    rating: 4.7,
    status: "ONLINE",
    specialty: "Traditional Shave",
    price: "AED120",
    avatar: "🧔‍♂️",
    nextAvailable: "1:45 PM"
  }
];

interface BarberGridProps {
  onBookBarber: (barber: any) => void;
}

export const BarberGrid = ({ onBookBarber }: BarberGridProps) => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-green-400 font-mono mb-4">
            [ACTIVE_BARBERS_NETWORK]
          </h2>
          <p className="text-green-300 font-mono">
            &gt; REAL_TIME_STATUS_MONITORING_ENABLED
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {barbers.map((barber, index) => (
            <motion.div
              key={barber.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-black/70 border-green-500/30 hover:border-green-500 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-3xl">{barber.avatar}</div>
                    <div className={`flex items-center gap-1 text-xs font-mono px-2 py-1 rounded ${
                      barber.status === 'ONLINE' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      <Wifi className="h-3 w-3" />
                      {barber.status}
                    </div>
                  </div>
                  <CardTitle className="text-green-400 font-mono text-lg">
                    {barber.name}
                  </CardTitle>
                  <div className="flex items-center gap-1 text-green-300 text-sm">
                    <MapPin className="h-3 w-3" />
                    {barber.location}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-white font-mono">{barber.rating}</span>
                    </div>
                    <span className="text-green-400 font-mono font-bold">{barber.price}</span>
                  </div>
                  
                  <div className="text-sm text-green-300 font-mono">
                    SPECIALTY: {barber.specialty}
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm text-green-300">
                    <Clock className="h-3 w-3" />
                    <span className="font-mono">NEXT: {barber.nextAvailable}</span>
                  </div>
                  
                  <Button 
                    onClick={() => onBookBarber(barber)}
                    className="w-full bg-green-500 hover:bg-green-600 text-black font-mono font-bold"
                    disabled={barber.status === 'BUSY'}
                  >
                    {barber.status === 'BUSY' ? '[BUSY]' : '[BOOK_NOW]'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
