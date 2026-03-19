import React, { useState, useEffect } from 'react';
import { FileText, Heart, Activity, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { healthRecordAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import DashboardLayout from '@/components/shared/DashboardLayout';

const emptyForm = { type: '', doctor: '', result: '', date: '' };

const HealthRecordsPage: React.FC = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadRecords(); }, [user]);

  const loadRecords = async () => {
    if (!user?.id) return;
    try {
      const res = await healthRecordAPI.getPatientRecords(parseInt(user.id));
      setRecords(res.data || []);
    } catch { console.error('Failed to load records'); }
    finally { setLoading(false); }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await healthRecordAPI.create({ ...form, patientId: parseInt(user!.id) });
      toast.success('Record added successfully');
      setDialogOpen(false);
      setForm(emptyForm);
      loadRecords();
    } catch { toast.error('Failed to add record'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this record?')) return;
    try {
      await healthRecordAPI.delete(id);
      toast.success('Record deleted');
      loadRecords();
    } catch { toast.error('Failed to delete record'); }
  };

  if (loading) return <DashboardLayout><div className="text-center py-8">Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-display text-2xl font-bold">Health Records</h1>
            <p className="text-muted-foreground mt-1">View and manage your medical records</p>
          </div>
          <Button className="bg-gradient-primary" onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-1" /> Add Record
          </Button>
        </div>

        <div className="grid gap-4">
          {records.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No health records found. Add your first record.</p>
          ) : records.map((record) => (
            <Card key={record.id} className="shadow-card hover:shadow-card-hover transition-shadow">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-info" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{record.type}</p>
                  <p className="text-sm text-muted-foreground">By {record.doctor}</p>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(record.date).toLocaleDateString()}</p>
                </div>
                <Badge variant="default">{record.result}</Badge>
                <Button size="sm" variant="outline" className="text-destructive" onClick={() => handleDelete(record.id)}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <h3 className="font-display text-lg font-bold mb-4">Vital Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-muted/50"><Heart className="w-5 h-5 text-destructive mb-2" /><p className="text-2xl font-bold">72</p><p className="text-xs text-muted-foreground">Heart Rate (bpm)</p></div>
              <div className="p-4 rounded-lg bg-muted/50"><Activity className="w-5 h-5 text-info mb-2" /><p className="text-2xl font-bold">120/80</p><p className="text-xs text-muted-foreground">Blood Pressure</p></div>
              <div className="p-4 rounded-lg bg-muted/50"><Activity className="w-5 h-5 text-warning mb-2" /><p className="text-2xl font-bold">98.6°F</p><p className="text-xs text-muted-foreground">Temperature</p></div>
              <div className="p-4 rounded-lg bg-muted/50"><Activity className="w-5 h-5 text-success mb-2" /><p className="text-2xl font-bold">70 kg</p><p className="text-xs text-muted-foreground">Weight</p></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add Health Record</DialogTitle></DialogHeader>
          <form onSubmit={handleUpload} className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Record Type *</label>
              <Select value={form.type} onValueChange={v => setForm({...form, type: v})}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {['Blood Test','X-Ray','ECG','MRI','CT Scan','Urine Test','Other'].map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Doctor Name *</label>
              <Input value={form.doctor} onChange={e => setForm({...form, doctor: e.target.value})} placeholder="e.g. Dr. Sharma" required />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Result *</label>
              <Input value={form.result} onChange={e => setForm({...form, result: e.target.value})} placeholder="e.g. Normal, Abnormal" required />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Date *</label>
              <Input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required />
            </div>
            <div className="flex gap-2 pt-1">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" className="flex-1 bg-gradient-primary" disabled={saving || !form.type}>
                {saving ? 'Saving...' : 'Add Record'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default HealthRecordsPage;
