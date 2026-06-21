import { execSync } from 'child_process'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 1. Push schema
  console.log('[startup] Running prisma db push...')
  execSync('npx prisma db push --skip-generate', { stdio: 'inherit' })

  // 2. Seed only if no admin user exists yet
  const adminCount = await prisma.adminUser.count()
  if (adminCount === 0) {
    console.log('[startup] DB empty — running seed...')
    execSync('npx tsx prisma/seed.ts', { stdio: 'inherit' })
    console.log('[startup] Seed complete.')
  } else {
    console.log(`[startup] DB already has ${adminCount} admin user(s) — skipping seed.`)
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
