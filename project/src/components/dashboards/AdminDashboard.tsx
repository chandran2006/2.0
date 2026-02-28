import React from 'react';
import { motion } from 'framer-motion';
import { Users, Stethoscope, FileText, Activity, Server, Database, Shield, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const systemStats = [
  { label: 'Total Users', value: '1,250', icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
  { label: 'Consultations', value: '3,421', icon: Stethoscope, color: 'text-info', bg: 'bg-info/10' },
  { label: 'Prescriptions', value: '8,921', icon: FileText, color: 'text-success', bg: 'bg-success/10' },
  { label: 'Uptime', value: '99.9%', icon: Activity, color: 'text-warning', bg: 'bg-warning/10' },
];

const userBreakdown = [
  { role: 'Patients', count: 650, color: 'bg-primary' },
  { role: 'Doctors', count: 120, color: 'bg-info' },
  { role: 'Pharmacies', count: 45, color: 'bg-success' },
  { role: 'Admins', count: 5, color: 'bg-accent' },
];

const systemHealth = [
  { service: 'API Server', status: 'healthy', uptime: '99.99%' },
  { service: 'Database', status: 'healthy', uptime: '99.95%' },
  { service: 'WebSocket', status: 'healthy', uptime: '99.90%' },
  { service: 'File Storage', status: 'warning', uptime: '98.50%' },
];

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">System overview and management</p>
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
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${(item.count / 650) * 100}%` }} />
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
                <div className={`w-2.5 h-2.5 rounded-full ${service.status === 'healthy' ? 'bg-success' : 'bg-warning'}`} />
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
    </div>
  );
};

export default AdminDashboard;
