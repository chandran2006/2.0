import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { VideoCall } from '@/components/VideoCall';

const VideoCallPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const roomId = searchParams.get('room');
  const appointmentId = searchParams.get('appointmentId');
  const token = searchParams.get('token');

  if (!roomId || !user) {
    navigate('/dashboard');
    return null;
  }

  const channelName = roomId;
  const userId = String(user.id);
  const userRole = user.role.toLowerCase() === 'doctor' ? 'doctor' : 'patient';

  return (
    <VideoCall
      channelName={channelName}
      userId={userId}
      userRole={userRole as 'doctor' | 'patient'}
      userName={user.name}
      token={token || undefined}
      onLeave={() => navigate('/dashboard')}
    />
  );
};

export default VideoCallPage;
