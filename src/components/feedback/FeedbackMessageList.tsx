
import { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FeedbackMessage } from './FeedbackMessage';

interface Message {
  id: string;
  content: string;
  sender_name: string;
  sender_type: 'user' | 'barber';
  created_at: string;
  user_id: string;
}

interface FeedbackMessageListProps {
  messages: Message[];
  currentUserId?: string;
}

export const FeedbackMessageList = ({ messages, currentUserId }: FeedbackMessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <ScrollArea className="flex-1 px-4 py-2">
      <div className="space-y-4">
        {messages.map((message) => (
          <FeedbackMessage
            key={message.id}
            message={message}
            isOwnMessage={message.user_id === currentUserId}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};
