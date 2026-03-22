import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, FileText, AlertTriangle, DollarSign, Plus, Download, RefreshCw, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { medicineAPI, prescriptionAPI } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const PharmacyDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, lowStock: 0, orders: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [medRes, rxRes] = await Promise.all([
        medicineAPI.getAll(),
        prescriptionAPI.getAll()
      ]);
      setMedicines(medRes.data || []);
      setPrescriptions(rxRes.data || []);
      
      const lowStock = medRes.data?.filter((m: any) => m.stockLevel < 20).length || 0;
      setStats({
        total: medRes.data?.length || 0,
        lowStock,
        orders: rxRes.data?.filter((r: any) => r.status === 'ACTIVE').length || 0,
        revenue: (rxRes.data?.filter((r: any) => r.status === 'COMPLETED').length || 0) * 150
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const rows = ['Medicine,Manufacturer,Price,Stock,Available'];
    medicines.forEach(m => rows.push(`${m.name},${m.manufacturer},${m.price},${m.stockLevel},${m.available}`));
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'inventory.csv'; a.click();
    URL.revokeObjectURL(url);
    toast.success('Inventory exported');
  };

  const handleRefresh = () => {
    setLoading(true);
    loadData();
    toast.success('Data refreshed');
  };

  const statsData = [
    { label: 'Total Medicines', value: stats.total.toString(), icon: Package, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Low Stock', value: stats.lowStock.toString(), icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10' },
    { label: "Today's Rx", value: stats.orders.toString(), icon: FileText, color: 'text-info', bg: 'bg-info/10' },
    { label: 'Revenue', value: `₹${stats.revenue}`, icon: DollarSign, color: 'text-success', bg: 'bg-success/10' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">Pharmacy Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage inventory and orders</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="gap-2">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            Auto-refresh: 3s
          </Badge>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-1" /> Export
          </Button>
          <Button size="sm" onClick={() => navigate('/pharmacy/inventory')} className="bg-gradient-primary text-primary-foreground shadow-primary hover:opacity-90">
            <Plus className="w-4 h-4 mr-1" /> Add Medicine
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsData.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="font-display text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="font-display text-lg">Recent Prescriptions</CardTitle>
            <Button size="sm" variant="ghost" onClick={() => navigate('/pharmacy/orders')}>View All</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <p className="text-sm text-muted-foreground text-center py-4">Loading...</p>
            ) : prescriptions.slice(0, 5).length > 0 ? (
              prescriptions.slice(0, 5).map((rx) => (
                <div key={rx.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer" onClick={() => navigate('/pharmacy/orders')}>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{rx.medicineName}</p>
                    <p className="text-xs text-muted-foreground">By {rx.doctorName} for {rx.patientName}</p>
                  </div>
                  <Badge variant={rx.status === 'ACTIVE' ? 'default' : 'secondary'}>{rx.status}</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No prescriptions</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="font-display text-lg">Inventory</CardTitle>
            <Button size="sm" variant="ghost" onClick={() => navigate('/pharmacy/inventory')}>Manage</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <p className="text-sm text-muted-foreground text-center py-4">Loading...</p>
            ) : medicines.slice(0, 5).length > 0 ? (
              medicines.slice(0, 5).map((med) => (
                <div key={med.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer" onClick={() => navigate('/pharmacy/inventory')}>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{med.name} {med.dosageStrength}</p>
                    <p className="text-xs text-muted-foreground">{med.manufacturer} · {med.dosageForm}</p>
                  </div>
                  <span className="text-sm font-semibold">₹{med.price}</span>
                  <Badge variant={med.available ? 'default' : 'secondary'}>
                    {med.available ? 'In Stock' : 'Out'}
                  </Badge>
                  {med.stockLevel < 20 && (
                    <AlertTriangle className="w-4 h-4 text-warning" />
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No medicines</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PharmacyDashboard;
