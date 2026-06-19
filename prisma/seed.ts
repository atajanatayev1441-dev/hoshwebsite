import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@hoscoffee.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
  const passwordHash = await bcrypt.hash(adminPassword, 12)

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: { email: adminEmail, passwordHash },
  })
  console.log('Admin user created:', adminEmail)

  // Categories
  const categories = [
    { name_ru: 'Кофе', name_tk: 'Kofe', position: 1 },
    { name_ru: 'Холодные напитки', name_tk: 'Sowuk içgiler', position: 2 },
    { name_ru: 'Чай', name_tk: 'Çaý', position: 3 },
    { name_ru: 'Молочные напитки', name_tk: 'Süýtli içgiler', position: 4 },
    { name_ru: 'Авторские напитки', name_tk: 'Awtor içgileri', position: 5 },
    { name_ru: 'Выпечка и десерты', name_tk: 'Çörekler we süýjülikler', position: 6 },
    { name_ru: 'Завтраки', name_tk: 'Ertirlikler', position: 7 },
    { name_ru: 'Лёгкие блюда', name_tk: 'Ýeňil naharlar', position: 8 },
  ]

  const createdCategories: Record<string, number> = {}

  for (const cat of categories) {
    const existing = await prisma.category.findFirst({
      where: { name_ru: cat.name_ru },
    })
    if (!existing) {
      const created = await prisma.category.create({ data: cat })
      createdCategories[cat.name_ru] = created.id
    } else {
      createdCategories[cat.name_ru] = existing.id
    }
  }
  console.log('Categories created')

  // Menu items
  const menuItems = [
    // Coffee
    {
      categoryName: 'Кофе',
      name_ru: 'Эспрессо',
      name_tk: 'Espresso',
      description_ru: 'Классический итальянский эспрессо из отборных зерён',
      description_tk: 'Saýlama kofe dänelerinden klassiki italýan espresso',
      price: 25000,
      featured: true,
    },
    {
      categoryName: 'Кофе',
      name_ru: 'Американо',
      name_tk: 'Amerikano',
      description_ru: 'Эспрессо разбавленный горячей водой',
      description_tk: 'Isti suw bilen garylan espresso',
      price: 28000,
    },
    {
      categoryName: 'Кофе',
      name_ru: 'Капучино',
      name_tk: 'Kapuçino',
      description_ru: 'Нежный капучино с бархатистой молочной пенкой',
      description_tk: 'Ýumşak süýt köpügi bilen näzik kapuçino',
      price: 38000,
      featured: true,
    },
    {
      categoryName: 'Кофе',
      name_ru: 'Латте',
      name_tk: 'Latte',
      description_ru: 'Мягкий кофе с большим количеством взбитого молока',
      description_tk: 'Köp mukdarda köpürtgilen süýt bilen ýumşak kofe',
      price: 40000,
      featured: true,
    },
    {
      categoryName: 'Кофе',
      name_ru: 'Флэт Уайт',
      name_tk: 'Flat White',
      description_ru: 'Двойной эспрессо с минимальным количеством молока',
      description_tk: 'Az mukdarda süýt bilen goşa espresso',
      price: 42000,
    },
    {
      categoryName: 'Кофе',
      name_ru: 'Раф',
      name_tk: 'Raf',
      description_ru: 'Кофе со сливками и ванильным сахаром',
      description_tk: 'Gaýmak we wanilin şeker bilen kofe',
      price: 45000,
      featured: true,
    },
    {
      categoryName: 'Кофе',
      name_ru: 'Маккиато',
      name_tk: 'Makiato',
      description_ru: 'Эспрессо с небольшой пенкой из молока',
      description_tk: 'Az mukdarda süýt köpügi bilen espresso',
      price: 32000,
    },
    {
      categoryName: 'Кофе',
      name_ru: 'Турецкий кофе',
      name_tk: 'Türk kofe',
      description_ru: 'Традиционный кофе, сваренный в джезве',
      description_tk: 'Jezwede bişirilen adaty kofe',
      price: 30000,
    },
    {
      categoryName: 'Кофе',
      name_ru: 'Дальгона',
      name_tk: 'Dolgona',
      description_ru: 'Взбитый кофейный крем на молоке',
      description_tk: 'Süýdüň üstünde çalnan kofe kremi',
      price: 42000,
    },
    // Cold drinks
    {
      categoryName: 'Холодные напитки',
      name_ru: 'Айс Латте',
      name_tk: 'Aýs Latte',
      description_ru: 'Классический латте со льдом',
      description_tk: 'Buz bilen klassiki latte',
      price: 42000,
      featured: true,
    },
    {
      categoryName: 'Холодные напитки',
      name_ru: 'Айс Американо',
      name_tk: 'Aýs Amerikano',
      description_ru: 'Освежающий американо со льдом',
      description_tk: 'Buz bilen janlandyryjy amerikano',
      price: 30000,
    },
    {
      categoryName: 'Холодные напитки',
      name_ru: 'Фрапучино',
      name_tk: 'Frapuçino',
      description_ru: 'Холодный кофейный напиток со взбитыми сливками',
      description_tk: 'Çalnan gaýmak bilen sowuk kofe içgisi',
      price: 52000,
      featured: true,
    },
    {
      categoryName: 'Холодные напитки',
      name_ru: 'Холодный чай с лимоном',
      name_tk: 'Limonly sowuk çaý',
      description_ru: 'Освежающий холодный чай с лимоном и мятой',
      description_tk: 'Limon we narpyz bilen janlandyryjy sowuk çaý',
      price: 32000,
    },
    {
      categoryName: 'Холодные напитки',
      name_ru: 'Лимонад классический',
      name_tk: 'Klassiki limonad',
      description_ru: 'Домашний лимонад из свежих лимонов',
      description_tk: 'Täze limonlardan öý limonady',
      price: 35000,
    },
    {
      categoryName: 'Холодные напитки',
      name_ru: 'Лимонад Клубника-Базилик',
      name_tk: 'Ýertudana-Baziliki limonad',
      description_ru: 'Лимонад с клубникой и свежим базиликом',
      description_tk: 'Ýertudana we täze baziliki bilen limonad',
      price: 40000,
      featured: true,
    },
    {
      categoryName: 'Холодные напитки',
      name_ru: 'Смузи Манго',
      name_tk: 'Mango smugi',
      description_ru: 'Тропический смузи из свежего манго и банана',
      description_tk: 'Täze mango we banan bilen tropik smugi',
      price: 48000,
    },
    {
      categoryName: 'Холодные напитки',
      name_ru: 'Матча Латте со льдом',
      name_tk: 'Buz bilen Matça Latte',
      description_ru: 'Японский зелёный чай матча со льдом и молоком',
      description_tk: 'Buz we süýt bilen ýapon ýaşyl çaý matça',
      price: 46000,
    },
    // Tea
    {
      categoryName: 'Чай',
      name_ru: 'Зелёный чай',
      name_tk: 'Ýaşyl çaý',
      description_ru: 'Лёгкий китайский зелёный чай',
      description_tk: 'Ýeňil hytaý ýaşyl çaýy',
      price: 22000,
    },
    {
      categoryName: 'Чай',
      name_ru: 'Чёрный чай',
      name_tk: 'Gara çaý',
      description_ru: 'Крепкий цейлонский чёрный чай',
      description_tk: 'Güýçli Seýlon gara çaýy',
      price: 22000,
    },
    {
      categoryName: 'Чай',
      name_ru: 'Чай с мятой',
      name_tk: 'Narpyzly çaý',
      description_ru: 'Освежающий чай с мятой и лимоном',
      description_tk: 'Narpyz we limon bilen janlandyryjy çaý',
      price: 28000,
    },
    {
      categoryName: 'Чай',
      name_ru: 'Ромашковый чай',
      name_tk: 'Reňkli gül çaýy',
      description_ru: 'Нежный ромашковый чай с мёдом',
      description_tk: 'Bal bilen näzik ýylgyryşly gül çaýy',
      price: 28000,
    },
    {
      categoryName: 'Чай',
      name_ru: 'Чай Масала',
      name_tk: 'Masala çaý',
      description_ru: 'Индийский пряный чай с молоком и специями',
      description_tk: 'Süýt we gök ot bilen hindi baharat çaýy',
      price: 35000,
    },
    // Milk drinks
    {
      categoryName: 'Молочные напитки',
      name_ru: 'Горячий шоколад',
      name_tk: 'Ýyly şokolad',
      description_ru: 'Насыщенный горячий шоколад из бельгийского какао',
      description_tk: 'Belgiýa kakaosyndan doly ýyly şokolad',
      price: 42000,
      featured: true,
    },
    {
      categoryName: 'Молочные напитки',
      name_ru: 'Матча Латте',
      name_tk: 'Matça Latte',
      description_ru: 'Японский зелёный чай со взбитым молоком',
      description_tk: 'Köpürtgilen süýt bilen ýapon ýaşyl çaýy',
      price: 44000,
      featured: true,
    },
    {
      categoryName: 'Молочные напитки',
      name_ru: 'Золотой латте',
      name_tk: 'Altyn latte',
      description_ru: 'Куркума с молоком и специями',
      description_tk: 'Süýt we baharat bilen zerdeçal',
      price: 40000,
    },
    {
      categoryName: 'Молочные напитки',
      name_ru: 'Молочный коктейль Ваниль',
      name_tk: 'Wanilli süýtli koktýeýl',
      description_ru: 'Классический молочный коктейль с ванилью и мороженым',
      description_tk: 'Wanilin we doňdurma bilen klassiki süýtli koktýeýl',
      price: 48000,
    },
    // Signature drinks
    {
      categoryName: 'Авторские напитки',
      name_ru: 'HOS Special',
      name_tk: 'HOS Ýörite',
      description_ru: 'Фирменный напиток кофейни — двойной эспрессо с кокосовым молоком и карамелью',
      description_tk: 'Kofehanaň firma içgisi — goşa espresso, kokos süýdi we karamel bilen',
      price: 55000,
      featured: true,
    },
    {
      categoryName: 'Авторские напитки',
      name_ru: 'Лесной Латте',
      name_tk: 'Tokaý Latte',
      description_ru: 'Латте с черничным сиропом и лавандой',
      description_tk: 'Möwsümleýin sirop we lawendar bilen latte',
      price: 52000,
    },
    {
      categoryName: 'Авторские напитки',
      name_ru: 'Карамельное облако',
      name_tk: 'Karamel bulut',
      description_ru: 'Мягкий латте с карамельным сиропом и взбитыми сливками',
      description_tk: 'Karamel sirop we çalnan gaýmak bilen ýumşak latte',
      price: 50000,
      featured: true,
    },
    {
      categoryName: 'Авторские напитки',
      name_ru: 'Терракотовый закат',
      name_tk: 'Terra bulguç',
      description_ru: 'Апельсиновый сок с эспрессо и пенкой из кокосового молока',
      description_tk: 'Apelsin suwy, espresso we kokos süýdi köpügi',
      price: 55000,
    },
    // Pastries and desserts
    {
      categoryName: 'Выпечка и десерты',
      name_ru: 'Круассан классический',
      name_tk: 'Klassiki kruassan',
      description_ru: 'Свежий масляный круассан из слоёного теста',
      description_tk: 'Gatly hamyrdan täze ýagy kruassan',
      price: 35000,
      featured: true,
    },
    {
      categoryName: 'Выпечка и десерты',
      name_ru: 'Круассан с миндалём',
      name_tk: 'Badam kruassan',
      description_ru: 'Круассан с миндальным кремом и лепестками миндаля',
      description_tk: 'Badam kremi we badam ýapraklary bilen kruassan',
      price: 45000,
    },
    {
      categoryName: 'Выпечка и десерты',
      name_ru: 'Чизкейк Нью-Йорк',
      name_tk: 'Nýu-Ýork çizkek',
      description_ru: 'Классический сливочный чизкейк',
      description_tk: 'Klassiki kremli çizkek',
      price: 52000,
      featured: true,
    },
    {
      categoryName: 'Выпечка и десерты',
      name_ru: 'Тирамису',
      name_tk: 'Tiramisu',
      description_ru: 'Итальянский десерт с маскарпоне и кофе',
      description_tk: 'Maskarpone we kofe bilen italýan dessert',
      price: 55000,
      featured: true,
    },
    {
      categoryName: 'Выпечка и десерты',
      name_ru: 'Маффин шоколадный',
      name_tk: 'Şokoladly maffin',
      description_ru: 'Пышный шоколадный маффин с шоколадными каплями',
      description_tk: 'Şokolad damjalary bilen ýumşak şokoladly maffin',
      price: 30000,
    },
    {
      categoryName: 'Выпечка и десерты',
      name_ru: 'Морковный торт',
      name_tk: 'Kädili tort',
      description_ru: 'Нежный морковный торт с кремом из маскарпоне',
      description_tk: 'Maskarpone kremi bilen näzik kädi torty',
      price: 48000,
    },
    {
      categoryName: 'Выпечка и десерты',
      name_ru: 'Вафли бельгийские',
      name_tk: 'Belgiýa waflasy',
      description_ru: 'Хрустящие вафли со взбитыми сливками и ягодами',
      description_tk: 'Çalnan gaýmak we miweler bilen gowrulan waflalar',
      price: 58000,
    },
    // Breakfast
    {
      categoryName: 'Завтраки',
      name_ru: 'Авокадо тост',
      name_tk: 'Awokado tost',
      description_ru: 'Тост с авокадо, яйцом пашот и микрозеленью',
      description_tk: 'Awokado, poşe ýumurtga we mikro ösümlikler bilen tost',
      price: 72000,
      featured: true,
    },
    {
      categoryName: 'Завтраки',
      name_ru: 'Омлет с сыром',
      name_tk: 'Peýnirli omlet',
      description_ru: 'Нежный омлет с сыром чеддер и зелёным луком',
      description_tk: 'Çedar peýniri we ýaşyl sogan bilen näzik omlet',
      price: 62000,
    },
    {
      categoryName: 'Завтраки',
      name_ru: 'Боул с гранолой',
      name_tk: 'Granola böwli',
      description_ru: 'Йогурт с домашней гранолой, свежими ягодами и мёдом',
      description_tk: 'Öý granolasy, täze miweler we bal bilen ýogurt',
      price: 55000,
      featured: true,
    },
    {
      categoryName: 'Завтраки',
      name_ru: 'Яичница с беконом',
      name_tk: 'Bekonly ýumurtga',
      description_ru: 'Яичница с хрустящим беконом и свежими томатами',
      description_tk: 'Gowrulan bikon we täze pomidor bilen ýumurtga',
      price: 68000,
    },
    {
      categoryName: 'Завтраки',
      name_ru: 'Сэндвич завтрак',
      name_tk: 'Ertirlik sendwi',
      description_ru: 'Горячий сэндвич с яйцом, беконом и сыром',
      description_tk: 'Ýumurtga, bikon we peýnir bilen ýyly sendwiç',
      price: 58000,
    },
    // Light meals
    {
      categoryName: 'Лёгкие блюда',
      name_ru: 'Клубный сэндвич',
      name_tk: 'Klub sendwi',
      description_ru: 'Сэндвич с куриным филе, беконом, томатом и листьями',
      description_tk: 'Towuk filesi, bikon, pomidor we ýapraklar bilen sendwiç',
      price: 78000,
      featured: true,
    },
    {
      categoryName: 'Лёгкие блюда',
      name_ru: 'Паниини с курицей',
      name_tk: 'Towukly panini',
      description_ru: 'Горячая итальянская лепёшка с куриным филе и овощами',
      description_tk: 'Towuk filesi we gök önümler bilen ýyly italýan çöregi',
      price: 72000,
    },
    {
      categoryName: 'Лёгкие блюда',
      name_ru: 'Салат Цезарь',
      name_tk: 'Sezar salatasy',
      description_ru: 'Классический Цезарь с куриным филе и пармезаном',
      description_tk: 'Towuk filesi we parmezan bilen klassiki Sezar',
      price: 75000,
      featured: true,
    },
    {
      categoryName: 'Лёгкие блюда',
      name_ru: 'Суп дня',
      name_tk: 'Günüň şorbasy',
      description_ru: 'Ежедневно обновляемый домашний суп',
      description_tk: 'Her gün täzelenýän öý şorbasy',
      price: 45000,
    },
    {
      categoryName: 'Лёгкие блюда',
      name_ru: 'Сырная тарелка',
      name_tk: 'Peýnir tarelkasy',
      description_ru: 'Ассорти из 4 видов сыра с мёдом, орехами и виноградом',
      description_tk: '4 görnüşli peýnir, bal, hoz we üzüm bilen assort',
      price: 95000,
    },
  ]

  for (const item of menuItems) {
    const categoryId = createdCategories[item.categoryName]
    if (!categoryId) continue

    const existing = await prisma.menuItem.findFirst({
      where: { name_ru: item.name_ru, categoryId },
    })

    if (!existing) {
      await prisma.menuItem.create({
        data: {
          categoryId,
          name_ru: item.name_ru,
          name_tk: item.name_tk,
          description_ru: item.description_ru,
          description_tk: item.description_tk,
          price: item.price,
          available: true,
          featured: item.featured ?? false,
        },
      })
    }
  }
  console.log('Menu items created')

  // Promotions
  const promotions = [
    {
      title_ru: 'Счастливые часы',
      title_tk: 'Bagtly sagat',
      description_ru: 'Скидка 20% на все кофейные напитки с 10:00 до 12:00',
      description_tk: 'Sagat 10:00-12:00 aralygynda ähli kofe içgilere 20% arzanladyş',
      badge_ru: '–20%',
      badge_tk: '–20%',
      active: true,
    },
    {
      title_ru: 'Завтрак + Кофе',
      title_tk: 'Ertirlik + Kofe',
      description_ru: 'Любой завтрак + капучино или латте по специальной цене',
      description_tk: 'Islendik ertirlik + kapuçino ýa-da latte ýörite bahadan',
      badge_ru: 'Комбо',
      badge_tk: 'Kombo',
      price: 75000,
      active: true,
    },
    {
      title_ru: 'Верный гость',
      title_tk: 'Wepaly myhmany',
      description_ru: 'Каждый 6-й кофе в подарок при покупке через наш сайт',
      description_tk: 'Biziň sahypamyz arkaly her 6-njy kofe sowgat',
      badge_ru: 'Лояльность',
      badge_tk: 'Wepalylyk',
      active: true,
    },
  ]

  for (const promo of promotions) {
    const existing = await prisma.promotion.findFirst({
      where: { title_ru: promo.title_ru },
    })
    if (!existing) {
      await prisma.promotion.create({ data: promo })
    }
  }
  console.log('Promotions created')

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
