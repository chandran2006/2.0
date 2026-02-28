import React, { useState } from 'react';
import { Users, Video, FileText, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const PatientsPage: React.FC = () => {
  const patients = [
    { id: 1, name: 'Ramesh Kumar', lastVisit: '2024-01-15', condition: 'Hypertension', status: 'stable' },
    { id: 2, name: 'Sunita Devi', lastVisit: '2024-01-14', condition: 'Diabetes', status: 'monitoring' },
    { id: 3, name: 'Kiran Patel', lastVisit: '2024-01-13', condition: 'Asthma', status: 'stable' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">My Patients</h1>

      <div className="space-y-3">
        {patients.map((patient) => (
          <Card key={patient.id} className="shadow-card">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {patient.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="font-medium">{patient.name}</p>
                <p className="text-sm text-muted-foreground">{patient.condition}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  <Clock className="w-3 h-3 inline mr-1" />
                  Last visit: {new Date(patient.lastVisit).toLocaleDateString()}
                </p>
              </div>
              <Badge variant={patient.status === 'stable' ? 'default' : 'secondary'}>
                {patient.status}
              </Badge>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <FileText className="w-3 h-3 mr-1" /> Records
                </Button>
                <Button size="sm" className="bg-gradient-primary">
                  <Video className="w-3 h-3 mr-1" /> Consult
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PatientsPage;
