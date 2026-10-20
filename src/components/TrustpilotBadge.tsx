"use client"

import Link from "next/link"
import { Star, ExternalLink } from "lucide-react"

interface TrustpilotBadgeProps {
  className?: string
}

export function TrustpilotBadge({ className = "" }: TrustpilotBadgeProps) {
  const rating = 3.7
  const reviewCount = 1
  const stars = Math.round(rating * 2) / 2
  const fullStars = Math.floor(stars)
  const hasHalfStar = stars % 1 >= 0.5

  return (
    <Link
      href="https://es.trustpilot.com/review/tokyogridstore.com"
      target="_blank"
      rel="noopener noreferrer"
      className={`
        group inline-flex items-center gap-3 px-5 py-3
        bg-zinc-900/80 backdrop-blur-md
        border border-zinc-800/50
        rounded-xl
        transition-all duration-300
        hover:border-emerald-500/50
        hover:shadow-[0_0_20px_rgba(0,182,122,0.15)]
        hover:bg-zinc-900/90
        ${className}
      `}
      aria-label={`Ver opiniones en Trustpilot: ${rating} de 5 estrellas, ${reviewCount} valoraciones`}
    >
      <div className="flex items-center gap-1 text-emerald-500 group-hover:text-emerald-400 transition-colors">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`
              h-4 w-4 transition-transform duration-200
              ${i < fullStars
                ? "fill-current text-emerald-500"
                : i === fullStars && hasHalfStar
                ? "fill-current text-emerald-500"
                : "text-zinc-600 group-hover:text-emerald-500/50"
              }
            `}
            aria-hidden="true"
          />
        ))}
      </div>

      <div className="flex flex-col items-start text-left">
        <span className="font-bold text-white text-sm">
          {rating} <span className="font-normal text-zinc-400">/ 5</span>
        </span>
        <span className="text-zinc-500 text-xs">
          {reviewCount} valoraciones
        </span>
      </div>

      <ExternalLink
        className="ml-2 h-4 w-4 text-zinc-600 group-hover:text-emerald-500 transition-colors opacity-0 group-hover:opacity-100"
        aria-hidden="true"
      />
    </Link>
  )
}