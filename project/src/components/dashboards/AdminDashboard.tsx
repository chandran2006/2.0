import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Stethoscope, FileText, Activity, Server, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { adminAPI, appointmentAPI, prescriptionAPI } from '@/services/api';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ 
    totalUsers: 0, 
    patients: 0,
    doctors: 0,
    pharmacies: 0,
    consultations: 0, 
    prescriptions: 0, 
    uptime: '99.9%' 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [usersRes, aptsRes, rxRes] = await Promise.all([
        adminAPI.getAllUsers(),
        appointmentAPI.getDoctors(),
        prescriptionAPI.getPatientPrescriptions(1)
      ]);
      
      const users = usersRes.data || [];
      setStats({
        totalUsers: users.length,
        patients: users.filter((u: any) => u.role === 'PATIENT').length,
        doctors: users.filter((u: any) => u.role === 'DOCTOR').length,
        pharmacies: users.filter((u: any) => u.role === 'PHARMACY').length,
        consultations: 0,
        prescriptions: rxRes.data?.length || 0,
        uptime: '99.9%'
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const systemStats = [
    { label: 'Total Users', value: stats.totalUsers.toString(), icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Consultations', value: stats.consultations.toString(), icon: Stethoscope, color: 'text-info', bg: 'bg-info/10' },
    { label: 'Prescriptions', value: stats.prescriptions.toString(), icon: FileText, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Uptime', value: stats.uptime, icon: Activity, color: 'text-warning', bg: 'bg-warning/10' },
  ];

  const userBreakdown = [
    { role: 'Patients', count: stats.patients, color: 'bg-primary' },
    { role: 'Doctors', count: stats.doctors, color: 'bg-info' },
    { role: 'Pharmacies', count: stats.pharmacies, color: 'bg-success' },
    { role: 'Admins', count: stats.totalUsers - stats.patients - stats.doctors - stats.pharmacies, color: 'bg-accent' },
  ];

  const systemHealth = [
    { service: 'API Server', status: 'healthy', uptime: '99.99%' },
    { service: 'Database', status: 'healthy', uptime: '99.95%' },
    { service: 'WebSocket', status: 'healthy', uptime: '99.90%' },
    { service: 'File Storage', status: 'healthy', uptime: '98.50%' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">System overview and management</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="gap-2">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            Auto-refresh: 3s
          </Badge>
          <Button size="sm" variant="outline" onClick={() => navigate('/admin/analytics')}>
            <TrendingUp className="w-4 h-4 mr-1" /> Analytics
          </Button>
          <Button size="sm" onClick={() => navigate('/admin/users')} className="bg-gradient-primary">
            <Users className="w-4 h-4 mr-1" /> Manage Users
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {systemStats.map((stat, i) => (
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
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" /> User Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {userBreakdown.map((item) => (
              <div key={item.role} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                <span className="text-sm font-medium flex-1">{item.role}</span>
                <span className="text-sm font-bold">{item.count}</span>
                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${stats.totalUsers > 0 ? (item.count / stats.totalUsers) * 100 : 0}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Server className="w-5 h-5 text-primary" /> System Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {systemHealth.map((service) => (
              <div key={service.service} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className={`w-2.5 h-2.5 rounded-full ${service.status === 'healthy' ? 'bg-success animate-pulse-soft' : 'bg-warning'}`} />
                <span className="text-sm font-medium flex-1">{service.service}</span>
                <Badge variant={service.status === 'healthy' ? 'default' : 'secondary'}>
                  {service.status}
                </Badge>
                <span className="text-xs text-muted-foreground">{service.uptime}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="font-display text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button variant="outline" onClick={() => navigate('/admin/users')} className="h-20 flex-col gap-2">
            <Users className="w-6 h-6" />
            <span className="text-sm">Manage Users</span>
          </Button>
          <Button variant="outline" onClick={() => navigate('/admin/analytics')} className="h-20 flex-col gap-2">
            <TrendingUp className="w-6 h-6" />
            <span className="text-sm">View Analytics</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2">
            <Server className="w-6 h-6" />
            <span className="text-sm">System Logs</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2">
            <Activity className="w-6 h-6" />
            <span className="text-sm">Monitor</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
