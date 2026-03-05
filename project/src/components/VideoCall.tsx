import React, { useEffect, useState, useRef } from 'react';
import AgoraRTC, {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from 'agora-rtc-sdk-ng';
import { getAgoraToken } from '../services/agoraService';
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, Monitor, MonitorOff } from 'lucide-react';

// Use environment variable or fallback to hardcoded value
const APP_ID = import.meta.env.VITE_AGORA_APP_ID || 'fec296083f304452b43d718b2aaa9d00';

interface VideoCallProps {
  channelName: string;
  userId: string;
  userRole: 'doctor' | 'patient';
  userName: string;
  token?: string;
  onLeave: () => void;
}

interface RemoteUserWithName extends IAgoraRTCRemoteUser {
  userName?: string;
  networkQuality?: number;
}

export const VideoCall: React.FC<VideoCallProps> = ({
  channelName,
  userId,
  userRole,
  userName,
  token,
  onLeave,
}) => {
  const [localTracks, setLocalTracks] = useState<{
    videoTrack: ICameraVideoTrack | null;
    audioTrack: IMicrophoneAudioTrack | null;
  }>({ videoTrack: null, audioTrack: null });
  
  const [remoteUsers, setRemoteUsers] = useState<RemoteUserWithName[]>([]);
  const [isJoined, setIsJoined] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [localNetworkQuality, setLocalNetworkQuality] = useState<number>(1);
  const [remoteNetworkQualities, setRemoteNetworkQualities] = useState<Map<string, number>>(new Map());
  const [showDisconnectMessage, setShowDisconnectMessage] = useState(false);

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
        console.log('User published:', user.uid, 'mediaType:', mediaType);
        await client.subscribe(user, mediaType);
        console.log('Subscribed to user:', user.uid);
        
        if (mediaType === 'video') {
          setRemoteUsers((prev) => {
            const exists = prev.find((u) => u.uid === user.uid);
            if (exists) return prev;
            
            const remoteUserRole = userRole === 'doctor' ? 'patient' : 'doctor';
            const remoteUserName = remoteUserRole === 'doctor' ? 'Dr. ' + (user.uid || 'Doctor') : 'Patient';
            
            console.log('Adding remote user:', user.uid, 'with name:', remoteUserName);
            return [...prev, { ...user, userName: remoteUserName }];
          });
          
          // Play video immediately after subscription
          setTimeout(() => {
            const remoteVideoElement = document.getElementById(`remote-${user.uid}`);
            if (remoteVideoElement && user.videoTrack) {
              console.log('Playing remote video for:', user.uid);
              user.videoTrack.play(remoteVideoElement);
            } else {
              console.warn('Remote video element not found for:', user.uid);
            }
          }, 100);
        }

        if (mediaType === 'audio') {
          console.log('Playing remote audio for:', user.uid);
          user.audioTrack?.play();
        }
      });

      client.on('user-unpublished', (user, mediaType) => {
        if (mediaType === 'video') {
          setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
        }
      });

      client.on('user-left', (user) => {
        console.log('Remote user left:', user.uid);
        setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
        
        if (!callEnded) {
          setShowDisconnectMessage(true);
          setTimeout(() => {
            handleLeave();
          }, 3000);
        }
      });

      client.on('connection-state-change', (curState, prevState) => {
        console.log('Connection state:', prevState, '->', curState);
      });

      client.on('network-quality', (stats) => {
        setLocalNetworkQuality(stats.uplinkNetworkQuality);
        
        if (stats.downlinkNetworkQuality) {
          setRemoteNetworkQualities((prev) => {
            const updated = new Map(prev);
            remoteUsers.forEach((user) => {
              updated.set(String(user.uid), stats.downlinkNetworkQuality);
            });
            return updated;
          });
        }
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
    console.log('Remote users updated:', remoteUsers.length);
    remoteUsers.forEach((user) => {
      const remoteVideoElement = document.getElementById(`remote-${user.uid}`);
      console.log('Checking remote video element for:', user.uid, 'found:', !!remoteVideoElement, 'has track:', !!user.videoTrack);
      if (remoteVideoElement && user.videoTrack) {
        console.log('Playing video for user:', user.uid);
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
    if (callEnded) return;
    setCallEnded(true);

    try {
      if (localTracks.audioTrack) {
        localTracks.audioTrack.stop();
        localTracks.audioTrack.close();
      }
      if (localTracks.videoTrack) {
        localTracks.videoTrack.stop();
        localTracks.videoTrack.close();
      }

      if (clientRef.current) {
        await clientRef.current.leave();
        clientRef.current.removeAllListeners();
      }

      setIsJoined(false);
      setRemoteUsers([]);
    } catch (e) {
      console.log('Leave error:', e);
    } finally {
      onLeave();
    }
  };

  const getNetworkQualityColor = (quality: number): string => {
    if (quality <= 2) return 'bg-green-500';
    if (quality <= 4) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getNetworkQualityText = (quality: number): string => {
    if (quality <= 2) return 'Good';
    if (quality <= 4) return 'Medium';
    return 'Poor';
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 z-50">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${
              isJoined ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
            }`} />
            <span className="text-white font-medium">
              {isJoined ? 'Connected' : 'Connecting...'}
            </span>
          </div>
          <div className="text-white text-sm">
            {remoteUsers.length > 0 ? `${remoteUsers.length + 1} participants` : 'Waiting for others...'}
          </div>
        </div>
      </div>

      {/* Disconnect Notification */}
      {showDisconnectMessage && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-2xl animate-pulse">
          <p className="font-semibold">User disconnected. Ending call...</p>
        </div>
      )}

      {/* Remote Video Grid */}
      <div className="flex-1 relative p-4 pt-20">
        {remoteUsers.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center bg-gray-800/50 rounded-2xl backdrop-blur-sm border border-gray-700">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <Phone className="w-12 h-12 text-white" />
            </div>
            <p className="text-white text-xl font-medium mb-2">Waiting for others to join...</p>
            <p className="text-gray-400 text-sm">Share the room link to start the call</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            {remoteUsers.map((user) => (
              <div
                key={user.uid}
                className="relative bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-gray-700"
              >
                <div
                  id={`remote-${user.uid}`}
                  className="w-full h-full"
                  style={{ minHeight: '400px' }}
                />
                {/* Remote User Name */}
                <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-2 rounded-lg">
                  <span className="text-white text-sm font-medium">{user.userName || 'Remote User'}</span>
                </div>
                {/* Remote Network Quality */}
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/70 backdrop-blur-sm px-3 py-2 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${getNetworkQualityColor(remoteNetworkQualities.get(String(user.uid)) || 1)}`} />
                  <span className="text-white text-xs">{getNetworkQualityText(remoteNetworkQualities.get(String(user.uid)) || 1)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Local Video */}
      <div className="absolute bottom-28 right-6 w-64 h-48 bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 transition-all hover:scale-105">
        <div ref={localVideoRef} className="w-full h-full" />
        {isVideoOff && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
            <VideoOff className="w-12 h-12 text-gray-400 mb-2" />
            <span className="text-white text-sm">Camera Off</span>
          </div>
        )}
        {/* Local User Name */}
        <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm px-3 py-2 rounded-lg">
          <span className="text-white text-xs font-medium">{userName}</span>
        </div>
        {/* Local Network Quality */}
        <div className="absolute top-2 right-2 flex items-center gap-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg">
          <div className={`w-2 h-2 rounded-full ${getNetworkQualityColor(localNetworkQuality)}`} />
          <span className="text-white text-xs">{getNetworkQualityText(localNetworkQuality)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={toggleMute}
            className={`w-14 h-14 rounded-full font-semibold transition-all transform hover:scale-110 shadow-lg ${
              isMuted
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff className="w-6 h-6 mx-auto" /> : <Mic className="w-6 h-6 mx-auto" />}
          </button>

          <button
            onClick={toggleVideo}
            className={`w-14 h-14 rounded-full font-semibold transition-all transform hover:scale-110 shadow-lg ${
              isVideoOff
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm'
            }`}
            title={isVideoOff ? 'Start Video' : 'Stop Video'}
          >
            {isVideoOff ? <VideoOff className="w-6 h-6 mx-auto" /> : <Video className="w-6 h-6 mx-auto" />}
          </button>

          <button
            onClick={handleLeave}
            className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-full font-semibold transition-all transform hover:scale-110 shadow-2xl flex items-center justify-center"
            title="End Call"
          >
            <PhoneOff className="w-7 h-7" />
          </button>
        </div>
      </div>
    </div>
  );
};
