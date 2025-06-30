
import { useAuth } from "@/hooks/useAuth";
import { useBarberData } from "@/hooks/useBarberData";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { DashboardTabs } from "./dashboard/DashboardTabs";

export const BarberDashboard = () => {
  const { user, signOut } = useAuth();
  const { 
    barberProfile, 
    services, 
    availability, 
    bookings, 
    loading,
    addService,
    updateService,
    setAvailabilityForDay,
    refetchData
  } = useBarberData();

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center">
        <div className="text-xl">[LOADING_BARBER_DASHBOARD...]</div>
      </div>
    );
  }

  if (!barberProfile) {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center">
        <div className="text-xl">No barber profile found</div>
      </div>
    );
  }

  const handlePaymentSuccess = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono p-6">
      <div className="container mx-auto max-w-6xl">
        <DashboardHeader 
          barberProfile={barberProfile}
          onSignOut={signOut}
        />
        
        <DashboardTabs
          barberProfile={barberProfile}
          bookings={bookings}
          services={services}
          availability={availability}
          onPaymentSuccess={handlePaymentSuccess}
          onAddService={addService}
          onUpdateService={updateService}
          onUpdateAvailability={setAvailabilityForDay}
          onRefreshBookings={refetchData}
        />
      </div>
    </div>
  );
};
