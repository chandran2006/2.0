import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit, Trash2, AlertTriangle, Search, TrendingDown, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { medicineAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import DashboardLayout from '@/components/shared/DashboardLayout';

const emptyForm = { name: '', genericName: '', manufacturer: '', dosageForm: '', dosageStrength: '', price: '', stockLevel: '', description: '' };

const InventoryPage: React.FC = () => {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadMedicines = () => {
    medicineAPI.getAll()
      .then(res => setMedicines(res.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadMedicines(); }, []);

  const openAdd = () => { setEditingId(null); setFormData(emptyForm); setDialogOpen(true); };

  const openEdit = (med: any) => {
    setEditingId(med.id);
    setFormData({
      name: med.name || '',
      genericName: med.genericName || '',
      manufacturer: med.manufacturer || '',
      dosageForm: med.dosageForm || '',
      dosageStrength: med.dosageStrength || '',
      price: med.price?.toString() || '',
      stockLevel: med.stockLevel?.toString() || '',
      description: med.description || '',
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      stockLevel: parseInt(formData.stockLevel),
      available: parseInt(formData.stockLevel) > 0,
      pharmacyId: user?.id ? parseInt(user.id) : null,
    };
    try {
      if (editingId) {
        await medicineAPI.update(editingId, payload);
        toast.success('Medicine updated successfully');
      } else {
        await medicineAPI.create(payload);
        toast.success('Medicine added successfully');
      }
      setDialogOpen(false);
      setFormData(emptyForm);
      setEditingId(null);
      loadMedicines();
    } catch {
      toast.error(editingId ? 'Failed to update medicine' : 'Failed to add medicine');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete ${name}?`)) return;
    try {
      await medicineAPI.delete(id);
      toast.success('Medicine deleted');
      loadMedicines();
    } catch { toast.error('Failed to delete medicine'); }
  };

  const filteredMedicines = medicines.filter(m =>
    m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.manufacturer?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: medicines.length,
    inStock: medicines.filter(m => m.available).length,
    outOfStock: medicines.filter(m => !m.available).length,
    lowStock: medicines.filter(m => m.stockLevel < 20 && m.available).length,
  };

  if (loading) return <DashboardLayout><div className="text-center py-8">Loading inventory...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-display text-2xl font-bold">Inventory Management</h1>
            <p className="text-muted-foreground mt-1">Track and manage medicine stock levels</p>
          </div>
          <Button className="bg-gradient-primary" onClick={openAdd}>
            <Plus className="w-4 h-4 mr-1" /> Add Medicine
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-card"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Package className="w-5 h-5 text-primary" /></div><div><p className="text-2xl font-bold">{stats.total}</p><p className="text-xs text-muted-foreground">Total Items</p></div></div></CardContent></Card>
          <Card className="shadow-card"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center"><ShoppingCart className="w-5 h-5 text-success" /></div><div><p className="text-2xl font-bold">{stats.inStock}</p><p className="text-xs text-muted-foreground">In Stock</p></div></div></CardContent></Card>
          <Card className="shadow-card"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-warning" /></div><div><p className="text-2xl font-bold">{stats.lowStock}</p><p className="text-xs text-muted-foreground">Low Stock</p></div></div></CardContent></Card>
          <Card className="shadow-card"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center"><TrendingDown className="w-5 h-5 text-destructive" /></div><div><p className="text-2xl font-bold">{stats.outOfStock}</p><p className="text-xs text-muted-foreground">Out of Stock</p></div></div></CardContent></Card>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by medicine name or manufacturer..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
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
                    {med.stockLevel != null && (
                      <p className="text-xs text-muted-foreground mt-1">Stock: {med.stockLevel} units</p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => openEdit(med)}><Edit className="w-3 h-3 mr-1" /> Edit</Button>
                    <Button size="sm" variant="outline" className="text-destructive" onClick={() => handleDelete(med.id, med.name)}><Trash2 className="w-3 h-3" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMedicines.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No medicines found</p>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Medicine' : 'Add New Medicine'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Medicine Name *</label>
                <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Paracetamol" required />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Generic Name</label>
                <Input value={formData.genericName} onChange={e => setFormData({...formData, genericName: e.target.value})} placeholder="e.g. Acetaminophen" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Manufacturer *</label>
              <Input value={formData.manufacturer} onChange={e => setFormData({...formData, manufacturer: e.target.value})} placeholder="e.g. Sun Pharma" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Dosage Form *</label>
                <Input value={formData.dosageForm} onChange={e => setFormData({...formData, dosageForm: e.target.value})} placeholder="e.g. Tablet" required />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Dosage Strength *</label>
                <Input value={formData.dosageStrength} onChange={e => setFormData({...formData, dosageStrength: e.target.value})} placeholder="e.g. 500mg" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Price (₹) *</label>
                <Input type="number" min="0" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="0.00" required />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Stock Level *</label>
                <Input type="number" min="0" value={formData.stockLevel} onChange={e => setFormData({...formData, stockLevel: e.target.value})} placeholder="0" required />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Description</label>
              <Input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Brief description..." />
            </div>
            <div className="flex gap-2 pt-1">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" className="flex-1 bg-gradient-primary" disabled={saving}>
                {saving ? (editingId ? 'Saving...' : 'Adding...') : (editingId ? 'Save Changes' : 'Add Medicine')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default InventoryPage;
