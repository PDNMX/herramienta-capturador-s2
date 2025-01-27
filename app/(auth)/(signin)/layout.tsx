// app/(auth)/(signin)/presentar-denuncia/layout.tsx
import Header from "@/components/layout/header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || "Denuncia",
};

export default function DenunciaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div>
        <main className="w-full pt-16">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}