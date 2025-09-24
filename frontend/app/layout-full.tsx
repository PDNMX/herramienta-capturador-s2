import "./globals.css"
import { Inter } from "next/font/google"
import { SessionProvider } from "next-auth/react"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "S2 - Sistema de Servidores Públicos",
  description: "Sistema de gestión de servidores públicos que intervengan en procedimientos de contrataciones públicas - Plataforma Digital Nacional",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}