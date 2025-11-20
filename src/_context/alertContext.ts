import { createContext } from 'react';

type AlertType = 'error' | 'success' | 'warning' | 'info';

interface AlertContextProps {
  openError: (message: string, title?: string, type?: AlertType) => void;
}

export const AlertContext = createContext<AlertContextProps | undefined>(
  undefined
);
