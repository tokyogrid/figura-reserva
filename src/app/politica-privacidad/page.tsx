import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Política de Privacidad | Tokyo Grid Store",
  description: "Cómo recopilamos, utilizamos y protegemos tus datos personales en Tokyo Grid Store.",
}

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="mb-8 flex items-center gap-2 text-sm text-gray-400" aria-label="Navegación">
          <Link href="/" className="hover:text-purple-400 transition-colors">Inicio</Link>
          <span>/</span>
          <span className="text-white">Política de Privacidad</span>
        </nav>

        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 sm:p-10 space-y-8 text-gray-300">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Política de Privacidad</h1>
            <p className="text-sm text-gray-400">Última actualización: Noviembre de 2026</p>
          </div>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">1. Responsable del tratamiento</h2>
            <p>
              De conformidad con el Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD), te informamos de que los datos personales recopilados a través de este sitio web son tratados por:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong className="text-white">Responsable:</strong> Tokyo Grid Store</li>
              <li><strong className="text-white">Correo electrónico:</strong>{" "}
                <a href="mailto:tokyogridstore@gmail.com" className="text-purple-400 hover:underline">
                  tokyogridstore@gmail.com
                </a>
              </li>
              <li><strong className="text-white">Ubicación:</strong> España</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">2. Qué datos recopilamos</h2>
            <p>Solo recopilamos los datos estrictamente necesarios para prestar nuestros servicios:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong className="text-white">Datos de pedido y envío:</strong> nombre, apellidos, dirección postal, correo electrónico y teléfono de contacto.</li>
              <li><strong className="text-white">Datos de cuenta de usuario:</strong> correo electrónico y contraseña cifrada (si decides registrarte).</li>
              <li><strong className="text-white">Datos de pago:</strong> los pagos se procesan de forma segura a través de <strong className="text-white">Stripe</strong>. Tokyo Grid Store nunca almacena ni tiene acceso a los datos completos de tu tarjeta bancaria.</li>
              <li><strong className="text-white">Datos técnicos y de navegación:</strong> métricas anónimas de rendimiento y visitas para mejorar la web.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">3. Finalidad del tratamiento</h2>
            <p>Utilizamos tus datos personales para:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Tramitar, preparar y enviar tus pedidos y reservas (pre-orders).</li>
              <li>Gestionar el pago, devoluciones, reembolsos o compras coordinadas a través de Vinted.</li>
              <li>Responder a tus consultas de atención al cliente por correo electrónico.</li>
              <li>Prevenir el fraude y garantizar la seguridad técnica de la tienda.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">4. Base legal (Legitimación)</h2>
            <p>El tratamiento de tus datos se basa en:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong className="text-white">Ejecución de un contrato:</strong> para gestionar y entregar las compras que realices.</li>
              <li><strong className="text-white">Consentimiento:</strong> cuando creas una cuenta o nos escribes voluntariamente.</li>
              <li><strong className="text-white">Interés legítimo y obligaciones legales:</strong> para la seguridad de la web y el cumplimiento de la normativa aplicable.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">5. Terceros y proveedores de servicios</h2>
            <p>
              No vendemos ni cedemos tus datos a terceros con fines publicitarios. Únicamente compartimos la información imprescindible con los proveedores necesarios para que la tienda funcione:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong className="text-white">Stripe:</strong> procesamiento seguro de pagos con tarjeta.</li>
              <li><strong className="text-white">Empresas de transporte y mensajería:</strong> para la entrega de los paquetes en tu domicilio.</li>
              <li><strong className="text-white">Vercel y Vercel Analytics:</strong> alojamiento de la web y analítica agregada sin rastreo invasivo.</li>
              <li><strong className="text-white">Trustpilot y Vinted:</strong> únicamente cuando interactúas directamente con dichas plataformas externas.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">6. Conservación de los datos</h2>
            <p>
              Conservaremos tus datos personales únicamente durante el tiempo necesario para gestionar tus pedidos, mantener activa tu cuenta (si la creaste) y cumplir con las posibles responsabilidades legales derivadas de la compraventa.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">7. Tus derechos</h2>
            <p>
              Puedes ejercer en cualquier momento tus derechos de <strong className="text-white">acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad</strong> enviando un correo electrónico a{" "}
              <a href="mailto:tokyogridstore@gmail.com" className="text-purple-400 hover:underline">
                tokyogridstore@gmail.com
              </a>{" "}
              indicando tu solicitud. También tienes derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD) si consideras que el tratamiento no se ajusta a la normativa.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">8. Cambios en esta política</h2>
            <p>
              Tokyo Grid Store se reserva el derecho a actualizar esta Política de Privacidad para adaptarla a novedades legislativas o cambios en la tienda. Cualquier modificación se publicará en esta misma página.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}