import { NextRequest, NextResponse } from "next/server"
import { getSessionFromRequest } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(request)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const product = await prisma.product.findUnique({ where: { id } })
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ product })
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(request)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  try {
    const body = await request.json()
    console.log("PUT body:", body)
    
    const updateData: any = { ...body }
    
    // Handle price - convert from euros string to cents integer
    if (body.price !== undefined && body.price !== "") {
      const priceVal = typeof body.price === 'string' ? parseFloat(body.price) : body.price
      // If value is already in cents (large number), don't convert again
      updateData.price = priceVal > 10000 ? Math.round(priceVal) : Math.round(priceVal * 100)
    }
    
    if (body.originalPrice !== undefined && body.originalPrice !== "") {
      const priceVal = typeof body.originalPrice === 'string' ? parseFloat(body.originalPrice) : body.originalPrice
      updateData.originalPrice = priceVal > 10000 ? Math.round(priceVal) : Math.round(priceVal * 100)
    }
    
    if (body.stock !== undefined && body.stock !== "") {
      updateData.stock = parseInt(body.stock)
    }
    
    if (body.sortOrder !== undefined && body.sortOrder !== "") {
      updateData.sortOrder = parseInt(body.sortOrder)
    }
    
    if (body.releaseDate) {
      updateData.releaseDate = new Date(body.releaseDate)
    }
    
    // Handle images - can be JSON string or array
    if (body.images !== undefined) {
      let images: string[] = []
      if (typeof body.images === 'string') {
        try {
          images = JSON.parse(body.images)
        } catch {
          images = body.images.split('\n').filter((u: string) => u.trim())
        }
      } else if (Array.isArray(body.images)) {
        images = body.images
      }
      updateData.images = JSON.stringify(images.filter((u: string) => u.trim()))
    }
    
    // Remove fields that shouldn't be updated directly
    delete updateData.id
    delete updateData.createdAt
    delete updateData.updatedAt
    delete updateData.bulkImages
    delete updateData.slug
    
    console.log("Updating with:", updateData)
    
    const product = await prisma.product.update({ where: { id }, data: updateData })
    return NextResponse.json({ product })
  } catch (e) { 
    console.error("Update error:", e)
    return NextResponse.json({ error: "Error updating: " + (e instanceof Error ? e.message : String(e)) }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(request)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  try { await prisma.product.delete({ where: { id } }); return NextResponse.json({ ok: true }) } catch { return NextResponse.json({ error: "Error deleting" }, { status: 500 }) }
}