
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  barber_profiles: {
    business_name: string;
  };
}

export const UserReviewsTab = () => {
  const { user } = useAuth();

  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ['user-reviews', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          barber_profiles!inner(business_name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Review[];
    },
    enabled: !!user,
  });

  return (
    <Card className="bg-black border-green-500/30">
      <CardHeader>
        <CardTitle className="text-green-400">My Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        {reviewsLoading ? (
          <div className="text-green-300/60">Loading reviews...</div>
        ) : reviews && reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border border-green-500/30 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-green-400 font-bold">{review.barber_profiles.business_name}</h3>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
                      />
                    ))}
                  </div>
                </div>
                
                {review.comment && (
                  <p className="text-green-300/80 mb-2">{review.comment}</p>
                )}
                
                <div className="text-green-300/60 text-sm">
                  {new Date(review.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-green-300/60">No reviews yet</div>
        )}
      </CardContent>
    </Card>
  );
};
