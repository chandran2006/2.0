import React, { useState } from 'react';
import { Video, Phone, MessageSquare, Clock, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/shared/DashboardLayout';

const ConsultationsPage: React.FC = () => {
  const navigate = useNavigate();
  const consultations = [
    { id: 1, patientName: 'Ramesh Kumar', type: 'Video', status: 'Scheduled', time: '2024-01-15 10:00 AM', duration: '30 min' },
    { id: 2, patientName: 'Sunita Devi', type: 'Phone', status: 'Completed', time: '2024-01-14 02:00 PM', duration: '20 min' },
    { id: 3, patientName: 'Kiran Patel', type: 'Video', status: 'In Progress', time: '2024-01-15 11:00 AM', duration: '45 min' },
  ];

  const getTypeIcon = (type: string) => {
    return type === 'Video' ? Video : Phone;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-display text-2xl font-bold">Consultations</h1>
            <p className="text-muted-foreground mt-1">Manage video and phone consultations</p>
          </div>
          <Button 
            className="bg-gradient-primary"
            onClick={() => navigate('/doctor/consultation-requests')}
          >
            View Requests
          </Button>
        </div>

        <div className="grid gap-4">
          {consultations.map((consult) => {
            const Icon = getTypeIcon(consult.type);
            return (
              <Card key={consult.id} className="shadow-card hover:shadow-card-hover transition-shadow">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-info" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{consult.patientName}</p>
                    <p className="text-sm text-muted-foreground">{consult.type} Consultation</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {consult.time} · {consult.duration}
                    </p>
                  </div>
                  <Badge variant={
                    consult.status === 'Completed' ? 'default' :
                    consult.status === 'In Progress' ? 'secondary' : 'outline'
                  }>
                    {consult.status}
                  </Badge>
                  {consult.status === 'Scheduled' && (
                    <Button size="sm" className="bg-gradient-primary">
                      <Video className="w-3 h-3 mr-1" /> Join
                    </Button>
                  )}
                  {consult.status === 'In Progress' && (
                    <Button size="sm" className="bg-success">
                      <Video className="w-3 h-3 mr-1" /> Resume
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <h3 className="font-display text-lg font-bold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Video className="w-6 h-6" />
                <span className="text-sm">Start Video Call</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Phone className="w-6 h-6" />
                <span className="text-sm">Start Phone Call</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ConsultationsPage;
