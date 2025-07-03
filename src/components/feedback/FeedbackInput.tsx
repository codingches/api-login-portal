
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface FeedbackInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  isDisabled: boolean;
}

export const FeedbackInput = ({ onSendMessage, isLoading, isDisabled }: FeedbackInputProps) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t border-blue-500/30">
      <div className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Share your feedback..."
          className="bg-black/50 border-blue-500/30 text-white font-mono"
          disabled={isLoading || isDisabled}
        />
        <Button
          onClick={handleSend}
          disabled={isLoading || !message.trim() || isDisabled}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
