import React, { useState, useEffect } from 'react';
import { Video, Phone, X, User, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  const [lastPoll, setLastPoll] = useState<Date>(new Date());

  useEffect(() => {
    if (!user?.id) return;
    loadIncomingCalls();
    const interval = setInterval(() => {
      loadIncomingCalls();
      setLastPoll(new Date());
    }, 3000);
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
      await callAPI.acceptCall(request.id);
      const channelName = `call-${request.id}`;
      const tokenResponse = await callAPI.getAgoraToken(channelName, user!.id, 'doctor');
      toast({ title: 'Call Accepted', description: 'Connecting to patient...' });
      navigate(`/video-call?room=${channelName}&appointmentId=${request.id}&token=${tokenResponse.data.token}`);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to accept call', variant: 'destructive' });
    }
  };

  const rejectRequest = async (request: any) => {
    try {
      await callAPI.rejectCall(request.id);
      setRequests(prev => prev.filter(r => r.id !== request.id));
      toast({ title: 'Request Rejected', description: 'Patient has been notified' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to reject call', variant: 'destructive' });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-display text-2xl font-bold">Consultation Requests</h1>
            <p className="text-muted-foreground mt-1">Accept or reject incoming consultation requests</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            Live · {lastPoll.toLocaleTimeString()}
          </div>
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
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="font-medium mb-1">No pending requests</p>
              <p className="text-sm text-muted-foreground">Checking every 3 seconds for new calls...</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id} className="shadow-card border-2 border-primary/20 animate-pulse-soft">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                        {request.patientName?.charAt(0) || 'P'}
                      </div>
                      <div>
                        <p className="font-semibold text-lg">{request.patientName || `Patient #${request.initiatorId}`}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <Badge variant="secondary">{request.callType || 'VIDEO'} Call</Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {request.createdAt ? new Date(request.createdAt).toLocaleTimeString() : 'Just now'}
                          </span>
                        </div>
                        {request.patientEmail && (
                          <p className="text-xs text-muted-foreground mt-1">{request.patientEmail}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={() => rejectRequest(request)} variant="outline" className="text-destructive border-destructive hover:bg-destructive hover:text-white">
                        <X className="w-4 h-4 mr-1" /> Reject
                      </Button>
                      <Button onClick={() => acceptRequest(request)} className="bg-success hover:bg-success/90 text-white">
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
