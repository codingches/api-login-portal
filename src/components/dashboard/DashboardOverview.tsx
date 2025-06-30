
import { DashboardStats } from "./DashboardStats";
import { VerificationStatusCard } from "./VerificationStatusCard";
import { RecentBookingsCard } from "./RecentBookingsCard";

interface DashboardOverviewProps {
  barberProfile: any;
  bookings: any[];
  services: any[];
}

export const DashboardOverview = ({ barberProfile, bookings, services }: DashboardOverviewProps) => {
  const totalEarnings = bookings?.filter((b: any) => b.status === 'completed').length * 35 || 0;
  const pendingBookings = bookings?.filter((b: any) => b.status === 'pending').length || 0;
  const completedBookings = bookings?.filter((b: any) => b.status === 'completed').length || 0;

  return (
    <>
      <DashboardStats
        totalEarnings={totalEarnings}
        pendingBookings={pendingBookings}
        completedBookings={completedBookings}
        servicesCount={services?.length || 0}
      />
      <VerificationStatusCard barberProfile={barberProfile} />
      <RecentBookingsCard bookings={bookings} />
    </>
  );
};
