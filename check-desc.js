const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ datasources: { db: { url: 'postgresql://neondb_owner:npg_vB2xZ9actLdw@ep-cold-bar-b4upsura-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require' } } });

async function check() {
  const p = await prisma.product.findUnique({ where: { slug: 'new-figure-1790870315223' } });
  console.log('description raw:', JSON.stringify(p.description));
  console.log('images raw:', JSON.stringify(p.images));
  await prisma.$disconnect();
}
check().catch(console.error);