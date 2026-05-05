import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-04-22.dahlia",
})

export async function POST(req: NextRequest) {
  try {
    const { items, shipping } = await req.json()

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "crc",
        product_data: {
          name: item.name,
          metadata: {
            productId: item.id.toString(),
            size: item.size || "N/A",
          },
        },
        unit_amount: Math.round(item.price),
      },
      quantity: item.quantity,
    }))

    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: "crc",
          product_data: { name: "Envio" },
          unit_amount: Math.round(shipping),
        },
        quantity: 1,
      })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/checkout`,
      metadata: {
        customerName: items[0]?.customerName || "",
        customerEmail: items[0]?.customerEmail || "",
        customerPhone: items[0]?.customerPhone || "",
        customerAddress: items[0]?.customerAddress || "",
        customerCity: items[0]?.customerCity || "",
      },
    })

    return NextResponse.json({ url: session.url })
  } catch {
    return NextResponse.json({ error: "Error al crear sesion de pago" }, { status: 500 })
  }
}
