const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const account = await prisma.vintedAccount.findFirst()
  if (!account) {
    console.log('No Vinted account found')
    return
  }

  const review = await prisma.vintedReview.create({
    data: {
      vintedAccountId: account.id,
      vintedReviewId: 'manual-' + Date.now(),
      buyerUsername: 'manual-user',
      rating: 5,
      comment: "test",
      reviewDate: new Date(),
    }
  })

  console.log('Created review:', review.id)

  // Update account stats
  const reviews = await prisma.vintedReview.findMany({
    where: { vintedAccountId: account.id }
  })

  const positiveFeedback = reviews.filter(r => r.rating >= 4).length
  const negativeFeedback = reviews.filter(r => r.rating <= 2).length
  const neutralFeedback = reviews.filter(r => r.rating === 3).length
  const avgRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
    : 0

  await prisma.vintedAccount.update({
    where: { id: account.id },
    data: {
      rating: avgRating,
      positiveFeedback,
      neutralFeedback,
      negativeFeedback,
    }
  })

  console.log('Updated account stats:', { avgRating, positiveFeedback, neutralFeedback, negativeFeedback })
  console.log('TOTAL_REVIEWS:', reviews.length)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())