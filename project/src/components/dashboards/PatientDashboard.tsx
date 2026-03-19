import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Activity, Thermometer, Weight, Clock, Calendar, Pill, Video, MapPin, FileText, Stethoscope, ChevronRight, Star, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { appointmentAPI, prescriptionAPI, callAPI } from '@/services/api';
import { BookAppointmentDialog } from '@/components/shared/BookAppointmentDialog';
import { VideoCall } from '@/components/shared/VideoCall';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const healthMetrics = [
  { label: 'Heart Rate', value: '72', unit: 'bpm', icon: Heart, trend: 'stable' as const, color: 'text-destructive' },
  { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', icon: Activity, trend: 'stable' as const, color: 'text-info' },
  { label: 'Temperature', value: '98.6', unit: '°F', icon: Thermometer, trend: 'stable' as const, color: 'text-warning' },
  { label: 'Weight', value: '70', unit: 'kg', icon: Weight, trend: 'down' as const, color: 'text-success' },
];

const quickActions = [
  { label: 'Book Appointment', icon: Calendar, color: 'bg-primary' },
  { label: 'Video Consultation', icon: Video, color: 'bg-info' },
  { label: 'My Prescriptions', icon: FileText, color: 'bg-success' },
  { label: 'Find Pharmacy', icon: MapPin, color: 'bg-accent' },
];

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'prescriptions' | 'doctors'>('overview');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [onlineDoctors, setOnlineDoctors] = useState<any[]>([]);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [callOpen, setCallOpen] = useState(false);
  const [callRoomId, setCallRoomId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, [user]);

  const loadData = async () => {
    if (!user?.id) return;
    try {
      const [aptsRes, rxRes, docsRes, availRes] = await Promise.all([
        appointmentAPI.getPatientAppointments(parseInt(user.id)),
        prescriptionAPI.getPatientPrescriptions(parseInt(user.id)),
        appointmentAPI.getDoctors(),
        callAPI.getAvailableDoctors()
      ]);
      setAppointments(aptsRes.data || []);
      setPrescriptions(rxRes.data || []);
      setDoctors(docsRes.data || []);
      
      // Handle available doctors response
      const availDoctors = availRes.data?.doctors || availRes.data || [];
      setOnlineDoctors(Array.isArray(availDoctors) ? availDoctors : []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorOnline = (data: any) => {
    setOnlineDoctors(prev => [...prev.filter(d => d.id !== data.doctorId), data]);
  };

  const handleDoctorOffline = (data: any) => {
    setOnlineDoctors(prev => prev.filter(d => d.id !== data.doctorId));
  };

  const startConsultation = async (doctorId: string) => {
    try {
      const response = await callAPI.initiate({
        initiatorId: user?.id,
        receiverId: doctorId,
        callType: 'VIDEO'
      });
      const callData = response.data;
      const channelName = callData.channelName || `call-${callData.call.id}`;
      const token = callData.initiatorToken || '';
      toast.success('Call invitation sent to doctor');
      navigate(`/video-call?room=${channelName}&appointmentId=${callData.call.id}&token=${token}`);
    } catch (error) {
      console.error('Failed to start consultation:', error);
      toast.error('Failed to start consultation');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">Good Morning, {user?.name?.split(' ')[0] || 'Patient'} 👋</h1>
          <p className="text-muted-foreground mt-1">Here's your health overview for today</p>
        </div>
        <Badge variant="outline" className="gap-2">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          Auto-refresh: 3s
        </Badge>
      </div>

      {/* Health Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {healthMetrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="shadow-card hover:shadow-card-hover transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <metric.icon className={`w-5 h-5 ${metric.color}`} />
                  <span className="text-xs text-muted-foreground capitalize">{metric.trend}</span>
                </div>
                <p className="font-display text-2xl font-bold">{metric.value}</p>
                <p className="text-xs text-muted-foreground">{metric.label} · {metric.unit}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button onClick={() => setBookingOpen(true)} className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border shadow-card hover:shadow-card-hover transition-all group">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Calendar className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Appointments</span>
        </button>
        <button onClick={() => navigate('/patient/prescriptions')} className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border shadow-card hover:shadow-card-hover transition-all group">
          <div className="w-10 h-10 rounded-lg bg-success flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Prescriptions</span>
        </button>
        <button onClick={() => navigate('/patient/medicines')} className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border shadow-card hover:shadow-card-hover transition-all group">
          <div className="w-10 h-10 rounded-lg bg-info flex items-center justify-center">
            <Pill className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Medicines</span>
        </button>
        <button onClick={() => navigate('/patient/health-records')} className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border shadow-card hover:shadow-card-hover transition-all group">
          <div className="w-10 h-10 rounded-lg bg-warning flex items-center justify-center">
            <Heart className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Health Records</span>
        </button>
        <button onClick={() => navigate('/patient/pharmacy')} className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border shadow-card hover:shadow-card-hover transition-all group">
          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Pharmacy Finder</span>
        </button>
        <button onClick={() => navigate('/patient/symptom-checker')} className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border shadow-card hover:shadow-card-hover transition-all group">
          <div className="w-10 h-10 rounded-lg bg-destructive flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Symptom Checker</span>
        </button>
        <button onClick={() => navigate('/patient/doctors')} className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border shadow-card hover:shadow-card-hover transition-all group">
          <div className="w-10 h-10 rounded-lg bg-info flex items-center justify-center">
            <Video className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Video Consultation</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
        {(['overview', 'appointments', 'prescriptions', 'doctors'] as const).map((tab) => (
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

      {/* Tab content */}
      {activeTab === 'overview' && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Upcoming Appointments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <p className="text-sm text-muted-foreground text-center py-4">Loading...</p>
              ) : appointments.filter(a => a.status === 'APPROVED').slice(0, 3).length > 0 ? (
                appointments.filter(a => a.status === 'APPROVED').slice(0, 3).map((apt) => (
                  <div key={apt.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-info/10 text-info">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{apt.doctorName}</p>
                      <p className="text-xs text-muted-foreground">{new Date(apt.appointmentDate).toLocaleString()}</p>
                    </div>
                    <Button size="sm" onClick={() => startConsultation(apt.doctorId)} className="h-8 bg-gradient-primary">
                      <Video className="w-3 h-3 mr-1" /> Join
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No upcoming appointments</p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Video className="w-5 h-5 text-primary" />
                Available Doctors ({onlineDoctors.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.isArray(onlineDoctors) && onlineDoctors.slice(0, 3).map((doc) => (
                <div key={doc.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-10 h-10 rounded-full bg-info flex items-center justify-center text-info-foreground font-bold text-sm">
                    {doc.name?.charAt(0) || 'D'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{doc.specialization}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse-soft" />
                    <span className="text-xs text-success">Online</span>
                  </div>
                  <Button size="sm" onClick={() => startConsultation(doc.id)} variant="outline" className="h-8">
                    <Phone className="w-3 h-3 mr-1" /> Call
                  </Button>
                </div>
              ))}
              {onlineDoctors.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No doctors online</p>
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
              <Card key={apt.id} className="shadow-card hover:shadow-card-hover transition-shadow cursor-pointer" onClick={() => navigate('/patient/appointments')}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-info" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{apt.doctorName}</p>
                    <p className="text-sm text-muted-foreground">{apt.doctorSpecialization} · {new Date(apt.appointmentDate).toLocaleDateString()}</p>
                  </div>
                  <Badge variant={apt.status === 'APPROVED' ? 'default' : 'secondary'}>
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
              <Card key={rx.id} className="shadow-card hover:shadow-card-hover transition-shadow cursor-pointer" onClick={() => navigate('/patient/prescriptions')}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                    <Pill className="w-6 h-6 text-success" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{rx.medicineName}</p>
                    <p className="text-sm text-muted-foreground">{rx.dosage} · {rx.duration}</p>
                    <p className="text-xs text-muted-foreground mt-1">By {rx.doctorName}</p>
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
        </div>
      )}

      {activeTab === 'doctors' && (
        <div className="grid md:grid-cols-2 gap-4">
          {loading ? (
            <p className="col-span-2 text-center py-8">Loading...</p>
          ) : doctors.length > 0 ? (
            doctors.map((doc) => (
              <Card key={doc.id} className="shadow-card hover:shadow-card-hover transition-shadow">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-info flex items-center justify-center text-info-foreground font-bold text-lg">
                    {doc.name?.split(' ').pop()?.charAt(0) || 'D'}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-muted-foreground">{doc.specialization}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-warning fill-warning" />
                        <span className="text-xs font-medium">4.8</span>
                      </div>
                      <span className={`inline-flex items-center gap-1 text-xs ${doc.isAvailable ? 'text-success' : 'text-muted-foreground'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${doc.isAvailable ? 'bg-success animate-pulse-soft' : 'bg-muted-foreground'}`} />
                        {doc.isAvailable ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">₹500</p>
                    <Button size="sm" onClick={() => setBookingOpen(true)} className="mt-2 bg-gradient-primary text-primary-foreground shadow-primary hover:opacity-90 h-8 text-xs">
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="col-span-2 text-center text-muted-foreground py-8">No doctors found</p>
          )}
        </div>
      )}

      <BookAppointmentDialog open={bookingOpen} onOpenChange={setBookingOpen} onSuccess={loadData} />
      {callOpen && <VideoCall open={callOpen} onClose={() => setCallOpen(false)} roomId={callRoomId} userId={user?.id || ''} />}
    </div>
  );
};

export default PatientDashboard;
