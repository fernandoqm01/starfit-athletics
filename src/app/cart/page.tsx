"use client"

import { useCart } from "@/context/CartContext"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function Cart() {
  const { cart, removeFromCart, addToCart, decreaseQuantity, clearCart } =
    useCart()
  const router = useRouter()

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  )
  const shipping = subtotal > 50000 ? 0 : 5000
  const total = subtotal + shipping

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Carrito</h1>
        <div className="text-center py-20 animate-slide-in-up">
          <svg className="w-24 h-24 text-gray-200 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
          <p className="text-gray-500 text-lg mb-2">Tu carrito esta vacio</p>
          <p className="text-gray-400 text-sm mb-6">
            Agrega productos para comenzar
          </p>
          <button
            onClick={() => router.push("/products")}
            className="bg-black text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
          >
            Ver productos
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Carrito</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Items */}
        <div className="md:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={`${item.id}-${item.size}`}
              className="flex justify-between items-start border rounded-xl p-4"
            >
              <div className="flex items-center gap-4">
                {item.image && item.image.startsWith("http") ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover shrink-0 bg-gray-100"
                  />
                ) : (
                  <div className="w-[80px] h-[80px] bg-gray-100 rounded-lg shrink-0 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">Sin</span>
                  </div>
                )}
                <div>
                  <h2 className="font-semibold">{item.name}</h2>
                  {item.size && (
                    <p className="text-sm text-gray-500">
                      Talla: {item.size}
                    </p>
                  )}
                  <p className="text-gray-500">{item.price.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => removeFromCart(item.id, item.size)}
                  className="text-red-500 hover:underline text-sm"
                >
                  Eliminar
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decreaseQuantity(item.id, item.size!)}
                    className="w-7 h-7 flex items-center justify-center border rounded hover:bg-gray-100 transition text-sm"
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-sm">{item.quantity}</span>
                  <button
                    onClick={() => addToCart(item)}
                    className="w-7 h-7 flex items-center justify-center border rounded hover:bg-gray-100 transition text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen */}
        <div className="md:col-span-1">
          <div className="bg-gray-50 rounded-xl p-6 space-y-4 sticky top-24">
            <h2 className="text-xl font-bold">Resumen</h2>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span>{subtotal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Envio</span>
              <span className={shipping === 0 ? "text-green-600 font-semibold" : ""}>
                {shipping === 0 ? "Gratis" : shipping.toLocaleString()}
              </span>
            </div>

            {shipping > 0 && (
              <p className="text-xs text-gray-400">
                Envio gratis en compras mayores a 50,000
              </p>
            )}

            <hr />

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{total.toLocaleString()}</span>
            </div>

            <button
              onClick={() => router.push("/checkout")}
              className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
            >
              Proceder al pago
            </button>

            <button
              onClick={clearCart}
              className="w-full text-red-500 text-sm hover:underline py-1"
            >
              Vaciar carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
