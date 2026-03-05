import React, { useState, useEffect } from 'react';
import { Settings, Bell, Shield, Database, Mail, Globe, Save, RotateCcw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import DashboardLayout from '@/components/shared/DashboardLayout';
import { adminAPI } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    siteName: 'TeleAsha 2.0',
    adminEmail: 'admin@teleasha.com',
    supportEmail: 'support@teleasha.com',
    maxAppointments: 50,
    sessionTimeout: 30,
    emailNotifications: true,
    smsNotifications: false,
    maintenanceMode: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await adminAPI.getSettings();
      if (response.data) {
        setSettings({
          siteName: response.data.siteName || 'TeleAsha 2.0',
          adminEmail: response.data.adminEmail || 'admin@teleasha.com',
          supportEmail: response.data.supportEmail || 'support@teleasha.com',
          maxAppointments: response.data.maxAppointments || 50,
          sessionTimeout: response.data.sessionTimeout || 30,
          emailNotifications: response.data.emailNotifications ?? true,
          smsNotifications: response.data.smsNotifications ?? false,
          maintenanceMode: response.data.maintenanceMode ?? false,
        });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      // Keep default values if loading fails
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      console.log('Saving settings:', settings);
      const response = await adminAPI.updateSettings(settings);
      console.log('Save response:', response.data);
      if (response.data.settings) {
        setSettings(response.data.settings);
      }
      toast({
        title: 'Success',
        description: 'Settings saved successfully',
      });
    } catch (error: any) {
      console.error('Save error:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to save settings',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset all settings to defaults?')) return;
    
    setSaving(true);
    try {
      const response = await adminAPI.resetSettings();
      setSettings(response.data.settings);
      toast({
        title: 'Success',
        description: 'Settings reset to defaults',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reset settings',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </DashboardLayout>
    );
  }

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
                    value={settings.siteName || ''}
                    onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                    placeholder="Enter site name"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="adminEmail">Admin Email</Label>
                    <Input 
                      id="adminEmail" 
                      type="email"
                      value={settings.adminEmail || ''}
                      onChange={(e) => setSettings({...settings, adminEmail: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="supportEmail">Support Email</Label>
                    <Input 
                      id="supportEmail" 
                      type="email"
                      value={settings.supportEmail || ''}
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
                    value={settings.maxAppointments || 0}
                    onChange={(e) => setSettings({...settings, maxAppointments: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input 
                    id="sessionTimeout" 
                    type="number"
                    value={settings.sessionTimeout || 0}
                    onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value) || 0})}
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
                  <Switch 
                    checked={settings.emailNotifications ?? true}
                    onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Bell className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">SMS Notifications</p>
                      <p className="text-xs text-muted-foreground">Send SMS alerts to users</p>
                    </div>
                  </div>
                  <Switch 
                    checked={settings.smsNotifications ?? false}
                    onCheckedChange={(checked) => setSettings({...settings, smsNotifications: checked})}
                  />
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
                  <Switch 
                    checked={settings.maintenanceMode ?? false}
                    onCheckedChange={(checked) => setSettings({...settings, maintenanceMode: checked})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleReset} disabled={saving}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button className="bg-gradient-primary" onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
