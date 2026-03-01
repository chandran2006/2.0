import React, { useState, useEffect } from 'react';
import { Pill, FileText, Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { prescriptionAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/shared/DashboardLayout';

const PrescriptionsPage: React.FC = () => {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      prescriptionAPI.getPatientPrescriptions(parseInt(user.id))
        .then(res => setPrescriptions(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) return <DashboardLayout><div className="text-center py-8">Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-bold">My Prescriptions</h1>

        <div className="space-y-3">
          {prescriptions.map((rx) => (
            <Card key={rx.id} className="shadow-card">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                    <Pill className="w-6 h-6 text-success" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{rx.medicineName}</p>
                    <p className="text-sm text-muted-foreground">{rx.dosage} · {rx.duration}</p>
                    <p className="text-xs text-muted-foreground mt-1">By {rx.doctorName}</p>
                    <p className="text-xs text-muted-foreground mt-2">{rx.instructions}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={rx.status === 'ACTIVE' ? 'default' : 'secondary'}>
                      {rx.status}
                    </Badge>
                    <Button size="sm" variant="outline" className="mt-2">
                      <Download className="w-3 h-3 mr-1" /> Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {prescriptions.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No prescriptions found</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PrescriptionsPage;
