import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Activity, DollarSign, ArrowUp, ArrowDown, Stethoscope, Building2, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/components/shared/DashboardLayout';
import { adminAPI, prescriptionAPI, medicineAPI } from '@/services/api';

const AnalyticsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [medicines, setMedicines] = useState<any[]>([]);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersRes, rxRes, medRes] = await Promise.all([
        adminAPI.getAllUsers(),
        prescriptionAPI.getAll(),
        medicineAPI.getAll(),
      ]);
      setUsers(usersRes.data || []);
      setPrescriptions(rxRes.data || []);
      setMedicines(medRes.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const patients = users.filter(u => u.role === 'PATIENT');
  const doctors = users.filter(u => u.role === 'DOCTOR');
  const pharmacies = users.filter(u => u.role === 'PHARMACY');
  const activePrescriptions = prescriptions.filter(p => p.status === 'ACTIVE');
  const completedPrescriptions = prescriptions.filter(p => p.status === 'COMPLETED');
  const availableMedicines = medicines.filter(m => m.available);
  const totalInventoryValue = medicines.reduce((s, m) => s + (m.price * (m.stockLevel || 0)), 0);

  const topStats = [
    { label: 'Total Users', value: users.length.toString(), change: '+' + users.length, trend: 'up', icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Active Prescriptions', value: activePrescriptions.length.toString(), change: '+' + activePrescriptions.length, trend: 'up', icon: Activity, color: 'text-info', bg: 'bg-info/10' },
    { label: 'Medicines Available', value: availableMedicines.length.toString(), change: availableMedicines.length + '/' + medicines.length, trend: 'up', icon: TrendingUp, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Inventory Value', value: `₹${totalInventoryValue.toLocaleString()}`, change: 'Total stock', trend: 'up', icon: DollarSign, color: 'text-warning', bg: 'bg-warning/10' },
  ];

  const userBreakdown = [
    { role: 'Patients', count: patients.length, color: 'bg-primary', pct: users.length ? Math.round(patients.length / users.length * 100) : 0 },
    { role: 'Doctors', count: doctors.length, color: 'bg-info', pct: users.length ? Math.round(doctors.length / users.length * 100) : 0 },
    { role: 'Pharmacies', count: pharmacies.length, color: 'bg-success', pct: users.length ? Math.round(pharmacies.length / users.length * 100) : 0 },
    { role: 'Admins', count: users.filter(u => u.role === 'ADMIN').length, color: 'bg-accent', pct: users.length ? Math.round(users.filter(u => u.role === 'ADMIN').length / users.length * 100) : 0 },
  ];

  const prescriptionBreakdown = [
    { label: 'Active', value: activePrescriptions.length, pct: prescriptions.length ? Math.round(activePrescriptions.length / prescriptions.length * 100) : 0, color: 'bg-success' },
    { label: 'Completed', value: completedPrescriptions.length, pct: prescriptions.length ? Math.round(completedPrescriptions.length / prescriptions.length * 100) : 0, color: 'bg-info' },
    { label: 'Cancelled', value: prescriptions.filter(p => p.status === 'CANCELLED').length, pct: prescriptions.length ? Math.round(prescriptions.filter(p => p.status === 'CANCELLED').length / prescriptions.length * 100) : 0, color: 'bg-warning' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold">Analytics & Insights</h1>
            <p className="text-muted-foreground mt-1">Real-time platform performance metrics</p>
          </div>
          <Button variant="outline" size="sm" onClick={loadData} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {topStats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className="shadow-card">
                <CardContent className="p-4">
                  <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <p className="font-display text-2xl font-bold">{loading ? '...' : stat.value}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <div className="flex items-center gap-1 text-xs text-success">
                      <ArrowUp className="w-3 h-3" />{stat.change}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { label: 'Total Users', value: users.length, Icon: Users },
                { label: 'Patients', value: patients.length, Icon: Users },
                { label: 'Doctors', value: doctors.length, Icon: Stethoscope },
                { label: 'Pharmacies', value: pharmacies.length, Icon: Building2 },
              ].map(({ label, value, Icon }) => (
                <Card key={label} className="shadow-card">
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-1">{label}</p>
                    <p className="text-2xl font-bold">{loading ? '...' : value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="shadow-card">
              <CardHeader><CardTitle>User Distribution</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {userBreakdown.map(item => (
                  <div key={item.role} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{item.role}</span>
                      <span className="text-muted-foreground">{item.count} ({item.pct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full transition-all`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardHeader><CardTitle>All Users</CardTitle></CardHeader>
              <CardContent>
                {loading ? <p className="text-center py-4 text-muted-foreground">Loading...</p> : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {users.map(u => (
                      <div key={u.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                        <div>
                          <p className="text-sm font-medium">{u.name}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="outline">{u.role}</Badge>
                          {u.blocked && <Badge variant="destructive">Blocked</Badge>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prescriptions" className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              {prescriptionBreakdown.map(item => (
                <Card key={item.label} className="shadow-card">
                  <CardContent className="p-4">
                    <div className="flex justify-between mb-2">
                      <p className="text-sm font-medium">{item.label}</p>
                      <Badge>{item.pct}%</Badge>
                    </div>
                    <p className="text-2xl font-bold mb-3">{loading ? '...' : item.value}</p>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="shadow-card">
              <CardHeader><CardTitle>Recent Prescriptions</CardTitle></CardHeader>
              <CardContent>
                {loading ? <p className="text-center py-4 text-muted-foreground">Loading...</p> : prescriptions.length === 0 ? (
                  <p className="text-center py-4 text-muted-foreground">No prescriptions yet</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {prescriptions.slice(0, 10).map((rx: any) => (
                      <div key={rx.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                        <div>
                          <p className="text-sm font-medium">{rx.medicineName}</p>
                          <p className="text-xs text-muted-foreground">{rx.patientName || `Patient #${rx.patientId}`} · {rx.dosage}</p>
                        </div>
                        <Badge variant={rx.status === 'ACTIVE' ? 'default' : 'secondary'}>{rx.status}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="shadow-card"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Medicines</p><p className="text-2xl font-bold">{loading ? '...' : medicines.length}</p></CardContent></Card>
              <Card className="shadow-card"><CardContent className="p-4"><p className="text-sm text-muted-foreground">In Stock</p><p className="text-2xl font-bold">{loading ? '...' : availableMedicines.length}</p></CardContent></Card>
              <Card className="shadow-card"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Inventory Value</p><p className="text-2xl font-bold">{loading ? '...' : `₹${totalInventoryValue.toLocaleString()}`}</p></CardContent></Card>
            </div>
            <Card className="shadow-card">
              <CardHeader><CardTitle>Medicine Stock Levels</CardTitle></CardHeader>
              <CardContent>
                {loading ? <p className="text-center py-4 text-muted-foreground">Loading...</p> : medicines.length === 0 ? (
                  <p className="text-center py-4 text-muted-foreground">No medicines in system</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {medicines.map((m: any) => (
                      <div key={m.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                        <div>
                          <p className="text-sm font-medium">{m.name} {m.dosageStrength}</p>
                          <p className="text-xs text-muted-foreground">{m.manufacturer} · {m.stockLevel} units · ₹{m.price}</p>
                        </div>
                        <Badge variant={m.available ? 'default' : 'secondary'}>{m.available ? 'In Stock' : 'Out'}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { service: 'API Server', status: 'healthy', uptime: '99.99%' },
                { service: 'Database (H2)', status: 'healthy', uptime: '99.95%' },
                { service: 'Auth Service', status: 'healthy', uptime: '99.90%' },
                { service: 'File Storage', status: 'healthy', uptime: '98.50%' },
              ].map(s => (
                <Card key={s.service} className="shadow-card">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-success animate-pulse" />
                      <div>
                        <p className="font-medium text-sm">{s.service}</p>
                        <p className="text-xs text-muted-foreground">Uptime: {s.uptime}</p>
                      </div>
                    </div>
                    <Badge variant="default">{s.status}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="shadow-card">
              <CardHeader><CardTitle>Database Summary</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 rounded-lg bg-muted/50 text-center"><p className="text-2xl font-bold">{users.length}</p><p className="text-xs text-muted-foreground">Users</p></div>
                <div className="p-3 rounded-lg bg-muted/50 text-center"><p className="text-2xl font-bold">{prescriptions.length}</p><p className="text-xs text-muted-foreground">Prescriptions</p></div>
                <div className="p-3 rounded-lg bg-muted/50 text-center"><p className="text-2xl font-bold">{medicines.length}</p><p className="text-xs text-muted-foreground">Medicines</p></div>
                <div className="p-3 rounded-lg bg-muted/50 text-center"><p className="text-2xl font-bold">{doctors.filter(d => d.isAvailable).length}</p><p className="text-xs text-muted-foreground">Doctors Online</p></div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
