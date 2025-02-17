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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  )
}

