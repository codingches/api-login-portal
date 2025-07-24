import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Phone, Video, MoreHorizontal } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  message_type: 'text' | 'image' | 'location';
  is_read: boolean;
  created_at: string;
}

interface ChatConversation {
  id: string;
  barber_id: string;
  client_id: string;
  last_message_at: string;
  created_at: string;
}

interface InstantMessagingHubProps {
  barberId?: string;
  clientId?: string;
}

export const InstantMessagingHub = ({ barberId, clientId }: InstantMessagingHubProps) => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch conversations
  const fetchConversations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .or(
          barberId 
            ? `barber_id.eq.${barberId}` 
            : clientId 
              ? `client_id.eq.${clientId}`
              : `barber_id.in.(${await getUserBarberIds()}),client_id.eq.${user.id}`
        )
        .order('last_message_at', { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get user's barber IDs if they are a barber
  const getUserBarberIds = async () => {
    if (!user) return '';
    
    const { data } = await supabase
      .from('barber_profiles')
      .select('id')
      .eq('user_id', user.id);
    
    return data?.map(b => b.id).join(',') || '';
  };

  // Fetch messages for a conversation
  const fetchMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages((data || []) as ChatMessage[]);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !currentConversation || !user) return;

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert([{
          conversation_id: currentConversation,
          sender_id: user.id,
          message: newMessage.trim(),
          message_type: 'text'
        }])
        .select()
        .single();

      if (error) throw error;

      // Update conversation last_message_at
      await supabase
        .from('chat_conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', currentConversation);

      setNewMessage('');
      
      // Stop typing indicator
      await updateTypingStatus(false);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  // Update typing status
  const updateTypingStatus = async (isTyping: boolean) => {
    if (!currentConversation || !user) return;

    try {
      await supabase
        .from('typing_indicators')
        .upsert([{
          conversation_id: currentConversation,
          user_id: user.id,
          is_typing: isTyping,
          last_typed_at: new Date().toISOString()
        }]);
    } catch (error) {
      console.error('Error updating typing status:', error);
    }
  };

  // Handle typing
  const handleTyping = () => {
    updateTypingStatus(true);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      updateTypingStatus(false);
    }, 3000);
  };

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    fetchConversations();

    // Subscribe to new messages
    const messagesChannel = supabase
      .channel('chat-messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, 
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          if (newMessage.conversation_id === currentConversation) {
            setMessages(prev => [...prev, newMessage]);
          }
        })
      .subscribe();

    // Subscribe to typing indicators
    const typingChannel = supabase
      .channel('typing-indicators')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'typing_indicators' }, 
        (payload) => {
          const typingData = payload.new as any;
          if (typingData && typingData.conversation_id === currentConversation) {
            setTypingUsers(prev => {
              const newSet = new Set(prev);
              if (typingData.is_typing && typingData.user_id !== user.id) {
                newSet.add(typingData.user_id);
              } else {
                newSet.delete(typingData.user_id);
              }
              return newSet;
            });
          }
        })
      .subscribe();

    return () => {
      messagesChannel.unsubscribe();
      typingChannel.unsubscribe();
    };
  }, [user, currentConversation]);

  // Load messages when conversation changes
  useEffect(() => {
    if (currentConversation) {
      fetchMessages(currentConversation);
    }
  }, [currentConversation]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <Card className="bg-black border-green-500/20 h-96">
        <CardContent className="p-6 flex items-center justify-center h-full">
          <div className="text-green-400 font-mono">[LOADING_CHAT...]</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black border-green-500/20 h-96 flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-green-400 font-mono flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Instant Messaging
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex p-0">
        {/* Conversations List */}
        <div className="w-1/3 border-r border-green-500/20 p-3">
          <ScrollArea className="h-full">
            {conversations.length === 0 ? (
              <div className="text-green-400/60 font-mono text-sm text-center py-4">
                No conversations
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setCurrentConversation(conv.id)}
                  className={`p-3 rounded cursor-pointer transition-colors mb-2 ${
                    currentConversation === conv.id 
                      ? 'bg-green-500/20 border border-green-500/30' 
                      : 'hover:bg-green-500/10'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-green-500/20 text-green-400 text-xs">
                        {barberId === conv.barber_id ? 'C' : 'B'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="text-green-400 font-mono text-sm truncate">
                        {barberId === conv.barber_id ? 'Client' : 'Barber'}
                      </div>
                      <div className="text-green-400/60 text-xs font-mono">
                        {formatTime(conv.last_message_at)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {currentConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-3 border-b border-green-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-green-500/20 text-green-400 text-xs">
                      {barberId ? 'C' : 'B'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-green-400 font-mono text-sm">
                    {barberId ? 'Client Chat' : 'Barber Chat'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="text-green-400 hover:bg-green-500/10">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-green-400 hover:bg-green-500/10">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-green-400 hover:bg-green-500/10">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-3">
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-3 py-2 rounded-lg ${
                          message.sender_id === user?.id
                            ? 'bg-green-500 text-black'
                            : 'bg-gray-800 text-green-400'
                        }`}
                      >
                        <div className="font-mono text-sm">{message.message}</div>
                        <div className={`text-xs mt-1 ${
                          message.sender_id === user?.id ? 'text-black/60' : 'text-green-400/60'
                        }`}>
                          {formatTime(message.created_at)}
                        </div>
                      </div>
                    </div>
                  ))}
                  {typingUsers.size > 0 && (
                    <div className="flex justify-start">
                      <div className="bg-gray-800 text-green-400/60 px-3 py-2 rounded-lg font-mono text-sm">
                        typing...
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-3 border-t border-green-500/20">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                      handleTyping();
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="bg-black border-green-500/30 text-green-400 font-mono"
                  />
                  <Button 
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-green-500 hover:bg-green-600 text-black"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-green-400/60 font-mono text-center">
                Select a conversation to start messaging
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};