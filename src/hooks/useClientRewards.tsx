
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface ClientRewards {
  id: string;
  user_id: string;
  total_bookings: number;
  total_spent: number;
  current_tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  discount_percentage: number;
  points_earned: number;
  created_at: string;
  updated_at: string;
}

export const useClientRewards = () => {
  const [rewards, setRewards] = useState<ClientRewards | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchRewards = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('client_rewards')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      setRewards(data);
    } catch (error: any) {
      console.error('Error fetching rewards:', error);
      toast({
        title: "Error",
        description: "Failed to load rewards data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'text-purple-400';
      case 'gold': return 'text-yellow-400';
      case 'silver': return 'text-gray-300';
      case 'bronze': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'platinum': return '💎';
      case 'gold': return '🥇';
      case 'silver': return '🥈';
      case 'bronze': return '🥉';
      default: return '🏆';
    }
  };

  useEffect(() => {
    fetchRewards();
  }, [user]);

  return {
    rewards,
    loading,
    getTierColor,
    getTierIcon,
    refetchRewards: fetchRewards,
  };
};
