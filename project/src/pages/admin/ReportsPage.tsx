import React, { useState } from 'react';
import { FileText, Download, TrendingUp, Users, Calendar, DollarSign, Search, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import DashboardLayout from '@/components/shared/DashboardLayout';
import { adminAPI } from '@/services/api';

const ReportsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [generating, setGenerating] = useState<number | null>(null);
  const [reports, setReports] = useState([
    { id: 1, title: 'Monthly Revenue Report', type: 'Financial', date: new Date().toISOString(), status: 'Generated', size: '2.4 MB' },
    { id: 2, title: 'User Activity Report', type: 'Analytics', date: new Date().toISOString(), status: 'Generated', size: '1.8 MB' },
    { id: 3, title: 'Appointment Statistics', type: 'Operations', date: new Date().toISOString(), status: 'Generated', size: '1.2 MB' },
    { id: 4, title: 'Prescription Analytics', type: 'Medical', date: new Date().toISOString(), status: 'Pending', size: '-' },
    { id: 5, title: 'Pharmacy Sales Report', type: 'Financial', date: new Date().toISOString(), status: 'Generated', size: '3.1 MB' },
  ]);

  const handleDownload = (report: any) => {
    // Generate a simple CSV download
    const csvContent = `Report: ${report.title}\nType: ${report.type}\nDate: ${new Date(report.date).toLocaleDateString()}\nStatus: ${report.status}\n\nThis is a sample report export from MeDora system.`;
    const blob = new Blob([csvContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.title.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded: ${report.title}`);
  };

  const handleGenerate = async (id: number) => {
    setGenerating(id);
    // Simulate report generation
    await new Promise(r => setTimeout(r, 1500));
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'Generated', size: '1.0 MB', date: new Date().toISOString() } : r));
    setGenerating(null);
    toast.success('Report generated successfully');
  };

  const handleGenerateNew = async () => {
    setGenerating(-1);
    await new Promise(r => setTimeout(r, 1500));
    const newReport = {
      id: Date.now(),
      title: 'System Overview Report',
      type: 'Analytics',
      date: new Date().toISOString(),
      status: 'Generated',
      size: '0.8 MB',
    };
    setReports(prev => [newReport, ...prev]);
    setGenerating(null);
    toast.success('New report generated');
  };

  const filteredReports = reports.filter(r =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: reports.length,
    generated: reports.filter(r => r.status === 'Generated').length,
    pending: reports.filter(r => r.status === 'Pending').length,
    thisMonth: reports.length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-display text-2xl font-bold">Reports</h1>
            <p className="text-muted-foreground mt-1">Generate and download system reports</p>
          </div>
          <Button className="bg-gradient-primary" onClick={handleGenerateNew} disabled={generating === -1}>
            <Plus className="w-4 h-4 mr-1" />
            {generating === -1 ? 'Generating...' : 'Generate Report'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Reports', value: stats.total, Icon: FileText, color: 'text-primary', bg: 'bg-primary/10' },
            { label: 'Generated', value: stats.generated, Icon: TrendingUp, color: 'text-success', bg: 'bg-success/10' },
            { label: 'Pending', value: stats.pending, Icon: Calendar, color: 'text-warning', bg: 'bg-warning/10' },
            { label: 'This Month', value: stats.thisMonth, Icon: DollarSign, color: 'text-info', bg: 'bg-info/10' },
          ].map(({ label, value, Icon, color, bg }) => (
            <Card key={label} className="shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div><p className="text-2xl font-bold">{value}</p><p className="text-xs text-muted-foreground">{label}</p></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search reports..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
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
                {report.status === 'Generated' ? (
                  <Button size="sm" variant="outline" onClick={() => handleDownload(report)}>
                    <Download className="w-3 h-3 mr-1" /> Download
                  </Button>
                ) : (
                  <Button size="sm" className="bg-gradient-primary" onClick={() => handleGenerate(report.id)} disabled={generating === report.id}>
                    {generating === report.id ? 'Generating...' : 'Generate'}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
          {filteredReports.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No reports found</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;
