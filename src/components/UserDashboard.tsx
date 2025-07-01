
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserDashboardHeader } from "@/components/dashboard/user/UserDashboardHeader";
import { UserDashboardTabs } from "@/components/dashboard/user/UserDashboardTabs";

export const UserDashboard = () => {
  const { user, signOut } = useAuth();
  const { profile, updateProfile, loading: profileLoading, refetchProfile } = useUserProfile();

  // Fetch user's bookings
  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['user-bookings', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          barber_profiles!inner(business_name, location, phone)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch user's reviews
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
      return data;
    },
    enabled: !!user,
  });

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono p-6">
      <div className="container mx-auto max-w-6xl">
        <UserDashboardHeader user={user} signOut={signOut} />
        
        <UserDashboardTabs
          user={user}
          profile={profile}
          profileLoading={profileLoading}
          bookings={bookings || []}
          bookingsLoading={bookingsLoading}
          reviews={reviews || []}
          reviewsLoading={reviewsLoading}
          updateProfile={updateProfile}
          refetchProfile={refetchProfile}
        />
      </div>
    </div>
  );
};
