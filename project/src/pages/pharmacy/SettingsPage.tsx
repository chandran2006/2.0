import React, { useState } from 'react';
import { Settings, Store, Clock, Phone, Mail, MapPin, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import DashboardLayout from '@/components/shared/DashboardLayout';

const SettingsPage: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Pharmacy Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your pharmacy information and preferences</p>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="w-5 h-5" />
              Pharmacy Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Pharmacy Name</label>
              <Input defaultValue="MedPlus Pharmacy" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">License Number</label>
              <Input defaultValue="PHARM12345" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Phone</label>
                <Input defaultValue="+91 9876543212" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Email</label>
                <Input defaultValue="pharmacy@teleasha.com" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Address</label>
              <Textarea defaultValue="123 Main Street, Delhi, India" rows={3} />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Operating Hours
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Currently Open</p>
                <p className="text-sm text-muted-foreground">Toggle your pharmacy status</p>
              </div>
              <Switch checked={isOpen} onCheckedChange={setIsOpen} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Opening Time</label>
                <Input type="time" defaultValue="09:00" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Closing Time</label>
                <Input type="time" defaultValue="21:00" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Working Days</label>
              <div className="flex flex-wrap gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <Button key={day} variant="outline" size="sm" className="w-16">
                    {day}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive order notifications via email</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">SMS Alerts</p>
                <p className="text-sm text-muted-foreground">Get SMS for urgent orders</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Low Stock Alerts</p>
                <p className="text-sm text-muted-foreground">Alert when inventory is low</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline">Cancel</Button>
          <Button className="bg-gradient-primary">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
