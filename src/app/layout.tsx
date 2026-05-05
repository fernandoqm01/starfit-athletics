import "./globals.css"
import { Inter } from "next/font/google"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ScrollToTop from "@/components/ScrollToTop"
import CookieBanner from "@/components/CookieBanner"
import { CartProvider } from "@/context/CartContext"
import type { Metadata } from "next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "StarFit - Equipamiento Deportivo de Alto Rendimiento",
    template: "%s | StarFit",
  },
  description: "Equipamiento deportivo disenado para quienes no se rinden. Ropa, calzado, accesorios, equipamiento y suplementos.",
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    title: "StarFit - Equipamiento Deportivo",
    description: "Equipamiento deportivo disenado para quienes no se rinden.",
    type: "website",
    locale: "es_CR",
    siteName: "StarFit",
  },
  twitter: {
    card: "summary_large_image",
    title: "StarFit - Equipamiento Deportivo",
    description: "Equipamiento deportivo disenado para quienes no se rinden.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <CartProvider>
          <Navbar />
          <div className="pt-16">{children}</div>
          <ScrollToTop />
          <CookieBanner />
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
