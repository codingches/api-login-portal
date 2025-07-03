
import { CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageCircle, X } from 'lucide-react';

interface FeedbackHeaderProps {
  userType: 'user' | 'barber';
  onClose: () => void;
}

export const FeedbackHeader = ({ userType, onClose }: FeedbackHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <MessageCircle className="h-6 w-6 text-blue-400" />
        <CardTitle className="text-blue-400 font-mono">
          [FEEDBACK_CHATROOM]
        </CardTitle>
        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
          {userType === 'barber' ? 'BARBER' : 'USER'}
        </Badge>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="text-blue-400 hover:text-blue-300"
      >
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
};
