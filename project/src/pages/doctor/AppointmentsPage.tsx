import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { appointmentAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import DashboardLayout from '@/components/shared/DashboardLayout';

const DoctorAppointmentsPage: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(() => {
      loadAppointments();
    }, 10000);
    
    return () => clearInterval(interval);
  }, [user]);

  const loadAppointments = () => {
    if (user?.id) {
      appointmentAPI.getDoctorAppointments(parseInt(user.id))
        .then(res => setAppointments(res.data || []))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await appointmentAPI.approveAppointment(id);
      toast.success('Appointment approved');
      loadAppointments();
    } catch (error) {
      toast.error('Failed to approve appointment');
    }
  };

  const handleReject = async (id: number) => {
    if (!confirm('Are you sure you want to reject this appointment?')) return;
    try {
      await appointmentAPI.rejectAppointment(id);
      toast.success('Appointment rejected');
      loadAppointments();
    } catch (error) {
      toast.error('Failed to reject appointment');
    }
  };

  if (loading) return <DashboardLayout><div className="text-center py-8">Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Appointments</h1>
          <p className="text-muted-foreground mt-1">Manage your patient appointments</p>
        </div>

        <div className="space-y-3">
          {appointments.map((apt) => (
            <Card key={apt.id} className="shadow-card hover:shadow-card-hover transition-shadow">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {apt.patientName?.charAt(0) || 'P'}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{apt.patientName}</p>
                  <p className="text-sm text-muted-foreground">{apt.reason || 'General consultation'}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {new Date(apt.appointmentDate).toLocaleString()}
                  </p>
                </div>
                <Badge variant={
                  apt.status === 'APPROVED' ? 'default' :
                  apt.status === 'PENDING' ? 'secondary' : 'outline'
                }>
                  {apt.status}
                </Badge>
                {apt.status === 'PENDING' && (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleApprove(apt.id)} className="bg-success">
                      <CheckCircle className="w-3 h-3 mr-1" /> Approve
                    </Button>
                    <Button size="sm" onClick={() => handleReject(apt.id)} variant="outline" className="text-destructive">
                      <XCircle className="w-3 h-3 mr-1" /> Reject
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          {appointments.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No appointments found</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorAppointmentsPage;
