import Link from "next/link"

export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Politica de Privacidad</h1>

      <div className="prose prose-slate max-w-none">
        <p className="text-gray-500 text-sm mb-8">
          Ultima actualizacion: Mayo 2026
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">1. Quienes somos</h2>
          <p className="text-gray-600 leading-relaxed">
            StarFit es una tienda en linea dedicada a la venta de equipamiento deportivo
            en Costa Rica. Nuestra direccion de contacto es info@starfit.cr.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">2. Informacion que recopilamos</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Recopilamos la informacion que nos proporcionas al:
          </p>
          <ul className="text-gray-600 leading-relaxed list-disc pl-6 space-y-1">
            <li>Crear una cuenta</li>
            <li>Realizar una compra</li>
            <li>Contactarnos por email o telefono</li>
            <li>Suscribirte a nuestro newsletter</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-3">
            La informacion incluye: nombre, email, telefono, direccion de envio y
            datos de pago (procesados de forma segura por terceros).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">3. Como usamos tu informacion</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Utilizamos tu informacion para:
          </p>
          <ul className="text-gray-600 leading-relaxed list-disc pl-6 space-y-1">
            <li>Procesar y enviar tus pedidos</li>
            <li>Comunicarnos contigo sobre tu orden</li>
            <li>Enviar promociones y novedades (solo si lo aceptas)</li>
            <li>Mejorar nuestros productos y servicios</li>
            <li>Cumplir con obligaciones legales</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">4. Proteccion de datos</h2>
          <p className="text-gray-600 leading-relaxed">
            Implementamos medidas de seguridad tecnicas y organizativas para proteger
            tu informacion personal. Los datos de pago son procesados por proveedores
            certificados y nunca almacenamos informacion de tarjetas en nuestros servidores.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">5. Comparticion de datos</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            No vendemos ni compartimos tu informacion personal con terceros, excepto:
          </p>
          <ul className="text-gray-600 leading-relaxed list-disc pl-6 space-y-1">
            <li>Proveedores de pago para procesar transacciones</li>
            <li>Empresas de envio para entregar tu pedido</li>
            <li>Cuando la ley lo requiera</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">6. Tus derechos</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Tienes derecho a:
          </p>
          <ul className="text-gray-600 leading-relaxed list-disc pl-6 space-y-1">
            <li>Acceder a tu informacion personal</li>
            <li>Corregir datos incorrectos</li>
            <li>Solicitar la eliminacion de tu cuenta y datos</li>
            <li>Cancelar la suscripcion a comunicaciones</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-3">
            Para ejercer estos derechos, contactanos a info@starfit.cr.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">7. Cookies</h2>
          <p className="text-gray-600 leading-relaxed">
            Utilizamos cookies para mejorar tu experiencia de navegacion, recordar tu
            carrito de compras y analizar el trafico del sitio. Puedes configurar tu
            navegador para rechazar cookies, aunque esto puede afectar la funcionalidad.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">8. Cambios en esta politica</h2>
          <p className="text-gray-600 leading-relaxed">
            Nos reservamos el derecho de actualizar esta politica de privacidad en
            cualquier momento. Los cambios seran publicados en esta pagina con la
            fecha de actualizacion.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">9. Contacto</h2>
          <p className="text-gray-600 leading-relaxed">
            Si tienes preguntas sobre esta politica, contactanos en:
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
