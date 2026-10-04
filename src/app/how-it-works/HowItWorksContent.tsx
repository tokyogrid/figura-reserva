import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Sparkles, Truck, Shield, Banknote, Package, Search, CreditCard, Clock, CheckCircle, ArrowRight, RotateCcw, MessageSquare } from "lucide-react"
import { siteConfig } from "@/lib/site-config"

export function HowItWorksContent() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 py-20 lg:py-28">
        <div className="container text-center">
          <Badge variant="info" className="mb-6 inline-flex items-center gap-2">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            {siteConfig.hero.badge}
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white tracking-tight mb-6">
            How <span className="text-blue-600 dark:text-blue-400">{siteConfig.name}</span> Works
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {siteConfig.hero.subtitle}
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="section bg-white dark:bg-gray-950">
        <div className="container">
          <div className="space-y-8">
            {siteConfig.howItWorks.steps.map((step, index) => (
              <div
                key={step.number}
                className={index % 2 === 0 ? "grid lg:grid-cols-2 gap-8 items-center" : "grid lg:grid-cols-2 gap-8 items-center lg:direction-rtl"}
              >
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                  <div className="relative mb-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-2xl font-bold">
                      {step.number}
                    </div>
                    {index < siteConfig.howItWorks.steps.length - 1 && (
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
                    {(() => {
                      const iconMap: Record<string, React.ElementType> = {
                        Search,
                        CreditCard,
                        Banknote,
                        Package,
                        Truck,
                        Sparkles,
                      }
                      const Icon = iconMap[step.icon] || Sparkles
                      return <Icon className="h-32 w-32 text-blue-200 dark:text-blue-800 opacity-50" aria-hidden="true" />
                    })()}
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
              {siteConfig.comparison.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {siteConfig.comparison.subtitle}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="pb-3 font-semibold text-gray-900 dark:text-white">{siteConfig.comparison.headers[0]}</th>
                  <th className="pb-3 font-semibold text-gray-900 dark:text-white text-center">{siteConfig.comparison.headers[1]}</th>
                  <th className="pb-3 font-semibold text-gray-900 dark:text-white text-center">{siteConfig.comparison.headers[2]}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {siteConfig.comparison.rows.map((row, index) => (
                  <tr key={index}>
                    <td className="py-4 font-medium text-gray-900 dark:text-white">{row[0]}</td>
                    <td className="py-4 text-center text-gray-600 dark:text-gray-300">{row[1]}</td>
                    <td className="py-4 text-center text-green-600 dark:text-green-400 font-medium">{row[2]}</td>
                  </tr>
                ))}
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
            <p className="text-gray-600 dark:text-gray-300">Answers to the most common questions</p>
          </div>

          <div className="space-y-4">
            {siteConfig.faq.map((faq, index) => (
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
              <h2 className="text-3xl font-bold mb-4">Ready to Get Your Figure?</h2>
              <p className="text-blue-100 mb-8 max-w-xl mx-auto">
                Browse the catalog or request it if you can't find it. No commitment, no risk.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/catalog">
                  <Button size="lg" variant="secondary" className="gap-2 w-full sm:w-auto">
                    Browse Catalog <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </Link>
                <Link href="/request">
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