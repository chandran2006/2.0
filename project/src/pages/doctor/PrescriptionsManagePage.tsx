import React, { useState } from 'react';
import { FileText, Plus, Pill } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const PrescriptionsManagePage: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState([
    { id: 1, patientName: 'Ramesh Kumar', medicine: 'Aspirin', dosage: '500mg', duration: '7 days', status: 'ACTIVE' },
    { id: 2, patientName: 'Sunita Devi', medicine: 'Metformin', dosage: '1000mg', duration: '30 days', status: 'ACTIVE' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-display text-2xl font-bold">Prescriptions</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary">
              <Plus className="w-4 h-4 mr-1" /> New Prescription
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Prescription</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Patient Name" />
              <Input placeholder="Medicine Name" />
              <Input placeholder="Dosage (e.g., 500mg)" />
              <Input placeholder="Duration (e.g., 7 days)" />
              <Textarea placeholder="Instructions" />
              <Button className="w-full bg-gradient-primary">Create Prescription</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {prescriptions.map((rx) => (
          <Card key={rx.id} className="shadow-card">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Pill className="w-6 h-6 text-success" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{rx.patientName}</p>
                <p className="text-sm text-muted-foreground">{rx.medicine} · {rx.dosage}</p>
                <p className="text-xs text-muted-foreground mt-1">{rx.duration}</p>
              </div>
              <Badge variant={rx.status === 'ACTIVE' ? 'default' : 'secondary'}>
                {rx.status}
              </Badge>
              <Button size="sm" variant="outline">View</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PrescriptionsManagePage;
