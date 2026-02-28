import React from 'react';
import { FileText, Package, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const OrdersPage: React.FC = () => {
  const orders = [
    { id: 1, patientName: 'Ramesh Kumar', medicine: 'Aspirin 500mg', quantity: 30, status: 'PENDING', date: '2024-01-15' },
    { id: 2, patientName: 'Sunita Devi', medicine: 'Metformin 1000mg', quantity: 60, status: 'COMPLETED', date: '2024-01-14' },
    { id: 3, patientName: 'Kiran Patel', medicine: 'Amoxicillin 250mg', quantity: 21, status: 'PROCESSING', date: '2024-01-15' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">Prescription Orders</h1>

      <div className="space-y-3">
        {orders.map((order) => (
          <Card key={order.id} className="shadow-card">
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
              <Badge variant={
                order.status === 'COMPLETED' ? 'default' :
                order.status === 'PROCESSING' ? 'secondary' : 'outline'
              }>
                {order.status}
              </Badge>
              {order.status === 'PENDING' && (
                <Button size="sm" className="bg-gradient-primary">Process</Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
