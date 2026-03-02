import React, { useState, useEffect } from 'react';
import { Video, Phone, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { callAPI } from '@/services/api';
import DashboardLayout from '@/components/shared/DashboardLayout';
import { useNavigate } from 'react-router-dom';

const DoctorConsultationPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    loadIncomingCalls();
    const interval = setInterval(loadIncomingCalls, 3000);
    return () => clearInterval(interval);
  }, [user]);

  const loadIncomingCalls = async () => {
    if (!user?.id) return;
    try {
      const response = await callAPI.getIncomingCalls(parseInt(user.id));
      setRequests(response.data || []);
    } catch (error) {
      console.error('Failed to load calls:', error);
    } finally {
      setLoading(false);
    }
  };

  const acceptRequest = async (request: any) => {
    try {
      const response = await callAPI.acceptCall(request.id);
      const channelName = `call-${request.id}`;
      
      // Get token for doctor
      const tokenResponse = await callAPI.getAgoraToken(channelName, user!.id, 'doctor');
      
      toast({
        title: 'Call Accepted',
        description: 'Connecting to patient...',
      });
      
      navigate(`/video-call?room=${channelName}&appointmentId=${request.id}&token=${tokenResponse.data.token}`);
    } catch (error) {
      console.error('Failed to accept call:', error);
      toast({
        title: 'Error',
        description: 'Failed to accept call',
        variant: 'destructive',
      });
    }
  };

  const rejectRequest = async (request: any) => {
    try {
      await callAPI.rejectCall(request.id);
      setRequests(prev => prev.filter(r => r.id !== request.id));
      
      toast({
        title: 'Request Rejected',
        description: 'Patient has been notified',
      });
    } catch (error) {
      console.error('Failed to reject call:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject call',
        variant: 'destructive',
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Consultation Requests</h1>
          <p className="text-muted-foreground mt-1">Accept or reject incoming consultation requests</p>
        </div>

        {loading ? (
          <Card className="shadow-card">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Loading...</p>
            </CardContent>
          </Card>
        ) : requests.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="p-8 text-center">
              <Video className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No pending consultation requests</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id} className="shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Phone className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-lg">Patient Call Request</p>
                        <p className="text-sm text-muted-foreground">{request.callType} Call</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(request.createdAt).toLocaleString()}
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
