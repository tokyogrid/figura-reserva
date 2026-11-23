import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Términos y Condiciones | Tokyo Grid Store",
  description: "Condiciones generales de compra, envíos, reservas, pagos vía Vinted y devoluciones en Tokyo Grid Store.",
}

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="mb-8 flex items-center gap-2 text-sm text-gray-400" aria-label="Navegación">
          <Link href="/" className="hover:text-purple-400 transition-colors">Inicio</Link>
          <span>/</span>
          <span className="text-white">Términos y Condiciones</span>
        </nav>

        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 sm:p-10 space-y-8 text-gray-300">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Términos y Condiciones de Compra</h1>
            <p className="text-sm text-gray-400">Última actualización: Noviembre de 2026</p>
          </div>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">1. Objeto y autenticidad de los productos</h2>
            <p>
              Las presentes condiciones regulan la compra de productos a través de <strong className="text-white">Tokyo Grid Store</strong>. Todas las figuras y artículos ofrecidos en nuestro catálogo son <strong className="text-white">100% originales</strong>, adquiridos directamente en tiendas y distribuidores oficiales en Japón.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">2. Precios y métodos de pago</h2>
            <p>
              Todos los precios mostrados en la web están expresados en euros (€) e incluyen los impuestos aplicables. Ofrecemos dos modalidades de compra:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-white">Pago directo con Stripe:</strong> abonas el 100% del importe del pedido (más los gastos de envío si aplican) de forma segura mediante tarjeta bancaria.
              </li>
              <li>
                <strong className="text-white">Compra vía Vinted (50% / 50%):</strong> abonas el 50% del precio de la figura en nuestra web en concepto de reserva/gestión de importación. Cuando la figura esté lista para enviarse, nos pondremos en contacto contigo para que abones el 50% restante a través de un anuncio reservado en Vinted, gestionando el envío mediante dicha plataforma.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">3. Envíos y plazos de entrega</h2>
            <p>
              El coste del envío estándar es de <strong className="text-white">4,99 €</strong>, siendo <strong className="text-white">gratuito en pedidos superiores a 100 €</strong>. Los plazos estimados dependen de la disponibilidad del producto:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-white">Productos en stock (Envío rápido):</strong> entrega estimada en <strong className="text-white">1 a 3 días laborables</strong> (despachados en 24-48 horas tras la confirmación del pedido).
              </li>
              <li>
                <strong className="text-white">Productos bajo pedido / Pre-order (Importación desde Japón):</strong> entrega estimada en <strong className="text-white">10 a 20 días laborables</strong>, sujetos a los tiempos de tránsito internacional y aduanas.
              </li>
            </ul>
            <p>
              Todos los envíos se preparan con embalaje reforzado para proteger tanto la figura como su caja original.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">4. Disponibilidad y garantía de reembolso</h2>
            <p>
              En el caso de figuras bajo pedido o ediciones limitadas traídas de Japón, si por falta de stock en origen o incidencias ajenas a nosotros no pudiéramos conseguir la figura solicitada, te notificaremos de inmediato y procederemos al <strong className="text-white">reembolso íntegro del 100% del importe abonado</strong>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">5. Devoluciones y derecho de desistimiento (14 días)</h2>
            <p>
              Conforme a la normativa vigente, dispones de un plazo de <strong className="text-white">14 días naturales</strong> desde la recepción del pedido para solicitar una devolución sin necesidad de justificación.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-white">Condición del producto:</strong> al tratarse de artículos de coleccionismo, la figura debe devolverse en el mismo estado en el que se entregó, <strong className="text-white">sin abrir, con sus precintos originales intactos y con la caja en perfecto estado</strong>.
              </li>
              <li>
                <strong className="text-white">Coste de devolución:</strong> los gastos de envío de la devolución corren a cargo del comprador, salvo que el producto haya llegado dañado, defectuoso o incorrecto.
              </li>
              <li>
                <strong className="text-white">Cómo solicitarla:</strong> escríbenos a{" "}
                <a href="mailto:tokyogridstore@gmail.com" className="text-purple-400 hover:underline">
                  tokyogridstore@gmail.com
                </a>{" "}
                indicando tu número de pedido y, en caso de daño en el transporte, adjuntando fotografías del paquete y del producto.
              </li>
            </ul>
            <p>
              Una vez recibido y verificado el estado del artículo, realizaremos el reembolso en un plazo máximo de 14 días utilizando el mismo método de pago original.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">6. Atención al cliente</h2>
            <p>
              Para cualquier duda sobre tu pedido, envíos o devoluciones, puedes contactar con nosotros en{" "}
              <a href="mailto:tokyogridstore@gmail.com" className="text-purple-400 hover:underline">
                tokyogridstore@gmail.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}