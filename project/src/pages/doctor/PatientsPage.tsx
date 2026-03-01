import React, { useState } from 'react';
import { Users, Video, FileText, Clock, Phone, Activity, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import DashboardLayout from '@/components/shared/DashboardLayout';

const PatientsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const patients = [
    { id: 1, name: 'Ramesh Kumar', age: 45, gender: 'Male', phone: '+91 9876543210', lastVisit: '2024-01-15', condition: 'Hypertension', status: 'stable', appointments: 12 },
    { id: 2, name: 'Sunita Devi', age: 38, gender: 'Female', phone: '+91 9876543211', lastVisit: '2024-01-14', condition: 'Diabetes Type 2', status: 'monitoring', appointments: 8 },
    { id: 3, name: 'Kiran Patel', age: 52, gender: 'Male', phone: '+91 9876543212', lastVisit: '2024-01-13', condition: 'Asthma', status: 'stable', appointments: 15 },
    { id: 4, name: 'Priya Sharma', age: 29, gender: 'Female', phone: '+91 9876543213', lastVisit: '2024-01-12', condition: 'Migraine', status: 'stable', appointments: 5 },
  ];

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.condition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-display text-2xl font-bold">My Patients</h1>
            <p className="text-muted-foreground mt-1">Manage and track your patient records</p>
          </div>
          <Button className="bg-gradient-primary">
            <Users className="w-4 h-4 mr-1" /> Add Patient
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search patients by name or condition..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {filteredPatients.map((patient) => (
            <Card key={patient.id} className="shadow-card hover:shadow-card-hover transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                    {patient.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-lg">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">{patient.age} years · {patient.gender}</p>
                      </div>
                      <Badge variant={patient.status === 'stable' ? 'default' : 'secondary'}>
                        {patient.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Activity className="w-4 h-4" />
                        <span>{patient.condition}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>Last visit: {new Date(patient.lastVisit).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>{patient.phone}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <FileText className="w-3 h-3 mr-1" /> Records
                      </Button>
                      <Button size="sm" className="bg-gradient-primary flex-1">
                        <Video className="w-3 h-3 mr-1" /> Consult
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No patients found</p>
        )}

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Patient Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">{patients.length}</p>
                <p className="text-xs text-muted-foreground">Total Patients</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">{patients.filter(p => p.status === 'stable').length}</p>
                <p className="text-xs text-muted-foreground">Stable</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">{patients.filter(p => p.status === 'monitoring').length}</p>
                <p className="text-xs text-muted-foreground">Monitoring</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">{patients.reduce((sum, p) => sum + p.appointments, 0)}</p>
                <p className="text-xs text-muted-foreground">Total Visits</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PatientsPage;
