import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/shared/DashboardLayout';
import PatientDashboard from '@/components/dashboards/PatientDashboard';
import DoctorDashboard from '@/components/dashboards/DoctorDashboard';
import PharmacyDashboard from '@/components/dashboards/PharmacyDashboard';
import AdminDashboard from '@/components/dashboards/AdminDashboard';

const DashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const renderDashboard = () => {
    switch (user?.role) {
      case 'DOCTOR': return <DoctorDashboard />;
      case 'PHARMACY': return <PharmacyDashboard />;
      case 'ADMIN': return <AdminDashboard />;
      default: return <PatientDashboard />;
    }
  };

  return (
    <DashboardLayout>
      {renderDashboard()}
    </DashboardLayout>
  );
};

export default DashboardPage;
