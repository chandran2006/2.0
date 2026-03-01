import React from 'react';
import { TrendingUp, DollarSign, ShoppingCart, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardLayout from '@/components/shared/DashboardLayout';

const SalesPage: React.FC = () => {
  const stats = [
    { label: 'Today\'s Sales', value: '₹12,450', change: '+8.2%', icon: DollarSign, color: 'text-success' },
    { label: 'Orders', value: '45', change: '+12%', icon: ShoppingCart, color: 'text-primary' },
    { label: 'Items Sold', value: '234', change: '+15%', icon: Package, color: 'text-info' },
    { label: 'Revenue', value: '₹2.5L', change: '+18%', icon: TrendingUp, color: 'text-warning' },
  ];

  const recentSales = [
    { id: 1, customer: 'Ramesh Kumar', items: 3, amount: 850, time: '10:30 AM' },
    { id: 2, customer: 'Sunita Devi', items: 2, amount: 1200, time: '11:15 AM' },
    { id: 3, customer: 'Kiran Patel', items: 5, amount: 2100, time: '12:00 PM' },
    { id: 4, customer: 'Priya Sharma', items: 1, amount: 450, time: '01:30 PM' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Sales & Revenue</h1>
          <p className="text-muted-foreground mt-1">Track your pharmacy sales and revenue</p>
        </div>

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
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">{sale.customer}</p>
                    <p className="text-sm text-muted-foreground">{sale.items} items · {sale.time}</p>
                  </div>
                  <p className="font-bold text-success">₹{sale.amount}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Monthly Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Sales chart visualization would go here
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SalesPage;
