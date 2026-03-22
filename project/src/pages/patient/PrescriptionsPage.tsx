import React, { useState, useEffect } from 'react';
import { Pill, Download, CheckCircle, Calendar, Search, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { prescriptionAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import DashboardLayout from '@/components/shared/DashboardLayout';

const PrescriptionsPage: React.FC = () => {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadPrescriptions();
    const interval = setInterval(loadPrescriptions, 15000);
    return () => clearInterval(interval);
  }, [user]);

  const loadPrescriptions = () => {
    if (!user?.id) return;
    prescriptionAPI.getPatientPrescriptions(parseInt(user.id))
      .then(res => setPrescriptions(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleDownload = (rx: any) => {
    const content = [
      'MEDORA - PRESCRIPTION',
      '='.repeat(40),
      `Patient: ${user?.name || 'N/A'}`,
      `Doctor: ${rx.doctorName || 'N/A'}`,
      `Date: ${new Date(rx.createdAt).toLocaleDateString()}`,
      '',
      `Medicine: ${rx.medicineName}`,
      `Dosage: ${rx.dosage}`,
      `Duration: ${rx.duration}`,
      `Instructions: ${rx.instructions || 'None'}`,
      `Status: ${rx.status}`,
      `Taken: ${rx.isTaken ? 'Yes' : 'No'}`,
    ].join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prescription_${rx.medicineName}_${rx.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Prescription downloaded');
  };

  const handleMarkTaken = async (id: number) => {
    try {
      await prescriptionAPI.markTaken(id);
      toast.success('Marked as taken');
      loadPrescriptions();
    } catch { toast.error('Failed to update'); }
  };

  const filtered = prescriptions.filter(rx =>
    (rx.medicineName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (rx.doctorName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: prescriptions.length,
    active: prescriptions.filter(p => p.status === 'ACTIVE').length,
    completed: prescriptions.filter(p => p.status === 'COMPLETED').length,
    taken: prescriptions.filter(p => p.isTaken).length,
  };

  if (loading) return <DashboardLayout><div className="text-center py-8">Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-display text-2xl font-bold">My Prescriptions</h1>
            <p className="text-muted-foreground mt-1">View and manage your prescriptions</p>
          </div>
          <Button variant="outline" size="sm" onClick={loadPrescriptions}>
            <RefreshCw className="w-4 h-4 mr-1" /> Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="shadow-card"><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{stats.total}</p><p className="text-xs text-muted-foreground">Total</p></CardContent></Card>
          <Card className="shadow-card"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-warning">{stats.active}</p><p className="text-xs text-muted-foreground">Active</p></CardContent></Card>
          <Card className="shadow-card"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-success">{stats.completed}</p><p className="text-xs text-muted-foreground">Completed</p></CardContent></Card>
          <Card className="shadow-card"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-info">{stats.taken}</p><p className="text-xs text-muted-foreground">Taken</p></CardContent></Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by medicine or doctor..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
        </div>

        {/* Prescription cards — same detailed layout as doctor view */}
        <div className="grid gap-4">
          {filtered.map((rx) => (
            <Card key={rx.id} className="shadow-card hover:shadow-card-hover transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0">
                    <Pill className="w-6 h-6 text-success" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium text-lg">{rx.medicineName}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          {rx.createdAt ? new Date(rx.createdAt).toLocaleDateString() : 'N/A'}
                          {rx.doctorName && <span className="ml-2">· Dr. {rx.doctorName}</span>}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant={rx.status === 'ACTIVE' ? 'default' : rx.status === 'COMPLETED' ? 'outline' : 'secondary'}>
                          {rx.status}
                        </Badge>
                        {rx.isTaken && <Badge variant="outline" className="text-success border-success text-xs">✓ Taken</Badge>}
                      </div>
                    </div>

                    {/* Detail grid — matches doctor layout */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">Medicine</p>
                        <p className="font-medium text-sm">{rx.medicineName}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">Dosage</p>
                        <p className="font-medium text-sm">{rx.dosage || '—'}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">Duration</p>
                        <p className="font-medium text-sm">{rx.duration || '—'}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">Taken</p>
                        <p className="font-medium text-sm">{rx.isTaken ? 'Yes' : 'No'}</p>
                      </div>
                    </div>

                    {rx.instructions && (
                      <div className="p-3 rounded-lg bg-info/5 border border-info/20 mb-3">
                        <p className="text-xs text-muted-foreground mb-1">Instructions</p>
                        <p className="text-sm">{rx.instructions}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {rx.status === 'ACTIVE' && !rx.isTaken && (
                        <Button size="sm" variant="outline" className="text-success border-success hover:bg-success/10" onClick={() => handleMarkTaken(rx.id)}>
                          <CheckCircle className="w-3 h-3 mr-1" /> Mark as Taken
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => handleDownload(rx)}>
                        <Download className="w-3 h-3 mr-1" /> Download
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No prescriptions found</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PrescriptionsPage;
