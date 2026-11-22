#!/usr/bin/env python3
"""
Script to update Trustpilot and Vinted ratings/reviews.
This script is not meant to be committed to git.
"""

import argparse
import subprocess
import sys
import os
import json
from pathlib import Path

# Add the project root to path
PROJECT_ROOT = Path(__file__).parent
TRUSTPILOT_BADGE_PATH = PROJECT_ROOT / "src" / "components" / "TrustpilotBadge.tsx"


def run_cmd(cmd, cwd=None, capture=True):
    """Run a shell command and return the result."""
    result = subprocess.run(cmd, shell=True, cwd=cwd or PROJECT_ROOT, capture_output=capture, text=True)
    if result.returncode != 0 and capture:
        print(f"Error running: {cmd}")
        print(f"stderr: {result.stderr}")
    return result


def get_current_review_count():
    """Read current review count from TrustpilotBadge.tsx."""
    if not TRUSTPILOT_BADGE_PATH.exists():
        return 0
    content = TRUSTPILOT_BADGE_PATH.read_text()
    for line in content.split('\n'):
        if 'const reviewCount =' in line:
            try:
                return int(line.split('=')[1].strip())
            except:
                pass
    return 0


def update_trustpilot(rating: float, review_count: int = None, auto_increment: bool = False):
    """Update Trustpilot rating and review count in TrustpilotBadge.tsx."""
    if not TRUSTPILOT_BADGE_PATH.exists():
        print(f"Error: {TRUSTPILOT_BADGE_PATH} not found")
        return False

    content = TRUSTPILOT_BADGE_PATH.read_text()

    # Calculate stars
    full_stars = int(rating)
    has_half_star = (rating - full_stars) >= 0.5

    # Auto-increment review count if requested
    if auto_increment:
        review_count = get_current_review_count() + 1
        print(f"Auto-incrementing review count to: {review_count}")

    # Replace the hardcoded values
    lines = content.split('\n')
    new_lines = []
    for line in lines:
        if 'const rating = 0' in line:
            new_lines.append(f'  const rating = {rating}')
        elif 'const reviewCount = 0' in line:
            new_lines.append(f'  const reviewCount = {review_count if review_count is not None else 0}')
        elif 'const stars = 0' in line:
            new_lines.append(f'  const stars = {rating}')
        elif 'const fullStars = 0' in line:
            new_lines.append(f'  const fullStars = {full_stars}')
        elif 'const hasHalfStar = false' in line:
            new_lines.append(f'  const hasHalfStar = {str(has_half_star).lower()}')
        else:
            new_lines.append(line)

    new_content = '\n'.join(new_lines)
    TRUSTPILOT_BADGE_PATH.write_text(new_content)
    print(f"Updated Trustpilot: rating={rating}, reviewCount={review_count}, fullStars={full_stars}, hasHalfStar={has_half_star}")
    return True


def add_vinted_review(rating: int, comment: str = None):
    """Add a Vinted review to the database using Prisma."""
    # Create a temporary seed script (ES module)
    seed_script = f"""import {{ PrismaClient }} from '@prisma/client'
const prisma = new PrismaClient()

async function main() {{
  const account = await prisma.vintedAccount.findFirst()
  if (!account) {{
    console.log('No Vinted account found')
    return
  }}

  const review = await prisma.vintedReview.create({{
    data: {{
      vintedAccountId: account.id,
      vintedReviewId: 'manual-' + Date.now(),
      buyerUsername: 'manual-user',
      rating: {rating},
      comment: {json.dumps(comment) if comment else 'null'},
      reviewDate: new Date(),
    }}
  }})

  console.log('Created review:', review.id)

  // Update account stats
  const reviews = await prisma.vintedReview.findMany({{
    where: {{ vintedAccountId: account.id }}
  }})

  const positiveFeedback = reviews.filter(r => r.rating >= 4).length
  const negativeFeedback = reviews.filter(r => r.rating <= 2).length
  const neutralFeedback = reviews.filter(r => r.rating === 3).length
  const avgRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
    : 0

  await prisma.vintedAccount.update({{
    where: {{ id: account.id }},
    data: {{
      rating: avgRating,
      positiveFeedback,
      neutralFeedback,
      negativeFeedback,
    }}
  }})

  console.log('Updated account stats:', {{ avgRating, positiveFeedback, neutralFeedback, negativeFeedback }})
  console.log('TOTAL_REVIEWS:', reviews.length)
}}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
"""
    
    seed_path = PROJECT_ROOT / "prisma" / "seed_manual_review.mjs"
    seed_path.write_text(seed_script)
    
    try:
        result = subprocess.run(f'node "{seed_path}"', shell=True, cwd=PROJECT_ROOT, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"Added Vinted review: rating={rating}, comment={comment}")
            # Extract total reviews from output
            for line in result.stdout.split('\n'):
                if 'TOTAL_REVIEWS:' in line:
                    total = int(line.split(':')[1].strip())
                    return total
            return True
        else:
            print(f"Failed to add Vinted review: {result.stderr}")
            return False
    finally:
        seed_path.unlink(missing_ok=True)


def git_push(message: str = "Update ratings and reviews"):
    """Commit and push changes to git."""
    # Check if there are changes
    result = run_cmd("git status --porcelain")
    if not result.stdout.strip():
        print("No changes to commit")
        return True

    run_cmd("git add -A")
    result = run_cmd(f'git commit -m "{message}"')
    if result.returncode != 0:
        print(f"Commit failed: {result.stderr}")
        return False

    result = run_cmd("git push")
    if result.returncode != 0:
        print(f"Push failed: {result.stderr}")
        return False

    print("Changes pushed to git successfully")
    return True


def main():
    parser = argparse.ArgumentParser(description="Update Trustpilot and Vinted ratings/reviews")
    parser.add_argument("-t", "--trustpilot-rating", type=float, help="Trustpilot rating (e.g., 4.8)")
    parser.add_argument("-tc", "--trustpilot-count", type=int, help="Trustpilot review count (auto-increments if not set when adding Vinted review)")
    parser.add_argument("-v", "--vinted-rating", type=int, choices=[1, 2, 3, 4, 5], help="Vinted review rating (1-5)")
    parser.add_argument("-vc", "--vinted-comment", type=str, help="Vinted review comment")
    parser.add_argument("--no-push", action="store_true", help="Don't push to git after changes")
    parser.add_argument("--commit-message", type=str, default="Update ratings and reviews", help="Git commit message")

    args = parser.parse_args()

    if len(sys.argv) == 1:
        parser.print_help()
        return

    success = True
    trustpilot_updated = False

    if args.trustpilot_rating is not None or args.trustpilot_count is not None:
        rating = args.trustpilot_rating if args.trustpilot_rating is not None else 0
        count = args.trustpilot_count if args.trustpilot_count is not None else 0
        if not update_trustpilot(rating, count):
            success = False
        trustpilot_updated = True

    if args.vinted_rating is not None:
        result = add_vinted_review(args.vinted_rating, args.vinted_comment)
        if result is False:
            success = False
        elif result is not True and not trustpilot_updated:
            # result is the new total review count - update Trustpilot automatically
            if not update_trustpilot(0, result, auto_increment=False):
                success = False
        elif not trustpilot_updated:
            # Auto-increment Trustpilot review count
            if not update_trustpilot(0, auto_increment=True):
                success = False

    if success and not args.no_push:
        git_push(args.commit_message)
    elif success:
        print("Changes made locally. Use --no-push to skip git push.")


if __name__ == "__main__":
    main()