import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PhoneOff } from 'lucide-react';

interface VideoCallProps {
  open: boolean;
  onClose: () => void;
  roomId: string;
  userId: string;
}

export const VideoCall: React.FC<VideoCallProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[600px] p-0">
        <div className="relative w-full h-full bg-black rounded-lg overflow-hidden flex items-center justify-center">
          <div className="text-white text-center">
            <p className="text-xl mb-4">Video calls now use Agora</p>
            <p className="text-sm text-gray-400 mb-6">Please use the new video call page</p>
            <Button size="icon" variant="destructive" onClick={onClose} className="rounded-full">
              <PhoneOff className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
