
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Scissors, Zap, Globe } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Animated grid background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-green-500/5" />
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(34,197,94,0.1) 1px, transparent 1px),
                             linear-gradient(rgba(34,197,94,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <div className="inline-block p-4 border-2 border-green-500 rounded-lg bg-green-500/10">
              <Scissors className="h-16 w-16 text-green-400" />
            </div>
          </motion.div>

          <motion.h1 
            className="text-6xl md:text-8xl font-bold mb-6 font-mono"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
          >
            <span className="text-green-400">ZIDON</span>
            <br />
            <span className="text-white text-4xl md:text-6xl">NETWORK_INITIALIZED</span>
          </motion.h1>

          <motion.div
            className="border border-green-500/50 p-4 bg-black/50 rounded-lg mb-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <p className="text-lg md:text-xl text-green-300 font-mono leading-relaxed">
              &gt; CONNECTING BARBERS GLOBALLY...<br/>
              &gt; REAL-TIME BOOKING SYSTEM ACTIVE<br/>
              &gt; NETWORK STATUS: <span className="text-green-400 font-bold">ONLINE</span><br/>
              &gt; USERS_CONNECTED: <span className="text-green-400">2,847</span>
            </p>
          </motion.div>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <Button 
              size="lg" 
              className="bg-green-500 hover:bg-green-600 text-black text-lg px-8 py-4 h-auto font-mono font-bold group border-2 border-green-400"
            >
              <Zap className="mr-2 group-hover:rotate-12 transition-transform" />
              BOOK_NOW
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="border-green-500 text-green-400 hover:bg-green-500/20 text-lg px-8 py-4 h-auto font-mono"
            >
              <Globe className="mr-2" />
              EXPLORE_NETWORK
            </Button>
          </motion.div>

          <motion.div
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <div className="border border-green-500/30 p-4 bg-black/30 rounded">
              <div className="text-green-400 font-mono text-sm mb-2">[FEATURE_01]</div>
              <div className="text-white">Real-time availability tracking</div>
            </div>
            <div className="border border-green-500/30 p-4 bg-black/30 rounded">
              <div className="text-green-400 font-mono text-sm mb-2">[FEATURE_02]</div>
              <div className="text-white">Global barber network access</div>
            </div>
            <div className="border border-green-500/30 p-4 bg-black/30 rounded">
              <div className="text-green-400 font-mono text-sm mb-2">[FEATURE_03]</div>
              <div className="text-white">Instant booking confirmation</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
