import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Using picsum.photos (always reliable) + some verified Unsplash IDs
// picsum.photos/seed/{seed}/600/400 always returns 200
const PHOTOS = {
  // ── Кофе ──────────────────────────────────────────────────────
  'Эспрессо':       'https://images.unsplash.com/photo-1596078842025-c5f47e2a0c58?w=600&h=400&fit=crop',
  'Американо':      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&h=400&fit=crop',
  'Капучино':       'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&h=400&fit=crop',
  'Латте':          'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=600&h=400&fit=crop',
  'Флэт Уайт':      'https://picsum.photos/seed/flatwhite/600/400',
  'Раф':            'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&h=400&fit=crop',
  'Маккиато':       'https://picsum.photos/seed/macchiato/600/400',
  'Турецкий кофе':  'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=600&h=400&fit=crop',
  'Дальгона':       'https://images.unsplash.com/photo-1604881991720-f91add269bed?w=600&h=400&fit=crop',

  // ── Холодные напитки ─────────────────────────────────────────
  'Айс Латте':              'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&h=400&fit=crop',
  'Айс Американо':          'https://picsum.photos/seed/iceamericano/600/400',
  'Фрапучино':              'https://images.unsplash.com/photo-1572119865084-43c285814d63?w=600&h=400&fit=crop',
  'Холодный чай с лимоном': 'https://picsum.photos/seed/icedtea/600/400',
  'Лимонад классический':   'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&h=400&fit=crop',
  'Лимонад Клубника-Базилик':'https://picsum.photos/seed/strawberrylemon/600/400',
  'Смузи Манго':            'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=600&h=400&fit=crop',
  'Матча Латте со льдом':   'https://picsum.photos/seed/icedmatcha/600/400',

  // ── Чай ─────────────────────────────────────────────────────
  'Зелёный чай':    'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=400&fit=crop',
  'Чёрный чай':     'https://picsum.photos/seed/blacktea/600/400',
  'Чай с мятой':    'https://picsum.photos/seed/minttea/600/400',
  'Ромашковый чай': 'https://picsum.photos/seed/chamomile/600/400',
  'Чай Масала':     'https://picsum.photos/seed/masalachai/600/400',

  // ── Молочные напитки ─────────────────────────────────────────
  'Горячий шоколад':        'https://picsum.photos/seed/hotchoco/600/400',
  'Матча Латте':            'https://picsum.photos/seed/matchalatte/600/400',
  'Золотой латте':          'https://images.unsplash.com/photo-1590502160462-58b41354f588?w=600&h=400&fit=crop',
  'Молочный коктейль Ваниль':'https://images.unsplash.com/photo-1568901839119-631418a3910d?w=600&h=400&fit=crop',

  // ── Авторские напитки ────────────────────────────────────────
  'HOS Special':        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop',
  'HOS Ýörite':         'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop',
  'Лесной Латте':       'https://images.unsplash.com/photo-1592663527359-cf6e183d4500?w=600&h=400&fit=crop',
  'Карамельное облако': 'https://picsum.photos/seed/caramelcoffee/600/400',
  'Терракотовый закат': 'https://picsum.photos/seed/terraottasunset/600/400',

  // ── Выпечка и десерты ────────────────────────────────────────
  'Круассан классический': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&h=400&fit=crop',
  'Круассан с миндалём':   'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=600&h=400&fit=crop',
  'Чизкейк Нью-Йорк':     'https://images.unsplash.com/photo-1516054575922-f0b8eeadec1a?w=600&h=400&fit=crop',
  'Тирамису':              'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&h=400&fit=crop',
  'Маффин шоколадный':     'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&h=400&fit=crop',
  'Морковный торт':        'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=600&h=400&fit=crop',
  'Вафли бельгийские':     'https://images.unsplash.com/photo-1568051243858-533a607809a5?w=600&h=400&fit=crop',

  // ── Завтраки ─────────────────────────────────────────────────
  'Авокадо тост':      'https://images.unsplash.com/photo-1541519227354-08fa5d50c627?w=600&h=400&fit=crop',
  'Омлет с сыром':     'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600&h=400&fit=crop',
  'Боул с гранолой':   'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=600&h=400&fit=crop',
  'Яичница с беконом': 'https://images.unsplash.com/photo-1528736235302-52922df5c122?w=600&h=400&fit=crop',
  'Сэндвич завтрак':   'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&h=400&fit=crop',

  // ── Лёгкие блюда ─────────────────────────────────────────────
  'Клубный сэндвич':   'https://images.unsplash.com/photo-1567620905732-e5c1e78553d9?w=600&h=400&fit=crop',
  'Паниини с курицей': 'https://images.unsplash.com/photo-1550507992-eb63ffee0847?w=600&h=400&fit=crop',
  'Салат Цезарь':      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop',
  'Суп дня':           'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=400&fit=crop',
  'Сырная тарелка':    'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=600&h=400&fit=crop',
}

async function main() {
  const items = await prisma.menuItem.findMany()
  let updated = 0

  for (const item of items) {
    const url = PHOTOS[item.name_ru]
    if (url && item.imageUrl !== url) {
      await prisma.menuItem.update({
        where: { id: item.id },
        data:  { imageUrl: url },
      })
      updated++
    }
  }

  console.log(`[update-photos] Updated ${updated}/${items.length} items.`)
}

main()
  .catch(e => { console.error('[update-photos] Error:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
