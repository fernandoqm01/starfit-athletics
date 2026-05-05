import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOrderConfirmationEmail(order: {
  id: number
  customer_name: string
  customer_email: string
  total: number
  items: { product_name: string; quantity: number; price: number; size?: string | null }[]
}) {
  if (!process.env.RESEND_API_KEY) {
    console.log("RESEND_API_KEY not configured. Email not sent.")
    return
  }

  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee;">
          ${item.product_name} ${item.size ? `(Talla: ${item.size})` : ""} x${item.quantity}
        </td>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">
          ${(item.price * item.quantity).toLocaleString()}
        </td>
      </tr>
    `
    )
    .join("")

  try {
    await resend.emails.send({
      from: "StarFit <orders@resend.dev>",
      to: [order.customer_email],
      subject: `Orden #${order.id} confirmada - StarFit`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #111;">Gracias por tu compra, ${order.customer_name}!</h1>
          <p>Tu orden <strong>#${order.id}</strong> ha sido confirmada.</p>
          
          <h2 style="color: #111; margin-top: 24px;">Resumen</h2>
          <table style="width: 100%; border-collapse: collapse;">
            ${itemsHtml}
            <tr>
              <td style="padding: 12px 0; font-weight: bold;">Total</td>
              <td style="padding: 12px 0; font-weight: bold; text-align: right;">${order.total.toLocaleString()}</td>
            </tr>
          </table>
          
          <p style="color: #666; margin-top: 24px;">
            Puedes ver el estado de tu orden en cualquier momento en tu cuenta: 
            <a href="${process.env.NEXT_PUBLIC_URL}/account">${process.env.NEXT_PUBLIC_URL}/account</a>
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
          <p style="color: #999; font-size: 12px;">StarFit - Equipamiento deportivo</p>
        </div>
      `,
    })
  } catch (error) {
    console.error("Error sending email:", error)
  }
}
