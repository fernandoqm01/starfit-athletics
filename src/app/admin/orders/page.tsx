"use client"

import { useEffect, useState, useCallback } from "react"
import { supabaseClient as supabase } from "@/lib/supabase-client"
import Link from "next/link"

type OrderItem = {
  product_id: number
  product_name: string
  quantity: number
  price: number
  size: string | null
}

type Order = {
  id: number
  created_at: string
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_address: string
  customer_city: string
  payment_method: string
  total: number
  items: OrderItem[]
  status: string
}

const STATUS_OPTIONS = ["pendiente", "confirmado", "enviado", "entregado", "cancelado"]

const STATUS_COLORS: Record<string, string> = {
  pendiente: "bg-yellow-100 text-yellow-700",
  confirmado: "bg-blue-100 text-blue-700",
  enviado: "bg-purple-100 text-purple-700",
  entregado: "bg-green-100 text-green-700",
  cancelado: "bg-red-100 text-red-700",
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Order | null>(null)
  const [statusFilter, setStatusFilter] = useState("todos")

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
      setOrders((data || []) as Order[])
    } catch {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const updateStatus = async (id: number, status: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id)

    if (error) {
      alert("Error al actualizar")
      return
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    )
    if (selected?.id === id) {
      setSelected((prev) => (prev ? { ...prev, status } : null))
    }
  }

  const filtered =
    statusFilter === "todos"
      ? orders
      : orders.filter((o) => o.status === statusFilter)

  const statusCounts = STATUS_OPTIONS.reduce(
    (acc, s) => ({
      ...acc,
      [s]: orders.filter((o) => o.status === s).length,
    }),
    {} as Record<string, number>
  )

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Ordenes</h1>
          <p className="text-gray-500 text-sm mt-1">{orders.length} ordenes en total</p>
        </div>
        <Link
          href="/admin"
          className="text-sm text-gray-500 hover:text-black transition"
        >
          Volver al panel
        </Link>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setStatusFilter("todos")}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
            statusFilter === "todos"
              ? "bg-black text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Todos ({orders.length})
        </button>
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize transition ${
              statusFilter === s
                ? "bg-black text-white"
                : `${STATUS_COLORS[s]} hover:opacity-80`
            }`}
          >
            {s} ({statusCounts[s] || 0})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="border rounded-xl p-4 animate-pulse">
              <div className="flex justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32" />
                  <div className="h-3 bg-gray-200 rounded w-48" />
                </div>
                <div className="space-y-2 text-right">
                  <div className="h-4 bg-gray-200 rounded w-20" />
                  <div className="h-6 bg-gray-200 rounded-full w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <svg className="w-20 h-20 text-gray-200 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <p className="text-gray-500 text-lg">No hay ordenes con este filtro</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <button
              key={order.id}
              onClick={() => setSelected(order)}
              className="w-full border rounded-xl p-4 hover:shadow-md transition text-left"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">
                    #{order.id} - {order.customer_name}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(order.created_at).toLocaleDateString("es-CR", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {order.items.length} producto{order.items.length !== 1 ? "s" : ""}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold">{order.total.toLocaleString()}</p>
                  <span
                    className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                      STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Order detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-in-up">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold">Orden #{selected.id}</h2>
              <button
                onClick={() => setSelected(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div>
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Estado
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selected.id, s)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition ${
                        selected.status === s
                          ? "bg-black text-white"
                          : `${STATUS_COLORS[s]} hover:opacity-80`
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer */}
              <div>
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Cliente
                </label>
                <div className="mt-2 space-y-1">
                  <p className="font-medium">{selected.customer_name}</p>
                  <p className="text-sm text-gray-600">{selected.customer_email}</p>
                  <p className="text-sm text-gray-600">{selected.customer_phone}</p>
                  <p className="text-sm text-gray-600">
                    {selected.customer_address}, {selected.customer_city}
                  </p>
                </div>
              </div>

              {/* Payment */}
              <div>
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Metodo de pago
                </label>
                <p className="mt-1 capitalize font-medium">{selected.payment_method}</p>
              </div>

              {/* Items */}
              <div>
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Productos
                </label>
                <div className="mt-2 space-y-2">
                  {selected.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm border-b pb-2">
                      <span>
                        {item.product_name}
                        {item.size && <span className="text-gray-400"> ({item.size})</span>}
                        <span className="text-gray-400"> x{item.quantity}</span>
                      </span>
                      <span className="font-medium">
                        {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-bold mt-4 pt-4 border-t">
                  <span>Total</span>
                  <span>{selected.total.toLocaleString()}</span>
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Fecha
                </label>
                <p className="mt-1 text-sm text-gray-600">
                  {new Date(selected.created_at).toLocaleString("es-CR")}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
