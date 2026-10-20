import { fetchTrustpilotData } from "@/lib/trustpilot"
import { TrustpilotBadge } from "@/components/TrustpilotBadge"

export async function TrustpilotBadgeWrapper() {
  const data = await fetchTrustpilotData()

  return <TrustpilotBadge rating={data.ratingValue} reviewCount={data.reviewCount} />
}