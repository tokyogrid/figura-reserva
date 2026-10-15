"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface CartItem {
  productId: string
  name: string
  price: number // en céntimos
  image: string
  quantity: number
  slug: string
  isVinted?: boolean
  vintedCode?: string
}

interface DiscountInfo {
  code: string
  type: "percentage" | "fixed"
  value: number // percentage (0-100) or fixed amount in cents
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (productId: string, isVinted?: boolean) => void // Corregido: añadido isVinted
  updateQuantity: (productId: string, quantity: number, isVinted?: boolean) => void // Corregido: añadido isVinted
  clearCart: () => void
  totalItems: number
  totalPrice: number
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  // Discount
  discount: DiscountInfo | null
  applyDiscount: (code: string) => Promise<{ success: boolean; error?: string }>
  removeDiscount: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [discount, setDiscount] = useState<DiscountInfo | null>(null)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("cart")
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch {
        localStorage.removeItem("cart")
      }
    }
    const savedDiscount = localStorage.getItem("cart_discount")
    if (savedDiscount) {
      try {
        setDiscount(JSON.parse(savedDiscount))
      } catch {
        localStorage.removeItem("cart_discount")
      }
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("cart", JSON.stringify(items))
    }
  }, [items, mounted])

  useEffect(() => {
    if (mounted) {
      if (discount) {
        localStorage.setItem("cart_discount", JSON.stringify(discount))
      } else {
        localStorage.removeItem("cart_discount")
      }
    }
  }, [discount, mounted])

  const addItem = (item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId && i.isVinted === item.isVinted)
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId && i.isVinted === item.isVinted ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
    setIsOpen(true)
  }

  // Corregido: Ahora elimina el artículo completamente, sin importar la cantidad
  const removeItem = (productId: string, isVinted?: boolean) => {
    setItems((prev) => 
      prev.filter((i) => !(i.productId === productId && i.isVinted === isVinted))
    )
  }

  // Corregido: Actualiza la cantidad exacta. Si llega a 0, llama a removeItem para borrarlo.
  const updateQuantity = (productId: string, quantity: number, isVinted?: boolean) => {
    if (quantity <= 0) {
      removeItem(productId, isVinted)
      return
    }
    setItems((prev) =>
      prev.map((i) => (i.productId === productId && i.isVinted === isVinted ? { ...i, quantity } : i))
    )
  }

  const clearCart = () => {
    setItems([])
    localStorage.removeItem("cart")
  }

  const applyDiscount = async (code: string) => {
    if (discount) {
      return { success: false, error: "A discount is already applied. Remove it first." }
    }
    try {
      const res = await fetch("/api/discounts/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code, cartTotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Invalid discount code")
      setDiscount({ code: data.discount.code, type: data.discount.type, value: data.discount.value })
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const removeDiscount = () => {
    setDiscount(null)
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isOpen,
        setIsOpen,
        discount,
        applyDiscount,
        removeDiscount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}