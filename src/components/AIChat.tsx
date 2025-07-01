
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI assistant. I can help you with barbering questions, booking advice, or general chat. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response (you can replace this with actual AI API call)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(inputMessage),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('haircut') || lowerMessage.includes('cut')) {
      return "Great choice! Our barbers specialize in various haircut styles. Would you like me to help you find a barber near you or provide information about different haircut styles?";
    } else if (lowerMessage.includes('book') || lowerMessage.includes('appointment')) {
      return "I can help you book an appointment! Browse our available barbers above and click 'BOOK NOW' on any barber's profile to schedule your appointment.";
    } else if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return "Prices vary by barber and service type. You can see each barber's pricing in their profile card. Most cuts range from $20-$50 depending on the service and location.";
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello! I'm here to help you with any questions about our barber services. What would you like to know?";
    } else {
      return "That's an interesting question! I'm here to help with barbering services, booking appointments, and general inquiries. Is there something specific about our barber network I can help you with?";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <Card className="bg-black border-green-500/30 h-96">
        <CardHeader className="pb-3">
          <CardTitle className="text-green-400 font-mono flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex flex-col h-80">
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg font-mono text-sm ${
                      message.isUser
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                        : 'bg-gray-800/50 text-green-400 border border-gray-700'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.isUser ? (
                        <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      ) : (
                        <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      )}
                      <span>{message.text}</span>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-800/50 text-green-400 border border-gray-700 p-3 rounded-lg font-mono text-sm">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4" />
                      <span>Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t border-green-500/30">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me anything..."
                className="bg-black/50 border-green-500/30 text-green-400 font-mono text-sm"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                size="sm"
                className="bg-green-500 hover:bg-green-600 text-black"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
