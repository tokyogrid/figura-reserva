const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ datasources: { db: { url: 'postgresql://neondb_owner:npg_vB2xZ9actLdw@ep-cold-bar-b4upsura-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require' } } });

const slugs = ['new-figure-1790870315223', 'new-figure-1790958525018', 'new-figure-1790958690703', 'new-figure-1790958867249', 'new-figure-1790960120808'];

async function check() {
  for (const slug of slugs) {
    const p = await prisma.product.findUnique({ where: { slug } });
    console.log('---', slug, '---');
    console.log('  name:', p.name);
    console.log('  description:', p.description ? p.description.substring(0, 100) : 'NULL');
    console.log('  images:', p.images ? p.images.substring(0, 100) : 'NULL');
    console.log('  price:', p.price);
    console.log('  originalPrice:', p.originalPrice);
    console.log('  category:', p.category);
    console.log('  series:', p.series);
    console.log('  character:', p.character);
    console.log('  manufacturer:', p.manufacturer);
    console.log('  scale:', p.scale);
    console.log('  releaseDate:', p.releaseDate);
    console.log('  stock:', p.stock);
    console.log('  reserved:', p.reserved);
    console.log('  status:', p.status);
    console.log('  isFeatured:', p.isFeatured);
    console.log('  isHidden:', p.isHidden);
    console.log('  isUnpurchasable:', p.isUnpurchasable);
    console.log('  sortOrder:', p.sortOrder);
    console.log('  createdAt:', p.createdAt);
    console.log('  updatedAt:', p.updatedAt);
  }
  await prisma.$disconnect();
}
check().catch(console.error);