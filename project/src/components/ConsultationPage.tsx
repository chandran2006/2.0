import React, { useState } from 'react';
import { VideoCall } from './VideoCall';

export const ConsultationPage: React.FC = () => {
  const [inCall, setInCall] = useState(false);
  
  // Get from your auth context or props
  const userId = '12345'; // User's ID from database
  const userRole = 'patient'; // or 'doctor'
  const appointmentId = 'apt-123'; // Use appointment ID as channel name

  const startCall = () => {
    setInCall(true);
  };

  const endCall = () => {
    setInCall(false);
  };

  if (inCall) {
    return (
      <VideoCall
        channelName={appointmentId}
        userId={userId}
        userRole={userRole}
        onLeave={endCall}
      />
    );
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <button
        onClick={startCall}
        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-lg font-semibold"
      >
        Start Video Consultation
      </button>
    </div>
  );
};
