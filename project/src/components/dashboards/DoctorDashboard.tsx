import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, AlertCircle, DollarSign, Calendar, Stethoscope, Video, Clock, Check, X, ChevronRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { mockAppointments, mockPrescriptions } from '@/data/mockData';

const todayStats = [
  { label: 'Consultations', value: '5', icon: Stethoscope, color: 'text-primary', bg: 'bg-primary/10' },
  { label: 'Prescriptions', value: '12', icon: FileText, color: 'text-info', bg: 'bg-info/10' },
  { label: 'Emergencies', value: '1', icon: AlertCircle, color: 'text-destructive', bg: 'bg-destructive/10' },
  { label: 'Revenue', value: '₹2,500', icon: DollarSign, color: 'text-success', bg: 'bg-success/10' },
];

const recentPatients = [
  { id: 'p1', name: 'Ramesh Kumar', issue: 'Chest pain', time: '10:30 AM', status: 'completed' },
  { id: 'p2', name: 'Sunita Devi', issue: 'Irregular heartbeat', time: '2:00 PM', status: 'pending' },
  { id: 'p3', name: 'Kiran Patel', issue: 'Routine checkup', time: '3:30 PM', status: 'pending' },
];

const DoctorDashboard: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'prescriptions'>('overview');

  const pendingAppointments = mockAppointments.filter(a => a.status === 'PENDING');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">Dr. Priya Sharma</h1>
          <p className="text-muted-foreground mt-1">Cardiologist · 12 years experience</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-card border border-border shadow-card">
            <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-success animate-pulse-soft' : 'bg-muted-foreground'}`} />
            <span className="text-sm font-medium">{isOnline ? 'Online' : 'Offline'}</span>
            <Switch checked={isOnline} onCheckedChange={setIsOnline} />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {todayStats.map((stat, i) => (
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

      {/* Tabs */}
      <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
        {(['overview', 'appointments', 'prescriptions'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all capitalize ${
              activeTab === tab ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Pending Appointments */}
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Pending Appointments
                {pendingAppointments.length > 0 && (
                  <Badge className="bg-destructive text-destructive-foreground ml-auto">{pendingAppointments.length}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{apt.patientName}</p>
                    <p className="text-xs text-muted-foreground">{apt.symptoms}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {new Date(apt.appointmentDate).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10">
                      <X className="w-4 h-4" />
                    </Button>
                    <Button size="sm" className="h-8 w-8 p-0 bg-success text-success-foreground hover:bg-success/90">
                      <Check className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {pendingAppointments.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No pending appointments</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Patients */}
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Today's Patients
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentPatients.map((patient) => (
                <div key={patient.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {patient.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{patient.name}</p>
                    <p className="text-xs text-muted-foreground">{patient.issue}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{patient.time}</p>
                    <Badge variant={patient.status === 'completed' ? 'default' : 'secondary'} className="mt-1 text-xs">
                      {patient.status}
                    </Badge>
                  </div>
                  {patient.status === 'pending' && (
                    <Button size="sm" variant="outline" className="h-8">
                      <Video className="w-3 h-3 mr-1" /> Call
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'appointments' && (
        <div className="space-y-3">
          {mockAppointments.map((apt) => (
            <Card key={apt.id} className="shadow-card">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-info" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{apt.patientName}</p>
                  <p className="text-sm text-muted-foreground">{apt.symptoms}</p>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(apt.appointmentDate).toLocaleString()} · {apt.consultationType}</p>
                </div>
                <Badge variant={apt.status === 'APPROVED' ? 'default' : apt.status === 'PENDING' ? 'secondary' : 'outline'}>
                  {apt.status}
                </Badge>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'prescriptions' && (
        <div className="space-y-3">
          {mockPrescriptions.map((rx) => (
            <Card key={rx.id} className="shadow-card">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-success" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{rx.patientName}</p>
                  <p className="text-sm text-muted-foreground">{rx.medicineName} · {rx.dosage}</p>
                  <p className="text-xs text-muted-foreground mt-1">{rx.duration} · {rx.instructions}</p>
                </div>
                <Badge variant={rx.status === 'ACTIVE' ? 'default' : 'secondary'}>
                  {rx.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
          <Button className="bg-gradient-primary text-primary-foreground shadow-primary hover:opacity-90">
            + Write New Prescription
          </Button>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
