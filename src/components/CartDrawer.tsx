"use client"

import { useCart } from "@/context/CartContext"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { cart, addToCart, removeFromCart, decreaseQuantity, clearCart } = useCart()
  const router = useRouter()

  const total = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  )

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-[70] transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[80] shadow-2xl flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">
            Carrito ({cart.length})
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
            aria-label="Cerrar carrito"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg
                className="w-16 h-16 text-gray-300 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                />
              </svg>
              <p className="text-gray-500 text-lg font-medium mb-2">
                Tu carrito esta vacio
              </p>
              <p className="text-gray-400 text-sm mb-4">
                Agrega productos para comenzar
              </p>
              <button
                onClick={() => {
                  onClose()
                  router.push("/products")
                }}
                className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
              >
                Ver productos
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={`${item.id}-${item.size}`}
                className="flex gap-4 animate-slide-in-up"
              >
                {item.image && item.image.startsWith("http") ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover shrink-0"
                  />
                ) : (
                  <div className="w-[80px] h-[80px] bg-gray-100 rounded-lg shrink-0 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">Sin</span>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{item.name}</h3>
                  {item.size && (
                    <p className="text-xs text-gray-400">
                      Talla: {item.size}
                    </p>
                  )}
                  <p className="text-sm font-semibold mt-1">
                    {(item.price * item.quantity).toLocaleString()}
                  </p>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decreaseQuantity(item.id, item.size!)}
                        className="w-7 h-7 flex items-center justify-center rounded border hover:bg-gray-100 transition text-sm"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => addToCart(item)}
                        className="w-7 h-7 flex items-center justify-center rounded border hover:bg-gray-100 transition text-sm"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id, item.size)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t p-6 space-y-4 bg-white">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Total</span>
              <span className="text-2xl font-bold">
                {total.toLocaleString()}
              </span>
            </div>

            <p className="text-xs text-gray-400">
              Envio gratis en compras mayores a 50,000
            </p>

            <button
              onClick={() => {
                onClose()
                router.push("/checkout")
              }}
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
        )}
      </div>
    </>
  )
}
