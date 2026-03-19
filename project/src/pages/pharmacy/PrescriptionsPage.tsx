import React, { useState, useEffect } from 'react';
import { FileText, Search, CheckCircle, Clock, User, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { prescriptionAPI } from '@/services/api';
import { toast } from 'sonner';
import DashboardLayout from '@/components/shared/DashboardLayout';

const PrescriptionsPage: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrescriptions();
    const interval = setInterval(loadPrescriptions, 15000);
    return () => clearInterval(interval);
  }, []);

  const loadPrescriptions = async () => {
    try {
      const res = await prescriptionAPI.getAll();
      setPrescriptions(res.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleFulfill = async (id: number) => {
    try {
      await prescriptionAPI.updateStatus(id, 'COMPLETED');
      toast.success('Prescription fulfilled');
      loadPrescriptions();
    } catch { toast.error('Failed to fulfill prescription'); }
  };

  const handleCancel = async (id: number) => {
    if (!confirm('Cancel this prescription?')) return;
    try {
      await prescriptionAPI.updateStatus(id, 'CANCELLED');
      toast.success('Prescription cancelled');
      loadPrescriptions();
    } catch { toast.error('Failed to cancel'); }
  };

  const filtered = prescriptions.filter(p =>
    (p.medicineName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.patientName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: prescriptions.length,
    active: prescriptions.filter(p => p.status === 'ACTIVE').length,
    completed: prescriptions.filter(p => p.status === 'COMPLETED').length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-display text-2xl font-bold">Prescriptions</h1>
            <p className="text-muted-foreground mt-1">Manage and fulfill prescription orders</p>
          </div>
          <Button variant="outline" size="sm" onClick={loadPrescriptions} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card className="shadow-card"><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{stats.total}</p><p className="text-xs text-muted-foreground">Total</p></CardContent></Card>
          <Card className="shadow-card"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-warning">{stats.active}</p><p className="text-xs text-muted-foreground">Pending</p></CardContent></Card>
          <Card className="shadow-card"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-success">{stats.completed}</p><p className="text-xs text-muted-foreground">Fulfilled</p></CardContent></Card>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by patient or medicine..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground py-8">Loading...</p>
        ) : (
          <div className="space-y-3">
            {filtered.map((rx) => (
              <Card key={rx.id} className="shadow-card hover:shadow-card-hover transition-shadow">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-info" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{rx.patientName || `Patient #${rx.patientId}`}</p>
                    <p className="text-sm text-muted-foreground">{rx.medicineName} · {rx.dosage} · {rx.duration}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      <User className="w-3 h-3 inline mr-1" />
                      Dr. {rx.doctorName || `#${rx.doctorId}`}
                      <Clock className="w-3 h-3 inline ml-2 mr-1" />
                      {rx.createdAt ? new Date(rx.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                    {rx.instructions && <p className="text-xs text-muted-foreground italic">{rx.instructions}</p>}
                  </div>
                  <Badge variant={rx.status === 'COMPLETED' ? 'default' : rx.status === 'ACTIVE' ? 'secondary' : 'outline'}>
                    {rx.status === 'ACTIVE' ? 'PENDING' : rx.status}
                  </Badge>
                  {rx.status === 'ACTIVE' && (
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-gradient-primary" onClick={() => handleFulfill(rx.id)}>
                        <CheckCircle className="w-3 h-3 mr-1" /> Fulfill
                      </Button>
                      <Button size="sm" variant="outline" className="text-destructive" onClick={() => handleCancel(rx.id)}>
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No prescriptions found</p>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PrescriptionsPage;
