import { BookOpenCheck, LayoutDashboard, File } from 'lucide-react';
import { NavItem } from '@/types';

export const NavItems: NavItem[] = [
  {
    title: 'Inicio',
    icon: LayoutDashboard,
    href: '/inicio',
    color: 'text-sky-500',
  },
  {
    title: 'Opción 1',
    icon: BookOpenCheck,
    color: 'text-orange-500',
    isChidren: true,
    children: [
      {
        title: 'Submenú 1',
        icon: File,
        color: 'text-green-500',
        href: '/submenu1/',
      },
      {
        title: 'Submenú 2',
        icon: File,
        color: 'text-green-500',
        href: '/submenu2/',
      },
    ],
  }
];
