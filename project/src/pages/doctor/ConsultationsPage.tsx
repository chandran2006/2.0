import React, { useState, useEffect } from 'react';
import { Video, Phone, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { appointmentAPI, callAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import DashboardLayout from '@/components/shared/DashboardLayout';

const ConsultationsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    appointmentAPI.getDoctorAppointments(parseInt(user.id))
      .then(res => setAppointments((res.data || []).filter((a: any) => a.status === 'APPROVED')))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const joinCall = async (apt: any) => {
    try {
      const channelName = `appt-${apt.id}`;
      const tokenRes = await callAPI.getAgoraToken(channelName, user!.id, 'doctor');
      navigate(`/video-call?room=${channelName}&appointmentId=${apt.id}&token=${tokenRes.data.token}`);
    } catch {
      toast.error('Failed to start call');
    }
  };

  const completeAppointment = async (id: number) => {
    try {
      await appointmentAPI.completeAppointment(id);
      toast.success('Appointment marked as completed');
      setAppointments(prev => prev.filter(a => a.id !== id));
    } catch { toast.error('Failed to complete appointment'); }
  };

  if (loading) return <DashboardLayout><div className="text-center py-8">Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-display text-2xl font-bold">Consultations</h1>
            <p className="text-muted-foreground mt-1">Approved appointments ready for consultation</p>
          </div>
          <Button className="bg-gradient-primary" onClick={() => navigate('/doctor/consultation-requests')}>
            View Requests
          </Button>
        </div>

        {appointments.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="p-8 text-center">
              <Video className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No approved consultations yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {appointments.map((apt) => (
              <Card key={apt.id} className="shadow-card hover:shadow-card-hover transition-shadow">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
                    <Video className="w-6 h-6 text-info" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{apt.patientName}</p>
                    <p className="text-sm text-muted-foreground">{apt.consultationType || 'VIDEO'} Consultation</p>
                    {apt.reason && <p className="text-xs text-muted-foreground">Reason: {apt.reason}</p>}
                    <p className="text-xs text-muted-foreground mt-1">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {new Date(apt.appointmentDate).toLocaleString()}
                    </p>
                  </div>
                  <Badge>APPROVED</Badge>
                  <Button size="sm" className="bg-gradient-primary" onClick={() => joinCall(apt)}>
                    <Video className="w-3 h-3 mr-1" /> Join Call
                  </Button>
                  <Button size="sm" variant="outline" className="text-success" onClick={() => completeAppointment(apt.id)}>
                    <CheckCircle className="w-3 h-3 mr-1" /> Done
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card className="shadow-card">
          <CardContent className="p-6">
            <h3 className="font-display text-lg font-bold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/doctor/consultation-requests')}>
                <Phone className="w-6 h-6" />
                <span className="text-sm">Incoming Requests</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/doctor/appointments')}>
                <Video className="w-6 h-6" />
                <span className="text-sm">All Appointments</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ConsultationsPage;
