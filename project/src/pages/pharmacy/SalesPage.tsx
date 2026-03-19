import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, ShoppingCart, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { medicineAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/shared/DashboardLayout';

const SalesPage: React.FC = () => {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    medicineAPI.getAll()
      .then(res => setMedicines(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  // Show all medicines (pharmacyId in DB is pharmacy entity ID, not user ID)
  const allMedicines = medicines;
  const totalValue = allMedicines.reduce((sum, m) => sum + (m.price * (m.stockLevel || 0)), 0);
  const inStock = allMedicines.filter(m => m.available).length;
  const totalItems = allMedicines.reduce((sum, m) => sum + (m.stockLevel || 0), 0);
  const lowStock = allMedicines.filter(m => m.stockLevel < 20 && m.available).length;

  const stats = [
    { label: 'Inventory Value', value: `₹${totalValue.toLocaleString()}`, icon: DollarSign, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Medicines Listed', value: allMedicines.length.toString(), icon: Package, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'In Stock', value: inStock.toString(), icon: ShoppingCart, color: 'text-info', bg: 'bg-info/10' },
    { label: 'Low Stock', value: lowStock.toString(), icon: TrendingUp, color: 'text-warning', bg: 'bg-warning/10' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Sales & Revenue</h1>
          <p className="text-muted-foreground mt-1">Track your pharmacy inventory value and stock</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="shadow-card">
              <CardContent className="p-4">
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="font-display text-2xl font-bold">{loading ? '...' : stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-card">
          <CardHeader><CardTitle>Inventory Breakdown</CardTitle></CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-muted-foreground py-4">Loading...</p>
            ) : allMedicines.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No medicines in inventory. Add medicines from the Inventory page.</p>
            ) : (
              <div className="space-y-3">
                {allMedicines.map(med => (
                  <div key={med.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{med.name} {med.dosageStrength}</p>
                      <p className="text-sm text-muted-foreground">{med.manufacturer} · {med.stockLevel} units</p>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <p className="font-bold text-success">₹{(med.price * (med.stockLevel || 0)).toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">₹{med.price} each</p>
                      </div>
                      <Badge variant={med.available ? 'default' : 'secondary'}>
                        {med.available ? 'In Stock' : 'Out'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SalesPage;
