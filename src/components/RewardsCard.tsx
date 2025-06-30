
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Gift } from 'lucide-react';
import { useClientRewards } from '@/hooks/useClientRewards';

export const RewardsCard = () => {
  const { rewards, loading, getTierColor, getTierIcon } = useClientRewards();

  if (loading) {
    return (
      <Card className="bg-black border-green-500/30">
        <CardContent className="p-6">
          <div className="text-green-300/60">Loading rewards...</div>
        </CardContent>
      </Card>
    );
  }

  if (!rewards) {
    return (
      <Card className="bg-black border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Rewards Program
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-green-300/80">
            Complete your first booking to join our rewards program!
          </p>
        </CardContent>
      </Card>
    );
  }

  const getNextTierRequirement = (currentTier: string) => {
    switch (currentTier) {
      case 'bronze': return { tier: 'Silver', bookings: 5 };
      case 'silver': return { tier: 'Gold', bookings: 10 };
      case 'gold': return { tier: 'Platinum', bookings: 20 };
      default: return null;
    }
  };

  const nextTier = getNextTierRequirement(rewards.current_tier);
  const progress = nextTier ? (rewards.total_bookings / nextTier.bookings) * 100 : 100;

  return (
    <Card className="bg-black border-green-500/30">
      <CardHeader>
        <CardTitle className="text-green-400 flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Rewards Program
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getTierIcon(rewards.current_tier)}</span>
            <div>
              <div className={`font-bold ${getTierColor(rewards.current_tier)}`}>
                {rewards.current_tier.toUpperCase()} TIER
              </div>
              <div className="text-green-300/80 text-sm">
                {rewards.discount_percentage}% discount on all services
              </div>
            </div>
          </div>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <Gift className="h-3 w-3 mr-1" />
            {rewards.points_earned} pts
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{rewards.total_bookings}</div>
            <div className="text-green-300/80 text-sm">Total Bookings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              ${(rewards.total_spent / 100).toFixed(0)}
            </div>
            <div className="text-green-300/80 text-sm">Total Spent</div>
          </div>
        </div>

        {nextTier && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-green-300/80">Progress to {nextTier.tier}</span>
              <span className="text-green-400">
                {rewards.total_bookings}/{nextTier.bookings} bookings
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {rewards.current_tier === 'platinum' && (
          <div className="text-center p-3 border border-purple-500/30 rounded-lg">
            <Star className="h-6 w-6 text-purple-400 mx-auto mb-2" />
            <div className="text-purple-400 font-bold">Maximum Tier Reached!</div>
            <div className="text-purple-300/80 text-sm">
              You've unlocked the highest rewards tier
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
