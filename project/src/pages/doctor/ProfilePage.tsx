import React, { useState, useEffect } from 'react';
import { User, Save, Mail, Phone, MapPin, Stethoscope, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI } from '@/services/api';
import { toast } from 'sonner';
import DashboardLayout from '@/components/shared/DashboardLayout';

const DoctorProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', address: '', specialization: '', licenseNumber: '' });
  const [initial, setInitial] = useState(form);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const loaded = {
      name: user.name || '',
      phone: user.phone || '',
      address: user.address || '',
      specialization: user.specialization || '',
      licenseNumber: user.licenseNumber || '',
    };
    setForm(loaded);
    setInitial(loaded);
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await authAPI.updateUser(parseInt(user!.id), form);
      updateUser(form);
      setInitial(form);
      toast.success('Profile updated successfully');
    } catch { toast.error('Failed to update profile'); }
    finally { setSaving(false); }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="font-display text-2xl font-bold">My Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your professional information</p>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User className="w-5 h-5" /> Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="pl-10" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input value={user?.email || ''} disabled className="pl-10 bg-muted" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="pl-10" placeholder="+91 XXXXX XXXXX" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Specialization</label>
                <div className="relative">
                  <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input value={form.specialization} onChange={e => setForm({...form, specialization: e.target.value})} className="pl-10" placeholder="e.g. Cardiologist" />
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">License Number</label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input value={form.licenseNumber} onChange={e => setForm({...form, licenseNumber: e.target.value})} className="pl-10" placeholder="Medical license number" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="pl-10" placeholder="Clinic address" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setForm(initial)}>Cancel</Button>
          <Button className="bg-gradient-primary" onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorProfilePage;
