import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { cart, formData, total } = body

    if (!cart?.length || !formData) {
      return NextResponse.json(
        { error: "Datos de orden incompletos" },
        { status: 400 }
      )
    }

    for (const item of cart) {
      const { data: product, error: fetchError } = await supabase
        .from("products")
        .select("stock")
        .eq("id", item.id)
        .single()

      if (fetchError) {
        return NextResponse.json(
          { error: "Error al verificar inventario" },
          { status: 500 }
        )
      }

      if (!product || product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Stock insuficiente para ${item.name}` },
          { status: 400 }
        )
      }

      const { error: updateError } = await supabase
        .from("products")
        .update({ stock: product.stock - item.quantity })
        .eq("id", item.id)

      if (updateError) {
        return NextResponse.json(
          { error: "Error al actualizar inventario" },
          { status: 500 }
        )
      }
    }

    const { data: { user } } = await supabase.auth.getUser()

    const order = {
      user_id: user?.id ?? null,
      customer_name: formData.nombre,
      customer_email: formData.email,
      customer_phone: formData.telefono,
      customer_address: formData.direccion,
      customer_city: formData.ciudad,
      payment_method: formData.metodo,
      sinpe_referencia: formData.sinpeReferencia || null,
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
      return NextResponse.json(
        { error: "Error al crear la orden" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json(
      { error: "Error al procesar la orden" },
      { status: 500 }
    )
  }
}
