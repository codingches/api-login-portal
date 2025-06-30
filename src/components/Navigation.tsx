
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Scissors, Terminal, User, LogOut, Settings } from "lucide-react";
import { useState } from "react";
import { AuthModal } from "./AuthModal";
import { BarberRegistrationModal } from "./BarberRegistrationModal";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isBarberModalOpen, setIsBarberModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  
  const { user, loading, signOut, isAuthenticated } = useAuth();

  // Check if user is a barber
  const { data: barberProfile } = useQuery({
    queryKey: ['barber-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('barber_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleLogin = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  const handleRegister = () => {
    setAuthModalMode('register');
    setIsAuthModalOpen(true);
  };

  const handleBarberRegistration = () => {
    if (!isAuthenticated) {
      // If not authenticated, show login modal first
      setAuthModalMode('register');
      setIsAuthModalOpen(true);
      return;
    }
    setIsBarberModalOpen(true);
  };

  if (loading) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 border-b border-green-500/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Terminal className="h-8 w-8 text-green-400" />
              <span className="text-2xl font-bold text-green-400 tracking-wider">
                ZIDON_SYSTEM
              </span>
            </div>
            <div className="text-green-400 font-mono">[LOADING...]</div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/90 border-b border-green-500/30 backdrop-blur-sm"
      >
        <div className="container mx-auto px-4 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-4"
              whileHover={{ scale: 1.05 }}
            >
              <Link to="/" className="flex items-center space-x-4">
                <Terminal className="h-8 w-8 text-green-400" />
                <span className="text-2xl font-bold text-green-400 tracking-wider">
                  ZIDON_SYSTEM
                </span>
              </Link>
            </motion.div>
            
            <div className="hidden md:flex items-center space-x-8">
              <button className="text-green-400 hover:text-green-300 transition-colors font-mono px-2 py-1">
                [FIND_BARBERS]
              </button>
              <button className="text-green-400 hover:text-green-300 transition-colors font-mono px-2 py-1">
                [REAL_TIME_BOOKING]
              </button>
              <button className="text-green-400 hover:text-green-300 transition-colors font-mono px-2 py-1">
                [JOIN_NETWORK]
              </button>
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-3 ml-8 pl-8 border-l border-green-500/30">
                  <span className="text-green-400 font-mono text-sm">
                    [USER: {user?.user_metadata?.full_name || user?.email}]
                  </span>
                  
                  <Link to="/dashboard">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-green-500 text-green-400 hover:bg-green-500/20 font-mono"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      DASHBOARD
                    </Button>
                  </Link>

                  {!barberProfile && (
                    <Button 
                      onClick={handleBarberRegistration}
                      variant="outline" 
                      size="sm"
                      className="border-green-500 text-green-400 hover:bg-green-500 hover:text-black font-mono"
                    >
                      <Scissors className="mr-2 h-4 w-4" />
                      REGISTER_BARBER
                    </Button>
                  )}

                  <Button 
                    onClick={signOut}
                    variant="outline" 
                    size="sm"
                    className="border-red-500 text-red-400 hover:bg-red-500/20 font-mono"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    LOGOUT
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-3 ml-8 pl-8 border-l border-green-500/30">
                  <Button 
                    onClick={handleLogin}
                    size="sm"
                    className="bg-green-500 hover:bg-green-600 text-black font-mono border border-green-400"
                  >
                    <User className="mr-2 h-4 w-4" />
                    LOGIN
                  </Button>
                  <Button 
                    onClick={handleBarberRegistration}
                    variant="outline" 
                    size="sm"
                    className="border-green-500 text-green-400 hover:bg-green-500 hover:text-black font-mono"
                  >
                    <Scissors className="mr-2 h-4 w-4" />
                    REGISTER_BARBER
                  </Button>
                </div>
              )}
            </div>

            <button 
              className="md:hidden text-green-400 p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Terminal />
            </button>
          </div>

          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="md:hidden mt-6 space-y-4 border-t border-green-500/30 pt-6"
            >
              <div className="text-green-400 font-mono text-sm">[MOBILE_MENU_ACTIVE]</div>
              <button className="block w-full text-left text-green-400 hover:text-green-300 font-mono py-2">
                [FIND_BARBERS]
              </button>
              <button className="block w-full text-left text-green-400 hover:text-green-300 font-mono py-2">
                [REAL_TIME_BOOKING]
              </button>
              <div className="space-y-3 pt-4 border-t border-green-500/20">
                {isAuthenticated ? (
                  <>
                    <div className="text-green-400 font-mono text-sm">
                      [USER: {user?.user_metadata?.full_name || user?.email}]
                    </div>
                    <Link to="/dashboard">
                      <Button 
                        className="w-full bg-green-500 hover:bg-green-600 text-black font-mono mb-3"
                      >
                        DASHBOARD
                      </Button>
                    </Link>
                    {!barberProfile && (
                      <Button 
                        onClick={handleBarberRegistration}
                        variant="outline" 
                        className="w-full border-green-500 text-green-400 font-mono mb-3"
                      >
                        REGISTER_BARBER
                      </Button>
                    )}
                    <Button 
                      onClick={signOut}
                      className="w-full bg-red-500 hover:bg-red-600 text-white font-mono"
                    >
                      LOGOUT
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      onClick={handleLogin}
                      className="w-full bg-green-500 hover:bg-green-600 text-black font-mono mb-3"
                    >
                      LOGIN
                    </Button>
                    <Button 
                      onClick={handleBarberRegistration}
                      variant="outline" 
                      className="w-full border-green-500 text-green-400 font-mono"
                    >
                      REGISTER_BARBER
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />

      <BarberRegistrationModal 
        isOpen={isBarberModalOpen}
        onClose={() => setIsBarberModalOpen(false)}
      />
    </>
  );
};
