"use client";

import UserAuthForm from "@/components/forms/user-auth-form";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LoginNav() {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" className="relative text-xs md:text-sm rounded-full">
            Ingresar
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-100" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <UserAuthForm/>
          </DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
