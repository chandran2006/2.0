import React, { useState, useEffect } from 'react';
import { FileText, Search, Clock, CheckCircle, Package, TrendingUp, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { prescriptionAPI } from '@/services/api';
import { toast } from 'sonner';
import DashboardLayout from '@/components/shared/DashboardLayout';

const OrdersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 15000);
    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    try {
      const res = await prescriptionAPI.getAll();
      setPrescriptions(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleFulfill = async (id: number) => {
    try {
      await prescriptionAPI.updateStatus(id, 'COMPLETED');
      toast.success('Order fulfilled successfully');
      loadOrders();
    } catch { toast.error('Failed to fulfill order'); }
  };

  const handleCancel = async (id: number) => {
    if (!confirm('Cancel this order?')) return;
    try {
      await prescriptionAPI.updateStatus(id, 'CANCELLED');
      toast.success('Order cancelled');
      loadOrders();
    } catch { toast.error('Failed to cancel order'); }
  };

  const filtered = prescriptions.filter(p =>
    (p.patientName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.medicineName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: prescriptions.length,
    pending: prescriptions.filter(p => p.status === 'ACTIVE').length,
    completed: prescriptions.filter(p => p.status === 'COMPLETED').length,
    cancelled: prescriptions.filter(p => p.status === 'CANCELLED').length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-display text-2xl font-bold">Orders</h1>
            <p className="text-muted-foreground mt-1">Manage prescription orders and fulfillment</p>
          </div>
          <Button variant="outline" size="sm" onClick={loadOrders} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Orders', value: stats.total, Icon: Package, color: 'text-primary', bg: 'bg-primary/10' },
            { label: 'Pending', value: stats.pending, Icon: Clock, color: 'text-warning', bg: 'bg-warning/10' },
            { label: 'Completed', value: stats.completed, Icon: CheckCircle, color: 'text-success', bg: 'bg-success/10' },
            { label: 'Cancelled', value: stats.cancelled, Icon: TrendingUp, color: 'text-destructive', bg: 'bg-destructive/10' },
          ].map(({ label, value, Icon, color, bg }) => (
            <Card key={label} className="shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div><p className="text-2xl font-bold">{value}</p><p className="text-xs text-muted-foreground">{label}</p></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by patient or medicine..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground py-8">Loading orders...</p>
        ) : (
          <div className="space-y-3">
            {filtered.map((order) => (
              <Card key={order.id} className="shadow-card hover:shadow-card-hover transition-shadow">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-info" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{order.patientName || `Patient #${order.patientId}`}</p>
                    <p className="text-sm text-muted-foreground">{order.medicineName} · {order.dosage} · {order.duration}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                      {order.doctorName && ` · Dr. ${order.doctorName}`}
                    </p>
                    {order.instructions && <p className="text-xs text-muted-foreground italic mt-1">{order.instructions}</p>}
                  </div>
                  <Badge variant={
                    order.status === 'COMPLETED' ? 'default' :
                    order.status === 'ACTIVE' ? 'secondary' : 'outline'
                  }>
                    {order.status === 'ACTIVE' ? 'PENDING' : order.status}
                  </Badge>
                  {order.status === 'ACTIVE' && (
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-gradient-primary" onClick={() => handleFulfill(order.id)}>
                        <CheckCircle className="w-3 h-3 mr-1" /> Fulfill
                      </Button>
                      <Button size="sm" variant="outline" className="text-destructive" onClick={() => handleCancel(order.id)}>
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No orders found</p>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default OrdersPage;
