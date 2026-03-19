import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Video, X, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { appointmentAPI, callAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { BookAppointmentDialog } from '@/components/shared/BookAppointmentDialog';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/shared/DashboardLayout';

const statusColor: Record<string, string> = {
  APPROVED: 'default', PENDING: 'secondary', COMPLETED: 'outline', REJECTED: 'destructive', CANCELLED: 'destructive'
};

const AppointmentsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'COMPLETED'>('ALL');

  useEffect(() => {
    loadAppointments();
    const interval = setInterval(loadAppointments, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const loadAppointments = () => {
    if (!user?.id) return;
    appointmentAPI.getPatientAppointments(parseInt(user.id))
      .then(res => setAppointments(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const joinCall = async (apt: any) => {
    try {
      const channelName = `appt-${apt.id}`;
      const tokenRes = await callAPI.getAgoraToken(channelName, user!.id, 'patient');
      navigate(`/video-call?room=${channelName}&appointmentId=${apt.id}&token=${tokenRes.data.token}`);
    } catch {
      toast.error('Failed to start call. Please try again.');
    }
  };

  const cancelAppointment = async (id: number) => {
    if (!confirm('Cancel this appointment?')) return;
    try {
      await appointmentAPI.cancelAppointment(id);
      toast.success('Appointment cancelled');
      loadAppointments();
    } catch { toast.error('Failed to cancel appointment'); }
  };

  const filtered = filter === 'ALL' ? appointments : appointments.filter(a => a.status === filter);

  if (loading) return <DashboardLayout><div className="text-center py-8">Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="font-display text-2xl font-bold">My Appointments</h1>
          <Button onClick={() => setBookingOpen(true)} className="bg-gradient-primary">Book New</Button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
          {(['ALL', 'PENDING', 'APPROVED', 'COMPLETED'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${filter === f ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
              {f} {f !== 'ALL' && <span className="ml-1 text-xs">({appointments.filter(a => a.status === f).length})</span>}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map((apt) => (
            <Card key={apt.id} className="shadow-card hover:shadow-card-hover transition-shadow">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-info" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{apt.doctorName}</p>
                  <p className="text-sm text-muted-foreground">{apt.doctorSpecialization}</p>
                  {apt.reason && <p className="text-sm text-muted-foreground">Reason: {apt.reason}</p>}
                  <p className="text-xs text-muted-foreground mt-1">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {new Date(apt.appointmentDate).toLocaleString()}
                  </p>
                </div>
                <Badge variant={statusColor[apt.status] as any}>{apt.status}</Badge>
                <div className="flex gap-2">
                  {apt.status === 'APPROVED' && (
                    <Button size="sm" onClick={() => joinCall(apt)} className="bg-gradient-primary">
                      <Video className="w-3 h-3 mr-1" /> Join Call
                    </Button>
                  )}
                  {apt.status === 'PENDING' && (
                    <Button size="sm" onClick={() => cancelAppointment(apt.id)} variant="outline" className="text-destructive">
                      <X className="w-3 h-3 mr-1" /> Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No {filter !== 'ALL' ? filter.toLowerCase() : ''} appointments found</p>
          )}
        </div>

        <BookAppointmentDialog open={bookingOpen} onOpenChange={setBookingOpen} onSuccess={loadAppointments} />
      </div>
    </DashboardLayout>
  );
};

export default AppointmentsPage;
