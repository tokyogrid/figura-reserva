"use client"

import React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Card, CardContent } from "@/components/ui/Card"
import { formatPrice, cn } from "@/lib/utils"
import { sanitizeHtml } from "@/lib/sanitize"
import { Truck, Shield, RotateCcw, Package, Check, Zap, Tag } from "lucide-react"

function handleAddToCart(inStock, images, product, addItem, options = {}) {
  const { isVinted = false } = options
  if (!inStock && !isVinted) return
  if (product.isUnpurchasable) return
  
  const price = isVinted ? Math.round(product.price / 2) : product.price
  
  addItem({
    productId: product.id,
    name: product.name,
    price: price,
    image: images[0] || "",
    slug: product.slug,
    isVinted: isVinted,
  })
}

function ProductDetailContent({
  product,
  images,
  selectedImage,
  setSelectedImage,
  quantity,
  setQuantity,
  addItem,
}) {
  const available = product.stock - product.reserved
  const inStock = available > 0
  const maxQty = Math.min(available > 0 ? available : 0, 5)

  return React.createElement("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-950" },
    React.createElement("div", { className: "container py-8" },
      React.createElement("nav", { className: "mb-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400", "aria-label": "Navigation" },
        React.createElement("a", { href: "/", className: "hover:text-blue-600 dark:hover:text-blue-400" }, "Home"),
        React.createElement("span", null, "/"),
        React.createElement("a", { href: "/catalog", className: "hover:text-blue-600 dark:hover:text-blue-400" }, "Catalog"),
        React.createElement("span", null, "/"),
        React.createElement("span", { className: "text-gray-900 dark:text-white truncate max-w-[200px]" }, product.name)
      ),
      React.createElement("div", { className: "grid lg:grid-cols-2 gap-8" },
        React.createElement("div", { className: "space-y-4" },
          React.createElement("div", { className: "relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800" },
            images[selectedImage] ? React.createElement(Image, {
              src: images[selectedImage],
              alt: product.name,
              width: 800,
              height: 800,
              className: "object-contain",
              priority: true,
              sizes: "(max-width: 1024px) 100vw, 50vw"
            }) : React.createElement("div", { className: "w-full h-full flex items-center justify-center text-gray-400" },
              React.createElement(Package, { className: "h-24 w-24", "aria-hidden": "true" })
            ),
            !inStock && React.createElement("div", { className: "absolute inset-0 bg-black/50 flex items-center justify-center" },
              React.createElement(Badge, { variant: "danger", className: "text-xl px-6 py-3" }, "Out of Stock - Pre-order Available")
            ),
            product.isFeatured && React.createElement(Badge, { className: "absolute top-4 left-4", variant: "warning" },
              "⭐ Featured"
            )
          ),
          images.length > 1 && React.createElement("div", { className: "flex gap-2 overflow-x-auto pb-2" },
            images.map((image, index) => React.createElement("button", {
              key: index,
              onClick: () => setSelectedImage(index),
              className: cn(
                "relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors",
                index === selectedImage ? "border-blue-500" : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
              ),
              "aria-label": "View image " + (index + 1),
              "aria-current": index === selectedImage ? "true" : "false"
            },
              React.createElement(Image, {
                src: image,
                alt: product.name + " - vista " + (index + 1),
                width: 80,
                height: 80,
                className: "object-contain",
                sizes: "80px"
              })
            ))
          )
        ),
        React.createElement("div", { className: "space-y-6" },
          React.createElement("div", null,
            product.series && React.createElement("p", { className: "text-sm text-blue-600 dark:text-blue-400 font-medium mb-1" }, product.series),
            React.createElement("h1", { className: "text-3xl font-bold text-gray-900 dark:text-white mb-2" }, product.name),
            React.createElement("div", { className: "flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400" },
              product.originalPrice && product.originalPrice > product.price && React.createElement("span", { className: "line-through" }, formatPrice(product.originalPrice)),
              React.createElement("span", { className: "text-2xl font-bold text-gray-900 dark:text-white" }, formatPrice(product.price))
            )
          ),
          React.createElement("div", { className: "flex flex-wrap gap-2" },
            (product.stock - product.reserved > 0) && (product.stock - product.reserved) < 5 && React.createElement(Badge, { variant: "warning", className: "gap-1" },
              React.createElement(Package, { className: "h-3 w-3", "aria-hidden": "true" }),
              "Only " + (product.stock - product.reserved) + " left"
            ),
            !(product.stock - product.reserved > 0) && React.createElement(Badge, { variant: "danger", className: "gap-1" },
              React.createElement(Package, { className: "h-3 w-3", "aria-hidden": "true" }),
              "Out of Stock - Available for Pre-order"
            ),
            product.status === "PRE_ORDER" && React.createElement(Badge, { variant: "info" }, "Pre-order"),
            product.status === "LOW_STOCK" && product.stock - product.reserved > 0 && React.createElement(Badge, { variant: "warning" }, "Low stock"),
            product.isUnpurchasable && React.createElement(Badge, { variant: "secondary", className: "gap-1" },
              React.createElement(Tag, { className: "h-3 w-3", "aria-hidden": "true" }),
              "Not purchasable"
            ),
            product.isHidden && React.createElement(Badge, { variant: "secondary" }, "Hidden from catalog")
          ),
          product.description && React.createElement("div", { className: "prose prose-gray dark:prose-invert max-w-none" },
            React.createElement("p", { className: "text-gray-600 dark:text-gray-300 whitespace-pre-wrap", dangerouslySetInnerHTML: { __html: sanitizeHtml(product.description) } })
          ),
          (function() {
            const specsArray = [
              { label: "Series", value: product.series },
              { label: "Character", value: product.character },
              { label: "Manufacturer", value: product.manufacturer },
              { label: "Scale", value: product.scale },
              { label: "Category", value: product.category },
              { label: "Release", value: product.releaseDate ? new Date(product.releaseDate).toLocaleDateString("en-US") : null }
            ]
            const specs = specsArray.filter(function(s) { return s.value !== null })
            if (specs.length === 0) return null
            return React.createElement(Card, null,
              React.createElement(CardContent, { className: "p-6" },
                React.createElement("h3", { className: "font-semibold text-gray-900 dark:text-white mb-4" }, "Especificaciones"),
                React.createElement("div", { className: "grid sm:grid-cols-2 gap-4" },
                  specs.map(function(spec) {
                    return React.createElement("div", { key: spec.label, className: "flex items-start gap-3" },
                      React.createElement(Package, { className: "h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5", "aria-hidden": "true" }),
                      React.createElement("div", null,
                        React.createElement("p", { className: "text-xs text-gray-500 dark:text-gray-400" }, spec.label),
                        React.createElement("p", { className: "text-sm font-medium text-gray-900 dark:text-white" }, spec.value)
                      )
                    )
                  })
                )
              )
            )
          })(),
          React.createElement(Card, { className: "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20" },
            React.createElement(CardContent, { className: "p-6" },
              React.createElement("div", { className: "space-y-4" },
                React.createElement("div", null,
                  React.createElement("label", { htmlFor: "quantity", className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" }, "Quantity"),
                  React.createElement("div", { className: "flex items-center gap-3" },
                    React.createElement("button", {
                      onClick: function() { return setQuantity(Math.max(1, quantity - 1)) },
                      disabled: quantity <= 1 || product.stock - product.reserved <= 0,
                      className: "p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed",
                      "aria-label": "Decrease quantity"
                    },
                      React.createElement("svg", { className: "h-5 w-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M20 12H4" })
                      )
                    ),
                    React.createElement("input", {
                      id: "quantity",
                      type: "number",
                      value: quantity,
                      onChange: function(e) { return setQuantity(Math.min(Math.min(product.stock - product.reserved > 0 ? product.stock - product.reserved : 0, 5), Math.max(1, parseInt(e.target.value) || 1))) },
                      min: 1,
                      max: Math.min(product.stock - product.reserved > 0 ? product.stock - product.reserved : 0, 5),
                      className: "w-20 text-center border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500",
                      disabled: product.stock - product.reserved <= 0
                    }),
                    React.createElement("button", {
                      onClick: function() { return setQuantity(Math.min(Math.min(product.stock - product.reserved > 0 ? product.stock - product.reserved : 0, 5), quantity + 1)) },
                      disabled: quantity >= Math.min(product.stock - product.reserved > 0 ? product.stock - product.reserved : 0, 5) || product.stock - product.reserved <= 0,
                      className: "p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed",
                      "aria-label": "Increase quantity"
                    },
                      React.createElement("svg", { className: "h-5 w-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" })
                      )
                    )
                  ),
                  (function() {
                    const maxQty = Math.min(product.stock - product.reserved > 0 ? product.stock - product.reserved : 0, 5)
                    return maxQty > 0 && maxQty < 5 && product.stock - product.reserved > 0 ? React.createElement("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1" }, "Max " + maxQty + " unit" + (maxQty !== 1 ? "s" : "") + " available") : null
                  })(),
                  !(product.stock - product.reserved > 0) && React.createElement("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1" }, "Out of stock - Pre-order available")
                ),
                React.createElement("div", { className: "space-y-3" },
                  inStock && !product.isUnpurchasable ? [
                    React.createElement(Button, {
                      key: "buy",
                      onClick: function() { return handleAddToCart(true, images, product, addItem, { isVinted: false }) },
                      className: "w-full h-12 text-lg",
                      variant: "primary"
                    }, React.createElement(Zap, { className: "h-4 w-4", "aria-hidden": "true" }), "Buy Now - Fast Shipping (1-3 days)"),
                    React.createElement(Button, {
                      key: "vinted",
                      onClick: function() { return handleAddToCart(true, images, product, addItem, { isVinted: true }) },
                      className: "w-full h-12 text-lg",
                      variant: "secondary"
                    }, React.createElement(Tag, { className: "h-4 w-4", "aria-hidden": "true" }), "Buy via Vinted (50% now, 50% on Vinted)")
                  ] : product.isUnpurchasable ? [
                    React.createElement("div", { key: "unpurchasable", className: "w-full h-12 text-lg bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400" },
                      "Not available for purchase"
                    )
                  ] : [
                    React.createElement(Button, {
                      key: "buy_preorder",
                      onClick: function() { return handleAddToCart(true, images, product, addItem, { isVinted: false }) },
                      className: "w-full h-12 text-lg",
                      variant: "primary"
                    }, React.createElement(Truck, { className: "h-4 w-4", "aria-hidden": "true" }), "Buy (15-30 days)"),
                    React.createElement(Button, {
                      key: "vinted",
                      onClick: function() { return handleAddToCart(true, images, product, addItem, { isVinted: true }) },
                      className: "w-full h-12 text-lg",
                      variant: "secondary"
                    }, React.createElement(Package, { className: "h-4 w-4", "aria-hidden": "true" }), "Buy via Vinted (50% now, 50% on Vinted)")
                  ]
                ),
                React.createElement("div", { className: "flex items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400 pt-4 border-t border-blue-200 dark:border-blue-800" },
                  React.createElement("div", { className: "flex items-center gap-2" },
                    React.createElement(Truck, { className: "h-4 w-4", "aria-hidden": "true" }),
                    React.createElement("span", null, "Shipping 4.99\u20ac (free >100\u20ac)")
                  ),
                  React.createElement("div", { className: "flex items-center gap-2" },
                    React.createElement(Shield, { className: "h-4 w-4", "aria-hidden": "true" }),
                    React.createElement("span", null, "Secure Stripe payment")
                  ),
                  React.createElement("div", { className: "flex items-center gap-2" },
                    React.createElement(RotateCcw, { className: "h-4 w-4", "aria-hidden": "true" }),
                    React.createElement("span", null, "14-day returns")
                  )
                )
              )
            )
          ),
          React.createElement("div", { className: "grid grid-cols-3 gap-4 text-center" },
            React.createElement("div", { className: "p-4" },
              React.createElement(Check, { className: "h-8 w-8 text-green-500 mx-auto mb-2", "aria-hidden": "true" }),
              React.createElement("p", { className: "text-sm font-medium text-gray-900 dark:text-white" }, "Authentic"),
              React.createElement("p", { className: "text-xs text-gray-500 dark:text-gray-400" }, "Bought from official JP stores")
            ),
            React.createElement("div", { className: "p-4" },
              React.createElement(Shield, { className: "h-8 w-8 text-blue-500 mx-auto mb-2", "aria-hidden": "true" }),
              React.createElement("p", { className: "text-sm font-medium text-gray-900 dark:text-white" }, "Secure"),
              React.createElement("p", { className: "text-xs text-gray-500 dark:text-gray-400" }, "Refund if we can't get the figure")
            ),
            React.createElement("div", { className: "p-4" },
              React.createElement(Truck, { className: "h-8 w-8 text-purple-500 mx-auto mb-2", "aria-hidden": "true" }),
              React.createElement("p", { className: "text-sm font-medium text-gray-900 dark:text-white" }, "Fast"),
              React.createElement("p", { className: "text-xs text-gray-500 dark:text-gray-400" }, "Shipped 24-48h after receipt")
            )
          )
        )
      )
    )
  )
}

export default ProductDetailContent