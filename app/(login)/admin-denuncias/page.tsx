// @ts-nocheck
import { Metadata } from "next";
import UserAuthForm from "@/components/forms/user-auth-form";
import LogoS2 from "@/components/s2-logo-color.svg"; // Ruta a tu logo PDN
import Image from "next/image"; // Import Image component from Next.js
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
export const metadata: Metadata = {
  title: "Inicia Sesión",
  description: "Introduce tus credenciales para acceder al sistema de captura de información",
};

export default function AuthenticationPage() {
  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-1 lg:px-0">
      <div className="flex h-full items-center p-4 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl text-center font-semibold tracking-tight">
                <Image
                  src={LogoS2}
                  alt="Logo S2"
                  width={140}
                  className="m-auto"
                />
                s5 - Denuncias
              </CardTitle>
              <CardDescription className="text-center">Introduce tus credenciales</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <UserAuthForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
