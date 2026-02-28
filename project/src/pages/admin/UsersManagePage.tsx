import React from 'react';
import { Users, Shield, Stethoscope, Building2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const UsersManagePage: React.FC = () => {
  const users = [
    { id: 1, name: 'Ramesh Kumar', email: 'ramesh@example.com', role: 'PATIENT', status: 'active' },
    { id: 2, name: 'Dr. Priya Sharma', email: 'priya@example.com', role: 'DOCTOR', status: 'active' },
    { id: 3, name: 'MedPlus Pharmacy', email: 'medplus@example.com', role: 'PHARMACY', status: 'active' },
  ];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'DOCTOR': return Stethoscope;
      case 'PHARMACY': return Building2;
      case 'ADMIN': return Shield;
      default: return Users;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-display text-2xl font-bold">User Management</h1>
        <Button className="bg-gradient-primary">Add User</Button>
      </div>

      <div className="space-y-3">
        {users.map((user) => {
          const Icon = getRoleIcon(user.role);
          return (
            <Card key={user.id} className="shadow-card">
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
    </div>
  );
};

export default UsersManagePage;
