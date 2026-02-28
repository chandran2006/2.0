import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Video, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { appointmentAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { BookAppointmentDialog } from '@/components/shared/BookAppointmentDialog';
import { VideoCall } from '@/components/shared/VideoCall';
import { toast } from 'sonner';

const AppointmentsPage: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [callOpen, setCallOpen] = useState(false);
  const [callRoomId, setCallRoomId] = useState('');

  useEffect(() => {
    loadAppointments();
  }, [user]);

  const loadAppointments = () => {
    if (user?.id) {
      appointmentAPI.getPatientAppointments(parseInt(user.id))
        .then(res => setAppointments(res.data || []))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  };

  const startCall = (apt: any) => {
    const roomId = `room_${user?.id}_${apt.doctorId}_${Date.now()}`;
    setCallRoomId(roomId);
    setCallOpen(true);
  };

  const cancelAppointment = async (id: number) => {
    try {
      await appointmentAPI.cancelAppointment(id);
      toast.success('Appointment cancelled');
      loadAppointments();
    } catch (error) {
      toast.error('Failed to cancel appointment');
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-display text-2xl font-bold">My Appointments</h1>
        <Button onClick={() => setBookingOpen(true)} className="bg-gradient-primary">Book New Appointment</Button>
      </div>

      <div className="space-y-3">
        {appointments.map((apt) => (
          <Card key={apt.id} className="shadow-card hover:shadow-card-hover transition-shadow">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-info" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{apt.doctorName}</p>
                <p className="text-sm text-muted-foreground">{apt.doctorSpecialization}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  <Clock className="w-3 h-3 inline mr-1" />
                  {new Date(apt.appointmentDate).toLocaleString()}
                </p>
              </div>
              <Badge variant={apt.status === 'APPROVED' ? 'default' : 'secondary'}>
                {apt.status}
              </Badge>
              {apt.status === 'APPROVED' && (
                <Button size="sm" onClick={() => startCall(apt)} variant="outline">
                  <Video className="w-4 h-4 mr-1" /> Join Call
                </Button>
              )}
              {apt.status === 'PENDING' && (
                <Button size="sm" onClick={() => cancelAppointment(apt.id)} variant="outline" className="text-destructive">
                  <X className="w-4 h-4 mr-1" /> Cancel
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
        {appointments.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No appointments found</p>
        )}
      </div>

      <BookAppointmentDialog open={bookingOpen} onOpenChange={setBookingOpen} onSuccess={loadAppointments} />
      {callOpen && <VideoCall open={callOpen} onClose={() => setCallOpen(false)} roomId={callRoomId} userId={user?.id || ''} />}
    </div>
  );
};

export default AppointmentsPage;
