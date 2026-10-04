import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Sparkles, Truck, Shield, Banknote, Package, Search, CreditCard, Clock, CheckCircle, ArrowRight, RotateCcw, MessageSquare } from "lucide-react"

const steps = [
  {
    number: 1,
    icon: Search,
    title: "Choose your figure",
    description: "Navegas por el catálogo o me pides que busque una figura concreta. Ves fotos, Price y Availability real.",
    details: [
      "Catálogo actualizado con stock real",
      "Puedes solicitar figuras que no estén en catálogo",
      "Prices in euros, no weird conversions",
    ],
  },
  {
    number: 2,
    icon: CreditCard,
    title: "Reserve and pay",
    description: "Pagas la reserva por Stripe (tarjeta, Apple Pay, Google Pay). Tu dinero está seguro hasta que confirmo la compra.",
    details: [
      "100% secure payment with Stripe (PCI DSS)",
      "Si no consigo la figura, reembolso automático",
      "Recibes confirmación por email al instante",
    ],
  },
  {
    number: 3,
    icon: Banknote,
    title: "Compro en Japón",
    description: "I go to Subuya, Suruga-ya, Mandarake and other stores and buy your figure at local price. You save on middlemen.",
    details: [
      "Compro en tiendas físicas de Akihabara/Nakano",
      "I search for the best price among multiple suppliers",
      "I inspect the figure before shipping",
    ],
  },
  {
    number: 4,
    icon: Package,
    title: "I receive and inspect",
    description: "La figura llega a mi dirección en España. La abro, verifico que está perfecta y la preparo para envío.",
    details: [
      "I check box, figure, accessories, and condition",
      "Photos of the actual figure before shipping",
      "Reinforced packaging for safe travel",
    ],
  },
  {
    number: 5,
    icon: Truck,
    title: "Te la envío",
    description: "Envío por correo certificado con seguimiento y seguro. Llega a tu casa en 24-48h (Península).",
    details: [
      "Envío 4,99€ (gratis en pedidos >100€)",
      "Certified mail with tracking",
      "Seguro incluido hasta 500€",
    ],
  },
  {
    number: 6,
    icon: Sparkles,
    title: "�Enjoy!",
    description: "Recibes tu figura original de Japón. Si prefieres venderla, te ayudo a publicarla en Vinted al Price que quieras.",
    details: [
      "14 días para devolución si no te convence",
      "Opción: te la envío O la vendo en Vinted por ti",
      "Email support for any questions",
    ],
  },
]

const faqs = [
  {
    q: "�Is it safe to pay upfront?",
    a: "Sí. Usamos Stripe (el mismo que usan Shopify, Amazon, etc.). Tu dinero queda retenido hasta que confirmo la compra. Si no consigo la figura, Stripe reembolsa automáticamente a tu tarjeta en 5-10 días laborables.",
  },
  {
    q: "¿Cuánto tarda en llegar la figura?",
    a: "Depende de la Availability en Japón. Normalmente 2-3 semanas desde que pagas: 1-2 semanas para comprarla y recibirla en España + 1 semana para enviártela. Te aviso en cada paso.",
  },
  {
    q: "¿Y si la figura llega dañada o no es la que pedí?",
    a: "Tienes 14 días para devolverla (gastos de vuelta a mi cargo si es error mío). La inspecciono antes de enviártela y te mando fotos. Si vienes dañada del viaje, el seguro del correo cubre hasta 500€.",
  },
  {
    q: "¿Puedo pedir figuras que no están en catálogo?",
    a: "¡Claro! Usa el formulario 'Solicitar figura'. La busco en mis proveedores y si la encuentro, te aviso con Price y fotos. Tienes prioridad para reservarla antes de que la ponga en catálogo.",
  },
  {
    q: "¿Qué pasa con Vinted? ¿La vendes tú por mí?",
    a: "Si me lo pides, publico la figura en Vinted a tu nombre con tus fotos y descripción. Gestiono mensajes, ofertas y envío. Tú cobras directamente en tu cuenta Vinted. Yo solo me llevo una pequeña comisión por la gestión (3-5%).",
  },
  {
    q: "�Are the figures 100% authentic??",
    a: "Sí. Compro solo en tiendas oficiales japonesas (Subuya, Suruga-ya, Mandarake, AmiAmi, etc.). Nunca compro en mercados de segunda mano dudosos. Cada figura viene con su caja original, hologramas de Authenticity y accesorios completos.",
  },
]

