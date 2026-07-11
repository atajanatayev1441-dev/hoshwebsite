import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { csvToObjects } from '@/lib/csv'

export const dynamic = 'force-dynamic'

interface ImportRow {
  category_ru: string
  category_tk?: string
  name_ru: string
  name_tk?: string
  description_ru?: string | null
  description_tk?: string | null
  price: number
  imageUrl?: string | null
  available: boolean
  featured: boolean
}

function parseBool(value: unknown, fallback: boolean): boolean {
  if (typeof value === 'boolean') return value
  if (value === undefined || value === null || value === '') return fallback
  const s = String(value).trim().toLowerCase()
  if (['true', '1', 'yes', 'да', 'есть', 'y'].includes(s)) return true
  if (['false', '0', 'no', 'нет', 'n'].includes(s)) return false
  return fallback
}

function parsePrice(value: unknown): number {
  if (typeof value === 'number') return value
  const s = String(value ?? '').trim().replace(',', '.').replace(/[^\d.]/g, '')
  const n = parseFloat(s)
  return Number.isFinite(n) ? n : 0
}

// Accepts either a flat list of rows (category_ru, name_ru, ...) or a nested
// list of categories with an `items` array. Normalizes both into flat rows.
function normalizeJson(data: unknown): ImportRow[] {
  if (!Array.isArray(data)) throw new Error('JSON должен быть массивом')

  const rows: ImportRow[] = []
  for (const entry of data) {
    if (entry && Array.isArray(entry.items)) {
      const category_ru = String(entry.name_ru ?? entry.category_ru ?? '').trim()
      const category_tk = String(entry.name_tk ?? entry.category_tk ?? category_ru).trim()
      for (const item of entry.items) {
        rows.push({
          category_ru,
          category_tk,
          name_ru: String(item.name_ru ?? '').trim(),
          name_tk: String(item.name_tk ?? item.name_ru ?? '').trim(),
          description_ru: item.description_ru ?? null,
          description_tk: item.description_tk ?? null,
          price: parsePrice(item.price),
          imageUrl: item.imageUrl || null,
          available: parseBool(item.available, true),
          featured: parseBool(item.featured, false),
        })
      }
    } else if (entry) {
      const category_ru = String(entry.category_ru ?? entry.category ?? '').trim()
      rows.push({
        category_ru,
        category_tk: String(entry.category_tk ?? category_ru).trim(),
        name_ru: String(entry.name_ru ?? '').trim(),
        name_tk: String(entry.name_tk ?? entry.name_ru ?? '').trim(),
        description_ru: entry.description_ru ?? null,
        description_tk: entry.description_tk ?? null,
        price: parsePrice(entry.price),
        imageUrl: entry.imageUrl || null,
        available: parseBool(entry.available, true),
        featured: parseBool(entry.featured, false),
      })
    }
  }
  return rows
}

function normalizeCsv(text: string): ImportRow[] {
  return csvToObjects(text)
    .map((r) => ({
      category_ru: (r.category_ru ?? '').trim(),
      category_tk: (r.category_tk || r.category_ru || '').trim(),
      name_ru: (r.name_ru ?? '').trim(),
      name_tk: (r.name_tk || r.name_ru || '').trim(),
      description_ru: r.description_ru || null,
      description_tk: r.description_tk || null,
      price: parsePrice(r.price),
      imageUrl: r.imageUrl || null,
      available: parseBool(r.available, true),
      featured: parseBool(r.featured, false),
    }))
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const venue: string = body.venue === 'coffee' ? 'coffee' : 'lounge'
  const mode: 'merge' | 'replace' = body.mode === 'replace' ? 'replace' : 'merge'
  const format: 'json' | 'csv' = body.format === 'csv' ? 'csv' : 'json'
  const raw: string = body.raw ?? ''

  let rows: ImportRow[]
  try {
    if (format === 'csv') {
      rows = normalizeCsv(raw)
    } else {
      rows = normalizeJson(JSON.parse(raw))
    }
  } catch (err: any) {
    return NextResponse.json({ error: `Не удалось разобрать данные: ${err.message}` }, { status: 400 })
  }

  rows = rows.filter((r) => r.category_ru && r.name_ru)
  if (rows.length === 0) {
    return NextResponse.json({ error: 'Не найдено ни одной валидной позиции' }, { status: 400 })
  }

  if (mode === 'replace') {
    await prisma.category.deleteMany({ where: { venue } })
  }

  const existingCategories = await prisma.category.findMany({ where: { venue } })
  const catByName = new Map(existingCategories.map((c) => [c.name_ru.trim().toLowerCase(), c]))
  let nextPosition = existingCategories.length

  const grouped = new Map<string, ImportRow[]>()
  for (const row of rows) {
    const key = row.category_ru.trim().toLowerCase()
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key)!.push(row)
  }

  let categoriesCreated = 0
  let itemsCreated = 0
  let itemsUpdated = 0

  for (const [key, groupRows] of Array.from(grouped.entries())) {
    let category = catByName.get(key)
    if (!category) {
      category = await prisma.category.create({
        data: {
          name_ru: groupRows[0].category_ru,
          name_tk: groupRows[0].category_tk || groupRows[0].category_ru,
          venue,
          position: nextPosition++,
        },
      })
      catByName.set(key, category)
      categoriesCreated++
    }

    const existingItems = await prisma.menuItem.findMany({ where: { categoryId: category.id } })
    const itemByName = new Map(existingItems.map((i) => [i.name_ru.trim().toLowerCase(), i]))

    for (const row of groupRows) {
      const itemKey = row.name_ru.trim().toLowerCase()
      const existingItem = itemByName.get(itemKey)
      const data = {
        categoryId: category.id,
        name_ru: row.name_ru,
        name_tk: row.name_tk || row.name_ru,
        description_ru: row.description_ru,
        description_tk: row.description_tk,
        price: row.price,
        imageUrl: row.imageUrl,
        available: row.available,
        featured: row.featured,
      }
      if (existingItem) {
        await prisma.menuItem.update({ where: { id: existingItem.id }, data })
        itemsUpdated++
      } else {
        const created = await prisma.menuItem.create({ data })
        itemByName.set(itemKey, created)
        itemsCreated++
      }
    }
  }

  return NextResponse.json({
    ok: true,
    categoriesCreated,
    itemsCreated,
    itemsUpdated,
    totalRows: rows.length,
  })
}
