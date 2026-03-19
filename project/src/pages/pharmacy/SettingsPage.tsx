import React, { useState, useEffect } from 'react';
import { Settings, Store, Clock, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { authAPI } from '@/services/api';
import DashboardLayout from '@/components/shared/DashboardLayout';

const PharmacySettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [initialForm, setInitialForm] = useState({
    pharmacyName: '', phone: '', address: '', openTime: '09:00', closeTime: '21:00',
    emailNotifications: true, smsAlerts: true, lowStockAlerts: true, isOpen: true,
  });
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const loaded = {
      ...initialForm,
      pharmacyName: user.pharmacyName || user.name || '',
      phone: user.phone || '',
      address: user.address || '',
    };
    setForm(loaded);
    setInitialForm(loaded);
  }, [user]);

  const handleCancel = () => setForm(initialForm);

  const handleSave = async () => {
    setSaving(true);
    try {
      await authAPI.updateUser(parseInt(user!.id), {
        pharmacyName: form.pharmacyName,
        phone: form.phone,
        address: form.address
      });
      toast.success('Settings saved successfully');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Pharmacy Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your pharmacy information and preferences</p>
        </div>

        <Card className="shadow-card">
          <CardHeader><CardTitle className="flex items-center gap-2"><Store className="w-5 h-5" /> Pharmacy Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Pharmacy Name</label>
              <Input value={form.pharmacyName} onChange={e => setForm({...form, pharmacyName: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Phone</label>
                <Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Email</label>
                <Input value={user?.email || ''} disabled className="bg-muted" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Address</label>
              <Input value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5" /> Operating Hours</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Currently Open</p>
                <p className="text-sm text-muted-foreground">Toggle your pharmacy open/closed status</p>
              </div>
              <Switch checked={form.isOpen} onCheckedChange={v => setForm({...form, isOpen: v})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Opening Time</label>
                <Input type="time" value={form.openTime} onChange={e => setForm({...form, openTime: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Closing Time</label>
                <Input type="time" value={form.closeTime} onChange={e => setForm({...form, closeTime: e.target.value})} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader><CardTitle className="flex items-center gap-2"><Settings className="w-5 h-5" /> Preferences</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive order notifications via email' },
              { key: 'smsAlerts', label: 'SMS Alerts', desc: 'Get SMS for urgent orders' },
              { key: 'lowStockAlerts', label: 'Low Stock Alerts', desc: 'Alert when inventory is low' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
                <Switch checked={(form as any)[key]} onCheckedChange={v => setForm({...form, [key]: v})} />
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button className="bg-gradient-primary" onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PharmacySettingsPage;
