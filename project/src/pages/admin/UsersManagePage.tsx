import React, { useState } from 'react';
import { Users, Shield, Stethoscope, Building2, Search, UserPlus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import DashboardLayout from '@/components/shared/DashboardLayout';

const UsersManagePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const users = [
    { id: 1, name: 'Ramesh Kumar', email: 'ramesh@example.com', role: 'PATIENT', status: 'active' },
    { id: 2, name: 'Dr. Priya Sharma', email: 'priya@example.com', role: 'DOCTOR', status: 'active' },
    { id: 3, name: 'MedPlus Pharmacy', email: 'medplus@example.com', role: 'PHARMACY', status: 'active' },
    { id: 4, name: 'Sunita Devi', email: 'sunita@example.com', role: 'PATIENT', status: 'active' },
    { id: 5, name: 'Dr. Amit Singh', email: 'amit@example.com', role: 'DOCTOR', status: 'inactive' },
  ];

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
          <Button className="bg-gradient-primary">
            <UserPlus className="w-4 h-4 mr-1" /> Add User
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-info" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.patients}</p>
                  <p className="text-xs text-muted-foreground">Patients</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.doctors}</p>
                  <p className="text-xs text-muted-foreground">Doctors</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pharmacies}</p>
                  <p className="text-xs text-muted-foreground">Pharmacies</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name, email, or role..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="space-y-3">
          {filteredUsers.map((user) => {
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
                  <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                    {user.status}
                  </Badge>
                  <Button size="sm" variant="outline">Manage</Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredUsers.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No users found</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UsersManagePage;
