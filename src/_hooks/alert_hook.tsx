import { AlertContext } from '@/_context/alertContext';
import { use } from 'react';

export const useAlertHook = () => {
  const context = use(AlertContext);

  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }

  return context;
};
