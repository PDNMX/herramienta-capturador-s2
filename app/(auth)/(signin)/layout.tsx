import Header from "@/components/layout/header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || "S2",
  description:
    "Sistema de los servidores públicos que intervengan en procedimientos de contrataciones pública",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div>
        <main className="w-full pt-16">
          <div className="max-w-screen-2xl mx-auto">{children}</div>
        </main>
      </div>
    </>
  );
}
