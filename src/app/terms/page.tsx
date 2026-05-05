import Link from "next/link"

export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Terminos y Condiciones</h1>

      <div className="prose prose-slate max-w-none">
        <p className="text-gray-500 text-sm mb-8">
          Ultima actualizacion: Mayo 2026
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">1. Informacion general</h2>
          <p className="text-gray-600 leading-relaxed">
            Estos terminos y condiciones rigen el uso de la tienda en linea StarFit.
            Al acceder y utilizar nuestro sitio web, aceptas cumplir con estos terminos.
            Si no estas de acuerdo con alguna parte, te pedimos que no utilices nuestros servicios.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">2. Productos</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Todos los productos publicados en StarFit estan sujetos a disponibilidad.
            Nos reservamos el derecho de modificar o descontinuar productos sin previo aviso.
            Las imagenes son de referencia y pueden variar ligeramente del producto final.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Los precios estan expresados en colones costarricenses (CRC) e incluyen impuestos
            aplicables. Nos reservamos el derecho de modificar los precios sin previo aviso.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">3. Pedidos y pagos</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Al realizar un pedido, te comprometes a proporcionar informacion veraz y completa.
            StarFit se reserva el derecho de cancelar o rechazar cualquier pedido.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Los metodos de pago disponibles son: tarjeta de credito/debito, SINPE Movil
            y transferencia bancaria. El procesamiento del pedido comienza una vez confirmado
            el pago.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">4. Envios</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Los envios se realizan dentro de Costa Rica. El tiempo de entrega estimado es
            de 3 a 7 dias habiles despues de confirmar el pago.
          </p>
          <p className="text-gray-600 leading-relaxed">
            El envio es gratis en compras mayores a 50,000 CRC. Para compras menores,
            el costo de envio es de 5,000 CRC. StarFit no se responsabiliza por retrasos
            causados por terceros.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">5. Devoluciones y cambios</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Tienes 15 dias calendario despues de recibir tu pedido para solicitar una
            devolucion o cambio. El producto debe estar sin uso, con etiquetas originales
            y en su empaque original.
          </p>
          <p className="text-gray-600 leading-relaxed mb-3">
            Para iniciar un proceso de devolucion, contactanos a info@starfit.cr o
            al +506 8888-8888 con tu numero de orden.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Los gastos de envio de la devolucion corren por cuenta del cliente,
            excepto en casos de productos defectuosos o incorrectos.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">6. Propiedad intelectual</h2>
          <p className="text-gray-600 leading-relaxed">
            Todo el contenido de este sitio web, incluyendo textos, imagenes, logotipos,
            disenos y codigos, es propiedad de StarFit y esta protegido por las leyes de
            propiedad intelectual de Costa Rica. Queda prohibida su reproduccion sin autorizacion.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">7. Limitacion de responsabilidad</h2>
          <p className="text-gray-600 leading-relaxed">
            StarFit no sera responsable por danos directos o indirectos derivados del uso
            de nuestros productos o sitio web. No garantizamos que el sitio funcionara sin
            interrupciones o errores.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">8. Contacto</h2>
          <p className="text-gray-600 leading-relaxed">
            Para cualquier consulta sobre estos terminos, puedes contactarnos en:
          </p>
          <ul className="text-gray-600 mt-2 space-y-1">
            <li>Email: info@starfit.cr</li>
            <li>Telefono: +506 8888-8888</li>
            <li>Ubicacion: San Jose, Costa Rica</li>
          </ul>
        </section>
      </div>

      <div className="border-t pt-8 mt-12">
        <Link
          href="/"
          className="text-blue-600 hover:underline font-medium"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
