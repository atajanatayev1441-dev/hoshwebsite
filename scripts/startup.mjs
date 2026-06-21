import { execSync } from 'child_process'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 1. Push schema
  console.log('[startup] Running prisma db push...')
  execSync('npx prisma db push --skip-generate', { stdio: 'inherit' })

  // 2. Seed if no categories exist
  const categoryCount = await prisma.category.count()
  if (categoryCount === 0) {
    console.log('[startup] No categories found — running seed...')
    execSync('npx tsx prisma/seed.ts', { stdio: 'inherit' })
    console.log('[startup] Seed complete.')
  } else {
    console.log(`[startup] DB has ${categoryCount} categories — skipping seed.`)
  }

  // 3. Add photos to items that don't have one yet
  const noPhoto = await prisma.menuItem.count({ where: { imageUrl: null } })
  if (noPhoto > 0) {
    console.log(`[startup] ${noPhoto} items without photos — updating...`)
    execSync('node scripts/update-photos.mjs', { stdio: 'inherit' })
  } else {
    console.log('[startup] All items have photos.')
  }

  await prisma.$disconnect()

  // 3. Start Next.js
  const port = process.env.PORT || '8080'
  console.log(`[startup] Starting Next.js on port ${port}...`)
  execSync(`next start -p ${port}`, { stdio: 'inherit' })
}

main().catch((err) => {
  console.error('[startup] Fatal error:', err)
  process.exit(1)
})
