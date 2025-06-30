
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardOverview } from "./DashboardOverview";
import { DashboardPayments } from "./DashboardPayments";
import { ClientSuggestions } from "@/components/ClientSuggestions";

interface DashboardTabsProps {
  barberProfile: any;
  bookings: any[];
  services: any[];
  onPaymentSuccess: () => void;
}

export const DashboardTabs = ({ 
  barberProfile, 
  bookings, 
  services, 
  onPaymentSuccess 
}: DashboardTabsProps) => {
  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="bg-black border border-green-500/30">
        <TabsTrigger value="overview" className="data-[state=active]:bg-green-500/20">
          Overview
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
        <div>Services Content</div>
      </TabsContent>

      <TabsContent value="bookings">
        <div>Bookings Content</div>
      </TabsContent>

      <TabsContent value="availability">
        <div>Availability Content</div>
      </TabsContent>
    </Tabs>
  );
};
