
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Clock, Calendar } from "lucide-react";
import { BarberAvailability } from "@/hooks/useBarberData";

interface AvailabilityTabProps {
  availability: BarberAvailability[];
  onUpdateAvailability: (dayOfWeek: number, startTime: string, endTime: string, isAvailable: boolean) => Promise<boolean>;
}

const DAYS_OF_WEEK = [
  { id: 0, name: "Sunday" },
  { id: 1, name: "Monday" },
  { id: 2, name: "Tuesday" },
  { id: 3, name: "Wednesday" },
  { id: 4, name: "Thursday" },
  { id: 5, name: "Friday" },
  { id: 6, name: "Saturday" },
];

export const AvailabilityTab = ({ availability, onUpdateAvailability }: AvailabilityTabProps) => {
  const [daySchedules, setDaySchedules] = useState(() => {
    const schedules: Record<number, { isAvailable: boolean; startTime: string; endTime: string }> = {};
    
    DAYS_OF_WEEK.forEach(day => {
      const existingAvailability = availability.find(a => a.day_of_week === day.id);
      schedules[day.id] = {
        isAvailable: existingAvailability?.is_available || false,
        startTime: existingAvailability?.start_time || "09:00",
        endTime: existingAvailability?.end_time || "17:00",
      };
    });
    
    return schedules;
  });

  const handleScheduleUpdate = async (dayOfWeek: number) => {
    const schedule = daySchedules[dayOfWeek];
    const success = await onUpdateAvailability(
      dayOfWeek,
      schedule.startTime,
      schedule.endTime,
      schedule.isAvailable
    );
    
    if (!success) {
      // Revert the change if it failed
      const existingAvailability = availability.find(a => a.day_of_week === dayOfWeek);
      setDaySchedules(prev => ({
        ...prev,
        [dayOfWeek]: {
          isAvailable: existingAvailability?.is_available || false,
          startTime: existingAvailability?.start_time || "09:00",
          endTime: existingAvailability?.end_time || "17:00",
        }
      }));
    }
  };

  const updateDaySchedule = (dayOfWeek: number, updates: Partial<typeof daySchedules[0]>) => {
    setDaySchedules(prev => ({
      ...prev,
      [dayOfWeek]: { ...prev[dayOfWeek], ...updates }
    }));
  };

  const copyToAllDays = (dayOfWeek: number) => {
    const sourceSchedule = daySchedules[dayOfWeek];
    const newSchedules = { ...daySchedules };
    
    DAYS_OF_WEEK.forEach(day => {
      newSchedules[day.id] = { ...sourceSchedule };
    });
    
    setDaySchedules(newSchedules);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-green-400 flex items-center gap-2">
          <Calendar className="h-6 w-6" />
          Availability Schedule
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {DAYS_OF_WEEK.map((day) => {
          const schedule = daySchedules[day.id];
          
          return (
            <Card key={day.id} className="bg-black border-green-500/30">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {day.name}
                  </span>
                  <Switch
                    checked={schedule.isAvailable}
                    onCheckedChange={(checked) => updateDaySchedule(day.id, { isAvailable: checked })}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {schedule.isAvailable && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-green-300">Start Time</Label>
                        <Input
                          type="time"
                          value={schedule.startTime}
                          onChange={(e) => updateDaySchedule(day.id, { startTime: e.target.value })}
                          className="bg-black border-green-500/30 text-green-400"
                        />
                      </div>
                      <div>
                        <Label className="text-green-300">End Time</Label>
                        <Input
                          type="time"
                          value={schedule.endTime}
                          onChange={(e) => updateDaySchedule(day.id, { endTime: e.target.value })}
                          className="bg-black border-green-500/30 text-green-400"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleScheduleUpdate(day.id)}
                        className="bg-green-500 hover:bg-green-600 text-black"
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToAllDays(day.id)}
                        className="border-green-500/30 text-green-400"
                      >
                        Copy to All
                      </Button>
                    </div>
                  </>
                )}
                {!schedule.isAvailable && (
                  <div className="text-center py-4">
                    <p className="text-green-300/60">Unavailable</p>
                    <Button
                      size="sm"
                      onClick={() => handleScheduleUpdate(day.id)}
                      className="bg-green-500 hover:bg-green-600 text-black mt-2"
                    >
                      Save
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-black border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => {
                const mondayToFriday = [1, 2, 3, 4, 5];
                const newSchedules = { ...daySchedules };
                mondayToFriday.forEach(dayId => {
                  newSchedules[dayId] = { isAvailable: true, startTime: "09:00", endTime: "17:00" };
                });
                setDaySchedules(newSchedules);
              }}
              variant="outline"
              className="border-green-500/30 text-green-400"
            >
              Set Weekdays (9-5)
            </Button>
            <Button
              onClick={() => {
                const weekend = [0, 6];
                const newSchedules = { ...daySchedules };
                weekend.forEach(dayId => {
                  newSchedules[dayId] = { isAvailable: true, startTime: "10:00", endTime: "16:00" };
                });
                setDaySchedules(newSchedules);
              }}
              variant="outline"
              className="border-green-500/30 text-green-400"
            >
              Set Weekends (10-4)
            </Button>
            <Button
              onClick={() => {
                const newSchedules = { ...daySchedules };
                DAYS_OF_WEEK.forEach(day => {
                  newSchedules[day.id] = { isAvailable: false, startTime: "09:00", endTime: "17:00" };
                });
                setDaySchedules(newSchedules);
              }}
              variant="outline"
              className="border-red-500/30 text-red-400"
            >
              Clear All
            </Button>
          </div>
          <p className="text-green-300/60 text-sm">
            Remember to save each day's schedule after making changes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
