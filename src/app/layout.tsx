import "./globals.css"
import { Inter } from "next/font/google"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ScrollToTop from "@/components/ScrollToTop"
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
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon.png", type: "image/png", sizes: "192x192" },
    ],
    apple: { url: "/icon.png", sizes: "192x192" },
  },
  openGraph: {
    title: "StarFit - Equipamiento Deportivo",
    description: "Equipamiento deportivo disenado para quienes no se rinden.",
    type: "website",
    locale: "es_CR",
    siteName: "StarFit",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "StarFit - Equipamiento Deportivo de Alto Rendimiento",
      },
    ],
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
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
