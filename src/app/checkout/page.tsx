"use client"

import { useState } from "react"
import { useCart } from "@/context/CartContext"
import { useRouter } from "next/navigation"
import { supabaseClient as supabase } from "@/lib/supabase-client"

export default function Checkout() {
  const router = useRouter()
  const { cart, clearCart } = useCart()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    metodo: "tarjeta",
  })

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  )
  const shipping = subtotal > 50000 ? 0 : 5000
  const total = subtotal + shipping

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const order = {
        customer_name: formData.nombre,
        customer_email: formData.email,
        customer_phone: formData.telefono,
        customer_address: formData.direccion,
        customer_city: formData.ciudad,
        payment_method: formData.metodo,
        total,
        items: cart.map((item) => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price,
          size: item.size || null,
        })),
        status: "pendiente",
      }

      const { error } = await supabase.from("orders").insert([order])

      if (error) throw error

      clearCart()
      setStep(3)
    } catch {
      alert("Error al procesar la orden. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0 && step !== 3) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center py-20">
        <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
        <p className="text-gray-500 text-lg mb-4">No hay productos en el carrito</p>
        <button
          onClick={() => router.push("/products")}
          className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition"
        >
          Ver productos
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= s ? "bg-black text-white" : "bg-gray-200 text-gray-500"
              }`}
            >
              {s}
            </div>
            {s < 3 && (
              <div
                className={`flex-1 h-1 mx-2 ${
                  step > s ? "bg-black" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Info */}
      {step === 1 && (
        <div>
          <h1 className="text-2xl font-bold mb-6">Informacion de envio</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setStep(2)
            }}
            className="space-y-4"
          >
            <input
              name="nombre"
              placeholder="Nombre completo"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <input
              name="telefono"
              placeholder="Telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <input
              name="direccion"
              placeholder="Direccion de envio"
              value={formData.direccion}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <input
              name="ciudad"
              placeholder="Ciudad"
              value={formData.ciudad}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
            >
              Continuar al pago
            </button>
          </form>
        </div>
      )}

      {/* Step 2: Payment */}
      {step === 2 && (
        <form onSubmit={handlePlaceOrder}>
          <h1 className="text-2xl font-bold mb-6">Metodo de pago</h1>

          {/* Items summary */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2">
            {cart.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex justify-between text-sm">
                <span>
                  {item.name} {item.size && `(Talla ${item.size})`} x{item.quantity}
                </span>
                <span>{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <hr />
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Envio</span>
              <span className={shipping === 0 ? "text-green-600 font-semibold" : ""}>
                {shipping === 0 ? "Gratis" : shipping.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{total.toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <label className="flex items-center gap-3 border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition">
              <input
                type="radio"
                name="metodo"
                value="tarjeta"
                checked={formData.metodo === "tarjeta"}
                onChange={handleChange}
              />
              <span className="font-medium">Tarjeta de credito</span>
            </label>
            <label className="flex items-center gap-3 border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition">
              <input
                type="radio"
                name="metodo"
                value="sinpe"
                checked={formData.metodo === "sinpe"}
                onChange={handleChange}
              />
              <span className="font-medium">SINPE Movil</span>
            </label>
            <label className="flex items-center gap-3 border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition">
              <input
                type="radio"
                name="metodo"
                value="transferencia"
                checked={formData.metodo === "transferencia"}
                onChange={handleChange}
              />
              <span className="font-medium">Transferencia bancaria</span>
            </label>
          </div>

          <div className="flex gap-3 mb-6">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 border border-black py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
            >
              Volver
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition disabled:opacity-50"
            >
              {loading ? "Procesando..." : "Confirmar orden"}
            </button>
          </div>

          {/* Trust badges */}
          <div className="border-t pt-6 grid grid-cols-3 gap-4 text-center text-xs text-gray-500">
            <div className="p-3">
              <svg className="w-6 h-6 mx-auto mb-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              Pago 100% seguro
            </div>
            <div className="p-3">
              <svg className="w-6 h-6 mx-auto mb-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-.001 9.984l2.929-2.929m0 0l-2.929-2.929m0 0l-2.929 2.929m0 0l2.929 2.929M3.524 4.356h4.992V9.348M21.015 4.356v4.992m-4.992 0h4.992m0 0l2.929-2.929m0 0l-2.929-2.929m0 0l-2.929 2.929m0 0l2.929 2.929" />
              </svg>
              Devoluciones gratis
            </div>
            <div className="p-3">
              <svg className="w-6 h-6 mx-auto mb-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.342.196-2.647 1.573-2.647 3.209v4.286c0 .837.46 1.58 1.155 1.951" />
              </svg>
              Soporte 24/7
            </div>
          </div>
        </form>
      )}

      {/* Step 3: Success */}
      {step === 3 && (
        <div className="text-center py-12 animate-slide-in-up">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">Orden confirmada!</h1>
          <p className="text-gray-600 mb-6">
            Te hemos enviado un email con los detalles de tu orden.
          </p>
          <button
            onClick={() => router.push("/products")}
            className="bg-black text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
          >
            Seguir comprando
          </button>
        </div>
      )}
    </div>
  )
}
