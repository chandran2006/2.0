import React, { useState, useEffect } from 'react';
import { Pill, Search, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { medicineAPI } from '@/services/api';
import { toast } from 'sonner';

const MedicinesPage: React.FC = () => {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchQuery.length > 2) {
      searchMedicines();
    } else {
      loadAllMedicines();
    }
  }, [searchQuery]);

  const loadAllMedicines = async () => {
    setLoading(true);
    try {
      const res = await medicineAPI.getAll();
      setMedicines(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const searchMedicines = async () => {
    setLoading(true);
    try {
      const res = await medicineAPI.search(searchQuery);
      setMedicines(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Search Medicines</h1>
        <p className="text-muted-foreground mt-1">Find medicines and check availability</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search medicines by name..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="col-span-full text-center py-8">Loading...</p>
        ) : medicines.length > 0 ? (
          medicines.map((med) => (
            <Card key={med.id} className="shadow-card hover:shadow-card-hover transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                    <Pill className="w-6 h-6 text-success" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{med.name}</p>
                    <p className="text-sm text-muted-foreground">{med.dosageStrength} · {med.dosageForm}</p>
                    <p className="text-xs text-muted-foreground mt-1">{med.manufacturer}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-lg font-bold text-primary">₹{med.price}</span>
                      <Badge variant={med.available ? 'default' : 'secondary'}>
                        {med.available ? 'Available' : 'Out of Stock'}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button size="sm" className="w-full mt-3 bg-gradient-primary" disabled={!med.available}>
                  <ShoppingCart className="w-3 h-3 mr-1" /> Order Now
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground py-8">
            {searchQuery ? 'No medicines found' : 'Start typing to search medicines'}
          </p>
        )}
      </div>
    </div>
  );
};

export default MedicinesPage;
