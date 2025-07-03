
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardOverview } from "./DashboardOverview";
import { DashboardPayments } from "./DashboardPayments";
import { ClientSuggestions } from "@/components/ClientSuggestions";
import { ServicesTab } from "./ServicesTab";
import { AvailabilityTab } from "./AvailabilityTab";
import { BookingsTab } from "./BookingsTab";
import { ProfileTab } from "./ProfileTab";
import { ReviewList } from "@/components/reviews/ReviewList";
import { PhotoGallery } from "@/components/gallery/PhotoGallery";

interface DashboardTabsProps {
  barberProfile: any;
  bookings: any[];
  services: any[];
  availability: any[];
  onPaymentSuccess: () => void;
  onAddService: (service: any) => Promise<boolean>;
  onUpdateService: (serviceId: string, updates: any) => Promise<boolean>;
  onUpdateAvailability: (dayOfWeek: number, startTime: string, endTime: string, isAvailable: boolean) => Promise<boolean>;
  onRefreshBookings: () => void;
}

export const DashboardTabs = ({ 
  barberProfile, 
  bookings, 
  services,
  availability,
  onPaymentSuccess,
  onAddService,
  onUpdateService,
  onUpdateAvailability,
  onRefreshBookings
}: DashboardTabsProps) => {
  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="bg-black border border-green-500/30">
        <TabsTrigger value="overview" className="data-[state=active]:bg-green-500/20">
          Overview
        </TabsTrigger>
        <TabsTrigger value="profile" className="data-[state=active]:bg-green-500/20">
          Profile
        </TabsTrigger>
        <TabsTrigger value="gallery" className="data-[state=active]:bg-green-500/20">
          Gallery
        </TabsTrigger>
        <TabsTrigger value="reviews" className="data-[state=active]:bg-green-500/20">
          Reviews
        </TabsTrigger>
        <TabsTrigger value="payments" className="data-[state=active]:bg-green-500/20">
          Payments
        </TabsTrigger>
        <TabsTrigger value="suggestions" className="data-[state=active]:bg-green-500/20">
          Suggestions
        </TabsTrigger>
        <TabsTrigger value="services" className="data-[state=active]:bg-green-500/20">
          Services
        </TabsTrigger>
        <TabsTrigger value="bookings" className="data-[state=active]:bg-green-500/20">
          Bookings
        </TabsTrigger>
        <TabsTrigger value="availability" className="data-[state=active]:bg-green-500/20">
          Availability
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <DashboardOverview 
          barberProfile={barberProfile}
          bookings={bookings}
          services={services}
        />
      </TabsContent>

      <TabsContent value="profile">
        <ProfileTab
          barberProfile={barberProfile}
          onRefreshData={onRefreshBookings}
        />
      </TabsContent>

      <TabsContent value="gallery">
        <PhotoGallery
          barberId={barberProfile.id}
          isOwner={true}
        />
      </TabsContent>

      <TabsContent value="reviews">
        <ReviewList barberId={barberProfile.id} />
      </TabsContent>

      <TabsContent value="payments">
        <DashboardPayments 
          barberProfile={barberProfile}
          onSuccess={onPaymentSuccess}
        />
      </TabsContent>

      <TabsContent value="suggestions">
        <ClientSuggestions barberId={barberProfile.id} />
      </TabsContent>

      <TabsContent value="services">
        <ServicesTab
          services={services}
          onAddService={onAddService}
          onUpdateService={onUpdateService}
          barberId={barberProfile.id}
        />
      </TabsContent>

      <TabsContent value="bookings">
        <BookingsTab
          bookings={bookings}
          onRefreshBookings={onRefreshBookings}
        />
      </TabsContent>

      <TabsContent value="availability">
        <AvailabilityTab
          availability={availability}
          onUpdateAvailability={onUpdateAvailability}
        />
      </TabsContent>
    </Tabs>
  );
};
