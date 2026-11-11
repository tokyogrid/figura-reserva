import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function checkProducts() {
  const failingSlugs = [
    'new-figure-1790870315223',
    'new-figure-1790958525018', 
    'new-figure-1790958690703',
    'new-figure-1790958867249'
  ]
  
  const workingSlugs = [
    'new-figure-1790960120808',
    'new-figure-1790959029233',
    'new-figure-1790960261382'
  ]
  
  console.log('=== FAILING PRODUCTS ===')
  for (const slug of failingSlugs) {
    const p = await prisma.product.findUnique({ where: { slug } })
    if (p) {
      console.log('\n--- ' + slug + ' ---')
      console.log('name:', p.name)
      console.log('description:', p.description ? p.description.substring(0, 200) : 'NULL')
      console.log('images:', p.images ? p.images.substring(0, 200) : 'NULL')
      console.log('price:', p.price)
      console.log('originalPrice:', p.originalPrice)
      console.log('category:', p.category)
      console.log('series:', p.series)
      console.log('character:', p.character)
      console.log('manufacturer:', p.manufacturer)
      console.log('scale:', p.scale)
      console.log('releaseDate:', p.releaseDate)
      console.log('stock:', p.stock)
      console.log('reserved:', p.reserved)
      console.log('status:', p.status)
      console.log('isFeatured:', p.isFeatured)
      console.log('isHidden:', p.isHidden)
      console.log('isUnpurchasable:', p.isUnpurchasable)
      console.log('sortOrder:', p.sortOrder)
    } else {
      console.log('\n--- ' + slug + ' --- NOT FOUND')
    }
  }
  
  console.log('\n=== WORKING PRODUCTS ===')
  for (const slug of workingSlugs) {
    const p = await prisma.product.findUnique({ where: { slug } })
    if (p) {
      console.log('\n--- ' + slug + ' ---')
      console.log('name:', p.name)
      console.log('description:', p.description ? p.description.substring(0, 200) : 'NULL')
      console.log('images:', p.images ? p.images.substring(0, 200) : 'NULL')
      console.log('price:', p.price)
      console.log('originalPrice:', p.originalPrice)
      console.log('category:', p.category)
      console.log('series:', p.series)
      console.log('character:', p.character)
      console.log('manufacturer:', p.manufacturer)
      console.log('scale:', p.scale)
      console.log('releaseDate:', p.releaseDate)
      console.log('stock:', p.stock)
      console.log('reserved:', p.reserved)
      console.log('status:', p.status)
      console.log('isFeatured:', p.isFeatured)
      console.log('isHidden:', p.isHidden)
      console.log('isUnpurchasable:', p.isUnpurchasable)
      console.log('sortOrder:', p.sortOrder)
    }
  }
  
  await prisma.$disconnect()
}

checkProducts().catch(console.error)