import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, Video } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { appointmentAPI, callAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import DashboardLayout from '@/components/shared/DashboardLayout';

const AppointmentsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'COMPLETED'>('ALL');

  useEffect(() => {
    loadAppointments();
    const interval = setInterval(loadAppointments, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const loadAppointments = () => {
    if (!user?.id) return;
    appointmentAPI.getDoctorAppointments(parseInt(user.id))
      .then(res => setAppointments(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleApprove = async (id: number) => {
    try {
      await appointmentAPI.approveAppointment(id);
      toast.success('Appointment approved');
      loadAppointments();
    } catch { toast.error('Failed to approve'); }
  };

  const handleReject = async (id: number) => {
    if (!confirm('Reject this appointment?')) return;
    try {
      await appointmentAPI.rejectAppointment(id);
      toast.success('Appointment rejected');
      loadAppointments();
    } catch { toast.error('Failed to reject'); }
  };

  const handleComplete = async (id: number) => {
    try {
      await appointmentAPI.completeAppointment(id);
      toast.success('Appointment completed');
      loadAppointments();
    } catch { toast.error('Failed to complete'); }
  };

  const joinCall = async (apt: any) => {
    try {
      const channelName = `appt-${apt.id}`;
      const tokenRes = await callAPI.getAgoraToken(channelName, user!.id, 'doctor');
      navigate(`/video-call?room=${channelName}&appointmentId=${apt.id}&token=${tokenRes.data.token}`);
    } catch { toast.error('Failed to start call'); }
  };

  const filtered = filter === 'ALL' ? appointments : appointments.filter(a => a.status === filter);

  if (loading) return <DashboardLayout><div className="text-center py-8">Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-display text-2xl font-bold">Appointments</h1>
            <p className="text-muted-foreground mt-1">Manage your patient appointments</p>
          </div>
          <div className="flex gap-2 text-sm text-muted-foreground">
            <span className="px-2 py-1 bg-warning/10 rounded text-warning font-medium">
              {appointments.filter(a => a.status === 'PENDING').length} pending
            </span>
          </div>
        </div>

        <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
          {(['ALL', 'PENDING', 'APPROVED', 'COMPLETED'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${filter === f ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
              {f} <span className="ml-1 text-xs">({appointments.filter(a => f === 'ALL' ? true : a.status === f).length})</span>
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map((apt) => (
            <Card key={apt.id} className="shadow-card hover:shadow-card-hover transition-shadow">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                  {apt.patientName?.charAt(0) || 'P'}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{apt.patientName}</p>
                  <p className="text-sm text-muted-foreground">{apt.reason || 'General consultation'}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {new Date(apt.appointmentDate).toLocaleString()} · {apt.consultationType || 'VIDEO'}
                  </p>
                </div>
                <Badge variant={apt.status === 'APPROVED' ? 'default' : apt.status === 'PENDING' ? 'secondary' : 'outline'}>
                  {apt.status}
                </Badge>
                <div className="flex gap-2">
                  {apt.status === 'PENDING' && (
                    <>
                      <Button size="sm" onClick={() => handleApprove(apt.id)} className="bg-success text-white">
                        <CheckCircle className="w-3 h-3 mr-1" /> Approve
                      </Button>
                      <Button size="sm" onClick={() => handleReject(apt.id)} variant="outline" className="text-destructive">
                        <XCircle className="w-3 h-3 mr-1" /> Reject
                      </Button>
                    </>
                  )}
                  {apt.status === 'APPROVED' && (
                    <>
                      <Button size="sm" onClick={() => joinCall(apt)} className="bg-gradient-primary">
                        <Video className="w-3 h-3 mr-1" /> Join Call
                      </Button>
                      <Button size="sm" onClick={() => handleComplete(apt.id)} variant="outline" className="text-success">
                        <CheckCircle className="w-3 h-3 mr-1" /> Done
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No {filter !== 'ALL' ? filter.toLowerCase() : ''} appointments</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AppointmentsPage;
