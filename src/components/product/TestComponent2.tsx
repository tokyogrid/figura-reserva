"use client"

import React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Card, CardContent } from "@/components/ui/Card"
import { formatPrice, cn } from "@/lib/utils"
import { sanitizeHtml } from "@/lib/sanitize"
import { Truck, Shield, RotateCcw, Package, Check, Zap } from "lucide-react"

interface Props {
  name: string
}

const TestComponent = ({ name }: Props) => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
    <div className="container py-8">
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
            <Image
              src="/test.jpg"
              alt={name}
              width={800}
              height={800}
              className="object-contain"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{name}</h1>
          </div>
          <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {}}
                      disabled={true}
                      className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Decrease quantity"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                    </button>
                    <input
                      id="quantity"
                      type="number"
                      value={1}
                      onChange={() => {}}
                      min={1}
                      max={5}
                      className="w-20 text-center border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={true}
                    />
                    <button
                      onClick={() => {}}
                      disabled={true}
                      className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Increase quantity"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  <Button
                    onClick={() => {}}
                    className="w-full h-12 text-lg"
                    variant="primary"
                  >
                    <Zap className="h-4 w-4" aria-hidden="true" />
                    Buy Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
)

export default TestComponent