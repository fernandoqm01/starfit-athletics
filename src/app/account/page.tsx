"use client"

import { useEffect, useState } from "react"
import { supabaseClient as supabase } from "@/lib/supabase-client"
import { useRouter } from "next/navigation"

interface OrderItem {
  product_id: number
  product_name: string
  quantity: number
  price: number
  size: string | null
}

interface Order {
  id: number
  created_at: string
  customer_name: string
  customer_email: string
  total: number
  status: string
  items: OrderItem[]
  tracking_code: string | null
}

export default function Account() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        router.push("/login")
        return
      }
      setUser(data.user)
    }
    fetchSession()
  }, [router])

  useEffect(() => {
    if (!user) return

    const fetchOrders = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("customer_email", user.email)
        .order("created_at", { ascending: false })

      if (data) setOrders(data)
      setLoading(false)
    }

    fetchOrders()
  }, [user])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Mi Cuenta</h1>
          <p className="text-gray-500 text-sm">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
        >
          Cerrar sesion
        </button>
      </div>

      <div className="mb-10">
        <h2 className="text-lg font-semibold mb-4">Mis pedidos</h2>

        {loading ? (
          <p className="text-gray-500">Cargando pedidos...</p>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="text-gray-500">Aun no has realizado pedidos</p>
            <button
              onClick={() => router.push("/products")}
              className="mt-4 text-sm font-semibold hover:underline"
            >
              Ver productos
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-xl p-5 hover:shadow-md transition">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      Pedido #{order.id} - {new Date(order.created_at).toLocaleDateString()}
                    </p>
                    {order.tracking_code && (
                      <p className="text-xs text-gray-400 mt-1">
                        Tracking: <span className="font-medium text-gray-700">{order.tracking_code}</span>
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        order.status === "entregado"
                          ? "bg-green-100 text-green-700"
                          : order.status === "enviado"
                          ? "bg-blue-100 text-blue-700"
                          : order.status === "confirmado"
                          ? "bg-indigo-100 text-indigo-700"
                          : order.status === "pendiente_pago"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.status.replace("_", " ").charAt(0).toUpperCase() + order.status.replace("_", " ").slice(1)}
                    </span>
                    <p className="font-bold mt-2">{order.total.toLocaleString()}</p>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <p className="text-xs text-gray-400 mb-2 font-semibold uppercase">Productos</p>
                  <div className="flex flex-wrap gap-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="text-sm">
                        <p className="font-medium">{item.product_name}</p>
                        <p className="text-gray-500">
                          {item.quantity}x {item.size && `(Talla: ${item.size})`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
