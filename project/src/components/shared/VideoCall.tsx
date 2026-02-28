import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Video, VideoOff, Mic, MicOff, PhoneOff } from 'lucide-react';
import socketService from '@/services/socket';

interface VideoCallProps {
  open: boolean;
  onClose: () => void;
  roomId: string;
  userId: string;
}

export const VideoCall: React.FC<VideoCallProps> = ({ open, onClose, roomId, userId }) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    if (open) {
      initializeCall();
    }
    return () => {
      cleanup();
    };
  }, [open]);

  const initializeCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });

      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      pc.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socketService.emit('ice-candidate', { roomId, candidate: event.candidate });
        }
      };

      peerConnection.current = pc;
      socketService.connect();
      socketService.emit('join-room', { roomId, userId });

      socketService.on('offer', async (data) => {
        await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socketService.emit('answer', { roomId, answer });
      });

      socketService.on('answer', async (data) => {
        await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
      });

      socketService.on('ice-candidate', async (data) => {
        await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      });

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socketService.emit('offer', { roomId, offer });
    } catch (error) {
      console.error('Error initializing call:', error);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setVideoEnabled(!videoEnabled);
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setAudioEnabled(!audioEnabled);
    }
  };

  const endCall = () => {
    socketService.emit('end-call', { roomId });
    cleanup();
    onClose();
  };

  const cleanup = () => {
    localStream?.getTracks().forEach(track => track.stop());
    peerConnection.current?.close();
    setLocalStream(null);
    setRemoteStream(null);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[600px] p-0">
        <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
          <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
          <video ref={localVideoRef} autoPlay playsInline muted className="absolute bottom-4 right-4 w-48 h-36 object-cover rounded-lg border-2 border-white" />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
            <Button size="icon" variant={videoEnabled ? 'default' : 'destructive'} onClick={toggleVideo} className="rounded-full">
              {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </Button>
            <Button size="icon" variant={audioEnabled ? 'default' : 'destructive'} onClick={toggleAudio} className="rounded-full">
              {audioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </Button>
            <Button size="icon" variant="destructive" onClick={endCall} className="rounded-full">
              <PhoneOff className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
