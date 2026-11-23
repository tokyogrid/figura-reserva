import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Política de Cookies | Tokyo Grid Store",
  description: "Información sobre el uso de cookies y tecnologías de almacenamiento local en Tokyo Grid Store.",
}

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="mb-8 flex items-center gap-2 text-sm text-gray-400" aria-label="Navegación">
          <Link href="/" className="hover:text-purple-400 transition-colors">Inicio</Link>
          <span>/</span>
          <span className="text-white">Política de Cookies</span>
        </nav>

        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 sm:p-10 space-y-8 text-gray-300">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Política de Cookies</h1>
            <p className="text-sm text-gray-400">Última actualización: Noviembre de 2026</p>
          </div>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">1. ¿Qué son las cookies?</h2>
            <p>
              Las cookies y tecnologías similares (como el almacenamiento local del navegador) son pequeños archivos que se guardan en tu dispositivo al navegar por una página web. Sirven para que la tienda funcione correctamente, recordar los productos que añades al carrito o mantener tu sesión iniciada.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">2. Tipos de cookies que utilizamos</h2>
            <p>
              En <strong className="text-white">Tokyo Grid Store</strong> apostamos por una navegación limpia y respetuosa con tu privacidad:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-white">Cookies técnicas y estrictamente necesarias:</strong> imprescindibles para el funcionamiento básico de la tienda (guardar los productos del carrito de compra, gestionar el inicio de sesión de usuario y proteger los formularios contra ataques CSRF). No requieren consentimiento previo ya que sin ellas la web no puede operar.
              </li>
              <li>
                <strong className="text-white">Cookies de seguridad y pago (Stripe):</strong> al realizar un pago, nuestra pasarela Stripe puede utilizar cookies técnicas necesarias para procesar la transacción de forma segura y prevenir el fraude.
              </li>
              <li>
                <strong className="text-white">Analítica respetuosa con la privacidad (Vercel Analytics):</strong> utilizamos herramientas de medición agregada que no emplean cookies publicitarias ni rastrean tu actividad entre distintos sitios web.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">3. Cómo gestionar o desactivar las cookies</h2>
            <p>
              Puedes permitir, bloquear o eliminar las cookies instaladas en tu equipo mediante la configuración de las opciones de tu navegador (Chrome, Firefox, Safari, Edge). Ten en cuenta que si bloqueas las cookies técnicas o el almacenamiento local, es posible que el carrito de compra o el inicio de sesión no funcionen correctamente.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">4. Contacto</h2>
            <p>
              Si tienes cualquier duda sobre nuestra Política de Cookies, puedes escribirnos a{" "}
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