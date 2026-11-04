import { Metadata } from "next"
import LoginClient from "./LoginClient"

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Sign In - Tokyo Grid",
  description: "Sign in to your Tokyo Grid account to reserve figures and track orders",
}

export default function LoginPage() {
  return <LoginClient />
}