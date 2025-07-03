
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Star, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user_id: string;
}

interface ReviewListProps {
  barberId: string;
}

export const ReviewList = ({ barberId }: ReviewListProps) => {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['reviews', barberId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('barber_id', barberId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Review[];
    },
  });

  if (isLoading) {
    return (
      <div className="text-green-400 font-mono text-center py-4">
        [LOADING_REVIEWS...]
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-green-400/60 font-mono text-center py-4">
        No reviews yet
      </div>
    );
  }

  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-2xl font-bold text-green-400 font-mono">
            {averageRating.toFixed(1)}
          </span>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${
                  star <= averageRating
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
        <p className="text-green-400/60 font-mono text-sm">
          Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
        </p>
      </div>

      {reviews.map((review) => (
        <Card key={review.id} className="bg-black border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-500/20 rounded-full p-2">
                <User className="h-4 w-4 text-green-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-green-400/60 font-mono text-xs">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            
            {review.comment && (
              <p className="text-green-300 font-mono text-sm leading-relaxed">
                {review.comment}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
