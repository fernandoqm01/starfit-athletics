import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nombre, email, asunto, mensaje } = body

    if (!nombre || !email || !asunto || !mensaje) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      )
    }

    const { error } = await supabase.from("contact_messages").insert([
      { nombre, email, asunto, mensaje },
    ])

    if (error) {
      console.error("Error saving contact message:", error)
      return NextResponse.json(
        { error: "Error al enviar el mensaje" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Contact error:", error)
    return NextResponse.json(
      { error: "Error al procesar el mensaje" },
      { status: 500 }
    )
  }
}
