import { NextRequest, NextResponse } from "next/server"
import { sendOrderConfirmationEmail } from "@/lib/email"

export async function POST(req: NextRequest) {
  try {
    const order = await req.json()
    await sendOrderConfirmationEmail(order)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Error al enviar email" }, { status: 500 })
  }
}
