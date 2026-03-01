import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit, AlertTriangle, Search, TrendingDown, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { medicineAPI } from '@/services/api';
import DashboardLayout from '@/components/shared/DashboardLayout';

const InventoryPage: React.FC = () => {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    medicineAPI.getAll()
      .then(res => setMedicines(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredMedicines = medicines.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.manufacturer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: medicines.length,
    inStock: medicines.filter(m => m.available).length,
    outOfStock: medicines.filter(m => !m.available).length,
    lowStock: medicines.filter(m => m.stockLevel < 20).length,
  };

  if (loading) return (
    <DashboardLayout>
      <div className="text-center py-8">Loading inventory...</div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-display text-2xl font-bold">Inventory Management</h1>
            <p className="text-muted-foreground mt-1">Track and manage medicine stock levels</p>
          </div>
          <Button className="bg-gradient-primary">
            <Plus className="w-4 h-4 mr-1" /> Add Medicine
          </Button>
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
                  <p className="text-xs text-muted-foreground">Total Items</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.inStock}</p>
                  <p className="text-xs text-muted-foreground">In Stock</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.lowStock}</p>
                  <p className="text-xs text-muted-foreground">Low Stock</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.outOfStock}</p>
                  <p className="text-xs text-muted-foreground">Out of Stock</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by medicine name or manufacturer..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {filteredMedicines.map((med) => (
            <Card key={med.id} className="shadow-card hover:shadow-card-hover transition-shadow">
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
                      {med.stockLevel < 20 && med.available && (
                        <Badge variant="outline" className="text-warning">
                          <AlertTriangle className="w-3 h-3 mr-1" /> Low Stock
                        </Badge>
                      )}
                    </div>
                    {med.stockLevel && (
                      <p className="text-xs text-muted-foreground mt-1">Stock: {med.stockLevel} units</p>
                    )}
                  </div>
                  <Button size="sm" variant="outline">
                    <Edit className="w-3 h-3 mr-1" /> Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMedicines.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No medicines found</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default InventoryPage;
