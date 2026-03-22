import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { appointmentAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface BookAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  preselectedDoctorId?: string;
}

export const BookAppointmentDialog: React.FC<BookAppointmentDialogProps> = ({ open, onOpenChange, onSuccess, preselectedDoctorId }) => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    doctorId: '',
    appointmentDate: '',
    symptoms: '',
    consultationType: 'VIDEO'
  });

  useEffect(() => {
    if (open) {
      appointmentAPI.getDoctors().then(res => setDoctors(res.data)).catch(console.error);
      setFormData(f => ({ ...f, doctorId: preselectedDoctorId || '' }));
    }
  }, [open, preselectedDoctorId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.doctorId) {
      toast.error('Please select a doctor');
      return;
    }
    if (!formData.appointmentDate) {
      toast.error('Please select a date and time');
      return;
    }
    if (!formData.symptoms.trim()) {
      toast.error('Please describe your symptoms');
      return;
    }
    setLoading(true);
    try {
      await appointmentAPI.bookAppointment({
        doctorId: parseInt(formData.doctorId),
        patientId: parseInt(user?.id || '0'),
        appointmentDate: formData.appointmentDate,
        symptoms: formData.symptoms,
        consultationType: formData.consultationType,
        status: 'PENDING'
      });
      toast.success('Appointment booked successfully!');
      onOpenChange(false);
      onSuccess?.();
      setFormData({ doctorId: '', appointmentDate: '', symptoms: '', consultationType: 'VIDEO' });
    } catch (error) {
      toast.error('Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Book Appointment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Select Doctor</label>
            <Select value={formData.doctorId} onValueChange={(v) => setFormData({...formData, doctorId: v})}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map(doc => (
                  <SelectItem key={doc.id} value={doc.id.toString()}>
                    {doc.name} - {doc.specialization}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Date & Time</label>
            <Input type="datetime-local" value={formData.appointmentDate} onChange={(e) => setFormData({...formData, appointmentDate: e.target.value})} required />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Consultation Type</label>
            <Select value={formData.consultationType} onValueChange={(v) => setFormData({...formData, consultationType: v})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VIDEO">Video Call</SelectItem>
                <SelectItem value="AUDIO">Audio Call</SelectItem>
                <SelectItem value="CHAT">Chat</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Symptoms</label>
            <Textarea placeholder="Describe your symptoms..." value={formData.symptoms} onChange={(e) => setFormData({...formData, symptoms: e.target.value})} required />
          </div>
          <Button type="submit" className="w-full bg-gradient-primary" disabled={loading}>
            {loading ? 'Booking...' : 'Book Appointment'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
