import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
  const { allowed, remaining } = rateLimit(ip)
  if (!allowed) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Intenta de nuevo en un minuto." },
      { status: 429, headers: { "Retry-After": "60" } }
    )
  }

  try {
    const body = await request.json()
    const { cart, formData, total } = body

    if (!cart?.length || !formData) {
      return NextResponse.json(
        { error: "Datos de orden incompletos" },
        { status: 400 }
      )
    }

    if (!formData.nombre || !formData.email || !formData.telefono || !formData.direccion || !formData.ciudad) {
      return NextResponse.json(
        { error: "Todos los campos de envio son obligatorios" },
        { status: 400 }
      )
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return NextResponse.json(
        { error: "Email invalido" },
        { status: 400 }
      )
    }

    if (formData.metodo === "sinpe" && !formData.sinpeReferencia) {
      return NextResponse.json(
        { error: "Numero de comprobante SINPE requerido" },
        { status: 400 }
      )
    }

    if (cart.length > 50) {
      return NextResponse.json(
        { error: "Demasiados productos en la orden" },
        { status: 400 }
      )
    }

    const deducted: { id: number; stock: number }[] = []

    try {
      for (const item of cart) {
        if (!item.id || !item.quantity || item.quantity < 1 || item.quantity > 99) {
          throw new Error(`Cantidad invalida para ${item.name || "un producto"}`)
        }

        const { data: product, error: fetchError } = await supabase
          .from("products")
          .select("stock")
          .eq("id", item.id)
          .single()

        if (fetchError || !product) {
          throw new Error(`Error al verificar inventario de ${item.name}`)
        }

        if (product.stock < item.quantity) {
          throw new Error(`Stock insuficiente para ${item.name}`)
        }

        const { error: updateError } = await supabase
          .from("products")
          .update({ stock: product.stock - item.quantity })
          .eq("id", item.id)

        if (updateError) {
          throw new Error(`Error al actualizar stock de ${item.name}`)
        }

        deducted.push({ id: item.id, stock: product.stock })
      }

      const order = {
        user_id: null,
        customer_name: formData.nombre.trim(),
        customer_email: formData.email.trim().toLowerCase(),
        customer_phone: formData.telefono.trim(),
        customer_address: formData.direccion.trim(),
        customer_city: formData.ciudad.trim(),
        payment_method: formData.metodo,
        sinpe_referencia: formData.sinpeReferencia?.trim() || null,
        total,
        items: cart.map((item: any) => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price,
          size: item.size || null,
        })),
        status: "pendiente_pago",
      }

      const { error: insertError } = await supabase
        .from("orders")
        .insert([order])

      if (insertError) {
        throw new Error("Error al crear la orden")
      }

      return NextResponse.json({ success: true })
    } catch (error: any) {
      for (const d of deducted) {
        await supabase
          .from("products")
          .update({ stock: d.stock })
          .eq("id", d.id)
      }
      throw error
    }
  } catch (error: any) {
    console.error("Checkout error:", error)
    return NextResponse.json(
      { error: error.message || "Error al procesar la orden" },
      { status: 500 }
    )
  }
}
