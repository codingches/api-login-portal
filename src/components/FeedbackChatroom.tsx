
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FeedbackHeader } from './feedback/FeedbackHeader';
import { FeedbackMessageList } from './feedback/FeedbackMessageList';
import { FeedbackInput } from './feedback/FeedbackInput';
import { OceanBackground } from './feedback/OceanBackground';

interface Message {
  id: string;
  content: string;
  sender_name: string;
  sender_type: 'user' | 'barber';
  created_at: string;
  user_id: string;
}

interface FeedbackChatroomProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackChatroom = ({ isOpen, onClose }: FeedbackChatroomProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<'user' | 'barber'>('user');

  useEffect(() => {
    if (isOpen) {
      checkUserType();
      fetchMessages();
      setupRealtimeSubscription();
    }
  }, [isOpen, user]);

  const checkUserType = async () => {
    if (!user) return;
    
    const { data: barberProfile } = await supabase
      .from('barber_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();
    
    setUserType(barberProfile ? 'barber' : 'user');
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('feedback_messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(100);

      if (error) throw error;
      
      const typedMessages: Message[] = (data || []).map(msg => ({
        ...msg,
        sender_type: msg.sender_type as 'user' | 'barber'
      }));
      
      setMessages(typedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('feedback_messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'feedback_messages'
      }, (payload) => {
        const newMsg = {
          ...payload.new,
          sender_type: payload.new.sender_type as 'user' | 'barber'
        } as Message;
        setMessages(prev => [...prev, newMsg]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleSendMessage = async (message: string) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('feedback_messages')
        .insert({
          content: message,
          sender_name: user.user_metadata?.full_name || user.email || 'Anonymous',
          sender_type: userType,
          user_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Message sent!",
        description: "Your feedback has been shared with the community.",
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <OceanBackground />

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-4xl h-[80vh] relative z-10"
        >
          <Card className="bg-black/90 border-blue-500/50 backdrop-blur-sm h-full">
            <CardHeader className="border-b border-blue-500/30 pb-4">
              <FeedbackHeader userType={userType} onClose={onClose} />
            </CardHeader>

            <CardContent className="p-0 flex flex-col h-[calc(100%-5rem)]">
              <FeedbackMessageList 
                messages={messages} 
                currentUserId={user?.id} 
              />

              <FeedbackInput
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                isDisabled={!user}
              />
              
              {!user && (
                <p className="text-blue-400/60 text-sm mt-2 px-4 pb-2">
                  Please sign in to participate in the chatroom
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
