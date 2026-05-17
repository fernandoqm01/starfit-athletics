"use client"

import { useCart } from "@/context/CartContext"
import Image from "next/image"
import Link from "next/link"

export default function Cart() {
  const { cart, removeFromCart, addToCart, decreaseQuantity, clearCart } =
    useCart()

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
          <div className="w-28 h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-14 h-14 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-3">Tu carrito esta vacio</h1>
          <p className="text-gray-500 mb-8">Agrega productos para comenzar tu compra</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-black text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-gray-800 transition shadow-lg shadow-black/10"
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
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Carrito</h1>
          <p className="text-gray-500 text-sm mt-1">{cart.length} {cart.length === 1 ? "producto" : "productos"}</p>
        </div>
        <button
          onClick={clearCart}
          className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1.5 transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
          Vaciar carrito
        </button>
      </div>

      {/* Shipping progress */}
      {shipping > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-yellow-700 font-medium">Te faltan ₡{(50000 - subtotal).toLocaleString()} para envio gratis</span>
            <span className="text-yellow-600 font-semibold">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-yellow-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {shipping === 0 && subtotal > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8 flex items-center gap-3">
          <svg className="w-5 h-5 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-green-700 text-sm font-medium">Tu envio es gratis</span>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={`${item.id}-${item.size}`}
              className="flex gap-5 bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg hover:border-gray-200 transition-all duration-300"
            >
              {/* Image */}
              <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-gray-100">
                {item.image && item.image.startsWith("http") ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={96}
                    height={96}
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

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-base">{item.name}</h3>
                    {item.size && (
                      <span className="inline-block mt-1 text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md font-medium">
                        Talla: {item.size}
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-base shrink-0">₡{(item.price * item.quantity).toLocaleString()}</p>
                </div>

                <div className="flex items-center justify-between mt-4">
                  {/* Quantity */}
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => decreaseQuantity(item.id, item.size!)}
                      className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition text-gray-600 hover:text-black"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                      </svg>
                    </button>
                    <span className="w-10 text-center text-sm font-semibold border-x border-gray-200 h-9 flex items-center justify-center bg-gray-50/50">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => addToCart(item)}
                      className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition text-gray-600 hover:text-black"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id, item.size)}
                    className="text-sm text-red-400 hover:text-red-600 flex items-center gap-1 transition"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5 sticky top-24 shadow-sm">
            <h2 className="text-lg font-bold">Resumen de orden</h2>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">₡{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Envio</span>
                <span className={shipping === 0 ? "text-green-600 font-semibold" : "font-medium"}>
                  {shipping === 0 ? "Gratis" : `₡${shipping.toLocaleString()}`}
                </span>
              </div>
            </div>

            <hr className="border-gray-100" />

            <div className="flex justify-between items-baseline">
              <span className="text-base font-bold">Total</span>
              <span className="text-2xl font-bold">₡{total.toLocaleString()}</span>
            </div>

            {shipping > 0 && (
              <p className="text-xs text-gray-400 text-center">
                Envio gratis en compras mayores a ₡50,000
              </p>
            )}

            <Link
              href="/checkout"
              className="block w-full bg-black text-white text-center py-3.5 rounded-xl font-semibold hover:bg-gray-800 transition shadow-lg shadow-black/10 active:scale-[0.98]"
            >
              Proceder al pago
            </Link>

            <Link
              href="/products"
              className="block w-full text-center text-sm text-gray-500 hover:text-black py-2 transition"
            >
              Seguir comprando
            </Link>

            {/* Payment methods */}
            <div className="border-t border-gray-100 pt-4 text-center">
              <p className="text-[10px] tracking-wider uppercase text-gray-400 font-semibold mb-3">Metodos de pago</p>
              <div className="flex justify-center gap-3 text-gray-300">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="2" y="4" width="20" height="16" rx="2" strokeWidth="1.5" stroke="currentColor" fill="none" />
                  <text x="5" y="16" fontSize="7" fontWeight="bold" fill="currentColor">MC</text>
                </svg>
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="2" y="4" width="20" height="16" rx="2" strokeWidth="1.5" stroke="currentColor" fill="none" />
                  <text x="5" y="16" fontSize="7" fontWeight="bold" fill="currentColor">VI</text>
                </svg>
                <span className="text-[10px] font-bold self-center tracking-tight">SINPE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
