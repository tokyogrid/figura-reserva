import { Metadata } from "next"
import RegisterClient from "./RegisterClient"

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Create Account - Tokyo Grid",
  description: "Create your Tokyo Grid account to reserve figures from Japan",
}

export default function RegisterPage() {
  return <RegisterClient />
}