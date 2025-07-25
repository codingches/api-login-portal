
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { X, User, Mail, Lock, Terminal, Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal = ({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        
        if (error) throw error;
        
        toast({
          title: "[LOGIN_SUCCESS]",
          description: "Welcome back to the network!",
        });
        onClose();
        // Redirect to main page
        window.location.href = '/';
      } else {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
            },
            emailRedirectTo: `${window.location.origin}/`
          }
        });
        
        if (error) throw error;
        
        toast({
          title: "[REGISTRATION_SUCCESS]",
          description: "Check your email to confirm your account!",
        });
        onClose();
        // Redirect to main page
        window.location.href = '/';
      }
    } catch (error: any) {
      // Enhanced error handling with friendly messages
      let errorMessage = "Something went wrong. Please try again.";
      
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Oops! Invalid email or password. Try again or reset your password.";
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "Please check your email and confirm your account first.";
      } else if (error.message.includes("User already registered")) {
        errorMessage = "This email is already registered. Try logging in instead.";
      } else if (error.message.includes("Password should be at least")) {
        errorMessage = "Password must be at least 6 characters long.";
      }
      
      toast({
        title: mode === 'login' ? "[LOGIN_FAILED]" : "[REGISTRATION_FAILED]",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Shake animation on error
      const formElement = document.querySelector('.auth-form') as HTMLElement;
      if (formElement) {
        formElement.classList.add('animate-pulse');
        setTimeout(() => formElement.classList.remove('animate-pulse'), 600);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ email: '', password: '', fullName: '' });
  };

  const handleClose = () => {
    resetForm();
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
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md"
          >
            {/* Glassmorphism background with subtle gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-blue-500/10 rounded-lg blur-xl"></div>
            <Card className="relative bg-black/90 backdrop-blur-md border-green-500/50 shadow-2xl shadow-green-500/25 hover:shadow-green-500/30 transition-all duration-300">
              <CardHeader className="border-b border-green-500/30 pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <Terminal className="h-6 w-6 text-green-400 animate-pulse" />
                      <CardTitle className="text-green-400 font-mono text-lg">
                        {mode === 'login' ? '[ACCESS_TERMINAL]' : '[CREATE_ACCOUNT]'}
                      </CardTitle>
                    </div>
                    <p className="text-green-300/70 font-mono text-sm">
                      {mode === 'login' 
                        ? "Welcome back, Dev! Ready to build something great?" 
                        : "Join the network — let's build the future together."
                      }
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClose}
                    className="text-green-400 hover:text-green-300 hover:bg-green-500/10 transition-all duration-200"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="auth-form space-y-5">
                  {mode === 'register' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="fullName" className="text-green-400 font-mono text-sm">DEVELOPER_NAME</Label>
                      <div className="relative group">
                        <User className="absolute left-3 top-3 h-4 w-4 text-green-500 group-focus-within:text-green-400 transition-colors" />
                        <Input
                          id="fullName"
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                          className="bg-black/50 border-green-500/50 text-white font-mono pl-10 pr-4 focus:border-green-400 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                    </motion.div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-green-400 font-mono text-sm">EMAIL_ADDRESS</Label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-green-500 group-focus-within:text-green-400 transition-colors" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="bg-black/50 border-green-500/50 text-white font-mono pl-10 pr-4 focus:border-green-400 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
                        placeholder="dev@example.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-green-400 font-mono text-sm">ACCESS_KEY</Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-green-500 group-focus-within:text-green-400 transition-colors" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="bg-black/50 border-green-500/50 text-white font-mono pl-10 pr-12 focus:border-green-400 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
                        placeholder={mode === 'register' ? "Min 6 characters" : "Enter your password"}
                        required
                        minLength={mode === 'register' ? 6 : undefined}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1 h-8 w-8 text-green-500 hover:text-green-400 hover:bg-green-500/10"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {mode === 'login' && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="remember"
                          checked={rememberMe}
                          onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                          className="border-green-500/50 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                        />
                        <label htmlFor="remember" className="text-green-400 font-mono cursor-pointer">
                          STAY_LOGGED_IN
                        </label>
                      </div>
                      <button
                        type="button"
                        className="text-green-400 hover:text-green-300 font-mono underline-offset-4 hover:underline transition-all duration-200"
                        onClick={() => {
                          toast({
                            title: "[PASSWORD_RESET]",
                            description: "Password reset feature coming soon!",
                          });
                        }}
                      >
                        FORGOT_KEY?
                      </button>
                    </div>
                  )}

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-mono font-bold py-3 transition-all duration-300 shadow-lg hover:shadow-green-500/25"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          [CONNECTING...]
                        </div>
                      ) : (
                        mode === 'login' ? '[ENTER_SYSTEM]' : '[JOIN_NETWORK]'
                      )}
                    </Button>
                  </motion.div>
                </form>

                <div className="mt-6 text-center space-y-3">
                  <button
                    type="button"
                    onClick={() => {
                      setMode(mode === 'login' ? 'register' : 'login');
                      resetForm();
                      setShowPassword(false);
                      setRememberMe(false);
                    }}
                    className="text-green-400 hover:text-green-300 font-mono text-sm transition-all duration-200 hover:scale-105"
                  >
                    {mode === 'login' 
                      ? '[NEW_USER?] → CREATE_ACCOUNT' 
                      : '← [RETURNING_USER?] LOGIN'
                    }
                  </button>
                  
                  <p className="text-green-300/50 font-mono text-xs italic">
                    "Every login is one step closer to your dream app."
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
