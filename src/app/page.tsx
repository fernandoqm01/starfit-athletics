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
    <main className="min-h-screen">
      {/* HERO */}
      <section className="relative h-screen flex items-center justify-center text-white">
        <Image
          src="/banner.png"
          alt="Hero banner"
          fill
          priority
          className="object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Contenido */}
        <div className="relative z-10 text-center px-6">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Rompe tus limites
          </h1>

          <p className="text-lg md:text-xl max-w-xl mx-auto mb-8 text-gray-200">
            Equipamiento deportivo disenado para quienes no se rinden.
          </p>

          <Link
            href="/products"
            className="bg-white text-black px-8 py-4 rounded-xl text-lg font-semibold hover:scale-105 transition"
          >
            Comprar ahora
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-6 grid md:grid-cols-3 gap-8 text-center max-w-5xl mx-auto">
        <div className="p-6 rounded-xl hover:shadow-lg transition">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Alto rendimiento</h3>
          <p className="text-gray-600">
            Materiales disenados para entrenamientos intensos.
          </p>
        </div>

        <div className="p-6 rounded-xl hover:shadow-lg transition">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Estilo moderno</h3>
          <p className="text-gray-600">
            Disenos que destacan dentro y fuera del gimnasio.
          </p>
        </div>

        <div className="p-6 rounded-xl hover:shadow-lg transition">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0015.019 6 5.002 5.002 0 006 7.285 4.486 4.486 0 005.82 16.318m5.362-1.5L12 12m0 0l-1.362 1.5m1.362 3L12 15m0 0l1.362 1.5M12 15v4.5" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Comodidad total</h3>
          <p className="text-gray-600">
            Ajuste perfecto para moverte sin limites.
          </p>
        </div>
      </section>

      {/* PRODUCTOS */}
      <section className="py-20 px-6 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-4">
          Productos destacados
        </h2>
        <p className="text-center text-gray-500 mb-10 max-w-xl mx-auto">
          Los productos mas populares entre nuestros clientes
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {products.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              No hay productos disponibles
            </p>
          ) : (
            products.map((item) => (
              <Link
                href={`/products/${item.id}`}
                key={item.id}
                className="group"
              >
                <div className="bg-white rounded-2xl shadow p-4 hover:shadow-lg transition">
                  {item.image && item.image.startsWith("http") ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={300}
                      height={160}
                      className="h-40 w-full object-cover rounded-lg mb-4 bg-gray-100 group-hover:opacity-90 transition"
                    />
                  ) : (
                    <div className="h-40 w-full bg-gray-100 rounded-lg mb-4" />
                  )}
                  <h3 className="font-semibold text-sm truncate">{item.name}</h3>
                  <p className="text-gray-500 text-sm">{item.price.toLocaleString()}</p>
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
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Lleva tu rendimiento al siguiente nivel
        </h2>
        <p className="text-gray-400 mb-8 max-w-lg mx-auto">
          Unete a miles de atletas que ya confian en StarFit para su entrenamiento diario.
        </p>
        <Link
          href="/products"
          className="bg-white text-black px-8 py-4 rounded-xl text-lg font-semibold hover:scale-105 transition"
        >
          Comprar ahora
        </Link>
      </section>
    </main>
  )
}
