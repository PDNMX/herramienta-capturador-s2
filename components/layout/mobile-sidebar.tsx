"use client";
import { useState, useEffect } from "react";
import { SideNav } from "@/components/layout/side-nav";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavItems } from "@/constants/side-nav";
import { MenuIcon } from "lucide-react";

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <div className="flex items-center justify-center gap-2">
          <SheetTrigger asChild>
              <MenuIcon className="cursor-pointer text-white"/>
          </SheetTrigger>
          <h1 className="text-lg font-semibold text-white">Plataforma Digital Nacional</h1>
        </div>
        <SheetContent side="left" className="w-75">
          <div className="py-6 pt-12">
            <SideNav items={NavItems} setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
