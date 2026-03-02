import React, { useState, useEffect } from 'react';
import { Star, Calendar, Search, Video } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { appointmentAPI } from '@/services/api';
import { BookAppointmentDialog } from '@/components/shared/BookAppointmentDialog';
import { useAuth } from '@/contexts/AuthContext';
import { io, Socket } from 'socket.io-client';
import DashboardLayout from '@/components/shared/DashboardLayout';

const DoctorsPage: React.FC = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadDoctors();
    
    if (!user?.id) return;
    
    // Connect to call server for real-time doctor status
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5002';
    console.log('Patient connecting to call server:', SOCKET_URL);
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('✅ Patient connected to call server, socket ID:', newSocket.id);
      
      // Register patient as online
      newSocket.emit('patient_online', {
        patientId: user.id,
        name: user.name
      });
      console.log('✅ Patient registered:', user.id, user.name);
    });

    newSocket.on('connect_error', (error: any) => {
      console.error('❌ Socket connection error:', error);
      toast({
        title: 'Connection Error',
        description: 'Failed to connect to call server',
        variant: 'destructive',
      });
    });

    // Listen for doctor status changes
    newSocket.on('doctor_status_changed', (data: any) => {
      console.log('Doctor status changed:', data);
      setDoctors(prev => prev.map(doc => 
        doc.id === data.doctorId 
          ? { ...doc, isAvailable: data.isOnline }
          : doc
      ));
    });

    // Get initial online doctors list
    newSocket.on('online_doctors_list', (onlineDoctors: any[]) => {
      console.log('Online doctors:', onlineDoctors);
      const onlineDoctorIds = new Set(onlineDoctors.map(d => d.doctorId));
      setDoctors(prev => prev.map(doc => ({
        ...doc,
        isAvailable: onlineDoctorIds.has(doc.id)
      })));
    });

    // Request online doctors list
    newSocket.emit('get_online_doctors');

    return () => {
      console.log('🔌 Patient disconnecting from call server');
      newSocket.disconnect();
    };
  }, [user, toast]);

  useEffect(() => {
    if (searchQuery) {
      setFilteredDoctors(doctors.filter(doc => 
        doc.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialization?.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    } else {
      setFilteredDoctors(doctors);
    }
  }, [searchQuery, doctors]);

  const loadDoctors = () => {
    appointmentAPI.getDoctors()
      .then(res => {
        setDoctors(res.data || []);
        setFilteredDoctors(res.data || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleInstantConsultation = (doctor: any) => {
    if (!doctor.isAvailable) {
      toast({
        title: 'Doctor Offline',
        description: 'Doctor is currently offline. Please book an appointment instead.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!socket || !socket.connected) {
      console.error('❌ Socket not connected');
      toast({
        title: 'Connection Error',
        description: 'Not connected to call server. Please refresh the page.',
        variant: 'destructive',
      });
      return;
    }
    
    const roomId = `call_${user?.id}_${doctor.id}_${Date.now()}`;
    console.log('📞 Sending consultation request:', { 
      roomId, 
      doctorId: doctor.id, 
      patientId: user?.id,
      socketConnected: socket.connected 
    });
    
    socket.emit('consultation_request', {
      consultationId: roomId,
      doctorId: doctor.id,
      patientId: user?.id,
      patientName: user?.name,
      reason: 'Instant consultation request'
    });
    
    console.log('✅ Consultation request sent to doctor:', doctor.id);
    
    toast({
      title: 'Request Sent',
      description: 'Waiting for doctor to accept...',
    });
    
    // Listen for acceptance
    socket.once('consultation_accepted', (data: any) => {
      console.log('✅ Consultation accepted:', data);
      if (data.consultationId === roomId) {
        toast({
          title: 'Call Accepted',
          description: 'Connecting to doctor...',
        });
        setTimeout(() => {
          window.location.href = `/call?room=${roomId}`;
        }, 1000);
      }
    });
    
    socket.once('consultation_rejected', (data: any) => {
      console.log('❌ Consultation rejected:', data);
      if (data.consultationId === roomId) {
        toast({
          title: 'Request Rejected',
          description: data.reason || 'Doctor is busy',
          variant: 'destructive',
        });
      }
    });
    
    // Timeout after 30 seconds
    setTimeout(() => {
      toast({
        title: 'Request Timeout',
        description: 'Doctor did not respond. Please try again.',
        variant: 'destructive',
      });
    }, 30000);
  };

  if (loading) return <DashboardLayout><div className="text-center py-8">Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Find Doctors</h1>
        <p className="text-muted-foreground mt-1">Book appointments with qualified specialists</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search by name or specialization..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filteredDoctors.map((doc) => (
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
                  <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                    doc.isAvailable ? 'text-success' : 'text-muted-foreground'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      doc.isAvailable ? 'bg-success animate-pulse' : 'bg-muted-foreground'
                    }`} />
                    {doc.isAvailable ? 'Online Now' : 'Offline'}
                  </span>
                </div>
              </div>
              <div className="text-right space-y-2">
                <p className="text-sm font-semibold">₹500</p>
                {doc.isAvailable && (
                  <Button 
                    size="sm" 
                    onClick={() => handleInstantConsultation(doc)}
                    className="bg-success hover:bg-success/90 text-white h-8 text-xs w-full"
                  >
                    <Video className="w-3 h-3 mr-1" /> Call Now
                  </Button>
                )}
                <Button 
                  size="sm" 
                  onClick={() => setBookingOpen(true)} 
                  className="bg-gradient-primary text-primary-foreground h-8 text-xs w-full"
                >
                  <Calendar className="w-3 h-3 mr-1" /> Book
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredDoctors.length === 0 && (
          <p className="col-span-2 text-center text-muted-foreground py-8">No doctors found</p>
        )}
      </div>

      <BookAppointmentDialog open={bookingOpen} onOpenChange={setBookingOpen} onSuccess={loadDoctors} />
    </div>
    </DashboardLayout>
  );
};

export default DoctorsPage;
