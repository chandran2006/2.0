import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { adminAPI } from '@/services/api';

export const useMaintenanceMode = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Don't check on landing page or if not logged in
    if (!user || location.pathname === '/') return;
    
    // Don't check for admins
    if (user.role === 'ADMIN') return;

    const checkMaintenanceMode = async () => {
      try {
        const response = await adminAPI.getSettings();
        if (response.data?.maintenanceMode) {
          alert('System is under maintenance. You will be logged out.');
          logout();
          navigate('/');
        }
      } catch (error) {
        console.error('[MaintenanceMode] Error checking status:', error);
      }
    };

    // Check immediately and then every 10 seconds
    checkMaintenanceMode();
    const interval = setInterval(checkMaintenanceMode, 10000);
    
    return () => clearInterval(interval);
  }, [user, logout, navigate, location.pathname]);
};
