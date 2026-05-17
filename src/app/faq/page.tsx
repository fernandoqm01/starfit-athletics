import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Preguntas Frecuentes",
  description: "Resuelve tus dudas sobre envios, pagos, devoluciones y mas.",
}

const FAQS = [
  {
    q: "¿Cuales son los metodos de pago?",
    a: "Aceptamos SINPE movil (transferencia bancaria) y pago contra entrega en areas seleccionadas.",
  },
  {
    q: "¿Cuanto tiempo tarda el envio?",
    a: "El envio estandar tarda de 3 a 7 dias habiles. Los productos dropship pueden tardar de 7 a 15 dias habiles.",
  },
  {
    q: "¿El envio es gratis?",
    a: "El envio es gratis en pedidos mayores a ₡50,000. Pedidos menores tienen un costo de ₡5,000.",
  },
  {
    q: "¿Puedo devolver un producto?",
    a: "Si, aceptamos devoluciones dentro de los primeros 30 dias. El producto debe estar en su estado original.",
  },
  {
    q: "¿Como se procesa el pago con SINPE?",
    a: "Al seleccionar SINPE como metodo de pago, recibiras los datos de la cuenta al hacer el checkout. Debes ingresar el numero de comprobante para confirmar la orden.",
  },
  {
    q: "¿Que hago si mi orden no llega?",
    a: "Puedes contactarnos a traves del formulario de contacto o escribirnos directamente. Te daremos seguimiento personalizado.",
  },
  {
    q: "¿Los productos tienen garantia?",
    a: "Todos nuestros productos tienen garantia de 30 dias contra defectos de fabrica.",
  },
]

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">Preguntas Frecuentes</h1>
      <p className="text-gray-500 mb-10">Resuelve tus dudas rapidamente.</p>

      <div className="space-y-4">
        {FAQS.map((faq, i) => (
          <details
            key={i}
            className="border border-gray-200 rounded-xl overflow-hidden group"
          >
            <summary className="px-6 py-4 font-semibold text-sm cursor-pointer hover:bg-gray-50 transition list-none flex items-center justify-between">
              {faq.q}
              <svg
                className="w-4 h-4 text-gray-400 group-open:rotate-180 transition"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="px-6 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
              {faq.a}
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}
