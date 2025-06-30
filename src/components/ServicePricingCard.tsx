
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Home, Clock } from 'lucide-react';

interface ServicePricingCardProps {
  service: {
    id: string;
    service_name: string;
    description: string | null;
    price: number;
    onsite_price: number | null;
    home_service_price: number | null;
    home_service_available: boolean | null;
    duration_minutes: number;
    is_active: boolean;
  };
  onBookService: (serviceId: string, serviceType: 'onsite' | 'home') => void;
}

export const ServicePricingCard = ({ service, onBookService }: ServicePricingCardProps) => {
  const formatPrice = (price: number) => `$${(price / 100).toFixed(2)}`;

  return (
    <Card className="bg-black border-green-500/30">
      <CardHeader>
        <CardTitle className="text-green-400 flex items-center justify-between">
          {service.service_name}
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <Clock className="h-3 w-3 mr-1" />
            {service.duration_minutes}min
          </Badge>
        </CardTitle>
        {service.description && (
          <p className="text-green-300/80 text-sm">{service.description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Onsite Service */}
        <div className="border border-green-500/20 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-green-400" />
              <span className="text-green-300">At Shop</span>
            </div>
            <span className="text-green-400 font-bold">
              {formatPrice(service.onsite_price || service.price)}
            </span>
          </div>
          <Button
            onClick={() => onBookService(service.id, 'onsite')}
            size="sm"
            className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30"
          >
            Book Onsite
          </Button>
        </div>

        {/* Home Service */}
        {service.home_service_available && (
          <div className="border border-blue-500/20 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-blue-400" />
                <span className="text-blue-300">At Your Location</span>
              </div>
              <span className="text-blue-400 font-bold">
                {formatPrice(service.home_service_price || service.price * 1.5)}
              </span>
            </div>
            <Button
              onClick={() => onBookService(service.id, 'home')}
              size="sm"
              className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30"
            >
              Book Home Service
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
