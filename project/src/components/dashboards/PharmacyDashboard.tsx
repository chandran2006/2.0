import React from 'react';
import { motion } from 'framer-motion';
import { Package, FileText, AlertTriangle, DollarSign, Plus, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockMedicines, mockPrescriptions } from '@/data/mockData';

const stats = [
  { label: 'Total Medicines', value: '1,250', icon: Package, color: 'text-primary', bg: 'bg-primary/10' },
  { label: 'Low Stock', value: '28', icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10' },
  { label: "Today's Rx", value: '7', icon: FileText, color: 'text-info', bg: 'bg-info/10' },
  { label: 'Revenue', value: '₹18,000', icon: DollarSign, color: 'text-success', bg: 'bg-success/10' },
];

const PharmacyDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">MedPlus Healthcare</h1>
          <p className="text-muted-foreground mt-1">Pharmacy Dashboard</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><RefreshCw className="w-4 h-4 mr-1" /> Refresh</Button>
          <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-1" /> Export</Button>
          <Button size="sm" className="bg-gradient-primary text-primary-foreground shadow-primary hover:opacity-90">
            <Plus className="w-4 h-4 mr-1" /> Add Medicine
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
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
            <CardTitle className="font-display text-lg">Recent Prescriptions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockPrescriptions.map((rx) => (
              <div key={rx.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="flex-1">
                  <p className="text-sm font-medium">{rx.medicineName}</p>
                  <p className="text-xs text-muted-foreground">By {rx.doctorName} for {rx.patientName}</p>
                </div>
                <Badge>{rx.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-lg">Inventory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockMedicines.map((med) => (
              <div key={med.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="flex-1">
                  <p className="text-sm font-medium">{med.name} {med.dosageStrength}</p>
                  <p className="text-xs text-muted-foreground">{med.manufacturer} · {med.dosageForm}</p>
                </div>
                <span className="text-sm font-semibold">₹{med.price}</span>
                <Badge variant={med.available ? 'default' : 'secondary'}>
                  {med.available ? 'In Stock' : 'Out'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PharmacyDashboard;
