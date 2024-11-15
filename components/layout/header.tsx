// @ts-nocheck
"use client";

import ThemeToggle from "@/components/layout/ThemeToggle/theme-toggle";
import { cn } from "@/lib/utils";
import { MobileSidebar } from "./mobile-sidebar";
import { UserNav } from "./user-nav";
import { LoginNav } from "./login-nav";
import Link from "next/link";
import Image from "next/image"; 
import logo from "./logo.svg";
import { useCurrentSession } from "@/hooks/useCurrentSession";

export default function Header() {
  const { session } = useCurrentSession();
  return (
    <div className="header-gradient fixed top-0 left-0 right-0 supports-backdrop-blur:bg-background/60 border-b bg-background/95 backdrop-blur z-20">
      <nav className="flex h-16 items-center justify-between px-4">
        <Link
          className="hidden items-center justify-between gap-2 md:flex"
          href="https://www.plataformadigitalnacional.org"
          target="_blank">
          <Image
            src={logo}
            alt="Logo PDN"
            width={60} // Ajusta el ancho según tu logo
            className="mr-3" // Agrega margen derecho para separar del texto
          />
          <h1 className="text-lg font-semibold text-white">Plataforma Digital Nacional</h1>
        </Link>
        <div className={cn("block md:!hidden")}>
          <MobileSidebar />
        </div>

        <div className="flex items-center gap-2">
          {session?.user ? <UserNav user={session.user} /> : <LoginNav />}
          <ThemeToggle />
        </div>
      </nav>
    </div>
  );
}
