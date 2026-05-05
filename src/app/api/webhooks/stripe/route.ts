import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { supabaseClient as supabase } from "@/lib/supabase-client"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-04-22.dahlia",
})

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    const { error } = await supabase
      .from("orders")
      .update({ status: "confirmado" })
      .eq("customer_email", session.customer_details?.email)
      .eq("status", "pendiente_pago")

    if (error) {
      console.error("Error updating order status:", error)
    }
  }

  return NextResponse.json({ received: true })
}