export function ComoFuncionaContent() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 py-20 lg:py-28">
        <div className="container text-center">
          <Badge variant="info" className="mb-6 inline-flex items-center gap-2">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            No dead stock, no risk, no surprises
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white tracking-tight mb-6">
            Cómo funciona <span className="text-blue-600 dark:text-blue-400">Tokyo Grid</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Tú eliges, yo compro en Japón, tú recibes. Así de simple. Sin pagar Prices de reventa en España.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="section bg-white dark:bg-gray-950">
        <div className="container">
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={index % 2 === 0 ? "grid lg:grid-cols-2 gap-8 items-center" : "grid lg:grid-cols-2 gap-8 items-center lg:direction-rtl"}
              >
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                  <div className="relative mb-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-2xl font-bold">
                      {step.number}
                    </div>
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute left-1/2 top-16 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 to-transparent -translate-x-1/2" />
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{step.title}</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-md">{step.description}</p>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" aria-hidden="true" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative">
                  <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center p-8">
                    <step.icon className="h-32 w-32 text-blue-200 dark:text-blue-800 opacity-50" aria-hidden="true" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key differences */}
      <section className="section bg-gray-50 dark:bg-gray-900">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              ¿Por qué no comprar directo en Vinted/Wallapop?
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Key differences between resale and direct reservation
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="pb-3 font-semibold text-gray-900 dark:text-white">Aspect</th>
                  <th className="pb-3 font-semibold text-gray-900 dark:text-white text-center">Vinted / Wallapop</th>
                  <th className="pb-3 font-semibold text-gray-900 dark:text-white text-center">Tokyo Grid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="py-4 font-medium text-gray-900 dark:text-white">Price</td>
                  <td className="py-4 text-center text-gray-600 dark:text-gray-300">+50-200% sobre Price Japón</td>
                  <td className="py-4 text-center text-green-600 dark:text-green-400 font-medium">Price Japón + pequeño margen</td>
                </tr>
                <tr>
                  <td className="py-4 font-medium text-gray-900 dark:text-white">Authenticity</td>
                  <td className="py-4 text-center text-gray-600 dark:text-gray-300">Risk of bootlegs/fakes</td>
                  <td className="py-4 text-center text-green-600 dark:text-green-400 font-medium">100% original, official stores</td>
                </tr>
                <tr>
                  <td className="py-4 font-medium text-gray-900 dark:text-white">Condition</td>
                  <td className="py-4 text-center text-gray-600 dark:text-gray-300">Fotos a veces engañosas</td>
                  <td className="py-4 text-center text-green-600 dark:text-green-400 font-medium">I send real photos before shipping</td>
                </tr>
                <tr>
                  <td className="py-4 font-medium text-gray-900 dark:text-white">Garantía</td>
                  <td className="py-4 text-center text-gray-600 dark:text-gray-300">None (private sale)</td>
                  <td className="py-4 text-center text-green-600 dark:text-green-400 font-medium">14 días devolución + seguro envío</td>
                </tr>
                <tr>
                  <td className="py-4 font-medium text-gray-900 dark:text-white">Availability</td>
                  <td className="py-4 text-center text-gray-600 dark:text-gray-300">Solo lo que ya hay en España</td>
                  <td className="py-4 text-center text-green-600 dark:text-green-400 font-medium">Acceso a todo el catálogo de Japón</td>
                </tr>
                <tr>
                  <td className="py-4 font-medium text-gray-900 dark:text-white">Exclusives</td>
                  <td className="py-4 text-center text-gray-600 dark:text-gray-300">Impossible to get</td>
                  <td className="py-4 text-center text-green-600 dark:text-green-400 font-medium">Puedo buscar Exclusives de eventos/tiendas</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-white dark:bg-gray-950">
        <div className="container max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 dark:text-gray-300">Respuestas a las dudas más comunes</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="group border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-900/50">
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                  <h3 className="font-medium text-gray-900 dark:text-white pr-8">{faq.q}</h3>
                  <svg className="h-5 w-5 text-gray-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <div className="px-5 pb-5 text-gray-600 dark:text-gray-300 animate-in slide-in-from-top-2 duration-200">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-white dark:bg-gray-950">
        <div className="container text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white max-w-2xl mx-auto">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-4">�Ready to get your figure??</h2>
              <p className="text-blue-100 mb-8 max-w-xl mx-auto">
                Explora el catálogo o pídemela si no la encuentras. Sin compromiso, sin riesgo.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/catalogo">
                  <Button size="lg" variant="secondary" className="gap-2 w-full sm:w-auto">
                    Ver catálogo <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </Link>
                <Link href="/solicitar">
                  <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto border-white text-white hover:bg-white/10">
                    <Search className="h-4 w-4" aria-hidden="true" />
                    Request Figure
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
