// Minimal RFC4180-ish CSV parser — no external dependency needed for menu import.

function detectDelimiter(firstLine: string): ',' | ';' {
  const commas = (firstLine.match(/,/g) ?? []).length
  const semicolons = (firstLine.match(/;/g) ?? []).length
  return semicolons > commas ? ';' : ','
}

export function parseCSV(text: string): string[][] {
  const clean = text.replace(/^﻿/, '') // strip BOM (Excel exports)
  const firstLine = clean.split(/\r?\n/, 1)[0] ?? ''
  const delimiter = detectDelimiter(firstLine)

  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < clean.length; i++) {
    const char = clean[i]
    if (inQuotes) {
      if (char === '"') {
        if (clean[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += char
      }
    } else if (char === '"') {
      inQuotes = true
    } else if (char === delimiter) {
      row.push(field)
      field = ''
    } else if (char === '\r') {
      // skip, \n handles the line break
    } else if (char === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else {
      field += char
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field)
    rows.push(row)
  }

  return rows.filter((r) => r.some((c) => c.trim() !== ''))
}

const HEADER_ALIASES: Record<string, string> = {
  category_ru: 'category_ru',
  category: 'category_ru',
  категория: 'category_ru',
  'категория_ru': 'category_ru',
  'категория (ru)': 'category_ru',

  category_tk: 'category_tk',
  'категория_tk': 'category_tk',
  'категория (tk)': 'category_tk',

  name_ru: 'name_ru',
  name: 'name_ru',
  название: 'name_ru',
  позиция: 'name_ru',
  'название (ru)': 'name_ru',

  name_tk: 'name_tk',
  'название (tk)': 'name_tk',

  description_ru: 'description_ru',
  description: 'description_ru',
  описание: 'description_ru',
  'описание (ru)': 'description_ru',

  description_tk: 'description_tk',
  'описание (tk)': 'description_tk',

  price: 'price',
  цена: 'price',
  стоимость: 'price',

  imageurl: 'imageUrl',
  image_url: 'imageUrl',
  image: 'imageUrl',
  фото: 'imageUrl',
  картинка: 'imageUrl',

  available: 'available',
  'в наличии': 'available',
  наличие: 'available',

  featured: 'featured',
  рекомендуем: 'featured',
  хит: 'featured',
}

export function csvToObjects(text: string): Record<string, string>[] {
  const rows = parseCSV(text)
  if (rows.length === 0) return []

  const header = rows[0].map((h) => HEADER_ALIASES[h.trim().toLowerCase()] ?? h.trim())
  return rows.slice(1).map((cells) => {
    const obj: Record<string, string> = {}
    header.forEach((key, i) => {
      obj[key] = (cells[i] ?? '').trim()
    })
    return obj
  })
}
