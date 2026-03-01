import React, { useState } from 'react';
import { FileText, Download, TrendingUp, Users, Calendar, DollarSign, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import DashboardLayout from '@/components/shared/DashboardLayout';

const ReportsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const reports = [
    { id: 1, title: 'Monthly Revenue Report', type: 'Financial', date: '2024-01-15', status: 'Generated', size: '2.4 MB' },
    { id: 2, title: 'User Activity Report', type: 'Analytics', date: '2024-01-14', status: 'Generated', size: '1.8 MB' },
    { id: 3, title: 'Appointment Statistics', type: 'Operations', date: '2024-01-13', status: 'Generated', size: '1.2 MB' },
    { id: 4, title: 'Prescription Analytics', type: 'Medical', date: '2024-01-12', status: 'Pending', size: '-' },
    { id: 5, title: 'Pharmacy Sales Report', type: 'Financial', date: '2024-01-11', status: 'Generated', size: '3.1 MB' },
  ];

  const filteredReports = reports.filter(r =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: reports.length,
    generated: reports.filter(r => r.status === 'Generated').length,
    pending: reports.filter(r => r.status === 'Pending').length,
    thisMonth: 12,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Reports</h1>
          <p className="text-muted-foreground mt-1">Generate and download system reports</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total Reports</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.generated}</p>
                  <p className="text-xs text-muted-foreground">Generated</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-info" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.thisMonth}</p>
                  <p className="text-xs text-muted-foreground">This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search reports..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="space-y-3">
          {filteredReports.map((report) => (
            <Card key={report.id} className="shadow-card hover:shadow-card-hover transition-shadow">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{report.title}</p>
                  <p className="text-sm text-muted-foreground">{report.type} · {report.size}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <Calendar className="w-3 h-3 inline mr-1" />
                    {new Date(report.date).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant={report.status === 'Generated' ? 'default' : 'secondary'}>
                  {report.status}
                </Badge>
                {report.status === 'Generated' && (
                  <Button size="sm" variant="outline">
                    <Download className="w-3 h-3 mr-1" /> Download
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No reports found</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;
