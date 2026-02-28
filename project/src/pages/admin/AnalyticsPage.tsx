import React from 'react';
import { TrendingUp, Users, Activity, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AnalyticsPage: React.FC = () => {
  const stats = [
    { label: 'Total Revenue', value: '₹2.5M', change: '+12.5%', icon: DollarSign, color: 'text-success' },
    { label: 'Active Users', value: '1,250', change: '+8.2%', icon: Users, color: 'text-primary' },
    { label: 'Consultations', value: '3,421', change: '+15.3%', icon: Activity, color: 'text-info' },
    { label: 'Growth Rate', value: '23%', change: '+5.1%', icon: TrendingUp, color: 'text-warning' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">Analytics & Reports</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <span className="text-xs text-success">{stat.change}</span>
              </div>
              <p className="font-display text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Monthly Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            Chart visualization would go here
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
