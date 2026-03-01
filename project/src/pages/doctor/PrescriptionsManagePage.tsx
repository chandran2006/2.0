import React, { useState } from 'react';
import { FileText, Plus, Pill, Search, Calendar, User, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import DashboardLayout from '@/components/shared/DashboardLayout';

const PrescriptionsManagePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [prescriptions, setPrescriptions] = useState([
    { id: 1, patientName: 'Ramesh Kumar', medicine: 'Aspirin', dosage: '500mg', frequency: 'Twice daily', duration: '7 days', status: 'ACTIVE', date: '2024-01-15', instructions: 'Take after meals' },
    { id: 2, patientName: 'Sunita Devi', medicine: 'Metformin', dosage: '1000mg', frequency: 'Once daily', duration: '30 days', status: 'ACTIVE', date: '2024-01-14', instructions: 'Take with breakfast' },
    { id: 3, patientName: 'Kiran Patel', medicine: 'Salbutamol Inhaler', dosage: '100mcg', frequency: 'As needed', duration: '90 days', status: 'ACTIVE', date: '2024-01-13', instructions: 'Use when breathing difficulty occurs' },
    { id: 4, patientName: 'Priya Sharma', medicine: 'Sumatriptan', dosage: '50mg', frequency: 'As needed', duration: '30 days', status: 'COMPLETED', date: '2024-01-10', instructions: 'Take at onset of migraine' },
  ]);

  const filteredPrescriptions = prescriptions.filter(p =>
    p.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.medicine.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-display text-2xl font-bold">Prescriptions</h1>
            <p className="text-muted-foreground mt-1">Create and manage patient prescriptions</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary">
                <Plus className="w-4 h-4 mr-1" /> New Prescription
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Prescription</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Patient Name" />
                  <Input placeholder="Medicine Name" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <Input placeholder="Dosage (e.g., 500mg)" />
                  <Input placeholder="Frequency" />
                  <Input placeholder="Duration" />
                </div>
                <Textarea placeholder="Instructions for patient" rows={4} />
                <Button className="w-full bg-gradient-primary">Create Prescription</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by patient name or medicine..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid gap-4">
          {filteredPrescriptions.map((rx) => (
            <Card key={rx.id} className="shadow-card hover:shadow-card-hover transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                    <Pill className="w-6 h-6 text-success" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-lg">{rx.patientName}</p>
                        <p className="text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          {new Date(rx.date).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={rx.status === 'ACTIVE' ? 'default' : 'secondary'}>
                        {rx.status}
                      </Badge>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3 mb-3">
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">Medicine</p>
                        <p className="font-medium">{rx.medicine}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">Dosage</p>
                        <p className="font-medium">{rx.dosage}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">Frequency</p>
                        <p className="font-medium">{rx.frequency}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">Duration</p>
                        <p className="font-medium">{rx.duration}</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-info/5 border border-info/20 mb-3">
                      <p className="text-xs text-muted-foreground mb-1">Instructions</p>
                      <p className="text-sm">{rx.instructions}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <FileText className="w-3 h-3 mr-1" /> View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-3 h-3 mr-1" /> Download
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPrescriptions.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No prescriptions found</p>
        )}

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Prescription Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">{prescriptions.length}</p>
                <p className="text-xs text-muted-foreground">Total Prescriptions</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">{prescriptions.filter(p => p.status === 'ACTIVE').length}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">{prescriptions.filter(p => p.status === 'COMPLETED').length}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">{new Set(prescriptions.map(p => p.patientName)).size}</p>
                <p className="text-xs text-muted-foreground">Unique Patients</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PrescriptionsManagePage;
