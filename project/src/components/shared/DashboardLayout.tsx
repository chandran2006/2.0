import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Heart, LayoutDashboard, Calendar, FileText, Pill, Activity, MapPin, LogOut, User, Settings, Stethoscope, Package, Clock, Video, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useBlockListener } from '@/hooks/useBlockListener';
import { useMaintenanceMode } from '@/hooks/useMaintenanceMode';

const patientNav = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Find Doctors', icon: Stethoscope, path: '/patient/doctors' },
  { label: 'Appointments', icon: Calendar, path: '/patient/appointments' },
  { label: 'Prescriptions', icon: FileText, path: '/patient/prescriptions' },
  { label: 'Medicines', icon: Pill, path: '/patient/medicines' },
  { label: 'Health Records', icon: Activity, path: '/patient/health-records' },
  { label: 'Pharmacy Finder', icon: MapPin, path: '/patient/pharmacy' },
  { label: 'Symptom Checker', icon: Stethoscope, path: '/patient/symptom-checker' },
];

const doctorNav = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Appointments', icon: Calendar, path: '/doctor/appointments' },
  { label: 'Patients', icon: User, path: '/doctor/patients' },
  { label: 'Prescriptions', icon: FileText, path: '/doctor/prescriptions' },
  { label: 'Consultations', icon: Video, path: '/doctor/consultations' },
  { label: 'Schedule', icon: Clock, path: '/doctor/schedule' },
];

const pharmacyNav = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Inventory', icon: Package, path: '/pharmacy/inventory' },
  { label: 'Orders', icon: FileText, path: '/pharmacy/orders' },
  { label: 'Prescriptions', icon: Pill, path: '/pharmacy/prescriptions' },
  { label: 'Sales', icon: Activity, path: '/pharmacy/sales' },
  { label: 'Settings', icon: Settings, path: '/pharmacy/settings' },
];

const adminNav = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Users', icon: User, path: '/admin/users' },
  { label: 'Analytics', icon: TrendingUp, path: '/admin/analytics' },
  { label: 'Reports', icon: FileText, path: '/admin/reports' },
  { label: 'Settings', icon: Settings, path: '/admin/settings' },
];

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Listen for block notifications
  useBlockListener();
  
  // Listen for maintenance mode
  useMaintenanceMode();

  const navItems = user?.role === 'DOCTOR' ? doctorNav
    : user?.role === 'PHARMACY' ? pharmacyNav
    : user?.role === 'ADMIN' ? adminNav
    : patientNav;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const roleColors: Record<string, string> = {
    PATIENT: 'bg-primary',
    DOCTOR: 'bg-info',
    PHARMACY: 'bg-success',
    ADMIN: 'bg-accent',
  };

  return (
    <div className="min-h-screen flex bg-background font-body">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card p-4 fixed h-screen">
        <Link to="/" className="flex items-center gap-2 px-3 mb-8">
          <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Heart className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold text-foreground">TeleAsha 2.0</span>
        </Link>

        <nav className="flex-1 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border pt-4 mt-4">
          <div className="flex items-center gap-3 px-3 mb-3">
            <div className={`w-9 h-9 rounded-full ${roleColors[user?.role || 'PATIENT']} flex items-center justify-center text-primary-foreground text-sm font-bold`}>
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role?.toLowerCase()}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-start text-muted-foreground hover:text-destructive">
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-card">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Heart className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold">TeleAsha 2.0</span>
          </Link>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </header>

        {/* Mobile nav */}
        <nav className="lg:hidden flex overflow-x-auto border-b border-border bg-card px-4 gap-1">
          {navItems.slice(0, 5).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 px-3 py-2 text-xs whitespace-nowrap transition-colors ${
                  isActive ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
