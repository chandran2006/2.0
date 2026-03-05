import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Activity, DollarSign, Calendar, FileText, Stethoscope, Building2, ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/components/shared/DashboardLayout';

const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');

  const stats = [
    { label: 'Total Revenue', value: '₹2.5M', change: '+12.5%', trend: 'up', icon: DollarSign, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Active Users', value: '1,250', change: '+8.2%', trend: 'up', icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Consultations', value: '3,421', change: '+15.3%', trend: 'up', icon: Activity, color: 'text-info', bg: 'bg-info/10' },
    { label: 'Growth Rate', value: '23%', change: '-2.1%', trend: 'down', icon: TrendingUp, color: 'text-warning', bg: 'bg-warning/10' },
  ];

  const userMetrics = [
    { label: 'New Patients', value: 245, change: '+18%', period: 'This month' },
    { label: 'New Doctors', value: 12, change: '+5%', period: 'This month' },
    { label: 'New Pharmacies', value: 8, change: '+12%', period: 'This month' },
    { label: 'Total Active', value: 1250, change: '+8%', period: 'Overall' },
  ];

  const consultationMetrics = [
    { label: 'Completed', value: 2845, percentage: 83, color: 'bg-success' },
    { label: 'Scheduled', value: 421, percentage: 12, color: 'bg-info' },
    { label: 'Cancelled', value: 155, percentage: 5, color: 'bg-warning' },
  ];

  const revenueBreakdown = [
    { source: 'Consultations', amount: '₹1.8M', percentage: 72, color: 'bg-primary' },
    { source: 'Prescriptions', amount: '₹450K', percentage: 18, color: 'bg-info' },
    { source: 'Subscriptions', amount: '₹250K', percentage: 10, color: 'bg-success' },
  ];

  const topDoctors = [
    { name: 'Dr. Priya Sharma', consultations: 245, revenue: '₹245K', rating: 4.9 },
    { name: 'Dr. Amit Singh', consultations: 198, revenue: '₹198K', rating: 4.8 },
    { name: 'Dr. Rajesh Kumar', consultations: 176, revenue: '₹176K', rating: 4.7 },
    { name: 'Dr. Sunita Devi', consultations: 165, revenue: '₹165K', rating: 4.9 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold">Analytics & Insights</h1>
            <p className="text-muted-foreground mt-1">Comprehensive platform performance metrics</p>
          </div>
          <div className="flex gap-2">
            {['24h', '7d', '30d', '90d'].map((range) => (
              <Button
                key={range}
                size="sm"
                variant={timeRange === range ? 'default' : 'outline'}
                onClick={() => setTimeRange(range)}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className="shadow-card">
                <CardContent className="p-4">
                  <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <p className="font-display text-2xl font-bold">{stat.value}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <div className={`flex items-center gap-1 text-xs ${stat.trend === 'up' ? 'text-success' : 'text-warning'}`}>
                      {stat.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                      {stat.change}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">User Analytics</TabsTrigger>
            <TabsTrigger value="consultations">Consultations</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <div className="grid md:grid-cols-4 gap-4">
              {userMetrics.map((metric) => (
                <Card key={metric.label} className="shadow-card">
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">{metric.period}</span>
                      <Badge variant="outline" className="text-success">{metric.change}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-display text-lg">User Growth Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                  User growth chart visualization
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="consultations" className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              {consultationMetrics.map((metric) => (
                <Card key={metric.label} className="shadow-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">{metric.label}</p>
                      <Badge>{metric.percentage}%</Badge>
                    </div>
                    <p className="text-2xl font-bold mb-3">{metric.value}</p>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full ${metric.color} rounded-full`} style={{ width: `${metric.percentage}%` }} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-display text-lg">Consultation Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                  Consultation timeline chart
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-4">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-display text-lg">Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {revenueBreakdown.map((item) => (
                  <div key={item.source} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.source}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold">{item.amount}</span>
                        <Badge variant="outline">{item.percentage}%</Badge>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-display text-lg">Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                  Revenue trend chart
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-display text-lg">Top Performing Doctors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topDoctors.map((doctor, index) => (
                  <div key={doctor.name} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{doctor.name}</p>
                      <p className="text-xs text-muted-foreground">{doctor.consultations} consultations</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{doctor.revenue}</p>
                      <div className="flex items-center gap-1 text-xs text-warning">
                        ⭐ {doctor.rating}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="font-display text-lg">Average Response Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                    Response time chart
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="font-display text-lg">Patient Satisfaction</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                    Satisfaction chart
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
