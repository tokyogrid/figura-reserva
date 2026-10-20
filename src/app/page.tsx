import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Sparkles, Truck, Shield, Banknote, ArrowRight, Package, Search, Star, Heart, Zap, Crown, Gem, TrendingUp, Sparkle, Sun, Moon, Layers } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { siteConfig } from "@/lib/site-config"
import { ProductCard } from "@/components/ProductCard"
import { TrustpilotBadgeWrapper } from "@/components/TrustpilotBadgeWrapper"
import Image from "next/image"

export const dynamic = 'force-dynamic'

const iconMap: Record<string, React.ElementType> = {
  Banknote,
  Shield,
  Truck,
  Package,
}

const animeCharacters = [
  { name: "Spy × Family", character: "Anya Forger", image: "/images/anime/anya.webp", color: "bg-pink-500", bgColor: "bg-pink-100 dark:bg-pink-900/30" },
  { name: "One Piece", character: "Monkey D. Luffy", image: "/images/anime/luffy.webp", color: "bg-yellow-500", bgColor: "bg-yellow-100 dark:bg-yellow-900/30" },
  { name: "Jujutsu Kaisen", character: "Satoru Gojo", image: "/images/anime/gojo.webp", color: "bg-blue-500", bgColor: "bg-blue-100 dark:bg-blue-900/30" },
  { name: "Demon Slayer", character: "Tanjiro Kamado", image: "/images/anime/tanjiro.webp", color: "bg-green-500", bgColor: "bg-green-100 dark:bg-green-900/30" },
  { name: "Naruto", character: "Naruto Uzumaki", image: "/images/anime/naruto.webp", color: "bg-orange-500", bgColor: "bg-orange-100 dark:bg-orange-900/30" },
]

