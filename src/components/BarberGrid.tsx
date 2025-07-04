import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Scissors, Phone, DollarSign, Star, Shield, Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Barber {
  id: string;
  business_name: string;
  location: string;
  specialty: string;
  pricing: string;
  x_handle: string | null;
  phone: string;
  status: string;
  is_verified: boolean | null;
  profile_picture_url: string | null;
  average_rating: number | null;
  total_bookings: number | null;
}

interface BarberGridProps {
  onBookBarber: (barber: Barber) => void;
}

export const BarberGrid = ({ onBookBarber }: BarberGridProps) => {
  const { data: barbers, isLoading, error } = useQuery({
    queryKey: ['barbers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('barber_profiles')
        .select('*')
        .in('status', ['active', 'pending_payment']);
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-green-400 font-mono mb-4">
              [LOADING_NETWORK...]
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border border-green-500/30 bg-black/50 p-6 rounded-lg animate-pulse">
                <div className="h-6 bg-green-500/20 rounded mb-4"></div>
                <div className="h-4 bg-green-500/10 rounded mb-2"></div>
                <div className="h-4 bg-green-500/10 rounded mb-2"></div>
                <div className="h-4 bg-green-500/10 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-red-400 font-mono mb-4">
            [NETWORK_ERROR]
          </h2>
          <p className="text-red-300 font-mono">Failed to load barber network</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-green-400 font-mono mb-4">
            [ACTIVE_NETWORK]
          </h2>
          <p className="text-green-300 font-mono">
            {barbers?.length || 0} barbers available
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {barbers?.map((barber, index) => (
            <motion.div
              key={barber.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-black border-green-500/30 hover:border-green-400 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-12 w-12 border-2 border-green-500/30">
                      <AvatarImage src={barber.profile_picture_url || undefined} alt={barber.business_name} />
                      <AvatarFallback className="bg-black text-green-400">
                        {barber.business_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-green-400 font-mono flex items-center gap-2">
                        <Scissors className="h-5 w-5" />
                        {barber.business_name}
                        {barber.is_verified && (
                          <div className="bg-blue-500 rounded-full p-1">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </CardTitle>
                      <div className="flex gap-2 mt-1">
                        {barber.status === 'pending_payment' && (
                          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                            Setting Up
                          </Badge>
                        )}
                        {barber.status === 'active' && (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            Available
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Rating Display */}
                  {barber.average_rating && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= (barber.average_rating || 0)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-green-400 font-mono text-sm">
                        {barber.average_rating.toFixed(1)}
                      </span>
                      {barber.total_bookings && (
                        <span className="text-green-400/60 font-mono text-xs">
                          ({barber.total_bookings} bookings)
                        </span>
                      )}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-green-300 font-mono text-sm">
                    <MapPin className="h-4 w-4" />
                    {barber.location}
                  </div>
                  
                  <div className="text-green-300/80 font-mono text-sm">
                    <strong>Specialty:</strong> {barber.specialty}
                  </div>
                  
                  <div className="flex items-center gap-2 text-green-300 font-mono text-sm">
                    <DollarSign className="h-4 w-4" />
                    {barber.pricing}
                  </div>
                  
                  <div className="flex items-center gap-2 text-green-300 font-mono text-sm">
                    <Phone className="h-4 w-4" />
                    {barber.phone}
                  </div>

                  {barber.x_handle && (
                    <div className="text-green-300/80 font-mono text-sm">
                      <strong>X:</strong> @{barber.x_handle}
                    </div>
                  )}

                  <div className="pt-4">
                    {barber.status === 'active' ? (
                      <Button
                        onClick={() => onBookBarber(barber)}
                        className="w-full bg-green-500 hover:bg-green-600 text-black font-mono"
                      >
                        [BOOK_NOW]
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-center text-yellow-400 font-mono text-sm mb-2">
                          [COMPLETING_SETUP]
                        </div>
                        <Button
                          onClick={() => onBookBarber(barber)}
                          variant="outline"
                          className="w-full border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 font-mono"
                        >
                          [CONTACT_FOR_BOOKING]
                        </Button>
                        <p className="text-xs text-yellow-400/70 text-center">
                          This barber is setting up their profile. You can still contact them for services!
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {barbers && barbers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-green-400/60 font-mono text-lg">
              [NO_BARBERS_FOUND]
            </p>
            <p className="text-green-400/40 font-mono text-sm mt-2">
              Check back later or register as a barber to join the network
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
