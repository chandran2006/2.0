import React, { useState, useEffect } from 'react';
import { FileText, Heart, Activity, Download, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { healthRecordAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/shared/DashboardLayout';

const HealthRecordsPage: React.FC = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecords();
  }, [user]);

  const loadRecords = async () => {
    if (!user?.id) return;
    try {
      const res = await healthRecordAPI.getPatientRecords(parseInt(user.id));
      setRecords(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const mockRecords = [
    { id: 1, type: 'Blood Test', date: '2024-01-15', doctor: 'Dr. Sharma', result: 'Normal', file: 'blood_test.pdf' },
    { id: 2, type: 'X-Ray', date: '2024-01-10', doctor: 'Dr. Kumar', result: 'Clear', file: 'xray.pdf' },
    { id: 3, type: 'ECG', date: '2024-01-05', doctor: 'Dr. Sharma', result: 'Normal', file: 'ecg.pdf' },
  ];

  const displayRecords = records.length > 0 ? records : mockRecords;

  if (loading) return <DashboardLayout><div className="text-center py-8">Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-display text-2xl font-bold">Health Records</h1>
          <p className="text-muted-foreground mt-1">View and manage your medical records</p>
        </div>
        <Button className="bg-gradient-primary">
          <Plus className="w-4 h-4 mr-1" /> Upload Record
        </Button>
      </div>

      <div className="grid gap-4">
        {displayRecords.map((record) => (
          <Card key={record.id} className="shadow-card hover:shadow-card-hover transition-shadow">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-info" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{record.type}</p>
                <p className="text-sm text-muted-foreground">By {record.doctor}</p>
                <p className="text-xs text-muted-foreground mt-1">{new Date(record.date).toLocaleDateString()}</p>
              </div>
              <Badge variant="default">{record.result}</Badge>
              <Button size="sm" variant="outline">
                <Download className="w-3 h-3 mr-1" /> Download
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-card">
        <CardContent className="p-6">
          <h3 className="font-display text-lg font-bold mb-4">Vital Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <Heart className="w-5 h-5 text-destructive mb-2" />
              <p className="text-2xl font-bold">72</p>
              <p className="text-xs text-muted-foreground">Heart Rate (bpm)</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <Activity className="w-5 h-5 text-info mb-2" />
              <p className="text-2xl font-bold">120/80</p>
              <p className="text-xs text-muted-foreground">Blood Pressure</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <Activity className="w-5 h-5 text-warning mb-2" />
              <p className="text-2xl font-bold">98.6°F</p>
              <p className="text-xs text-muted-foreground">Temperature</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <Activity className="w-5 h-5 text-success mb-2" />
              <p className="text-2xl font-bold">70 kg</p>
              <p className="text-xs text-muted-foreground">Weight</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    </DashboardLayout>
  );
};

export default HealthRecordsPage;
