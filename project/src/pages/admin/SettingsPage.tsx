import React, { useState } from 'react';
import { Settings, Bell, Shield, Database, Mail, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DashboardLayout from '@/components/shared/DashboardLayout';

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    siteName: 'TeleAsha 2.0',
    adminEmail: 'admin@teleasha.com',
    supportEmail: 'support@teleasha.com',
    maxAppointments: '50',
    sessionTimeout: '30',
    emailNotifications: true,
    smsNotifications: false,
    maintenanceMode: false,
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold">System Settings</h1>
          <p className="text-muted-foreground mt-1">Configure system-wide settings and preferences</p>
        </div>

        <div className="grid gap-6">
          {/* General Settings */}
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold">General Settings</h2>
                  <p className="text-sm text-muted-foreground">Basic system configuration</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input 
                    id="siteName" 
                    value={settings.siteName}
                    onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="adminEmail">Admin Email</Label>
                    <Input 
                      id="adminEmail" 
                      type="email"
                      value={settings.adminEmail}
                      onChange={(e) => setSettings({...settings, adminEmail: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="supportEmail">Support Email</Label>
                    <Input 
                      id="supportEmail" 
                      type="email"
                      value={settings.supportEmail}
                      onChange={(e) => setSettings({...settings, supportEmail: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Limits */}
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                  <Database className="w-5 h-5 text-info" />
                </div>
                <div>
                  <h2 className="font-semibold">System Limits</h2>
                  <p className="text-sm text-muted-foreground">Configure system capacity and limits</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxAppointments">Max Daily Appointments</Label>
                  <Input 
                    id="maxAppointments" 
                    type="number"
                    value={settings.maxAppointments}
                    onChange={(e) => setSettings({...settings, maxAppointments: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input 
                    id="sessionTimeout" 
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => setSettings({...settings, sessionTimeout: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <h2 className="font-semibold">Notification Settings</h2>
                  <p className="text-sm text-muted-foreground">Manage notification preferences</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">Email Notifications</p>
                      <p className="text-xs text-muted-foreground">Send email alerts to users</p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant={settings.emailNotifications ? 'default' : 'outline'}
                    onClick={() => setSettings({...settings, emailNotifications: !settings.emailNotifications})}
                  >
                    {settings.emailNotifications ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Bell className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">SMS Notifications</p>
                      <p className="text-xs text-muted-foreground">Send SMS alerts to users</p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant={settings.smsNotifications ? 'default' : 'outline'}
                    onClick={() => setSettings({...settings, smsNotifications: !settings.smsNotifications})}
                  >
                    {settings.smsNotifications ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <h2 className="font-semibold">Security Settings</h2>
                  <p className="text-sm text-muted-foreground">System security and maintenance</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Maintenance Mode</p>
                    <p className="text-xs text-muted-foreground">Temporarily disable user access</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant={settings.maintenanceMode ? 'destructive' : 'outline'}
                    onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
                  >
                    {settings.maintenanceMode ? 'Active' : 'Inactive'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline">Reset to Defaults</Button>
          <Button className="bg-gradient-primary">Save Changes</Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
