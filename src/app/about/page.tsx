import Link from "next/link"
import Image from "next/image"

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Sobre StarFit
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Nacimos de la pasion por el deporte y la conviccion de que todos merecen equipamiento de calidad para alcanzar sus metas.
        </p>
      </div>

      {/* Historia */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div className="bg-gray-100 rounded-2xl h-80 flex items-center justify-center">
          <Image
            src="/banner.png"
            alt="StarFit"
            width={400}
            height={200}
            className="object-cover rounded-2xl"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Nuestra historia</h2>
          <p className="text-gray-600 mb-4">
            StarFit comenzo en 2024 con un objetivo claro: ofrecer equipamiento deportivo de alta calidad a precios accesibles para toda Costa Rica.
          </p>
          <p className="text-gray-600 mb-4">
            Lo que empezo como un pequeno emprendimiento hoy es la tienda de confianza de miles de atletas que buscan rendimiento, estilo y comodidad en cada producto.
          </p>
          <p className="text-gray-600">
            Trabajamos directamente con las mejores fabricas para garantizar materiales duraderos y disenos modernos que te acompanen en cada entrenamiento.
          </p>
        </div>
      </div>

      {/* Valores */}
      <div className="mb-20">
        <h2 className="text-2xl font-bold text-center mb-10">
          Nuestros valores
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.745 3.745 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.743 3.743 0 013.296-1.043A3.745 3.745 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.745 3.745 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-2">Calidad</h3>
            <p className="text-gray-600 text-sm">
              Cada producto pasa por rigurosas pruebas antes de llegar a tus manos.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-2">Comunidad</h3>
            <p className="text-gray-600 text-sm">
              Somos mas que una tienda, somos una familia de atletas apasionados.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-2">Accesible</h3>
            <p className="text-gray-600 text-sm">
              Precios justos para que el deporte sea para todos, sin excepciones.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gray-50 rounded-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center mb-16">
        <div>
          <p className="text-3xl font-bold text-blue-600">500+</p>
          <p className="text-sm text-gray-500 mt-1">Clientes felices</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-blue-600">100+</p>
          <p className="text-sm text-gray-500 mt-1">Productos</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-blue-600">5</p>
          <p className="text-sm text-gray-500 mt-1">Categorias</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-blue-600">24/7</p>
          <p className="text-sm text-gray-500 mt-1">Soporte</p>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Unete a la familia StarFit</h2>
        <p className="text-gray-600 mb-6">
          Descubre nuestros productos y lleva tu entrenamiento al siguiente nivel.
        </p>
        <Link
          href="/products"
          className="inline-block bg-black text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
        >
          Ver productos
        </Link>
      </div>
    </div>
  )
}
