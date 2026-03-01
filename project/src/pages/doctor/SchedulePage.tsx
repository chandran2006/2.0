import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Plus, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { callAPI } from '@/services/api';
import DashboardLayout from '@/components/shared/DashboardLayout';
import io from 'socket.io-client';

const CALL_SERVER_URL = 'http://localhost:5002';

const SchedulePage: React.FC = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    const newSocket = io(CALL_SERVER_URL);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleAvailabilityToggle = async (checked: boolean) => {
    try {
      if (!user?.id) {
        toast({
          title: 'Error',
          description: 'User not found',
          variant: 'destructive',
        });
        return;
      }

      // Update backend
      if (checked) {
        await callAPI.doctorOnline(user.id);
      } else {
        await callAPI.doctorOffline(user.id);
      }

      // Update socket
      if (socket) {
        if (checked) {
          socket.emit('doctor_online', {
            doctorId: user.id,
            name: user.name,
            specialization: user.specialization || 'General Physician',
          });
        } else {
          socket.emit('doctor_offline', {
            doctorId: user.id,
          });
        }
      }

      setIsAvailable(checked);
      toast({
        title: 'Success',
        description: `You are now ${checked ? 'online' : 'offline'}`,
      });
    } catch (error) {
      console.error('Failed to update status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  const schedule = [
    { day: 'Monday', slots: ['09:00 AM - 12:00 PM', '02:00 PM - 05:00 PM'], active: true },
    { day: 'Tuesday', slots: ['09:00 AM - 12:00 PM', '02:00 PM - 05:00 PM'], active: true },
    { day: 'Wednesday', slots: ['09:00 AM - 12:00 PM'], active: true },
    { day: 'Thursday', slots: ['09:00 AM - 12:00 PM', '02:00 PM - 05:00 PM'], active: true },
    { day: 'Friday', slots: ['09:00 AM - 12:00 PM', '02:00 PM - 05:00 PM'], active: true },
    { day: 'Saturday', slots: ['10:00 AM - 01:00 PM'], active: true },
    { day: 'Sunday', slots: [], active: false },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-display text-2xl font-bold">My Schedule</h1>
            <p className="text-muted-foreground mt-1">Manage your availability and working hours</p>
          </div>
          <Button className="bg-gradient-primary">
            <Plus className="w-4 h-4 mr-1" /> Add Time Slot
          </Button>
        </div>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Online Status</p>
                <p className="text-sm text-muted-foreground">Make yourself available for consultations</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={isAvailable ? 'default' : 'secondary'}>
                  {isAvailable ? 'Online' : 'Offline'}
                </Badge>
                <Switch checked={isAvailable} onCheckedChange={handleAvailabilityToggle} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {schedule.map((day) => (
            <Card key={day.day} className="shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{day.day}</p>
                    {day.slots.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {day.slots.map((slot, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {slot}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground mt-1">No slots available</p>
                    )}
                  </div>
                  <Badge variant={day.active ? 'default' : 'secondary'}>
                    {day.active ? 'Active' : 'Inactive'}
                  </Badge>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-destructive">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">Ramesh Kumar</p>
                  <p className="text-sm text-muted-foreground">Today, 10:00 AM</p>
                </div>
                <Badge>Confirmed</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">Sunita Devi</p>
                  <p className="text-sm text-muted-foreground">Today, 02:00 PM</p>
                </div>
                <Badge>Confirmed</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">Kiran Patel</p>
                  <p className="text-sm text-muted-foreground">Tomorrow, 11:00 AM</p>
                </div>
                <Badge variant="secondary">Pending</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SchedulePage;
