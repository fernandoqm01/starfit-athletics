"use client"

import { useState } from "react"
import { supabaseClient as supabase } from "@/lib/supabase-client"

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("")
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setOrder(null)
    setLoading(true)

    try {
      const id = Number(orderId)
      if (!id) {
        setError("Ingresa un numero de orden valido")
        return
      }

      const { data, error: fetchError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .single()

      if (fetchError || !data) {
        setError("Orden no encontrada")
        return
      }

      setOrder(data)
    } catch {
      setError("Error al buscar la orden")
    } finally {
      setLoading(false)
    }
  }

  const statusLabels: Record<string, string> = {
    pendiente_pago: "Pendiente de pago",
    pagado: "Pagado",
    enviado: "Enviado",
    entregado: "Entregado",
    cancelado: "Cancelado",
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">Seguimiento de orden</h1>
      <p className="text-gray-500 mb-8">Ingresa el numero de tu orden para ver su estado.</p>

      <form onSubmit={handleSearch} className="flex gap-3 mb-10">
        <input
          type="number"
          placeholder="Numero de orden"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="flex-1 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50"
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-sm text-red-600 mb-6">
          {error}
        </div>
      )}

      {order && (
        <div className="border border-gray-200 rounded-xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-lg">Orden #{order.id}</h2>
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${
              order.status === "entregado" ? "bg-green-100 text-green-700" :
              order.status === "enviado" ? "bg-blue-100 text-blue-700" :
              order.status === "cancelado" ? "bg-red-100 text-red-700" :
              "bg-yellow-100 text-yellow-700"
            }`}>
              {statusLabels[order.status] || order.status}
            </span>
          </div>

          <div className="text-sm text-gray-500 space-y-1">
            <p>Cliente: {order.customer_name}</p>
            <p>Email: {order.customer_email}</p>
            <p>Direccion: {order.customer_address}, {order.customer_city}</p>
            <p>Metodo de pago: {order.payment_method === "sinpe" ? "SINPE" : "Contra entrega"}</p>
            <p>Total: ₡{order.total?.toLocaleString?.() || order.total}</p>
            <p>Creada: {new Date(order.created_at).toLocaleDateString("es-CR")}</p>
          </div>
        </div>
      )}
    </div>
  )
}
