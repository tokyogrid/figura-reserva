import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Sparkles, Truck, Shield, Banknote, ArrowRight, Package, Search } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { formatPrice, parseImages } from "@/lib/utils"
import { siteConfig } from "@/lib/site-config"
import { ProductCard } from "@/components/ProductCard"

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { status: "AVAILABLE", isFeatured: true },
    take: 4,
    orderBy: { sortOrder: "asc" },
  })
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts()

  const iconMap: Record<string, React.ElementType> = {
    Banknote,
    Shield,
    Truck,
    Package,
  }

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 py-20 lg:py-32">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="info" className="mb-6 inline-flex items-center gap-2">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              {siteConfig.hero.badge}
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white tracking-tight mb-6">
              {siteConfig.hero.title}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
              {siteConfig.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/catalog">
                <Button size="lg" className="w-full sm:w-auto gap-2" variant="primary">
                  {siteConfig.hero.ctaPrimary} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
              <Link href="/request">
                <Button size="lg" className="w-full sm:w-auto gap-2" variant="outline">
                  <Search className="h-4 w-4" aria-hidden="true" />
                  {siteConfig.hero.ctaSecondary}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works - brief */}
      <section className="section bg-white dark:bg-gray-950">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {siteConfig.howItWorks.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {siteConfig.howItWorks.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {siteConfig.features.map((feature, index) => {
              const Icon = iconMap[feature.icon]
              return (
                <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
                      <Icon className="h-7 w-7" aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured products */}
      {featuredProducts.length > 0 && (
        <section className="section bg-gray-50 dark:bg-gray-900">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Figures</h2>
                <p className="text-gray-600 dark:text-gray-300 mt-1">Most reserved this week</p>
              </div>
              <Link href="/catalog">
                <Button variant="ghost" className="gap-2">
                  View All <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={{
                  ...product,
                  releaseDate: product.releaseDate ? product.releaseDate.toISOString() : null,
                }} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section bg-white dark:bg-gray-950">
        <div className="container">
          <Card className="bg-blue-600 dark:bg-blue-700 text-white overflow-hidden">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Can't Find Your Figure?</h2>
              <p className="text-blue-100 mb-8 max-w-xl mx-auto">
                Request it and we'll search our Japan suppliers. If found, you get priority to reserve.
              </p>
              <Link href="/request">
                <Button size="lg" variant="secondary" className="gap-2">
                  Request Figure <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}