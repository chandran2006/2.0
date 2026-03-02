import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Video, VideoOff, Mic, MicOff, PhoneOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import io from 'socket.io-client';

const CALL_SERVER_URL = 'http://localhost:5002';

const VideoCallPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const roomId = searchParams.get('room');
  const [socket, setSocket] = useState<any>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    if (!roomId || !user) {
      navigate('/dashboard');
      return;
    }

    const newSocket = io(CALL_SERVER_URL);
    setSocket(newSocket);

    // Get local media
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Join room
        newSocket.emit('join-room', {
          roomId,
          userId: user.id,
          userName: user.name,
          userType: user.role.toLowerCase()
        });

        // Setup peer connection
        const pc = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });
        peerConnectionRef.current = pc;

        stream.getTracks().forEach(track => pc.addTrack(track, stream));

        pc.ontrack = (event) => {
          setRemoteStream(event.streams[0]);
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            newSocket.emit('ice-candidate', {
              roomId,
              candidate: event.candidate,
              userId: user.id
            });
          }
        };

        // Handle signaling
        newSocket.on('user-joined', async () => {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          newSocket.emit('offer', { roomId, offer, userId: user.id });
        });

        newSocket.on('offer', async (data: any) => {
          await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          newSocket.emit('answer', { roomId, answer, userId: user.id });
        });

        newSocket.on('answer', async (data: any) => {
          await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
        });

        newSocket.on('ice-candidate', async (data: any) => {
          await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        });

        newSocket.on('end-call', () => {
          endCall();
        });
      })
      .catch(err => {
        console.error('Error accessing media devices:', err);
        alert('Cannot access camera/microphone');
      });

    return () => {
      localStream?.getTracks().forEach(track => track.stop());
      peerConnectionRef.current?.close();
      newSocket.disconnect();
    };
  }, [roomId, user]);

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks()[0].enabled = !videoEnabled;
      setVideoEnabled(!videoEnabled);
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      localStream.getAudioTracks()[0].enabled = !audioEnabled;
      setAudioEnabled(!audioEnabled);
    }
  };

  const endCall = () => {
    if (socket) {
      socket.emit('end-call', { roomId, userId: user?.id });
    }
    localStream?.getTracks().forEach(track => track.stop());
    peerConnectionRef.current?.close();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="flex-1 grid md:grid-cols-2 gap-2 p-2">
        <div className="relative bg-gray-900 rounded-lg overflow-hidden">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4 text-white bg-black/50 px-3 py-1 rounded">
            Remote User
          </div>
        </div>
        
        <div className="relative bg-gray-900 rounded-lg overflow-hidden">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4 text-white bg-black/50 px-3 py-1 rounded">
            You
          </div>
        </div>
      </div>

      <div className="p-4 flex justify-center gap-4">
        <Button
          size="lg"
          variant={videoEnabled ? 'default' : 'destructive'}
          onClick={toggleVideo}
          className="rounded-full w-14 h-14"
        >
          {videoEnabled ? <Video /> : <VideoOff />}
        </Button>
        
        <Button
          size="lg"
          variant={audioEnabled ? 'default' : 'destructive'}
          onClick={toggleAudio}
          className="rounded-full w-14 h-14"
        >
          {audioEnabled ? <Mic /> : <MicOff />}
        </Button>
        
        <Button
          size="lg"
          variant="destructive"
          onClick={endCall}
          className="rounded-full w-14 h-14"
        >
          <PhoneOff />
        </Button>
      </div>
    </div>
  );
};

export default VideoCallPage;
