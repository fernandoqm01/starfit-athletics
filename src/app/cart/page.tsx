"use client"

import { useCart } from "@/context/CartContext"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import ConfirmModal from "@/components/ConfirmModal"

export default function Cart() {
  const { cart, removeFromCart, addToCart, decreaseQuantity, clearCart } =
    useCart()
  const [confirmOpen, setConfirmOpen] = useState(false)

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  )
  const shipping = subtotal > 50000 ? 0 : 5000
  const total = subtotal + shipping
  const progress = Math.min((subtotal / 50000) * 100, 100)

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Tu carrito esta vacio</h1>
          <p className="text-gray-500 text-sm mb-8">Agrega productos para comenzar tu compra</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Ver productos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Carrito de compras</h1>
          <p className="text-gray-500 text-sm mt-0.5">{cart.length} {cart.length === 1 ? "articulo" : "articulos"}</p>
        </div>
        <button
          onClick={() => setConfirmOpen(true)}
          className="text-sm text-gray-400 hover:text-red-500 flex items-center gap-1.5 transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
          Vaciar carrito
        </button>
      </div>

      {shipping > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Te faltan <span className="font-semibold text-gray-900">₡{(50000 - subtotal).toLocaleString()}</span> para envio gratis</span>
            <span className="text-gray-900 font-semibold">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gray-900 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {shipping === 0 && subtotal > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-6 flex items-center gap-2.5">
          <svg className="w-5 h-5 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-green-700 text-sm font-medium">Tu envio es gratis</span>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={`${item.id}-${item.size}`}
              className="flex items-center gap-6 bg-white border border-gray-200 rounded-2xl p-6"
            >
              <div className="w-28 h-28 shrink-0 rounded-xl overflow-hidden bg-gray-100">
                {item.image && item.image.startsWith("http") ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={112}
                    height={112}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-base">{item.name}</h3>
                    {item.size && (
                      <span className="inline-block mt-1.5 text-sm text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-md">
                        Talla {item.size}
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-base shrink-0">₡{(item.price * item.quantity).toLocaleString()}</p>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      onClick={() => decreaseQuantity(item.id, item.size!)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition text-gray-500"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                      </svg>
                    </button>
                    <span className="w-10 text-center text-base h-10 flex items-center justify-center border-x border-gray-200 bg-white font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => addToCart(item)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition text-gray-500"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id, item.size)}
                    className="text-sm text-gray-400 hover:text-red-500 transition font-medium"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-xl p-5 sticky top-24">
            <h2 className="font-bold mb-4">Resumen</h2>

            <div className="space-y-2.5 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">₡{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Envio</span>
                <span className={shipping === 0 ? "text-green-600 font-semibold" : ""}>
                  {shipping === 0 ? "Gratis" : `₡${shipping.toLocaleString()}`}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mb-5">
              <div className="flex justify-between items-baseline">
                <span className="font-bold">Total</span>
                <span className="text-xl font-bold">₡{total.toLocaleString()}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="block w-full bg-black text-white text-center py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
            >
              Proceder al pago
            </Link>

            <Link
              href="/products"
              className="block w-full text-center text-sm text-gray-400 hover:text-gray-600 mt-3 transition"
            >
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Vaciar carrito"
        message="Esta accion eliminara todos los productos de tu carrito."
        confirmLabel="Si, vaciar"
        cancelLabel="Cancelar"
        variant="danger"
        onConfirm={() => { clearCart(); setConfirmOpen(false) }}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}
