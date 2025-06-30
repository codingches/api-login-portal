
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserDashboard } from "@/components/UserDashboard";
import { BarberDashboard } from "@/components/BarberDashboard";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();

  // Check if user is a barber
  const { data: barberProfile, isLoading: barberLoading } = useQuery({
    queryKey: ['barber-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('barber_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (authLoading || barberLoading) {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center">
        <div className="text-xl">[LOADING_DASHBOARD...]</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Show barber dashboard if user has a barber profile, otherwise show user dashboard
  return barberProfile ? <BarberDashboard /> : <UserDashboard />;
};

export default Dashboard;
