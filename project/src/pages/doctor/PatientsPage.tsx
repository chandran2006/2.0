import React, { useState, useEffect } from 'react';
import { Users, Video, FileText, Clock, Activity, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { appointmentAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/shared/DashboardLayout';

const PatientsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [patients, setPatients] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    appointmentAPI.getDoctorAppointments(parseInt(user.id))
      .then(res => {
        // Deduplicate by patientId, keep latest appointment info
        const map = new Map();
        (res.data || []).forEach((a: any) => {
          if (!map.has(a.patientId) || new Date(a.appointmentDate) > new Date(map.get(a.patientId).appointmentDate)) {
            map.set(a.patientId, a);
          }
        });
        setPatients(Array.from(map.values()));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const filtered = patients.filter(p =>
    p.patientName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <DashboardLayout><div className="text-center py-8">Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-display text-2xl font-bold">My Patients</h1>
            <p className="text-muted-foreground mt-1">Patients who have booked appointments with you</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search patients by name..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((patient) => (
            <Card key={patient.patientId} className="shadow-card hover:shadow-card-hover transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                    {patient.patientName?.charAt(0) || 'P'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-lg">{patient.patientName}</p>
                      <Badge variant={patient.status === 'APPROVED' ? 'default' : 'secondary'}>{patient.status}</Badge>
                    </div>
                    <div className="space-y-1 mb-3">
                      {patient.reason && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Activity className="w-4 h-4" />
                          <span>{patient.reason}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>Last: {new Date(patient.appointmentDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => navigate(`/doctor/prescriptions?patientId=${patient.patientId}&patientName=${encodeURIComponent(patient.patientName || '')}`)  }>
                        <FileText className="w-3 h-3 mr-1" /> Prescribe
                      </Button>
                      <Button size="sm" className="bg-gradient-primary flex-1" onClick={() => navigate('/doctor/consultations')}>
                        <Video className="w-3 h-3 mr-1" /> Consult
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && <p className="col-span-2 text-center text-muted-foreground py-8">No patients found</p>}
        </div>

        <Card className="shadow-card">
          <CardHeader><CardTitle>Patient Statistics</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-muted/50"><p className="text-2xl font-bold">{patients.length}</p><p className="text-xs text-muted-foreground">Total Patients</p></div>
              <div className="p-4 rounded-lg bg-muted/50"><p className="text-2xl font-bold">{patients.filter(p => p.status === 'APPROVED').length}</p><p className="text-xs text-muted-foreground">Approved</p></div>
              <div className="p-4 rounded-lg bg-muted/50"><p className="text-2xl font-bold">{patients.filter(p => p.status === 'PENDING').length}</p><p className="text-xs text-muted-foreground">Pending</p></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PatientsPage;
