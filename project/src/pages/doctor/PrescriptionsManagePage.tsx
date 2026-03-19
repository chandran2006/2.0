import React, { useState, useEffect } from 'react';
import { FileText, Plus, Pill, Search, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { prescriptionAPI, appointmentAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import DashboardLayout from '@/components/shared/DashboardLayout';

const emptyForm = { patientId: '', medicineName: '', dosage: '', duration: '', instructions: '' };

const PrescriptionsManagePage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    // Auto-open dialog if patientId passed from PatientsPage
    const pid = searchParams.get('patientId');
    const pname = searchParams.get('patientName');
    if (pid) {
      setFormData(f => ({ ...f, patientId: pid }));
      setDialogOpen(true);
    }
  }, [user]);

  const loadData = async () => {
    if (!user?.id) return;
    try {
      const [rxRes, aptsRes] = await Promise.all([
        prescriptionAPI.getDoctorPrescriptions(parseInt(user.id)),
        appointmentAPI.getDoctorAppointments(parseInt(user.id)),
      ]);
      setPrescriptions(rxRes.data || []);
      // Build unique patient list from appointments
      const seen = new Set();
      const pts = (aptsRes.data || []).filter((a: any) => {
        if (seen.has(a.patientId)) return false;
        seen.add(a.patientId);
        return true;
      });
      setPatients(pts);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await prescriptionAPI.create({ ...formData, doctorId: parseInt(user!.id), patientId: parseInt(formData.patientId) });
      toast.success('Prescription created');
      setDialogOpen(false);
      setFormData(emptyForm);
      loadData();
    } catch { toast.error('Failed to create prescription'); }
    finally { setSaving(false); }
  };

  const filtered = prescriptions.filter(p =>
    p.medicineName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.patientName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <DashboardLayout><div className="text-center py-8">Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-display text-2xl font-bold">Prescriptions</h1>
            <p className="text-muted-foreground mt-1">Create and manage patient prescriptions</p>
          </div>
          <Button className="bg-gradient-primary" onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-1" /> New Prescription
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by patient or medicine..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
        </div>

        <div className="grid gap-4">
          {filtered.map((rx) => (
            <Card key={rx.id} className="shadow-card hover:shadow-card-hover transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                    <Pill className="w-6 h-6 text-success" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-lg">{rx.patientName || `Patient #${rx.patientId}`}</p>
                        <p className="text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          {new Date(rx.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={rx.status === 'ACTIVE' ? 'default' : 'secondary'}>{rx.status}</Badge>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3 mb-3">
                      <div className="p-3 rounded-lg bg-muted/50"><p className="text-xs text-muted-foreground mb-1">Medicine</p><p className="font-medium">{rx.medicineName}</p></div>
                      <div className="p-3 rounded-lg bg-muted/50"><p className="text-xs text-muted-foreground mb-1">Dosage</p><p className="font-medium">{rx.dosage}</p></div>
                      <div className="p-3 rounded-lg bg-muted/50"><p className="text-xs text-muted-foreground mb-1">Duration</p><p className="font-medium">{rx.duration}</p></div>
                      <div className="p-3 rounded-lg bg-muted/50"><p className="text-xs text-muted-foreground mb-1">Status</p><p className="font-medium">{rx.isTaken ? 'Taken' : 'Not taken'}</p></div>
                    </div>
                    {rx.instructions && (
                      <div className="p-3 rounded-lg bg-info/5 border border-info/20">
                        <p className="text-xs text-muted-foreground mb-1">Instructions</p>
                        <p className="text-sm">{rx.instructions}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">No prescriptions found</p>}
        </div>

        <Card className="shadow-card">
          <CardHeader><CardTitle>Statistics</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-muted/50"><p className="text-2xl font-bold">{prescriptions.length}</p><p className="text-xs text-muted-foreground">Total</p></div>
              <div className="p-4 rounded-lg bg-muted/50"><p className="text-2xl font-bold">{prescriptions.filter(p => p.status === 'ACTIVE').length}</p><p className="text-xs text-muted-foreground">Active</p></div>
              <div className="p-4 rounded-lg bg-muted/50"><p className="text-2xl font-bold">{prescriptions.filter(p => p.status === 'COMPLETED').length}</p><p className="text-xs text-muted-foreground">Completed</p></div>
              <div className="p-4 rounded-lg bg-muted/50"><p className="text-2xl font-bold">{new Set(prescriptions.map(p => p.patientId)).size}</p><p className="text-xs text-muted-foreground">Patients</p></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Create Prescription</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Patient *</label>
              <Select value={formData.patientId} onValueChange={v => setFormData({...formData, patientId: v})}>
                <SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
                <SelectContent>
                  {patients.map(p => <SelectItem key={p.patientId} value={p.patientId.toString()}>{p.patientName}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-sm font-medium mb-1 block">Medicine Name *</label><Input value={formData.medicineName} onChange={e => setFormData({...formData, medicineName: e.target.value})} placeholder="e.g. Paracetamol" required /></div>
              <div><label className="text-sm font-medium mb-1 block">Dosage *</label><Input value={formData.dosage} onChange={e => setFormData({...formData, dosage: e.target.value})} placeholder="e.g. 500mg" required /></div>
            </div>
            <div><label className="text-sm font-medium mb-1 block">Duration *</label><Input value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} placeholder="e.g. 7 days" required /></div>
            <div><label className="text-sm font-medium mb-1 block">Instructions</label><Textarea value={formData.instructions} onChange={e => setFormData({...formData, instructions: e.target.value})} placeholder="Instructions for patient..." rows={3} /></div>
            <div className="flex gap-2 pt-1">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" className="flex-1 bg-gradient-primary" disabled={saving || !formData.patientId}>{saving ? 'Creating...' : 'Create Prescription'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default PrescriptionsManagePage;
