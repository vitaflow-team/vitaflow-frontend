import { Dumbbell, Home, User2 } from 'lucide-react';

export const APP_ROUTES = {
  HOME: '/',
  SIGN_IN: '/signin',
  SIGN_UP: '/signup',
  ROUTE_PRIVATE: '/restrict',
  USER_SETTINGS: '/restrict/settings',
  EXCLUDED_ROUTES: ['/restrict', '/restrict/settings'],
  PRIVATE: [
    {
      TITLE: 'Início',
      URL: '/restrict',
      ICON: Home,
      PRODUCT_TYPE: ['USER', 'NUTRITIONIST', 'PHYSICAL_EDUCATOR'],
    },
    {
      TITLE: 'Pessoas',
      URL: '/restrict/clients',
      ICON: User2,
      PRODUCT_TYPE: ['NUTRITIONIST', 'PHYSICAL_EDUCATOR'],
    },
    {
      TITLE: 'Treinos',
      URL: '/restrict/workouts',
      ICON: Dumbbell,
      PRODUCT_TYPE: ['USER', 'NUTRITIONIST', 'PHYSICAL_EDUCATOR'],
    },
  ],
};
