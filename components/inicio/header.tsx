// @ts-nocheck
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import ThemeToggle from '@/components/layout/ThemeToggle/theme-toggle';
import AccessibilityMenu from '@/components/layout/AccessibilityMenu/accessibillty-menu';
import logoPDNd from '@/components/layout/logo-dark.svg';
import logoPDNw from '@/components/layout/logo-white.svg';
import logoPDNh from '@/components/layout/logo-high-contrast.svg';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  const { theme } = useTheme();
  //console.log(theme); // Verifica si devuelve 'high-contrast'

  return (
    <header className="absolute w-full h-16">
      <nav className="h-full w-full px-6">
        <div className="flex h-full items-center justify-between">
          <Link href="https://www.plataformadigitalnacional.org" target="_blank" className="flex items-center">
            <Image
              src={ theme === 'dark'  ? logoPDNw  : theme === 'high-contrast' ? logoPDNh : logoPDNd }
              alt="Logo PDN"
              width={60}
              height={24}
              className="h-6 w-auto"
            />
            <span className="ml-2 text-sm font-semibold text-dark hidden sm:inline">Plataforma Digital Nacional</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              size="sm"
              className="flex items-center gap-2"
              asChild
            >
              <Link href="#">
                <ShieldCheck className="h-4 w-4" />
                <span className="hidden sm:inline">Aviso de privacidad</span>
              </Link>
            </Button>
            <AccessibilityMenu />
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
}
