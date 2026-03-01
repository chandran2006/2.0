import React, { useState } from 'react';
import { FileText, Search, CheckCircle, Clock, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import DashboardLayout from '@/components/shared/DashboardLayout';

const PrescriptionsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const prescriptions = [
    { id: 1, patientName: 'Ramesh Kumar', doctorName: 'Dr. Sharma', medicine: 'Aspirin 500mg', quantity: 30, status: 'PENDING', date: '2024-01-15' },
    { id: 2, patientName: 'Sunita Devi', doctorName: 'Dr. Kumar', medicine: 'Metformin 1000mg', quantity: 60, status: 'FULFILLED', date: '2024-01-14' },
    { id: 3, patientName: 'Kiran Patel', doctorName: 'Dr. Sharma', medicine: 'Amoxicillin 250mg', quantity: 21, status: 'PROCESSING', date: '2024-01-15' },
    { id: 4, patientName: 'Priya Sharma', doctorName: 'Dr. Patel', medicine: 'Paracetamol 650mg', quantity: 20, status: 'PENDING', date: '2024-01-15' },
  ];

  const filteredPrescriptions = prescriptions.filter(p =>
    p.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.medicine.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Prescriptions</h1>
          <p className="text-muted-foreground mt-1">Manage and fulfill prescription orders</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by patient or medicine..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="space-y-3">
          {filteredPrescriptions.map((prescription) => (
            <Card key={prescription.id} className="shadow-card hover:shadow-card-hover transition-shadow">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-info" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{prescription.patientName}</p>
                  <p className="text-sm text-muted-foreground">{prescription.medicine} × {prescription.quantity}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <User className="w-3 h-3 inline mr-1" />
                    Prescribed by {prescription.doctorName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {new Date(prescription.date).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant={
                  prescription.status === 'FULFILLED' ? 'default' :
                  prescription.status === 'PROCESSING' ? 'secondary' : 'outline'
                }>
                  {prescription.status}
                </Badge>
                {prescription.status === 'PENDING' && (
                  <Button size="sm" className="bg-gradient-primary">
                    <CheckCircle className="w-3 h-3 mr-1" /> Process
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPrescriptions.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No prescriptions found</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PrescriptionsPage;
