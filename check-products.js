const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

prisma.product.findMany({ 
  take: 10, 
  select: { id: true, name: true, slug: true, images: true, stock: true, status: true } 
})
  .then(products => {
    console.log(JSON.stringify(products, null, 2));
  })
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());