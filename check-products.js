const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ datasources: { db: { url: 'postgresql://neondb_owner:npg_vB2xZ9actLdw@ep-cold-bar-b4upsura-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require' } } });

const slugs = ['new-figure-1790870315223', 'new-figure-1790958525018', 'new-figure-1790958690703', 'new-figure-1790958867249'];

async function check() {
  for (const slug of slugs) {
    const p = await prisma.product.findUnique({ where: { slug } });
    console.log(slug, p ? 'EXISTS' : 'NOT FOUND');
  }
  await prisma.$disconnect();
}
check().catch(console.error);