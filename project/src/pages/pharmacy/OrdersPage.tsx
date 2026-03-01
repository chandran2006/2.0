import React, { useState } from 'react';
import { FileText, Search, Clock, User, CheckCircle, Package, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import DashboardLayout from '@/components/shared/DashboardLayout';

const OrdersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const orders = [
    { id: 1, patientName: 'Ramesh Kumar', medicine: 'Aspirin 500mg', quantity: 30, status: 'PENDING', date: '2024-01-15', amount: 450 },
    { id: 2, patientName: 'Sunita Devi', medicine: 'Metformin 1000mg', quantity: 60, status: 'COMPLETED', date: '2024-01-14', amount: 1200 },
    { id: 3, patientName: 'Kiran Patel', medicine: 'Amoxicillin 250mg', quantity: 21, status: 'PROCESSING', date: '2024-01-15', amount: 315 },
    { id: 4, patientName: 'Priya Sharma', medicine: 'Paracetamol 650mg', quantity: 20, status: 'PENDING', date: '2024-01-15', amount: 200 },
    { id: 5, patientName: 'Amit Singh', medicine: 'Ciprofloxacin 500mg', quantity: 14, status: 'COMPLETED', date: '2024-01-13', amount: 280 },
  ];

  const filteredOrders = orders.filter(o =>
    o.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.medicine.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'PENDING').length,
    processing: orders.filter(o => o.status === 'PROCESSING').length,
    completed: orders.filter(o => o.status === 'COMPLETED').length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Orders</h1>
          <p className="text-muted-foreground mt-1">Manage prescription orders and fulfillment</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-warning" />
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
                  <TrendingUp className="w-5 h-5 text-info" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.processing}</p>
                  <p className="text-xs text-muted-foreground">Processing</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.completed}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
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
          {filteredOrders.map((order) => (
            <Card key={order.id} className="shadow-card hover:shadow-card-hover transition-shadow">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-info" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{order.patientName}</p>
                  <p className="text-sm text-muted-foreground">{order.medicine} × {order.quantity}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg">₹{order.amount}</p>
                </div>
                <Badge variant={
                  order.status === 'COMPLETED' ? 'default' :
                  order.status === 'PROCESSING' ? 'secondary' : 'outline'
                }>
                  {order.status}
                </Badge>
                {order.status === 'PENDING' && (
                  <Button size="sm" className="bg-gradient-primary">
                    <CheckCircle className="w-3 h-3 mr-1" /> Process
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No orders found</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default OrdersPage;
