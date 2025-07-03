
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ReviewFormProps {
  barberId: string;
  bookingId?: string;
  onReviewSubmitted: () => void;
}

export const ReviewForm = ({ barberId, bookingId, onReviewSubmitted }: ReviewFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || rating === 0) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          user_id: user.id,
          barber_id: barberId,
          booking_id: bookingId,
          rating,
          comment: comment.trim() || null
        });

      if (error) throw error;

      toast({
        title: "Review submitted!",
        description: "Thank you for your feedback.",
      });

      setRating(0);
      setComment('');
      onReviewSubmitted();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-black border-green-500/30">
      <CardHeader>
        <CardTitle className="text-green-400 font-mono">[LEAVE_REVIEW]</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-green-300 font-mono text-sm mb-2 block">
              Rating
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-600'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-green-300 font-mono text-sm mb-2 block">
              Comment (Optional)
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              className="bg-black border-green-500/30 text-green-300 font-mono"
              rows={4}
            />
          </div>

          <Button
            type="submit"
            disabled={rating === 0 || isSubmitting || !user}
            className="w-full bg-green-500 hover:bg-green-600 text-black font-mono"
          >
            {isSubmitting ? '[SUBMITTING...]' : '[SUBMIT_REVIEW]'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
