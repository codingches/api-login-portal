
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Scissors, Plus, Edit, Trash2, DollarSign, Clock } from "lucide-react";
import { BarberService } from "@/hooks/useBarberData";

interface ServicesTabProps {
  services: BarberService[];
  onAddService: (service: Omit<BarberService, 'id' | 'created_at'>) => Promise<boolean>;
  onUpdateService: (serviceId: string, updates: Partial<BarberService>) => Promise<boolean>;
  barberId: string;
}

export const ServicesTab = ({ services, onAddService, onUpdateService, barberId }: ServicesTabProps) => {
  const [isAddingService, setIsAddingService] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [newService, setNewService] = useState({
    service_name: "",
    description: "",
    price: 0,
    duration_minutes: 30,
    home_service_available: false,
    home_service_price: 0,
    onsite_price: 0,
    is_active: true,
  });
  const { toast } = useToast();

  const handleAddService = async () => {
    if (!newService.service_name || newService.price <= 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const success = await onAddService({
      ...newService,
      barber_id: barberId,
    });

    if (success) {
      setNewService({
        service_name: "",
        description: "",
        price: 0,
        duration_minutes: 30,
        home_service_available: false,
        home_service_price: 0,
        onsite_price: 0,
        is_active: true,
      });
      setIsAddingService(false);
    }
  };

  const handleUpdateService = async (service: BarberService, updates: Partial<BarberService>) => {
    const success = await onUpdateService(service.id, updates);
    if (success) {
      setEditingServiceId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-green-400 flex items-center gap-2">
          <Scissors className="h-6 w-6" />
          Services Management
        </h2>
        <Button
          onClick={() => setIsAddingService(true)}
          className="bg-green-500 hover:bg-green-600 text-black"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      {isAddingService && (
        <Card className="bg-black border-green-500/30">
          <CardHeader>
            <CardTitle className="text-green-400">Add New Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-green-300">Service Name *</Label>
                <Input
                  value={newService.service_name}
                  onChange={(e) => setNewService({ ...newService, service_name: e.target.value })}
                  className="bg-black border-green-500/30 text-green-400"
                  placeholder="e.g., Haircut, Beard Trim"
                />
              </div>
              <div>
                <Label className="text-green-300">Duration (minutes) *</Label>
                <Input
                  type="number"
                  value={newService.duration_minutes}
                  onChange={(e) => setNewService({ ...newService, duration_minutes: parseInt(e.target.value) })}
                  className="bg-black border-green-500/30 text-green-400"
                />
              </div>
            </div>
            <div>
              <Label className="text-green-300">Description</Label>
              <Textarea
                value={newService.description || ""}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                className="bg-black border-green-500/30 text-green-400"
                placeholder="Describe your service..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-green-300">Base Price ($) *</Label>
                <Input
                  type="number"
                  value={newService.price}
                  onChange={(e) => setNewService({ ...newService, price: parseFloat(e.target.value) })}
                  className="bg-black border-green-500/30 text-green-400"
                />
              </div>
              <div>
                <Label className="text-green-300">On-site Price ($)</Label>
                <Input
                  type="number"
                  value={newService.onsite_price || 0}
                  onChange={(e) => setNewService({ ...newService, onsite_price: parseFloat(e.target.value) })}
                  className="bg-black border-green-500/30 text-green-400"
                />
              </div>
              <div>
                <Label className="text-green-300">Home Service Price ($)</Label>
                <Input
                  type="number"
                  value={newService.home_service_price || 0}
                  onChange={(e) => setNewService({ ...newService, home_service_price: parseFloat(e.target.value) })}
                  className="bg-black border-green-500/30 text-green-400"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={newService.home_service_available}
                onCheckedChange={(checked) => setNewService({ ...newService, home_service_available: checked })}
              />
              <Label className="text-green-300">Available for home service</Label>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddService} className="bg-green-500 hover:bg-green-600 text-black">
                Add Service
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsAddingService(false)}
                className="border-green-500/30 text-green-400"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <Card key={service.id} className="bg-black border-green-500/30">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-green-400 flex items-center gap-2">
                  <Scissors className="h-4 w-4" />
                  {service.service_name}
                </CardTitle>
                <div className="flex gap-1">
                  <Badge variant={service.is_active ? "default" : "secondary"}>
                    {service.is_active ? "Active" : "Inactive"}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingServiceId(service.id)}
                    className="text-green-400 hover:bg-green-500/10"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {service.description && (
                <p className="text-green-300/80 text-sm">{service.description}</p>
              )}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-green-400">
                  <DollarSign className="h-4 w-4" />
                  <span>Base: ${service.price}</span>
                </div>
                {service.onsite_price && service.onsite_price > 0 && (
                  <div className="flex items-center gap-2 text-green-400">
                    <DollarSign className="h-4 w-4" />
                    <span>On-site: ${service.onsite_price}</span>
                  </div>
                )}
                {service.home_service_available && service.home_service_price && (
                  <div className="flex items-center gap-2 text-green-400">
                    <DollarSign className="h-4 w-4" />
                    <span>Home Service: ${service.home_service_price}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-green-400">
                  <Clock className="h-4 w-4" />
                  <span>{service.duration_minutes} minutes</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpdateService(service, { is_active: !service.is_active })}
                  className="border-green-500/30 text-green-400"
                >
                  {service.is_active ? "Deactivate" : "Activate"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {services.length === 0 && !isAddingService && (
        <Card className="bg-black border-green-500/30">
          <CardContent className="text-center py-8">
            <Scissors className="h-12 w-12 mx-auto text-green-400/50 mb-4" />
            <p className="text-green-300/60">No services added yet. Add your first service to get started!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
