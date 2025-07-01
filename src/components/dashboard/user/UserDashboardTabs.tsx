
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserOverviewTab } from "./UserOverviewTab";
import { UserBookingsTab } from "./UserBookingsTab";
import { UserReviewsTab } from "./UserReviewsTab";
import { UserProfileTab } from "./UserProfileTab";
import { RewardsCard } from "@/components/RewardsCard";

interface UserDashboardTabsProps {
  user: any;
  profile: any;
  profileLoading: boolean;
  bookings: any[];
  bookingsLoading: boolean;
  reviews: any[];
  reviewsLoading: boolean;
  updateProfile: (data: any) => Promise<boolean>;
  refetchProfile: () => void;
}

export const UserDashboardTabs = ({
  user,
  profile,
  profileLoading,
  bookings,
  bookingsLoading,
  reviews,
  reviewsLoading,
  updateProfile,
  refetchProfile
}: UserDashboardTabsProps) => {
  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="bg-black border border-green-500/30">
        <TabsTrigger value="overview" className="data-[state=active]:bg-green-500/20">
          Overview
        </TabsTrigger>
        <TabsTrigger value="rewards" className="data-[state=active]:bg-green-500/20">
          Rewards
        </TabsTrigger>
        <TabsTrigger value="bookings" className="data-[state=active]:bg-green-500/20">
          My Bookings
        </TabsTrigger>
        <TabsTrigger value="reviews" className="data-[state=active]:bg-green-500/20">
          My Reviews
        </TabsTrigger>
        <TabsTrigger value="profile" className="data-[state=active]:bg-green-500/20">
          Profile
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <UserOverviewTab 
          bookings={bookings}
          reviews={reviews}
          bookingsLoading={bookingsLoading}
        />
      </TabsContent>

      <TabsContent value="rewards">
        <RewardsCard />
      </TabsContent>

      <TabsContent value="bookings">
        <UserBookingsTab
          bookings={bookings}
          bookingsLoading={bookingsLoading}
        />
      </TabsContent>

      <TabsContent value="reviews">
        <UserReviewsTab
          reviews={reviews}
          reviewsLoading={reviewsLoading}
        />
      </TabsContent>

      <TabsContent value="profile">
        <UserProfileTab
          user={user}
          profile={profile}
          profileLoading={profileLoading}
          updateProfile={updateProfile}
          refetchProfile={refetchProfile}
        />
      </TabsContent>
    </Tabs>
  );
};
