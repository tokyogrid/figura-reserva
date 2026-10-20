export interface TrustpilotData {
  ratingValue: number
  reviewCount: number
  bestRating?: number
  worstRating?: number
}

const TRUSTPILOT_URL = "https://es.trustpilot.com/review/tokyogridstore.com"
const REVALIDATE_SECONDS = 43200 // 12 hours

function extractJSONLD(html: string): TrustpilotData | null {
  const jsonLdRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi
  let match

  while ((match = jsonLdRegex.exec(html)) !== null) {
    try {
      const jsonText = match[1].trim()
      const data = JSON.parse(jsonText)

      const items = Array.isArray(data) ? data : [data]

      for (const item of items) {
        if (item["@type"] === "AggregateRating" || item["@type"]?.includes("AggregateRating")) {
          const ratingValue = parseFloat(item.ratingValue)
          const reviewCount = parseInt(item.reviewCount, 10)

          if (!isNaN(ratingValue) && !isNaN(reviewCount)) {
            return {
              ratingValue,
              reviewCount,
              bestRating: item.bestRating ? parseFloat(item.bestRating) : 5,
              worstRating: item.worstRating ? parseFloat(item.worstRating) : 1,
            }
          }
        }

        if (item["@graph"]) {
          for (const graphItem of item["@graph"]) {
            if (graphItem["@type"] === "AggregateRating") {
              const ratingValue = parseFloat(graphItem.ratingValue)
              const reviewCount = parseInt(graphItem.reviewCount, 10)

              if (!isNaN(ratingValue) && !isNaN(reviewCount)) {
                return {
                  ratingValue,
                  reviewCount,
                  bestRating: graphItem.bestRating ? parseFloat(graphItem.bestRating) : 5,
                  worstRating: graphItem.worstRating ? parseFloat(graphItem.worstRating) : 1,
                }
              }
            }
          }
        }
      }
    } catch {
      continue
    }
  }

  return null
}

export async function fetchTrustpilotData(): Promise<TrustpilotData> {
  try {
    const response = await fetch(TRUSTPILOT_URL, {
      next: { revalidate: REVALIDATE_SECONDS },
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; TokyoGridBot/1.0; +https://tokyogrid.com)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    })

    if (!response.ok) {
      throw new Error(`Trustpilot fetch failed: ${response.status}`)
    }

    const html = await response.text()
    const data = extractJSONLD(html)

    if (!data) {
      throw new Error("No AggregateRating JSON-LD found")
    }

    return data
  } catch (error) {
    console.warn("[Trustpilot] Failed to fetch real data:", error)
    return {
      ratingValue: 5.0,
      reviewCount: 0,
      bestRating: 5,
      worstRating: 1,
    }
  }
}

export function getFallbackData(): TrustpilotData {
  return {
    ratingValue: 5.0,
    reviewCount: 0,
    bestRating: 5,
    worstRating: 1,
  }
}