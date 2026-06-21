import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Unsplash photo URLs by item name (stable CDN URLs)
const PHOTOS = {
  // ── Кофе ──────────────────────────────────────────────────────
  'Эспрессо':       'https://images.unsplash.com/photo-1510591628991-10f76cd4a3ce?w=600&h=400&fit=crop',
  'Американо':      'https://images.unsplash.com/photo-1496318447583-f524534e9ce1?w=600&h=400&fit=crop',
  'Капучино':       'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&h=400&fit=crop',
  'Латте':          'https://images.unsplash.com/photo-1561882468-9110d70d6bdc?w=600&h=400&fit=crop',
  'Флэт Уайт':      'https://images.unsplash.com/photo-1474314881477-04c4aac40a0e?w=600&h=400&fit=crop',
  'Раф':            'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&h=400&fit=crop',
  'Маккиато':       'https://images.unsplash.com/photo-1485808191679-5f86510bd9d4?w=600&h=400&fit=crop',
  'Турецкий кофе':  'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop',
  'Дальгона':       'https://images.unsplash.com/photo-1604881991720-f91add269bed?w=600&h=400&fit=crop',

  // ── Холодные напитки ─────────────────────────────────────────
  'Айс Латте':              'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&h=400&fit=crop',
  'Айс Американо':          'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=600&h=400&fit=crop',
  'Фрапучино':              'https://images.unsplash.com/photo-1572119865084-43c285814d63?w=600&h=400&fit=crop',
  'Холодный чай с лимоном': 'https://images.unsplash.com/photo-1499638673709-d0ce2bd3ff02?w=600&h=400&fit=crop',
  'Лимонад классический':   'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&h=400&fit=crop',
  'Лимонад Клубника-Базилик':'https://images.unsplash.com/photo-1560180474-e8563fd75bab?w=600&h=400&fit=crop',
  'Смузи Манго':            'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=600&h=400&fit=crop',
  'Матча Латте со льдом':   'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=600&h=400&fit=crop',

  // ── Чай ─────────────────────────────────────────────────────
  'Зелёный чай':    'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=400&fit=crop',
  'Чёрный чай':     'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=600&h=400&fit=crop',
  'Чай с мятой':    'https://images.unsplash.com/photo-1564890369478-c89ca3d9cde5?w=600&h=400&fit=crop',
  'Ромашковый чай': 'https://images.unsplash.com/photo-1563822249366-3efb23b8d2c3?w=600&h=400&fit=crop',
  'Чай Масала':     'https://images.unsplash.com/photo-1616091216791-a5360b5e7c71?w=600&h=400&fit=crop',

  // ── Молочные напитки ─────────────────────────────────────────
  'Горячий шоколад':       'https://images.unsplash.com/photo-1542990253-a781e1b9fe4a?w=600&h=400&fit=crop',
  'Матча Латте':           'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&h=400&fit=crop',
  'Золотой латте':         'https://images.unsplash.com/photo-1590502160462-58b41354f588?w=600&h=400&fit=crop',
  'Молочный коктейль Ваниль':'https://images.unsplash.com/photo-1568901839119-631418a3910d?w=600&h=400&fit=crop',

  // ── Авторские напитки ────────────────────────────────────────
  'HOS Special':        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop',
  'HOS Ýörite':         'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop',
  'Лесной Латте':       'https://images.unsplash.com/photo-1592663527359-cf6e183d4500?w=600&h=400&fit=crop',
  'Карамельное облако': 'https://images.unsplash.com/photo-1521302080334-4bebac2a4ea9?w=600&h=400&fit=crop',
  'Терракотовый закат': 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&h=400&fit=crop',

  // ── Выпечка и десерты ────────────────────────────────────────
  'Круассан классический': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&h=400&fit=crop',
  'Круассан с миндалём':   'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=600&h=400&fit=crop',
  'Чизкейк Нью-Йорк':     'https://images.unsplash.com/photo-1547518648-b0ccb85e3c93?w=600&h=400&fit=crop',
  'Тирамису':              'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&h=400&fit=crop',
  'Маффин шоколадный':     'https://images.unsplash.com/photo-1562440499-64b9f87a2ccd?w=600&h=400&fit=crop',
  'Морковный торт':        'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=600&h=400&fit=crop',
  'Вафли бельгийские':     'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600&h=400&fit=crop',

  // ── Завтраки ─────────────────────────────────────────────────
  'Авокадо тост':      'https://images.unsplash.com/photo-1541519227354-08fa5d50c627?w=600&h=400&fit=crop',
  'Омлет с сыром':     'https://images.unsplash.com/photo-1525351484163-7529414f2aae?w=600&h=400&fit=crop',
  'Боул с гранолой':   'https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?w=600&h=400&fit=crop',
  'Яичница с беконом': 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=600&h=400&fit=crop',
  'Сэндвич завтрак':   'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&h=400&fit=crop',

  // ── Лёгкие блюда ─────────────────────────────────────────────
  'Клубный сэндвич':      'https://images.unsplash.com/photo-1567620905732-e5c1e78553d9?w=600&h=400&fit=crop',
  'Паниини с курицей':    'https://images.unsplash.com/photo-1555600543-48297350a338?w=600&h=400&fit=crop',
  'Салат Цезарь':         'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop',
  'Суп дня':              'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=400&fit=crop',
  'Сырная тарелка':       'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600&h=400&fit=crop',
}

async function main() {
  const items = await prisma.menuItem.findMany()
  let updated = 0

  for (const item of items) {
    const url = PHOTOS[item.name_ru]
    if (url && !item.imageUrl) {
      await prisma.menuItem.update({
        where: { id: item.id },
        data:  { imageUrl: url },
      })
      updated++
    }
  }

  console.log(`[update-photos] Updated ${updated}/${items.length} items with photos.`)
}

main()
  .catch(e => { console.error('[update-photos] Error:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