const headerCharacters = [
  { name: "Anya Forger", image: "/images/anime/anya.webp", series: "Spy × Family" },
  { name: "Luffy", image: "/images/anime/luffy.webp", series: "One Piece" },
  { name: "Gojo", image: "/images/anime/gojo.webp", series: "Jujutsu Kaisen" },
  { name: "Tanjiro", image: "/images/anime/tanjiro.webp", series: "Demon Slayer" },
  { name: "Naruto", image: "/images/anime/naruto.webp", series: "Naruto" }
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

async function getLatestProducts() {
  return prisma.product.findMany({
    where: { status: "AVAILABLE" },
    take: 2,
    orderBy: { createdAt: "desc" },
  })
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts()
  const latestProducts = await getLatestProducts()

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black dark:from-gray-900 dark:via-gray-950 dark:to-black">
      {/* Animated background grid */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-purple-900/10 via-pink-900/5 to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,_rgba(139,92,246,0.03)_0%,_transparent_50%),_linear-gradient(90deg,_rgba(139,92,246,0.03)_0%,_transparent_50%)] bg-[size:60px_60px]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-bl from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000" />
      </div>

      {/* Hero */}
      <section className="relative z-10 overflow-hidden py-20 lg:py-32">
        {/* Floating particles */}
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
                  animationDelay: `${index * 0.5}s`,
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
            {/* Header with anime characters */}
            <div className="flex items-center justify-center gap-3 mb-6 animate-slide-up">
              <div className="flex items-center gap-1.5">
                {headerCharacters.map((char) => (
                  <Link
                    key={char.name}
                    href={`/catalog?series=${encodeURIComponent(char.series)}`}
                    className="group relative"
                    title={char.name}
                  >
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden ring-2 ring-purple-500/50 dark:ring-purple-400/50 group-hover:scale-110 transition-transform duration-300">
                      <img
                        src={char.image}
                        alt={char.name}
                        className="object-cover transition-transform duration-300 group-hover:scale-110 w-full h-full"
                        sizes="40px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 to-transparent" />
                    </div>
                    <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] text-white/90 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      {char.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 px-4 py-2 rounded-full mb-6 animate-fade-in animate-slide-up delay-100">
              <Sparkle className="h-3 w-3 animate-pulse" aria-hidden="true" />
              <span className="font-medium">{siteConfig.hero.badge}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6 animate-slide-up delay-200 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              {siteConfig.hero.title}
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl mx-auto animate-slide-up delay-300">
              {siteConfig.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up delay-400">
              <Link href="/catalog">
                <Button size="lg" className="w-full sm:w-auto gap-2 group relative overflow-hidden" variant="primary">
                  <span className="relative z-10">{siteConfig.hero.ctaPrimary}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </Link>
              <Link href="/request">
                <Button size="lg" className="w-full sm:w-auto gap-2 group relative overflow-hidden" variant="outline">
                  <Search className="h-4 w-4" aria-hidden="true" />
                  <span className="relative z-10">{siteConfig.hero.ctaSecondary}</span>
                </Button>
              </Link>
            </div>

            {/* Trustpilot Badge */}
            <div className="animate-fade-in delay-500 mt-10" style={{ animationDelay: '500ms' }}>
              <TrustpilotBadgeWrapper />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative z-10 border-y border-gray-800/50 py-6 animate-fade-in">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={Truck} label="Fast Shipping" value="24-48h" desc="After Japan arrival" />
            <StatCard icon={Shield} label="Authenticity" value="100%" desc="Official sources only" />
            <StatCard icon={Banknote} label="Japan Prices" value="Best Price" desc="No middleman markup" />
            <StatCard icon={Sparkles} label="Exclusive Access" value="Priority" desc="First dibs on new arrivals" />
          </div>
        </div>
      </section>

      {/* Latest Arrivals - NEW SECTION */}
      {latestProducts.length > 0 && (
        <section className="relative z-10 py-16 lg:py-24 animate-fade-in">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
          <div className="container">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="relative p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-white" />
                  <div className="absolute -inset-1 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl blur opacity-30 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">Latest Arrivals</h2>
                  <p className="text-gray-400 text-sm">Fresh from Japan — just added to our catalog</p>
                </div>
              </div>
              <Link href="/catalog?sort=newest" className="hidden md:flex items-center gap-2 text-purple-400 hover:text-pink-400 font-medium transition-colors">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {latestProducts.map((product, index) => (
                <Link key={product.id} href={`/catalog/${product.slug}`} className="group relative">
                  <Card className="relative overflow-hidden h-full transition-all duration-500 group-hover:shadow-[0_0_40px_rgba(139,92,246,0.2)] group-hover:-translate-y-2 group-hover:border-purple-500/30 border-gray-800">
                    {/* NEW Badge */}
                    <div className="absolute top-3 left-3 z-10 animate-bounce-subtle">
                      <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider flex items-center gap-1.5">
                        <span className="relative z-10">🔥 NEW</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full opacity-50 animate-ping" />
                      </Badge>
                    </div>
                    
                    <div className="relative aspect-[4/5] overflow-hidden bg-gray-900">
                      {product.images ? JSON.parse(product.images)[0] ? (
                        <Image
                          src={JSON.parse(product.images)[0]}
                          alt={product.name}
                          width={400}
                          height={500}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          <Package className="h-16 w-16" aria-hidden="true" />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          <Package className="h-16 w-16" aria-hidden="true" />
                        </div>
                      )}
                      {/* Dark overlay for text readability on light images */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    
                    <CardContent className="p-5 relative z-10 bg-gradient-to-t from-gray-950/95 via-gray-900/80 to-transparent">
                      <div className="flex items-center gap-2 mb-2">
                        {product.series && (
                          <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs font-medium rounded-full">{product.series}</span>
                        )}
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-2 py-0.5 rounded-full text-xs">
                            🎁 Reserve
                          </Badge>
                        </div>
                      </div>
                      <h3 className="font-bold text-white truncate group-hover:text-purple-400 transition-colors text-lg drop-shadow-lg">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
                        <span className="text-xl font-bold text-white drop-shadow-lg">
                          {new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(product.price / 100)}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-sm text-gray-400 line-through">
                            {new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(product.originalPrice / 100)}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            
            <div className="mt-8 text-center md:hidden">
              <Link href="/catalog?sort=newest" className="inline-flex items-center gap-2 text-purple-400 hover:text-pink-400 font-medium transition-colors">
                View All Latest <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Anime character showcase section */}
      <section className="relative z-10 py-16 lg:py-24 overflow-hidden animate-fade-in">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000" />
        </div>
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-10 animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 px-4 py-2 rounded-full mb-3">
              <Crown className="h-3 w-3" aria-hidden="true" />
              <span className="font-medium">Popular Series</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Popular Anime Series
            </h2>
            <p className="text-gray-400">
              Discover figures from your favorite anime series
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {animeCharacters.map((series, index) => (
              <Link key={series.name} href={`/catalog?series=${encodeURIComponent(series.name)}`} className="group" style={{ animationDelay: `${index * 100}ms` }}>
                <Card className="overflow-hidden transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] group-hover:-translate-y-2 group-hover:border-purple-500/30 border-gray-800 animate-slide-up">
                  <CardContent className="p-0">
                    <div className="relative h-52 flex items-center justify-center overflow-hidden">
                      <img
                        src={series.image}
                        alt={`${series.character} from ${series.name}`}
                        className="object-cover group-hover:scale-110 transition-transform duration-500 w-full h-full"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-500/10 to-pink-500/20" />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent h-1/2 relative z-10" />
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                        {series.name}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">{series.character}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works - brief */}
      <section className="relative z-10 py-16 lg:py-24 animate-fade-in">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16 animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 px-4 py-2 rounded-full mb-3">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              <span className="font-medium">How It Works</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {siteConfig.howItWorks.title}
            </h2>
            <p className="text-gray-400">
              {siteConfig.howItWorks.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {siteConfig.features.map((feature, index) => {
              const Icon = iconMap[feature.icon]
              if (!Icon) return null;
              
              return (
                <Card key={index} className="text-center p-6 hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] transition-all duration-500 relative overflow-hidden group animate-slide-up border-gray-800" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardContent className="p-0 relative z-10">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-400 mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:bg-gradient-to-br group-hover:from-purple-500/40 group-hover:to-pink-500/40">
                      <Icon className="h-7 w-7" aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured products */}
      {featuredProducts.length > 0 && (
        <section className="relative z-10 py-16 lg:py-24 animate-fade-in">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="container">
            <div className="flex items-center justify-between mb-10 animate-slide-up">
              <div className="flex items-center gap-2">
                <div className="relative p-2 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl">
                  <Sparkles className="h-6 w-6 text-white" />
                  <div className="absolute -inset-1 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl blur opacity-30 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Featured Figures</h2>
                  <p className="text-gray-400">Most reserved this week</p>
                </div>
              </div>
              <Link href="/catalog">
                <Button variant="ghost" className="gap-2 group">
                  View All <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Button>
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <ProductCard key={product.id} product={{
                  ...product,
                  releaseDate: product.releaseDate ? product.releaseDate.toISOString() : null,
                  createdAt: product.createdAt.toISOString(),
                  updatedAt: product.updatedAt.toISOString(),
                }} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="relative z-10 py-16 lg:py-24 overflow-hidden animate-fade-in">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-pink-500/5" />
        <div className="container">
          <Card className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-pink-700 text-white border-purple-500/30 animate-slide-up">
            <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl animate-pulse-slow delay-1000" />
            <CardContent className="p-8 md:p-12 text-center relative z-10">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/10 mb-4 group animate-pulse-slow">
                <Search className="h-8 w-8" aria-hidden="true" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Can't Find Your Figure?</h2>
              <p className="text-pink-100 mb-8 max-w-xl mx-auto text-lg">
                Request it and we'll search our Japan suppliers. If found, you get priority to reserve.
              </p>
              <Link href="/request">
                <Button size="lg" variant="secondary" className="gap-2 bg-white text-pink-600 hover:bg-pink-50 group relative overflow-hidden">
                  <span className="relative z-10">Request Figure</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Newsletter / Trust badges */}
      <section className="relative z-10 py-12 border-t border-gray-800/50 animate-fade-in">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <TrustBadge icon={Truck} title="Free Shipping" desc="Over €100" />
            <TrustBadge icon={Shield} title="Secure Payment" desc="Stripe encrypted" />
            <TrustBadge icon={Package} title="Authentic" desc="Official sources" />
            <TrustBadge icon={Sparkles} title="Support" desc="24/7 help" />
          </div>
        </div>
      </section>
    </div>
  )
}

// Helper Components
function StatCard({ icon: Icon, label, value, desc }: { icon: React.ElementType; label: string; value: string; desc: string }) {
  return (
    <div className="text-center p-4 bg-gray-900/50 border border-gray-800 rounded-2xl hover:border-purple-500/30 transition-all duration-300 group">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-400 mb-3 group-hover:scale-110 transition-transform">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="font-medium text-gray-300">{label}</p>
      <p className="text-xs text-gray-500 mt-1">{desc}</p>
    </div>
  )
}

function TrustBadge({ icon: Icon, title, desc }: { icon: React.ElementType; title: string; desc: string }) {
  return (
    <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-xl hover:border-purple-500/30 transition-all duration-300">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-400 mx-auto mb-2">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <p className="font-semibold text-white">{title}</p>
      <p className="text-xs text-gray-500">{desc}</p>
    </div>
  )
}