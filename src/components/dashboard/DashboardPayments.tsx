
import { BankConnectionForm } from "@/components/BankConnectionForm";
import { RealTimePayments } from "@/components/RealTimePayments";

interface DashboardPaymentsProps {
  barberProfile: any;
  onSuccess: () => void;
}

export const DashboardPayments = ({ barberProfile, onSuccess }: DashboardPaymentsProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <BankConnectionForm 
        barberProfile={barberProfile}
        onSuccess={onSuccess}
      />
      <RealTimePayments barberId={barberProfile.id} />
    </div>
  );
};
