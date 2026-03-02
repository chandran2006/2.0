import React, { useState, useEffect } from 'react';
import { Video, Phone, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/shared/DashboardLayout';
import io from 'socket.io-client';

const CALL_SERVER_URL = 'http://localhost:5002';

const DoctorConsultationPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [socket, setSocket] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.id) return;

    console.log('👨‍⚕️ Doctor connecting to call server...');
    const newSocket = io(CALL_SERVER_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('✅ Doctor connected to call server, socket ID:', newSocket.id);
      
      // Register as online doctor
      console.log('📡 Registering doctor online:', user.id, user.name);
      newSocket.emit('doctor_online', {
        doctorId: user.id,
        name: user.name,
        specialization: user.specialization || 'General Physician'
      });
    });

    newSocket.on('connect_error', (error: any) => {
      console.error('❌ Socket connection error:', error);
      toast({
        title: 'Connection Error',
        description: 'Failed to connect to call server',
        variant: 'destructive',
      });
    });

    // Listen for consultation requests
    newSocket.on('consultation_request', (data: any) => {
      console.log('✅ Consultation request received:', data);
      setRequests(prev => [...prev, data]);
      
      // Play notification sound
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGS57OihUBELTKXh8bllHAU2jdXzzn0vBSh+zPLaizsKGGO56+mjUhELTKXh8bllHAU2jdXzzn0vBSh+zPLaizsKGGO56+mjUhELTKXh8bllHAU2jdXzzn0vBQ==');
      audio.play().catch(e => console.log('Audio play failed:', e));
      
      toast({
        title: '🔔 New Consultation Request',
        description: `${data.patientName} wants to consult`,
      });
    });

    newSocket.on('consultation_error', (data: any) => {
      console.error('❌ Consultation error:', data);
      toast({
        title: 'Error',
        description: data.message,
        variant: 'destructive',
      });
    });

    return () => {
      console.log('🔌 Doctor disconnecting...');
      newSocket.emit('doctor_offline', { doctorId: user.id });
      newSocket.disconnect();
    };
  }, [user, toast]);

  const acceptRequest = (request: any) => {
    if (!socket || !socket.connected) {
      toast({
        title: 'Connection Error',
        description: 'Not connected to call server',
        variant: 'destructive',
      });
      return;
    }
    
    const roomId = request.consultationId;
    
    console.log('✅ Accepting consultation:', roomId);
    socket.emit('consultation_accepted', {
      consultationId: request.consultationId,
      patientId: request.patientId,
      doctorId: user?.id,
      doctorName: user?.name
    });
    
    // Remove from list
    setRequests(prev => prev.filter(r => r.consultationId !== request.consultationId));
    
    toast({
      title: 'Call Accepted',
      description: 'Connecting to patient...',
    });
    
    // Navigate to call page
    setTimeout(() => {
      window.location.href = `/call?room=${roomId}`;
    }, 1000);
  };

  const rejectRequest = (request: any) => {
    if (!socket || !socket.connected) {
      toast({
        title: 'Connection Error',
        description: 'Not connected to call server',
        variant: 'destructive',
      });
      return;
    }
    
    console.log('❌ Rejecting consultation:', request.consultationId);
    socket.emit('consultation_rejected', {
      consultationId: request.consultationId,
      reason: 'Doctor is busy'
    });
    
    setRequests(prev => prev.filter(r => r.consultationId !== request.consultationId));
    
    toast({
      title: 'Request Rejected',
      description: 'Patient has been notified',
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Consultation Requests</h1>
          <p className="text-muted-foreground mt-1">Accept or reject incoming consultation requests</p>
        </div>

        {requests.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="p-8 text-center">
              <Video className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No pending consultation requests</p>
              <p className="text-sm text-muted-foreground mt-2">
                Make sure you're online in the Schedule page
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.consultationId} className="shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Phone className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-lg">{request.patientName}</p>
                        <p className="text-sm text-muted-foreground">{request.reason}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(request.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => rejectRequest(request)}
                        variant="outline"
                        className="text-destructive"
                      >
                        <X className="w-4 h-4 mr-1" /> Reject
                      </Button>
                      <Button
                        onClick={() => acceptRequest(request)}
                        className="bg-success hover:bg-success/90 text-white"
                      >
                        <Video className="w-4 h-4 mr-1" /> Accept Call
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DoctorConsultationPage;
