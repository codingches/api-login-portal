
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserOverviewTab } from "./UserOverviewTab";
import { UserBookingsTab } from "./UserBookingsTab";
import { UserProfileTab } from "./UserProfileTab";
import { UserReviewsTab } from "./UserReviewsTab";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";

interface UserDashboardTabsProps {
  bookings: any[];
  onRefreshBookings: () => void;
}

export const UserDashboardTabs = ({ bookings, onRefreshBookings }: UserDashboardTabsProps) => {
  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="bg-black border border-green-500/30">
        <TabsTrigger value="overview" className="data-[state=active]:bg-green-500/20">
          Overview
        </TabsTrigger>
        <TabsTrigger value="bookings" className="data-[state=active]:bg-green-500/20">
          Bookings
        </TabsTrigger>
        <TabsTrigger value="reviews" className="data-[state=active]:bg-green-500/20">
          Reviews
        </TabsTrigger>
        <TabsTrigger value="notifications" className="data-[state=active]:bg-green-500/20">
          Notifications
        </TabsTrigger>
        <TabsTrigger value="profile" className="data-[state=active]:bg-green-500/20">
          Profile
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <UserOverviewTab bookings={bookings} />
      </TabsContent>

      <TabsContent value="bookings">
        <UserBookingsTab 
          bookings={bookings}
          onRefreshBookings={onRefreshBookings}
        />
      </TabsContent>

      <TabsContent value="reviews">
        <UserReviewsTab />
      </TabsContent>

      <TabsContent value="notifications">
        <NotificationCenter />
      </TabsContent>

      <TabsContent value="profile">
        <UserProfileTab />
      </TabsContent>
    </Tabs>
  );
};
