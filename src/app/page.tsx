import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Sparkles, Truck, Shield, Banknote, ArrowRight, Package, Search, Star, Heart, Zap, Crown, Gem } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { siteConfig } from "@/lib/site-config"
import { ProductCard } from "@/components/ProductCard"
import Image from "next/image"

const iconMap: Record<string, React.ElementType> = {
  Banknote,
  Shield,
  Truck,
  Package,
}

const animeCharacters = [
  { name: "Spy × Family", character: "Anya Forger", image: "https://imgs.search.brave.com/qa1zNirbMeYYdlLPAjQr1N2s4tSPgheLNgR5gogGgZc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zMy56/ZXJvY2hhbi5uZXQv/MjQwLzQ0LzE2LzM2/NzgzNDQuYXZpZg", color: "bg-pink-500", bgColor: "bg-pink-100 dark:bg-pink-900/30" },
  { name: "One Piece", character: "Monkey D. Luffy", image: "https://imgs.search.brave.com/5FLcqksNc5cYvnbvSLb3vrp-eJL9XHFfO3-wYspIjYo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJzLmNvbS9p/bWFnZXMvdGh1bWJu/YWlsL29uZS1waWVj/ZS1sdWZmeS1wZnAt/c3VjY2Vzcy1wb3Nl/LXdpbmQtZWZmZWN0/LTA4dG1xZzI2cTUy/OTV1YzMuanBn", color: "bg-yellow-500", bgColor: "bg-yellow-100 dark:bg-yellow-900/30" },
  { name: "Jujutsu Kaisen", character: "Satoru Gojo", image: "https://imgs.search.brave.com/Cnei4dB-Tc1K9J0pzfeOwcAERH9yRmNWkzg0i18rG60/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9taXIt/czMtY2RuLWNmLmJl/aGFuY2UubmV0L3By/b2plY3RzLzQwNC82/OTNhYmExNzgyMDA3/MjkuWTNKdmNDd3hO/REV6TERFeE1EVXNO/emMyTERFME13LnBu/Zw", color: "bg-blue-500", bgColor: "bg-blue-100 dark:bg-blue-900/30" },
  { name: "Demon Slayer", character: "Tanjiro Kamado", image: "https://imgs.search.brave.com/H5-2sBhWd_NNpB7HdahONZ5H_bvuW20Au1UUj-jfEfw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJjYXZlLmNv/bS93cC93cDExMTUx/NDI4LnBuZw", color: "bg-green-500", bgColor: "bg-green-100 dark:bg-green-900/30" },
  { name: "Naruto", character: "Naruto Uzumaki", image: "https://imgs.search.brave.com/YGngAFAJ8Hpz85-ygE9yzy2lZII96u2mN3AOkXOYQE4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS52YW5kYWwubmV0/L2kvNjQweDM2MC8x/MC0yMDIzLzE3LzIw/MjMxMDE3MTYzMTE0/XzIuanBn", color: "bg-orange-500", bgColor: "bg-orange-100 dark:bg-orange-900/30" },
]

const headerCharacters = [
  { name: "Anya Forger", image: "https://imgs.search.brave.com/qa1zNirbMeYYdlLPAjQr1N2s4tSPgheLNgR5gogGgZc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zMy56/ZXJvY2hhbi5uZXQv/MjQwLzQ0LzE2LzM2/NzgzNDQuYXZpZg", series: "Spy × Family" },
  { name: "Luffy", image: "https://imgs.search.brave.com/5FLcqksNc5cYvnbvSLb3vrp-eJL9XHFfO3-wYspIjYo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJzLmNvbS9p/bWFnZXMvdGh1bWJu/YWlsL29uZS1waWVj/ZS1sdWZmeS1wZnAt/c3VjY2Vzcy1wb3Nl/LXdpbmQtZWZmZWN0/LTA4dG1xZzI2cTUy/OTV1YzMuanBn", series: "One Piece" },
  { name: "Gojo", image: "https://imgs.search.brave.com/Cnei4dB-Tc1K9J0pzfeOwcAERH9yRmNWkzg0i18rG60/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9taXIt/czMtY2RuLWNmLmJl/aGFuY2UubmV0L3By/b2plY3RzLzQwNC82/OTNhYmExNzgyMDA3/MjkuWTNKdmNDd3hO/REV6TERFeE1EVXNO/emMyTERFME13LnBu/Zw", series: "Jujutsu Kaisen" },
  { name: "Tanjiro", image: "https://imgs.search.brave.com/H5-2sBhWd_NNpB7HdahONZ5H_bvuW20Au1UUj-jfEfw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJjYXZlLmNv/bS93cC93cDExMTUx/NDI4LnBuZw", series: "Demon Slayer" },
  { name: "Naruto", image: "https://imgs.search.brave.com/YGngAFAJ8Hpz85-ygE9yzy2lZII96u2mN3AOkXOYQE4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS52YW5kYWwubmV0/L2kvNjQweDM2MC8x/MC0yMDIzLzE3LzIw/MjMxMDE3MTYzMTE0/XzIuanBn", series: "Naruto" }
]

