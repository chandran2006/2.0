import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, Star, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { pharmacyAPI } from '@/services/api';
import DashboardLayout from '@/components/shared/DashboardLayout';

const PharmacyPage: React.FC = () => {
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    pharmacyAPI.getAll()
      .then(res => setPharmacies(res.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout><div className="text-center py-8">Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Find Pharmacy</h1>
          <p className="text-muted-foreground mt-1">Locate nearby pharmacies</p>
        </div>

        {pharmacies.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No pharmacies found</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {pharmacies.map((pharmacy) => (
              <Card key={pharmacy.id} className="shadow-card hover:shadow-card-hover transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{pharmacy.pharmacyName}</p>
                      <p className="text-sm text-muted-foreground">{pharmacy.address}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {pharmacy.phone}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {pharmacy.openingHours}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        <Star className="w-3 h-3 text-warning fill-warning" />
                        <span className="text-xs font-medium">{pharmacy.rating || '4.5'}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => setSelected(pharmacy)}>View</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>{selected.pharmacyName}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm"><MapPin className="w-4 h-4 text-muted-foreground" />{selected.address}</div>
              <div className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4 text-muted-foreground" />{selected.phone}</div>
              <div className="flex items-center gap-2 text-sm"><Clock className="w-4 h-4 text-muted-foreground" />{selected.openingHours}</div>
              <div className="flex items-center gap-2 text-sm"><Star className="w-4 h-4 text-warning" />Rating: {selected.rating || '4.5'}</div>
              {selected.licenseNumber && <div className="text-sm text-muted-foreground">License: {selected.licenseNumber}</div>}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
};

export default PharmacyPage;
