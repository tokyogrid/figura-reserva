import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Aviso Legal | Tokyo Grid Store",
  description: "Información legal y condiciones de uso de Tokyo Grid Store.",
}

export default function AvisoLegalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="mb-8 flex items-center gap-2 text-sm text-gray-400" aria-label="Navegación">
          <Link href="/" className="hover:text-purple-400 transition-colors">Inicio</Link>
          <span>/</span>
          <span className="text-white">Aviso Legal</span>
        </nav>

        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 sm:p-10 space-y-8 text-gray-300">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Aviso Legal</h1>
            <p className="text-sm text-gray-400">Última actualización: Noviembre de 2026</p>
          </div>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">1. Datos identificativos</h2>
            <p>
              En cumplimiento con el deber de información recogido en la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSI-CE), se facilitan los siguientes datos del titular de este sitio web:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-300">
              <li><strong className="text-white">Nombre comercial:</strong> Tokyo Grid Store</li>
              <li><strong className="text-white">Correo electrónico de contacto:</strong>{" "}
                <a href="mailto:tokyogridstore@gmail.com" className="text-purple-400 hover:underline">
                  tokyogridstore@gmail.com
                </a>
              </li>
              <li><strong className="text-white">Ubicación:</strong> España</li>
              <li><strong className="text-white">Actividad:</strong> Comercio electrónico e importación de figuras de colección y merchandising oficial de anime.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">2. Objeto y ámbito de aplicación</h2>
            <p>
              El presente Aviso Legal regula el acceso, navegación y uso del sitio web de <strong className="text-white">Tokyo Grid Store</strong>, así como las responsabilidades derivadas de la utilización de sus contenidos. El acceso y uso de la web atribuye la condición de usuario e implica la aceptación plena de las presentes condiciones.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">3. Propiedad intelectual e industrial</h2>
            <p>
              Los textos, diseño gráfico, logotipo propio y código fuente de este sitio web son propiedad de Tokyo Grid Store o cuentan con licencia para su uso, quedando prohibida su reproducción, distribución o modificación sin autorización expresa.
            </p>
            <p>
              Todas las marcas, personajes, nombres comerciales e imágenes promocionales de las figuras pertenecen a sus respectivos fabricantes, estudios y titulares de derechos en Japón y a nivel internacional. Tokyo Grid Store actúa únicamente como distribuidor e importador de productos 100% originales adquiridos en tiendas oficiales japonesas y no mantiene afiliación directa con dichos titulares de licencias.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">4. Condiciones de uso y responsabilidad</h2>
            <p>
              El usuario se compromete a hacer un uso adecuado y lícito del sitio web. Tokyo Grid Store no se hace responsable de interrupciones temporales del servicio por mantenimiento técnico, fallos de red ajenos o causas de fuerza mayor, ni del contenido de enlaces externos (como redes sociales, plataformas de pago o plataformas de reseñas).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">5. Legislación aplicable y jurisdicción</h2>
            <p>
              Las presentes condiciones se rigen por la legislación española vigente. Para la resolución de cualquier controversia que pudiera derivarse del acceso o uso de este sitio web, las partes se someterán a los juzgados y tribunales que correspondan conforme a la normativa de protección de consumidores y usuarios.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}