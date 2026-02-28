import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Activity, Thermometer, Weight, Clock, Calendar, Pill, Video, MapPin, FileText, Stethoscope, ChevronRight, Star, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockDoctors, mockAppointments, mockPrescriptions, mockReminders } from '@/data/mockData';

const healthMetrics = [
  { label: 'Heart Rate', value: '72', unit: 'bpm', icon: Heart, trend: 'stable' as const, color: 'text-destructive' },
  { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', icon: Activity, trend: 'stable' as const, color: 'text-info' },
  { label: 'Temperature', value: '98.6', unit: '°F', icon: Thermometer, trend: 'stable' as const, color: 'text-warning' },
  { label: 'Weight', value: '70', unit: 'kg', icon: Weight, trend: 'down' as const, color: 'text-success' },
];

const quickActions = [
  { label: 'Book Appointment', icon: Calendar, color: 'bg-primary' },
  { label: 'Video Consultation', icon: Video, color: 'bg-info' },
  { label: 'My Prescriptions', icon: FileText, color: 'bg-success' },
  { label: 'Find Pharmacy', icon: MapPin, color: 'bg-accent' },
];

const PatientDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'prescriptions' | 'doctors'>('overview');
  const onlineDoctors = mockDoctors.filter(d => d.isOnline);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold">Good Morning, Ramesh 👋</h1>
        <p className="text-muted-foreground mt-1">Here's your health overview for today</p>
      </div>

      {/* Health Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {healthMetrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="shadow-card hover:shadow-card-hover transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <metric.icon className={`w-5 h-5 ${metric.color}`} />
                  <span className="text-xs text-muted-foreground capitalize">{metric.trend}</span>
                </div>
                <p className="font-display text-2xl font-bold">{metric.value}</p>
                <p className="text-xs text-muted-foreground">{metric.label} · {metric.unit}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickActions.map((action) => (
          <button
            key={action.label}
            className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border shadow-card hover:shadow-card-hover transition-all group"
          >
            <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center`}>
              <action.icon className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
        {(['overview', 'appointments', 'prescriptions', 'doctors'] as const).map((tab) => (
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

      {/* Tab content */}
      {activeTab === 'overview' && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Today's Reminders */}
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Today's Reminders
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockReminders.map((r) => (
                <div key={r.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    r.type === 'medicine' ? 'bg-success/10 text-success' :
                    r.type === 'appointment' ? 'bg-info/10 text-info' : 'bg-warning/10 text-warning'
                  }`}>
                    {r.type === 'medicine' ? <Pill className="w-4 h-4" /> :
                     r.type === 'appointment' ? <Calendar className="w-4 h-4" /> :
                     <Stethoscope className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{r.title}</p>
                    <p className="text-xs text-muted-foreground">{r.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{r.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Online Doctors */}
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Video className="w-5 h-5 text-primary" />
                Available Doctors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {onlineDoctors.map((doc) => (
                <div key={doc.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-10 h-10 rounded-full bg-info flex items-center justify-center text-info-foreground font-bold text-sm">
                    {doc.name.split(' ').pop()?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{doc.specialization}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-warning fill-warning" />
                    <span className="text-xs font-medium">{doc.rating}</span>
                  </div>
                  <Button size="sm" variant="outline" className="h-8">
                    <Phone className="w-3 h-3 mr-1" /> Consult
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'appointments' && (
        <div className="space-y-3">
          {mockAppointments.filter(a => a.patientId === 'p1').map((apt) => (
            <Card key={apt.id} className="shadow-card">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-info" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{apt.doctorName}</p>
                  <p className="text-sm text-muted-foreground">{apt.doctorSpecialization} · {new Date(apt.appointmentDate).toLocaleDateString()}</p>
                </div>
                <Badge variant={apt.status === 'APPROVED' ? 'default' : 'secondary'}>
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
                  <Pill className="w-6 h-6 text-success" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{rx.medicineName}</p>
                  <p className="text-sm text-muted-foreground">{rx.dosage} · {rx.duration}</p>
                  <p className="text-xs text-muted-foreground mt-1">By {rx.doctorName}</p>
                </div>
                <Badge variant={rx.status === 'ACTIVE' ? 'default' : 'secondary'}>
                  {rx.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'doctors' && (
        <div className="grid md:grid-cols-2 gap-4">
          {mockDoctors.map((doc) => (
            <Card key={doc.id} className="shadow-card">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-info flex items-center justify-center text-info-foreground font-bold text-lg">
                  {doc.name.split(' ').pop()?.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-sm text-muted-foreground">{doc.specialization} · {doc.experience} yrs</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-warning fill-warning" />
                      <span className="text-xs font-medium">{doc.rating}</span>
                    </div>
                    <span className={`inline-flex items-center gap-1 text-xs ${doc.isOnline ? 'text-success' : 'text-muted-foreground'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${doc.isOnline ? 'bg-success animate-pulse-soft' : 'bg-muted-foreground'}`} />
                      {doc.isOnline ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">₹{doc.consultationFee}</p>
                  <Button size="sm" className="mt-2 bg-gradient-primary text-primary-foreground shadow-primary hover:opacity-90 h-8 text-xs">
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
