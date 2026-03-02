import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, AlertCircle, DollarSign, Calendar, Stethoscope, Video, Clock, Check, X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { appointmentAPI, prescriptionAPI, callAPI } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import socketService from '@/services/socket';

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'prescriptions'>('overview');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [stats, setStats] = useState({ consultations: 0, prescriptions: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const [incomingCall, setIncomingCall] = useState<any>(null);

  useEffect(() => {
    loadData();
    loadOnlineStatus();
    socketService.connect();
    socketService.on('consultation_request', handleConsultationRequest);
    
    const interval = setInterval(loadData, 3000);
    
    return () => {
      socketService.off('consultation_request', handleConsultationRequest);
      clearInterval(interval);
    };
  }, [user]);

  const loadOnlineStatus = async () => {
    if (!user?.id) return;
    try {
      const response = await fetch(`http://localhost:8080/api/auth/current-user/${user.id}`);
      const data = await response.json();
      const isOnline = data.isAvailable === true;
      setIsOnline(isOnline);
      console.log('Dashboard loaded doctor status:', isOnline);
    } catch (error) {
      console.error('Failed to load online status:', error);
    }
  };

  const loadData = async () => {
    if (!user?.id) return;
    try {
      const [aptsRes, rxRes] = await Promise.all([
        appointmentAPI.getDoctorAppointments(parseInt(user.id)),
        prescriptionAPI.getDoctorPrescriptions(parseInt(user.id))
      ]);
      setAppointments(aptsRes.data || []);
      setPrescriptions(rxRes.data || []);
      setStats({
        consultations: aptsRes.data?.filter((a: any) => a.status === 'COMPLETED').length || 0,
        prescriptions: rxRes.data?.length || 0,
        revenue: aptsRes.data?.filter((a: any) => a.status === 'COMPLETED').length * 500 || 0
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleOnlineStatus = async (status: boolean) => {
    setIsOnline(status);
    try {
      if (status) {
        await callAPI.doctorOnline(parseInt(user?.id || '0'));
        socketService.emit('doctor_online', { doctorId: user?.id, name: user?.name, specialization: user?.specialization });
        toast.success('You are now online');
      } else {
        await callAPI.doctorOffline(parseInt(user?.id || '0'));
        socketService.emit('doctor_offline', { doctorId: user?.id });
        toast.info('You are now offline');
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleConsultationRequest = (data: any) => {
    console.log('Incoming consultation request:', data);
    setIncomingCall(data);
    toast.info(`Incoming call from ${data.patientName}`, {
      duration: 10000,
      action: {
        label: 'View',
        onClick: () => {}
      }
    });
  };
  
  const acceptCall = async () => {
    if (!incomingCall) return;
    
    try {
      // Update call status in backend
      await callAPI.acceptCall(incomingCall.callId);
      
      // Notify patient via socket
      socketService.emit('consultation_accepted', {
        callId: incomingCall.callId,
        patientId: incomingCall.patientId,
        doctorId: user?.id,
        doctorName: user?.name,
        roomId: incomingCall.roomId
      });
      
      toast.success('Call accepted! Joining video call...');
      
      // Navigate to video call
      navigate(`/video-call?room=${incomingCall.roomId}`);
      
      setIncomingCall(null);
    } catch (error) {
      console.error('Failed to accept call:', error);
      toast.error('Failed to accept call');
    }
  };
  
  const rejectCall = async () => {
    if (!incomingCall) return;
    
    try {
      // Update call status in backend
      await callAPI.rejectCall(incomingCall.callId);
      
      // Notify patient via socket
      socketService.emit('consultation_rejected', {
        callId: incomingCall.callId,
        patientId: incomingCall.patientId,
        reason: 'Doctor is busy'
      });
      
      toast.info('Call declined');
      setIncomingCall(null);
    } catch (error) {
      console.error('Failed to reject call:', error);
      toast.error('Failed to reject call');
    }
  };

  const handleAppointment = async (id: number, action: 'approve' | 'cancel') => {
    try {
      if (action === 'approve') {
        await appointmentAPI.approveAppointment(id);
        toast.success('Appointment approved');
      } else {
        await appointmentAPI.cancelAppointment(id);
        toast.success('Appointment cancelled');
      }
      loadData();
    } catch (error) {
      toast.error(`Failed to ${action} appointment`);
    }
  };

  const pendingAppointments = appointments.filter(a => a.status === 'PENDING');
  const todayStats = [
    { label: 'Consultations', value: stats.consultations.toString(), icon: Stethoscope, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Prescriptions', value: stats.prescriptions.toString(), icon: FileText, color: 'text-info', bg: 'bg-info/10' },
    { label: 'Emergencies', value: '0', icon: AlertCircle, color: 'text-destructive', bg: 'bg-destructive/10' },
    { label: 'Revenue', value: `₹${stats.revenue}`, icon: DollarSign, color: 'text-success', bg: 'bg-success/10' },
  ];

  return (
    <div className="space-y-6">
      {/* Incoming Call Notification */}
      {incomingCall && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 right-4 z-50 w-96 bg-card border-2 border-primary shadow-2xl rounded-xl p-4"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
              <Video className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-lg">Incoming Call</p>
              <p className="text-sm text-muted-foreground">{incomingCall.patientName}</p>
              <p className="text-xs text-muted-foreground">{incomingCall.reason}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={rejectCall}
              variant="outline"
              className="flex-1 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <X className="w-4 h-4 mr-2" />
              Decline
            </Button>
            <Button
              onClick={acceptCall}
              className="flex-1 bg-success text-success-foreground hover:bg-success/90"
            >
              <Check className="w-4 h-4 mr-2" />
              Accept
            </Button>
          </div>
        </motion.div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">{user?.name || 'Doctor'}</h1>
          <p className="text-muted-foreground mt-1">{user?.specialization || 'Specialist'}</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="gap-2">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            Auto-refresh: 3s
          </Badge>
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-card border border-border shadow-card">
            <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-success animate-pulse-soft' : 'bg-muted-foreground'}`} />
            <span className="text-sm font-medium">{isOnline ? 'Online' : 'Offline'}</span>
            <Switch checked={isOnline} onCheckedChange={toggleOnlineStatus} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {todayStats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="font-display text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
        {(['overview', 'appointments', 'prescriptions'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all capitalize ${
              activeTab === tab ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Pending Appointments
                {pendingAppointments.length > 0 && (
                  <Badge className="bg-destructive text-destructive-foreground ml-auto">{pendingAppointments.length}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <p className="text-sm text-muted-foreground text-center py-4">Loading...</p>
              ) : pendingAppointments.length > 0 ? (
                pendingAppointments.map((apt) => (
                  <div key={apt.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{apt.patientName}</p>
                      <p className="text-xs text-muted-foreground">{apt.symptoms}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {new Date(apt.appointmentDate).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleAppointment(apt.id, 'cancel')} className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10">
                        <X className="w-4 h-4" />
                      </Button>
                      <Button size="sm" onClick={() => handleAppointment(apt.id, 'approve')} className="h-8 w-8 p-0 bg-success text-success-foreground hover:bg-success/90">
                        <Check className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No pending appointments</p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Today's Patients
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {appointments.filter(a => new Date(a.appointmentDate).toDateString() === new Date().toDateString()).slice(0, 3).map((apt) => (
                <div key={apt.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {apt.patientName?.charAt(0) || 'P'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{apt.patientName}</p>
                    <p className="text-xs text-muted-foreground">{apt.symptoms}</p>
                  </div>
                  <Badge variant={apt.status === 'COMPLETED' ? 'default' : 'secondary'} className="text-xs">
                    {apt.status}
                  </Badge>
                </div>
              ))}
              {appointments.filter(a => new Date(a.appointmentDate).toDateString() === new Date().toDateString()).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No patients today</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'appointments' && (
        <div className="space-y-3">
          {loading ? (
            <p className="text-center py-8">Loading...</p>
          ) : appointments.length > 0 ? (
            appointments.map((apt) => (
              <Card key={apt.id} className="shadow-card hover:shadow-card-hover transition-shadow cursor-pointer" onClick={() => navigate('/doctor/patients')}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-info" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{apt.patientName}</p>
                    <p className="text-sm text-muted-foreground">{apt.symptoms}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(apt.appointmentDate).toLocaleString()} · {apt.consultationType}</p>
                  </div>
                  <Badge variant={apt.status === 'APPROVED' ? 'default' : apt.status === 'PENDING' ? 'secondary' : 'outline'}>
                    {apt.status}
                  </Badge>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">No appointments found</p>
          )}
        </div>
      )}

      {activeTab === 'prescriptions' && (
        <div className="space-y-3">
          {loading ? (
            <p className="text-center py-8">Loading...</p>
          ) : prescriptions.length > 0 ? (
            prescriptions.map((rx) => (
              <Card key={rx.id} className="shadow-card hover:shadow-card-hover transition-shadow cursor-pointer" onClick={() => navigate('/doctor/prescriptions')}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-success" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{rx.patientName}</p>
                    <p className="text-sm text-muted-foreground">{rx.medicineName} · {rx.dosage}</p>
                    <p className="text-xs text-muted-foreground mt-1">{rx.duration} · {rx.instructions}</p>
                  </div>
                  <Badge variant={rx.status === 'ACTIVE' ? 'default' : 'secondary'}>
                    {rx.status}
                  </Badge>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">No prescriptions found</p>
          )}
          <Button onClick={() => navigate('/doctor/prescriptions')} className="bg-gradient-primary text-primary-foreground shadow-primary hover:opacity-90">
            + Write New Prescription
          </Button>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
