import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(cents: number, currency = "EUR"): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(cents / 100)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PURCHASING_IN_JAPAN: "Purchasing in Japan",
  AVAILABLE_ON_VINTED: "Available on Vinted",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
}

export const ORDER_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PURCHASING_IN_JAPAN: "bg-purple-100 text-purple-800",
  AVAILABLE_ON_VINTED: "bg-pink-100 text-pink-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-800",
}

export const VINTED_ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PURCHASING_IN_JAPAN: "Purchasing in Japan",
  AVAILABLE_ON_VINTED: "Available on Vinted",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
}

export const VINTED_ORDER_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PURCHASING_IN_JAPAN: "bg-purple-100 text-purple-800",
  AVAILABLE_ON_VINTED: "bg-pink-100 text-pink-800",
  CANCELLED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-800",
}

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  UNPAID: "Unpaid",
  PAID: "Paid",
  PARTIAL: "Partial",
  REFUNDED: "Refunded",
  FAILED: "Failed",
}

export const REQUEST_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  CONTACTED: "Contactado",
  PRODUCT_CREATED: "Producto creado",
  REJECTED: "Rechazado",
}

export const REQUEST_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  CONTACTED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  PRODUCT_CREATED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  REJECTED: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
}

export const PRODUCT_STATUS_LABELS: Record<string, string> = {
  AVAILABLE: "Disponible",
  LOW_STOCK: "Stock bajo",
  OUT_OF_STOCK: "Agotado",
  PRE_ORDER: "Pre-order",
  DISCONTINUED: "Descatalogado",
}

export const PRODUCT_STATUS_COLORS: Record<string, string> = {
  AVAILABLE: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  LOW_STOCK: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  OUT_OF_STOCK: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  PRE_ORDER: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  DISCONTINUED: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400",
}

export function parseImages(images: string): string[] {
  try {
    return JSON.parse(images)
  } catch {
    return images ? [images] : []
  }
}

export function stringifyImages(images: string[]): string {
  return JSON.stringify(images)
}