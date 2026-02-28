import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { medicineAPI } from '@/services/api';

const InventoryPage: React.FC = () => {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    medicineAPI.getAll()
      .then(res => setMedicines(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-display text-2xl font-bold">Inventory Management</h1>
        <Button className="bg-gradient-primary">
          <Plus className="w-4 h-4 mr-1" /> Add Medicine
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {medicines.map((med) => (
          <Card key={med.id} className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{med.name} {med.dosageStrength}</p>
                  <p className="text-sm text-muted-foreground">{med.manufacturer} · {med.dosageForm}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm font-semibold">₹{med.price}</span>
                    <Badge variant={med.available ? 'default' : 'secondary'}>
                      {med.available ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                    {med.stockLevel < 20 && (
                      <Badge variant="outline" className="text-warning">
                        <AlertTriangle className="w-3 h-3 mr-1" /> Low Stock
                      </Badge>
                    )}
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <Edit className="w-3 h-3 mr-1" /> Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InventoryPage;
