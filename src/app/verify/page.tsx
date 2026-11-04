import { Metadata } from "next"
import VerifyClient from "./VerifyClient"

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Verify Email - Tokyo Grid",
  description: "Verify your email address to complete your Tokyo Grid registration",
}

export default function VerifyPage() {
  return <VerifyClient />
}