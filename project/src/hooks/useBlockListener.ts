import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '@/services/api';

export const useBlockListener = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id) return;

    // Check user status every 5 seconds
    const checkUserStatus = async () => {
      try {
        const response = await authAPI.getCurrentUser(parseInt(user.id));
        if (response.data?.blocked) {
          alert('Your account has been blocked by the administrator. You will be logged out.');
          logout();
          navigate('/login');
        }
      } catch (error) {
        console.error('[BlockListener] Error checking user status:', error);
      }
    };

    const interval = setInterval(checkUserStatus, 5000);
    return () => clearInterval(interval);
  }, [user?.id, logout, navigate]);
};
