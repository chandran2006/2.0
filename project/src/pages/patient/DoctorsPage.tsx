import React, { useState, useEffect } from 'react';
import { Star, Calendar, Search, Video, Clock, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { appointmentAPI, callAPI } from '@/services/api';
import { BookAppointmentDialog } from '@/components/shared/BookAppointmentDialog';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/shared/DashboardLayout';
import { useNavigate } from 'react-router-dom';

const DoctorsPage: React.FC = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [waitingForDoctor, setWaitingForDoctor] = useState(false);
  const [currentCallId, setCurrentCallId] = useState<number | null>(null);
  const [currentCallToken, setCurrentCallToken] = useState<string>('');
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadDoctors();
    const onFocus = () => loadDoctors();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  useEffect(() => {
    let interval: any;
    if (waitingForDoctor && currentCallId) {
      interval = setInterval(async () => {
        try {
          const response = await callAPI.getCallStatus(currentCallId);
          const call = response.data;
          
          if (call.status === 'ACCEPTED') {
            clearInterval(interval);
            setWaitingForDoctor(false);
            const channelName = `call-${call.id}`;
            navigate(`/video-call?room=${channelName}&appointmentId=${call.id}&token=${currentCallToken}`);
          } else if (call.status === 'REJECTED') {
            clearInterval(interval);
            setWaitingForDoctor(false);
            setCurrentCallId(null);
            toast({
              title: 'Call Rejected',
              description: 'Doctor is not available right now',
              variant: 'destructive',
            });
          }
        } catch (error) {
          console.error('Error checking call status:', error);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [waitingForDoctor, currentCallId, currentCallToken, user, navigate, toast]);

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

  const handleInstantConsultation = async (doctor: any) => {
    try {
      const response = await callAPI.initiate({
        initiatorId: user?.id,
        receiverId: doctor.id,
        callType: 'VIDEO'
      });
      
      const callData = response.data;
      setCurrentCallId(callData.call.id);
      setCurrentCallToken(callData.initiatorToken || '');
      setWaitingForDoctor(true);
      
      toast({
        title: 'Call Request Sent',
        description: 'Waiting for doctor to accept...',
      });
    } catch (error) {
      console.error('Failed to initiate call:', error);
      toast({
        title: 'Call Failed',
        description: 'Unable to start call. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const cancelCallRequest = async () => {
    if (currentCallId) {
      try {
        await callAPI.rejectCall(currentCallId);
        setWaitingForDoctor(false);
        setCurrentCallId(null);
        toast({
          title: 'Call Cancelled',
          description: 'Call request has been cancelled',
        });
      } catch (error) {
        console.error('Failed to cancel call:', error);
      }
    }
  };

  if (loading) return <DashboardLayout><div className="text-center py-8">Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      {waitingForDoctor && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
          <Card className="max-w-md mx-4">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Waiting for Doctor</h3>
              <p className="text-muted-foreground mb-6">Your call request has been sent. Please wait for the doctor to accept.</p>
              <Button onClick={cancelCallRequest} variant="outline" className="text-destructive">
                <X className="w-4 h-4 mr-2" /> Cancel Request
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
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
                  onClick={() => { setSelectedDoctorId(doc.id.toString()); setBookingOpen(true); }} 
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

      <BookAppointmentDialog open={bookingOpen} onOpenChange={setBookingOpen} onSuccess={loadDoctors} preselectedDoctorId={selectedDoctorId} />
    </div>
    </DashboardLayout>
  );
};

export default DoctorsPage;
