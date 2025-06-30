
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Terminal, Zap, Users, Clock } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="min-h-screen pt-20 pb-16 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-6xl md:text-8xl font-bold text-green-400 mb-6 tracking-wider">
              ZIDON_SYSTEM
            </h1>
            <p className="text-xl md:text-2xl text-green-300 font-mono mb-8">
              [NEXT_GENERATION_BARBER_NETWORK]
            </p>
            <p className="text-lg text-green-400/80 font-mono max-w-2xl mx-auto">
              Connect with elite barbers in real-time. Advanced booking algorithms. 
              Secure payment processing. Welcome to the future of grooming.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          >
            <div className="border border-green-500/30 bg-black/50 p-6 rounded-lg">
              <Zap className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-green-400 font-mono text-lg mb-2">[REAL_TIME]</h3>
              <p className="text-green-300/80 font-mono text-sm">
                Instant booking confirmation and live availability updates
              </p>
            </div>
            
            <div className="border border-green-500/30 bg-black/50 p-6 rounded-lg">
              <Users className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-green-400 font-mono text-lg mb-2">[VERIFIED_NETWORK]</h3>
              <p className="text-green-300/80 font-mono text-sm">
                Curated barbers with verified skills and customer reviews
              </p>
            </div>
            
            <div className="border border-green-500/30 bg-black/50 p-6 rounded-lg">
              <Clock className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-green-400 font-mono text-lg mb-2">[24/7_ACCESS]</h3>
              <p className="text-green-300/80 font-mono text-sm">
                Book appointments anytime, anywhere in the network
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="space-y-4"
          >
            <Button
              size="lg"
              className="bg-green-500 hover:bg-green-600 text-black font-mono text-lg px-8 py-4 mr-4"
            >
              <Terminal className="mr-2 h-5 w-5" />
              ACCESS_NETWORK
            </Button>
            <div className="text-green-400/60 font-mono text-sm">
              [SYSTEM_STATUS: ONLINE] | [ACTIVE_BARBERS: LOADING...]
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