const animeDecorations = [
  { top: "10%", left: "5%", size: 40, rotate: -15, icon: Star, color: "text-yellow-400/30" },
  { top: "20%", right: "8%", size: 30, rotate: 45, icon: Heart, color: "text-pink-400/30" },
  { bottom: "15%", left: "3%", size: 35, rotate: -30, icon: Zap, color: "text-yellow-300/30" },
  { top: "30%", right: "12%", size: 25, rotate: 90, icon: Crown, color: "text-yellow-500/30" },
  { bottom: "25%", right: "5%", size: 28, rotate: -20, icon: Gem, color: "text-blue-400/30" },
  { top: "50%", left: "2%", size: 22, rotate: 15, icon: Sparkles, color: "text-purple-400/30" },
]

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { status: "AVAILABLE", isFeatured: true },
    take: 4,
    orderBy: { sortOrder: "asc" },
  })
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts()

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-purple-50/50 to-white dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-950 py-20 lg:py-32">
        {/* Anime decorative floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {animeDecorations.map((decoration, index) => {
            const Icon = decoration.icon;
            return (
              <div
                key={index}
                className="absolute animate-float"
                style={{
                  top: decoration.top,
                  bottom: decoration.bottom,
                  left: decoration.left,
                  right: decoration.right,
                  transform: `rotate(${decoration.rotate}deg)`,
                }}
              >
                <Icon 
                  className={decoration.color} 
                  style={{ width: `${decoration.size}px`, height: `${decoration.size}px` }} 
                  aria-hidden="true" 
                />
              </div>
            );
          })}
        </div>

        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            {/* Header with anime characters next to logo */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="flex items-center gap-1.5">
{headerCharacters.map((char) => (
                  <Link
                    key={char.name}
                    href={`/catalog?series=${encodeURIComponent(char.series)}`}
                    className="group relative"
                    title={char.name}
                  >
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden ring-2 ring-white dark:ring-gray-800 group-hover:scale-110 transition-transform duration-300">
                      <img
                        src={char.image}
                        alt={char.name}
                        className="object-cover transition-transform duration-300 group-hover:scale-110 w-full h-full"
                        sizes="40px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      </div>
                    <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] text-white/90 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      {char.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <Badge variant="info" className="mb-6 inline-flex items-center gap-2">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              {siteConfig.hero.badge}
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white tracking-tight mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
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

      {/* Anime character showcase section */}
      <section className="section bg-white dark:bg-gray-950 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-pink-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Badge variant="secondary" className="mb-3 inline-flex items-center gap-2">
              <Crown className="h-3 w-3" aria-hidden="true" />
              Popular Anime Series
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Popular Anime Series
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Discover figures from your favorite anime series
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {animeCharacters.map((series) => (
              <Link key={series.name} href={`/catalog?series=${encodeURIComponent(series.name)}`} className="group">
                <Card className="overflow-hidden transition-all hover:shadow-xl hover:-translate-y-2">
                  <CardContent className="p-0">
                    <div className="relative h-52 flex items-center justify-center overflow-hidden">
                      <img
                        src={series.image}
                        alt={`${series.character} from ${series.name}`}
                        className="object-cover group-hover:scale-110 transition-transform duration-300 w-full h-full"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/10 to-black/30" />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent h-1/2 relative z-10" />
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {series.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{series.character}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
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
              if (!Icon) return null;
              
              return (
                <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardContent className="p-0 relative z-10">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300">
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
        <section className="section bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-400/10 to-pink-400/10 rounded-full blur-3xl" />
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-yellow-500" aria-hidden="true" />
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Figures</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-300">Most reserved this week</p>
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
      <section className="section bg-white dark:bg-gray-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5" />
        <div className="container">
          <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl" />
            <CardContent className="p-8 md:p-12 text-center relative z-10">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/20 mb-4">
                <Search className="h-8 w-8" aria-hidden="true" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Can&apos;t Find Your Figure?</h2>
              <p className="text-pink-100 mb-8 max-w-xl mx-auto">
                Request it and we&apos;ll search our Japan suppliers. If found, you get priority to reserve.
              </p>
              <Link href="/request">
                <Button size="lg" variant="secondary" className="gap-2 bg-white text-pink-600 hover:bg-pink-50">
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