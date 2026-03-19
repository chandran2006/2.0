import React, { useState, useEffect } from 'react';
import { Users, Shield, Stethoscope, Building2, Search, UserPlus, Ban, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DashboardLayout from '@/components/shared/DashboardLayout';
import { adminAPI, authAPI } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  blocked: boolean;
}

const emptyForm = { name: '', email: '', password: '', role: 'PATIENT' };

const UsersManagePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      const response = await adminAPI.getAllUsers();
      setUsers(response.data || []);
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to load users', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await authAPI.register(form);
      toast({ title: 'Success', description: 'User created successfully' });
      setDialogOpen(false);
      setForm(emptyForm);
      loadUsers();
    } catch (error: any) {
      toast({ title: 'Error', description: error.response?.data?.message || 'Failed to create user', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleBlock = async (userId: number, currentStatus: boolean) => {
    try {
      await adminAPI.toggleBlockUser(userId);
      toast({ title: 'Success', description: `User ${currentStatus ? 'unblocked' : 'blocked'} successfully` });
      loadUsers();
    } catch {
      toast({ title: 'Error', description: 'Failed to update user status', variant: 'destructive' });
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: users.length,
    patients: users.filter(u => u.role === 'PATIENT').length,
    doctors: users.filter(u => u.role === 'DOCTOR').length,
    pharmacies: users.filter(u => u.role === 'PHARMACY').length,
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'DOCTOR': return Stethoscope;
      case 'PHARMACY': return Building2;
      case 'ADMIN': return Shield;
      default: return Users;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-display text-2xl font-bold">User Management</h1>
            <p className="text-muted-foreground mt-1">Manage all system users and roles</p>
          </div>
          <Button className="bg-gradient-primary" onClick={() => setDialogOpen(true)}>
            <UserPlus className="w-4 h-4 mr-1" /> Add User
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8"><p className="text-muted-foreground">Loading users...</p></div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Users', value: stats.total, Icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
                { label: 'Patients', value: stats.patients, Icon: Users, color: 'text-info', bg: 'bg-info/10' },
                { label: 'Doctors', value: stats.doctors, Icon: Stethoscope, color: 'text-success', bg: 'bg-success/10' },
                { label: 'Pharmacies', value: stats.pharmacies, Icon: Building2, color: 'text-warning', bg: 'bg-warning/10' },
              ].map(({ label, value, Icon, color, bg }) => (
                <Card key={label} className="shadow-card">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${color}`} />
                      </div>
                      <div><p className="text-2xl font-bold">{value}</p><p className="text-xs text-muted-foreground">{label}</p></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search by name, email, or role..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>

            <div className="space-y-3">
              {filteredUsers.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No users found</p>
              ) : filteredUsers.map((user) => {
                const Icon = getRoleIcon(user.role);
                return (
                  <Card key={user.id} className="shadow-card hover:shadow-card-hover transition-shadow">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <Badge>{user.role}</Badge>
                      <Badge variant={user.blocked ? 'destructive' : 'default'}>
                        {user.blocked ? 'Blocked' : 'Active'}
                      </Badge>
                      <Button
                        size="sm"
                        variant={user.blocked ? 'default' : 'destructive'}
                        onClick={() => handleToggleBlock(user.id, user.blocked)}
                      >
                        {user.blocked ? <><CheckCircle className="w-4 h-4 mr-1" /> Unblock</> : <><Ban className="w-4 h-4 mr-1" /> Block</>}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add New User</DialogTitle></DialogHeader>
          <form onSubmit={handleAddUser} className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Full Name *</label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Dr. Sharma" required />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Email *</label>
              <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="user@example.com" required />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Password *</label>
              <Input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Min 6 characters" required minLength={6} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Role *</label>
              <Select value={form.role} onValueChange={v => setForm({ ...form, role: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PATIENT">Patient</SelectItem>
                  <SelectItem value="DOCTOR">Doctor</SelectItem>
                  <SelectItem value="PHARMACY">Pharmacy</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-1">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" className="flex-1 bg-gradient-primary" disabled={saving}>
                {saving ? 'Creating...' : 'Create User'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default UsersManagePage;
