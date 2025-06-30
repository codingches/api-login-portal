
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, User, Mail, Lock, Terminal } from "lucide-react";
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
      } else {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
            }
          }
        });
        
        if (error) throw error;
        
        toast({
          title: "[REGISTRATION_SUCCESS]",
          description: "Check your email to confirm your account!",
        });
        onClose();
      }
    } catch (error: any) {
      toast({
        title: "[ERROR]",
        description: error.message,
        variant: "destructive",
      });
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
                      {mode === 'login' ? '[USER_LOGIN]' : '[USER_REGISTER]'}
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
              </CardHeader>

              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === 'register' && (
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-green-400 font-mono">FULL_NAME</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                        <Input
                          id="fullName"
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                          className="bg-black/50 border-green-500/50 text-white font-mono pl-10"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-green-400 font-mono">EMAIL</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="bg-black/50 border-green-500/50 text-white font-mono pl-10"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-green-400 font-mono">PASSWORD</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="bg-black/50 border-green-500/50 text-white font-mono pl-10"
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-500 hover:bg-green-600 text-black font-mono font-bold"
                  >
                    {loading ? '[PROCESSING...]' : mode === 'login' ? '[LOGIN]' : '[REGISTER]'}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setMode(mode === 'login' ? 'register' : 'login');
                      resetForm();
                    }}
                    className="text-green-400 hover:text-green-300 font-mono text-sm"
                  >
                    {mode === 'login' 
                      ? '[CREATE_ACCOUNT] →' 
                      : '← [BACK_TO_LOGIN]'
                    }
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
