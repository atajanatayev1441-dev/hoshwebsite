import { prisma } from '@/lib/prisma'
import { MenuClient } from '@/components/menu/MenuClient'

export type CategoryWithItems = {
  id: number
  name_ru: string
  name_tk: string
  position: number
  visible: boolean
  items: {
    id: number
    categoryId: number
    name_ru: string
    name_tk: string
    description_ru: string | null
    description_tk: string | null
    price: number
    imageUrl: string | null
    available: boolean
    featured: boolean
  }[]
}

export default async function MenuPage() {
  let categories: CategoryWithItems[] = []

  try {
    categories = await prisma.category.findMany({
      where: { visible: true },
      orderBy: { position: 'asc' },
      include: {
        items: {
          where: { available: true },
          orderBy: [{ featured: 'desc' }, { id: 'asc' }],
        },
      },
    })
  } catch (err) {
    console.error('[MenuPage] DB error:', err)
  }

  return <MenuClient categories={categories} />
}
