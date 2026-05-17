import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Productos",
  description: "Explora nuestra coleccion de equipamiento deportivo.",
}

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
