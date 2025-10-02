import { useState, useCallback } from 'react';
import { AppNotification } from '@/types/notification';

export function useNotificationToast() {
  const [activeToast, setActiveToast] = useState<AppNotification | null>(null);

  const showToast = useCallback((notification: AppNotification) => {
    setActiveToast(notification);
  }, []);

  const hideToast = useCallback(() => {
    setActiveToast(null);
  }, []);

  return {
    activeToast,
    showToast,
    hideToast,
  };
}
