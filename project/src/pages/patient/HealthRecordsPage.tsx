import React, { useState, useEffect } from 'react';
import { FileText, Heart, Activity, Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

const VITALS_KEY = 'medora_vitals';

const defaultVitals = { heartRate: '72', bloodPressure: '120/80', temperature: '98.6', weight: '70' };

const HealthRecordsPage: React.FC = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [editingVitals, setEditingVitals] = useState(false);
  const [vitals, setVitals] = useState(() => {
    try { return JSON.parse(localStorage.getItem(VITALS_KEY) || 'null') || defaultVitals; }
    catch { return defaultVitals; }
  });
  const [vitalsForm, setVitalsForm] = useState(vitals);

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
    if (!form.type || !form.doctor || !form.result || !form.date) {
      toast.error('Please fill all fields');
      return;
    }
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

  const saveVitals = () => {
    localStorage.setItem(VITALS_KEY, JSON.stringify(vitalsForm));
    setVitals(vitalsForm);
    setEditingVitals(false);
    toast.success('Vital statistics updated');
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
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-display text-lg">Vital Statistics</CardTitle>
              {editingVitals ? (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => { setVitalsForm(vitals); setEditingVitals(false); }}>
                    <X className="w-3 h-3 mr-1" /> Cancel
                  </Button>
                  <Button size="sm" className="bg-gradient-primary" onClick={saveVitals}>
                    <Save className="w-3 h-3 mr-1" /> Save
                  </Button>
                </div>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setEditingVitals(true)}>
                  <Edit2 className="w-3 h-3 mr-1" /> Edit
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { key: 'heartRate', label: 'Heart Rate', unit: 'bpm', icon: Heart, color: 'text-destructive' },
                { key: 'bloodPressure', label: 'Blood Pressure', unit: 'mmHg', icon: Activity, color: 'text-info' },
                { key: 'temperature', label: 'Temperature', unit: '°F', icon: Activity, color: 'text-warning' },
                { key: 'weight', label: 'Weight', unit: 'kg', icon: Activity, color: 'text-success' },
              ].map(({ key, label, unit, icon: Icon, color }) => (
                <div key={key} className="p-4 rounded-lg bg-muted/50">
                  <Icon className={`w-5 h-5 ${color} mb-2`} />
                  {editingVitals ? (
                    <Input
                      value={vitalsForm[key as keyof typeof vitalsForm]}
                      onChange={e => setVitalsForm({ ...vitalsForm, [key]: e.target.value })}
                      className="h-8 text-lg font-bold mb-1"
                    />
                  ) : (
                    <p className="text-2xl font-bold">{vitals[key as keyof typeof vitals]}</p>
                  )}
                  <p className="text-xs text-muted-foreground">{label} ({unit})</p>
                </div>
              ))}
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
