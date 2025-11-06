import { Locale } from "@/lib/i18n";

const dictionaries = {
  uz: {
    meta: {
      title: "NDM Market — Qurilish materiallari katalogi",
      description:
        "NDM Market katalogida premium qurilish materiallari: beton, metall konstruktsiyalar, aralashmalar va professional yechimlar.",
    },
    navigation: {
      home: "Bosh sahifa",
      categories: "Kategoriyalar",
      catalog: "Mahsulotlar",
      brands: "Brendlar",
      contact: "Aloqa",
      searchPlaceholder: "Mahsulot izlash...",
      admin: "Admin",
    },
    hero: {
      eyebrow: "Premium qurilish yechimlari",
      title: "NDM Market katalogi bilan inshootlaringizni yangi darajaga olib chiqing",
      description:
        "Biz sanoat miqyosidagi qurilish uchun beton, metall konstruktsiyalar va yuqori sifatli mutaxassislar tanlovi bo‘lgan mahsulotlarni jamladik.",
      cta: "Katalogni ko‘rish",
    },
    home: {
      categoriesHeading: "Kategoriyalar bo‘yicha tanlang",
      categoriesDescription:
        "NDM Market mahsulotlari qurilishning har bir bosqichi uchun sinchkovlik bilan tanlangan.",
      featuredHeading: "Tavsiya etilgan mahsulotlar",
      featuredDescription:
        "Inshootlar xavfsizligi va samaradorligini oshiruvchi eng ommabop yechimlarimiz.",
      viewCatalogCta: "Barcha mahsulotlar",
    },
    categories: {
      title: "Katalog bo‘yicha kategoriyalar",
      subtitle:
        "Har bir yo‘nalish uchun alohida tayyorlangan yechimlarimizni tanlang.",
      exploreCta: "Mahsulotlarni ko‘rish",
    },
    catalog: {
      title: "Mahsulotlar katalogi",
      subtitle:
        "Kategoriya va brend bo‘yicha qulay filtrlar bilan kerakli mahsulotni toping.",
      filtersTitle: "Filtrlash",
      categoryLabel: "Kategoriya",
      brandLabel: "Brend",
      searchPlaceholder: "Mahsulot nomi bo‘yicha qidiring",
      resetFilters: "Filtrlarni tozalash",
      resultsLabel: "Topilgan mahsulotlar",
      emptyState:
        "Tanlangan parametrlar bo‘yicha mos mahsulot topilmadi. Boshqa filtrlardan foydalanib ko‘ring.",
    },
    product: {
      specsTitle: "Texnik xususiyatlar",
      descriptionTitle: "Mahsulot haqida",
      brandLabel: "Brend",
      categoryLabel: "Kategoriya",
      galleryLabel: "Galereya",
      backToCatalog: "Katalogga qaytish",
      relatedTitle: "O‘xshash mahsulotlar",
    },
    brands: {
      title: "Hamkor brendlar",
      subtitle:
        "Yetakchi ishlab chiqaruvchilar bilan birgalikda yuqori standartlarni taqdim etamiz.",
      productCount: "Mahsulot",
    },
    contact: {
      title: "Biz bilan bog‘laning",
      subtitle:
        "Mutaxassislarimiz loyiha ehtiyojlaringiz uchun eng yaxshi yechimni tavsiya qiladi.",
      officeTitle: "Bosh ofis",
      addressLabel: "Manzil",
      phoneLabel: "Telefon",
      telegramLabel: "Telegram",
      hoursLabel: "Ish vaqti",
      mapTitle: "Google xarita",
      emailLabel: "Elektron pochta",
    },
    footer: {
      rights: "© {year} NDM Market. Barcha huquqlar himoyalangan.",
      tagline: "Premium qurilish materiallari yechimi",
      address: "Toshkent shahri, Yashnobod tumani, Quruvchilar ko‘chasi 7",
      phone: "+998 (71) 123-45-67",
      telegram: "@ndmmarket",
      email: "info@ndmmarket.uz",
    },
    buttons: {
      viewDetails: "Batafsil",
      viewAll: "Hammasi",
      loadMore: "Yana ko‘rish",
      contactUs: "Bog‘lanish",
      search: "Qidirish",
    },
    pagination: {
      prev: "Oldingi",
      next: "Keyingi",
    },
    filters: {
      showAll: "Barchasi",
    },
  },
  ru: {
    meta: {
      title: "NDM Market — Каталог строительных материалов",
      description:
        "Премиальный каталог строительных материалов NDM Market: бетон, металлоконструкции, профессиональные смеси и инженерные решения.",
    },
    navigation: {
      home: "Главная",
      categories: "Категории",
      catalog: "Каталог",
      brands: "Бренды",
      contact: "Контакты",
      searchPlaceholder: "Поиск по каталогу...",
      admin: "Админ",
    },
    hero: {
      eyebrow: "Премиальные строительные решения",
      title: "Повышайте уровень проектов с каталогом NDM Market",
      description:
        "Собрали ведущие материалы для масштабного строительства: бетоны, металлоконструкции и профессиональные смеси.",
      cta: "Открыть каталог",
    },
    home: {
      categoriesHeading: "Выберите направление",
      categoriesDescription:
        "Материалы NDM Market — это тщательно отобранные решения для всех этапов строительства.",
      featuredHeading: "Рекомендуемые позиции",
      featuredDescription:
        "Самые востребованные решения для повышения надежности и эффективности объектов.",
      viewCatalogCta: "Весь каталог",
    },
    categories: {
      title: "Категории каталога",
      subtitle: "Подберите решения, созданные для каждого направления строительства.",
      exploreCta: "Перейти к товарам",
    },
    catalog: {
      title: "Каталог продукции",
      subtitle:
        "Используйте фильтры по категориям и брендам, чтобы быстрее найти нужный продукт.",
      filtersTitle: "Фильтры",
      categoryLabel: "Категория",
      brandLabel: "Бренд",
      searchPlaceholder: "Поиск по названию продукции",
      resetFilters: "Сбросить фильтры",
      resultsLabel: "Найденные товары",
      emptyState:
        "По выбранным параметрам ничего не найдено. Попробуйте изменить фильтры.",
    },
    product: {
      specsTitle: "Технические характеристики",
      descriptionTitle: "О продукте",
      brandLabel: "Бренд",
      categoryLabel: "Категория",
      galleryLabel: "Галерея",
      backToCatalog: "Вернуться в каталог",
      relatedTitle: "Похожие продукты",
    },
    brands: {
      title: "Партнерские бренды",
      subtitle:
        "Работаем с ведущими производителями, чтобы обеспечить высочайшие стандарты.",
      productCount: "Товаров",
    },
    contact: {
      title: "Свяжитесь с нами",
      subtitle:
        "Наши специалисты подберут решение под задачи вашего проекта.",
      officeTitle: "Головной офис",
      addressLabel: "Адрес",
      phoneLabel: "Телефон",
      telegramLabel: "Telegram",
      hoursLabel: "Режим работы",
      mapTitle: "Карта Google",
      emailLabel: "Эл. почта",
    },
      footer: {
        rights: "© {year} NDM Market. Все права защищены.",
        tagline: "Премиальные строительные материалы",
        address: "г. Ташкент, Яшнабадский район, ул. Курувчилар, 7",
        phone: "+998 (71) 123-45-67",
        telegram: "@ndmmarket",
        email: "info@ndmmarket.uz",
      },
      buttons: {
        viewDetails: "Подробнее",
        viewAll: "Все",
        loadMore: "Показать ещё",
        contactUs: "Связаться",
        search: "Поиск",
      },
    pagination: {
      prev: "Назад",
      next: "Вперёд",
    },
    filters: {
      showAll: "Все",
    },
  },
} satisfies Record<Locale, Record<string, unknown>>;

export type Dictionary = (typeof dictionaries)[Locale];

export async function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
