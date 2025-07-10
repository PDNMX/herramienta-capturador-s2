import type React from "react"
import Header from "@/components/inicio/header"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || "Denuncia",
}

export default function DenunciaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 overflow">{children}</main>
    </div>
  )
}

