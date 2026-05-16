import Link from "next/link"
import Image from "next/image"
import { supabase } from "@/lib/supabase"

type Product = {
  id: number
  name: string
  price: number
  image: string
}

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const { data } = await supabase.from("products").select("*").limit(4)
    return data || []
  } catch {
    return []
  }
}

export default async function Home() {
  const products = await getFeaturedProducts()

  return (
    <main className="min-h-screen overflow-x-hidden">
      {/* HERO */}
      <section className="relative h-screen flex items-center justify-center text-white">
        {/* Background image */}
        <Image
          src="/banner.png"
          alt="Hero banner"
          fill
          priority
          className="object-cover"
        />

        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/80 animate-gradient" />

        {/* Floating decorative shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-[10%] w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/3 right-[15%] w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-float-delayed" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        </div>

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-3xl">
          <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-yellow-500 font-semibold mb-6 animate-hero-text">
            Temporada 2026
          </span>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-[1.1] animate-hero-text" style={{ animationDelay: "0.15s" }}>
            Rompe tus
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              limites
            </span>
          </h1>

          <p className="text-lg md:text-xl max-w-xl mx-auto mb-10 text-gray-200 animate-hero-text" style={{ animationDelay: "0.3s" }}>
            Equipamiento deportivo disenado para quienes no se rinden. Cada detalle importa cuando buscas la excelencia.
          </p>

          <div className="flex gap-4 justify-center animate-hero-text" style={{ animationDelay: "0.45s" }}>
            <Link
              href="/products"
              className="bg-yellow-500 text-black px-8 py-4 rounded-xl text-lg font-bold hover:bg-yellow-400 transition-all duration-300 animate-pulse-glow active:scale-95"
            >
              Comprar ahora
            </Link>

            <Link
              href="/about"
              className="border border-white/30 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              Conocer mas
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          <span className="text-[10px] tracking-[0.2em] uppercase text-white/40">Scroll</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-white/40 to-transparent animate-scroll" />
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-6 grid md:grid-cols-3 gap-8 text-center max-w-5xl mx-auto">
        <div className="p-6 rounded-xl hover:shadow-lg transition hover:-translate-y-1 duration-300 animate-scale-in" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Alto rendimiento</h3>
          <p className="text-gray-600">
            Materiales disenados para entrenamientos intensos.
          </p>
        </div>

        <div className="p-6 rounded-xl hover:shadow-lg transition hover:-translate-y-1 duration-300 animate-scale-in" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Comodidad total</h3>
          <p className="text-gray-600">
            Diseno ergonomico para moverte sin limites.
          </p>
        </div>

        <div className="p-6 rounded-xl hover:shadow-lg transition hover:-translate-y-1 duration-300 animate-scale-in" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Envio rapido</h3>
          <p className="text-gray-600">
            Recibe tu pedido en la puerta de tu casa.
          </p>
        </div>
      </section>

      {/* PRODUCTOS */}
      <section className="py-20 px-6 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-4 animate-slide-in-up">
          Productos destacados
        </h2>
        <p className="text-center text-gray-500 mb-10 max-w-xl mx-auto animate-slide-in-up" style={{ animationDelay: "0.1s" }}>
          Los productos mas populares entre nuestros clientes
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {products.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              No hay productos disponibles
            </p>
          ) : (
            products.map((item, idx) => (
              <Link
                href={`/products/${item.id}`}
                key={item.id}
                className="group animate-scale-in"
                style={{ animationDelay: `${idx * 80}ms`, animationFillMode: "both" }}
              >
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300 overflow-hidden will-change-transform hover:-translate-y-1.5">
                  <div className="relative overflow-hidden">
                    {item.image && item.image.startsWith("http") ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={300}
                        height={160}
                        className="h-44 w-full object-cover rounded-none mb-0 bg-gray-100 transition-all duration-500 ease-out group-hover:scale-110"
                      />
                    ) : (
                      <div className="h-44 w-full bg-gray-100" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 card-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm truncate group-hover:text-black transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-gray-900 text-sm font-bold mt-1.5 group-hover:scale-105 inline-block transition-transform origin-left">
                      ₡{item.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/products"
            className="inline-block border-2 border-black text-black px-8 py-3 rounded-xl font-semibold hover:bg-black hover:text-white transition"
          >
            Ver todos los productos
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center px-6 bg-black text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-slide-in-up">
          Lleva tu rendimiento al siguiente nivel
        </h2>
        <p className="text-gray-400 mb-8 max-w-lg mx-auto animate-slide-in-up" style={{ animationDelay: "0.1s" }}>
          Unete a miles de atletas que ya confian en StarFit para su entrenamiento diario.
        </p>
        <Link
          href="/products"
          className="bg-white text-black px-8 py-4 rounded-xl text-lg font-semibold hover:scale-105 transition inline-block animate-slide-in-up active:scale-95"
          style={{ animationDelay: "0.2s", animationFillMode: "both" }}
        >
          Comprar ahora
        </Link>
      </section>
    </main>
  )
}
