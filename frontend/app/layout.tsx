import "./globals.css"
import { Providers } from "./providers"

export const metadata = {
  title: "S2 - Sistema de Servidores Públicos",
  description: "Sistema de gestión de servidores públicos que intervengan en procedimientos de contrataciones públicas - Plataforma Digital Nacional",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}