"use client"

import { useState } from "react"
import { useCart } from "@/lib/cart-context"
import { parseImages } from "@/lib/utils"
import ProductDetailContent from "@/components/product/ProductDetailContent.jsx"

interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  originalPrice: number | null
  images: string
  category: string | null
  series: string | null
  character: string | null
  manufacturer: string | null
  scale: string | null
  releaseDate: string | null
  stock: number
  reserved: number
  status: string
  isFeatured: boolean
}

interface Props {
  product: Product
}

export function ProductDetail({ product }: Props) {
  const images = parseImages(product.images)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  return (
    <ProductDetailContent
      product={product}
      images={images}
      selectedImage={selectedImage}
      setSelectedImage={setSelectedImage}
      quantity={quantity}
      setQuantity={setQuantity}
      addItem={addItem}
    />
  )
}