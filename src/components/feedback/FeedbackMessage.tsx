
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { User, Scissors } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender_name: string;
  sender_type: 'user' | 'barber';
  created_at: string;
  user_id: string;
}

interface FeedbackMessageProps {
  message: Message;
  isOwnMessage: boolean;
}

export const FeedbackMessage = ({ message, isOwnMessage }: FeedbackMessageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[70%] p-3 rounded-lg ${
          isOwnMessage
            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
            : 'bg-gray-800/50 text-white border border-gray-700'
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          {message.sender_type === 'barber' ? (
            <Scissors className="h-4 w-4 text-green-400" />
          ) : (
            <User className="h-4 w-4 text-blue-400" />
          )}
          <span className="text-xs font-medium">
            {message.sender_name}
          </span>
          <Badge
            className={`text-xs px-1 py-0 ${
              message.sender_type === 'barber'
                ? 'bg-green-500/20 text-green-400'
                : 'bg-blue-500/20 text-blue-400'
            }`}
          >
            {message.sender_type}
          </Badge>
        </div>
        <p className="text-sm">{message.content}</p>
        <div className="text-xs opacity-60 mt-1">
          {new Date(message.created_at).toLocaleTimeString()}
        </div>
      </div>
    </motion.div>
  );
};
