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
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-[70] transition-opacity"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[80] shadow-2xl flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold">Carrito</h2>
            <p className="text-xs text-gray-400">{cart.length} {cart.length === 1 ? "producto" : "productos"}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
            aria-label="Cerrar carrito"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-5">
                <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium mb-1">Carrito vacio</p>
              <p className="text-gray-400 text-sm mb-5">Agrega productos para comenzar</p>
              <button
                onClick={() => { onClose(); router.push("/products") }}
                className="bg-black text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition"
              >
                Ver productos
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={`${item.id}-${item.size}`}
                className="flex gap-3 p-3 bg-gray-50/80 rounded-xl border border-gray-100"
              >
                {item.image && item.image.startsWith("http") ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={72}
                    height={72}
                    className="w-[72px] h-[72px] rounded-lg object-cover shrink-0"
                  />
                ) : (
                  <div className="w-[72px] h-[72px] bg-gray-200 rounded-lg shrink-0 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                    </svg>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2">
                    <h3 className="text-sm font-medium truncate">{item.name}</h3>
                    <p className="text-sm font-bold shrink-0">₡{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                  {item.size && (
                    <span className="inline-block mt-1 text-[10px] bg-white border border-gray-200 text-gray-500 px-2 py-0.5 rounded font-medium">
                      {item.size}
                    </span>
                  )}

                  <div className="flex items-center justify-between mt-2.5">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() => decreaseQuantity(item.id, item.size!)}
                        className="w-7 h-7 flex items-center justify-center hover:bg-gray-50 transition text-gray-500"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                        </svg>
                      </button>
                      <span className="w-8 text-center text-xs font-semibold border-x border-gray-200 h-7 flex items-center justify-center bg-gray-50/50">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => addToCart(item)}
                        className="w-7 h-7 flex items-center justify-center hover:bg-gray-50 transition text-gray-500"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id, item.size)}
                      className="text-gray-400 hover:text-red-500 transition"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-gray-100 p-5 space-y-3 bg-white">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">Total</span>
              <span className="text-xl font-bold">₡{total.toLocaleString()}</span>
            </div>

            <p className="text-[11px] text-gray-400 text-center">Envio gratis en compras mayores a ₡50,000</p>

            <button
              onClick={() => { onClose(); router.push("/checkout") }}
              className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition active:scale-[0.98]"
            >
              Proceder al pago
            </button>

            <button
              onClick={clearCart}
              className="w-full text-sm text-red-400 hover:text-red-600 py-1 transition"
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </>
  )
}
