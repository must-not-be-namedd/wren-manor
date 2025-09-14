import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const useSystemLockCheck = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSystemLock = () => {
      const systemCompleted = localStorage.getItem('wren-manor-system-completed');
      if (systemCompleted === 'true') {
        toast({
          title: "System Locked",
          description: "This system has been locked due to a game violation. Please try from a different device.",
          variant: "destructive",
          duration: 10000,
        });
        // Redirect to home page after short delay
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 2000);
      }
    };

    checkSystemLock();
  }, [navigate, toast]);
};