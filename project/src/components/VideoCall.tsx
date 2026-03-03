import React, { useEffect, useState, useRef } from 'react';
import AgoraRTC, {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from 'agora-rtc-sdk-ng';
import { getAgoraToken } from '../services/agoraService';

const APP_ID = '11ab8951ac914836a96affca6b87bae7';

interface VideoCallProps {
  channelName: string;
  userId: string;
  userRole: 'doctor' | 'patient';
  token?: string;
  onLeave: () => void;
}

export const VideoCall: React.FC<VideoCallProps> = ({
  channelName,
  userId,
  userRole,
  token,
  onLeave,
}) => {
  const [localTracks, setLocalTracks] = useState<{
    videoTrack: ICameraVideoTrack | null;
    audioTrack: IMicrophoneAudioTrack | null;
  }>({ videoTrack: null, audioTrack: null });
  
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [isJoined, setIsJoined] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localVideoRef = useRef<HTMLDivElement>(null);
  const isInitializing = useRef(false);

  useEffect(() => {
    if (isInitializing.current) return;
    isInitializing.current = true;

    const init = async () => {
      const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      clientRef.current = client;

      client.on('user-published', async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        
        if (mediaType === 'video') {
          setRemoteUsers((prev) => {
            const exists = prev.find((u) => u.uid === user.uid);
            return exists ? prev : [...prev, user];
          });
        }

        if (mediaType === 'audio') {
          user.audioTrack?.play();
        }
      });

      client.on('user-unpublished', (user, mediaType) => {
        if (mediaType === 'video') {
          setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
        }
      });

      client.on('user-left', (user) => {
        setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
      });

      try {
        console.log('=== Agora Join Debug ===' );
        console.log('Channel:', channelName);
        console.log('User ID:', userId);
        console.log('Role:', userRole);
        console.log('Token provided:', !!token);
        
        let agoraToken = token;
        if (!agoraToken) {
          console.log('Fetching token from backend...');
          const response = await getAgoraToken(channelName, userId, userRole);
          agoraToken = response.token;
          if (!agoraToken) {
            console.log('No token received - using null (testing mode)');
          } else {
            console.log('Received token:', agoraToken?.substring(0, 20) + '...');
          }
        }
        
        const uid = parseInt(userId) || 0;
        console.log('Parsed UID:', uid);
        console.log('App ID being used:', APP_ID);
        console.log('App ID type:', typeof APP_ID);
        console.log('App ID length:', APP_ID?.length);
        console.log('Attempting to join...');

        if (!APP_ID || APP_ID.trim() === '') {
          throw new Error('App ID is empty or undefined');
        }

        await client.join(APP_ID, channelName, agoraToken, uid);
        console.log('✓ Successfully joined channel');

        console.log('Requesting camera and microphone permissions...');
        try {
          const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks(
            { AEC: true, ANS: true },
            { encoderConfig: '480p_1' }
          );
          console.log('✓ Got media tracks - Audio:', !!audioTrack, 'Video:', !!videoTrack);
          
          setLocalTracks({ audioTrack, videoTrack });

          if (localVideoRef.current) {
            videoTrack.play(localVideoRef.current);
            console.log('✓ Playing local video');
          }

          await client.publish([audioTrack, videoTrack]);
          console.log('✓ Published tracks');
          setIsJoined(true);
        } catch (mediaError: any) {
          console.error('Media access error:', mediaError);
          alert(`Camera/Microphone access denied: ${mediaError.message}\n\nPlease allow camera and microphone permissions in your browser settings.`);
          throw mediaError;
        }
      } catch (error: any) {
        console.error('Failed to join channel:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        alert(`Failed to join call: ${error.message}`);
      }
    };

    init();

    return () => {
      isInitializing.current = false;
      const cleanup = async () => {
        if (localTracks.audioTrack) {
          localTracks.audioTrack.close();
        }
        if (localTracks.videoTrack) {
          localTracks.videoTrack.close();
        }
        if (clientRef.current) {
          await clientRef.current.leave();
        }
      };
      cleanup();
    };
  }, []);

  useEffect(() => {
    remoteUsers.forEach((user) => {
      const remoteVideoElement = document.getElementById(`remote-${user.uid}`);
      if (remoteVideoElement && user.videoTrack) {
        user.videoTrack.play(remoteVideoElement);
      }
    });
  }, [remoteUsers]);

  const toggleMute = () => {
    if (localTracks.audioTrack) {
      localTracks.audioTrack.setEnabled(isMuted);
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localTracks.videoTrack) {
      localTracks.videoTrack.setEnabled(isVideoOff);
      setIsVideoOff(!isVideoOff);
    }
  };

  const handleLeave = async () => {
    if (localTracks.audioTrack) {
      localTracks.audioTrack.close();
    }
    if (localTracks.videoTrack) {
      localTracks.videoTrack.close();
    }

    if (clientRef.current) {
      try {
        await clientRef.current.leave();
      } catch (e) {
        console.log('Leave error (ignored):', e);
      }
    }

    setIsJoined(false);
    setRemoteUsers([]);
    onLeave();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Remote Video Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {remoteUsers.length === 0 ? (
          <div className="flex items-center justify-center bg-gray-800 rounded-lg">
            <p className="text-white text-lg">Waiting for others to join...</p>
          </div>
        ) : (
          remoteUsers.map((user) => (
            <div
              key={user.uid}
              id={`remote-${user.uid}`}
              className="bg-gray-800 rounded-lg overflow-hidden"
              style={{ minHeight: '300px' }}
            />
          ))
        )}
      </div>

      {/* Local Video */}
      <div className="absolute bottom-24 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white">
        <div ref={localVideoRef} className="w-full h-full" />
        {isVideoOff && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
            <span className="text-white">Camera Off</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex justify-center items-center gap-4 p-6 bg-gray-800">
        <button
          onClick={toggleMute}
          className={`px-6 py-3 rounded-full font-semibold transition ${
            isMuted
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-gray-600 hover:bg-gray-700 text-white'
          }`}
        >
          {isMuted ? 'Unmute' : 'Mute'}
        </button>

        <button
          onClick={toggleVideo}
          className={`px-6 py-3 rounded-full font-semibold transition ${
            isVideoOff
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-gray-600 hover:bg-gray-700 text-white'
          }`}
        >
          {isVideoOff ? 'Start Video' : 'Stop Video'}
        </button>

        <button
          onClick={handleLeave}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold transition"
        >
          Leave Call
        </button>
      </div>

      {/* Status */}
      {isJoined && (
        <div className="absolute top-4 left-4 bg-green-600 text-white px-4 py-2 rounded-lg">
          Connected
        </div>
      )}
    </div>
  );
};
