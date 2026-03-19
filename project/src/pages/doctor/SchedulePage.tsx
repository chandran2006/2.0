import React, { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { callAPI, appointmentAPI, authAPI } from '@/services/api';
import { toast } from 'sonner';
import DashboardLayout from '@/components/shared/DashboardLayout';

const SchedulePage: React.FC = () => {
  const { user } = useAuth();
  const [isAvailable, setIsAvailable] = useState(false);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    authAPI.getCurrentUser(parseInt(user.id))
      .then(res => setIsAvailable(res.data.isAvailable === true))
      .catch(console.error);
    appointmentAPI.getDoctorAppointments(parseInt(user.id))
      .then(res => setAppointments(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const handleToggle = async (checked: boolean) => {
    try {
      if (checked) await callAPI.doctorOnline(user!.id);
      else await callAPI.doctorOffline(user!.id);
      setIsAvailable(checked);
      toast.success(`You are now ${checked ? 'online' : 'offline'}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const upcoming = appointments
    .filter(a => a.status === 'APPROVED' || a.status === 'PENDING')
    .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())
    .slice(0, 5);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold">My Schedule</h1>
          <p className="text-muted-foreground mt-1">Manage your availability and appointments</p>
        </div>

        {/* Online Status Toggle */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Online Status</p>
                <p className="text-sm text-muted-foreground">Make yourself available for instant consultations</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={isAvailable ? 'default' : 'secondary'}>
                  {isAvailable ? '🟢 Online' : '⚫ Offline'}
                </Badge>
                <Switch checked={isAvailable} onCheckedChange={handleToggle} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="shadow-card"><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{appointments.length}</p><p className="text-xs text-muted-foreground">Total</p></CardContent></Card>
          <Card className="shadow-card"><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{appointments.filter(a => a.status === 'PENDING').length}</p><p className="text-xs text-muted-foreground">Pending</p></CardContent></Card>
          <Card className="shadow-card"><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{appointments.filter(a => a.status === 'APPROVED').length}</p><p className="text-xs text-muted-foreground">Approved</p></CardContent></Card>
        </div>

        {/* Upcoming Appointments */}
        <Card className="shadow-card">
          <CardHeader><CardTitle>Upcoming Appointments</CardTitle></CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-muted-foreground py-4">Loading...</p>
            ) : upcoming.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No upcoming appointments</p>
            ) : (
              <div className="space-y-3">
                {upcoming.map(apt => (
                  <div key={apt.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                        {apt.patientName?.charAt(0) || 'P'}
                      </div>
                      <div>
                        <p className="font-medium">{apt.patientName}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(apt.appointmentDate).toLocaleString()}
                        </p>
                        {apt.reason && <p className="text-xs text-muted-foreground">{apt.reason}</p>}
                      </div>
                    </div>
                    <Badge variant={apt.status === 'APPROVED' ? 'default' : 'secondary'}>{apt.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weekly Schedule */}
        <Card className="shadow-card">
          <CardHeader><CardTitle>Weekly Overview</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(day => {
                const dayApts = appointments.filter(a => {
                  const d = new Date(a.appointmentDate);
                  return d.toLocaleDateString('en-US', { weekday: 'long' }) === day;
                });
                return (
                  <div key={day} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                    <div className="w-24 text-sm font-medium">{day}</div>
                    <div className="flex-1">
                      {dayApts.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {dayApts.map(a => (
                            <Badge key={a.id} variant="outline" className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              {new Date(a.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">No appointments</span>
                      )}
                    </div>
                    <Badge variant={dayApts.length > 0 ? 'default' : 'secondary'} className="text-xs">
                      {dayApts.length} appts
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SchedulePage;
