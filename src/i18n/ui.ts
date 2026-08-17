/**
 * Тексты сайта по языкам.
 *
 * Русский — источник истины: ключи заводятся здесь. Тип Lang и функция
 * useTranslations устроены так, что при отсутствии ключа в другом языке
 * TypeScript ругается на сборке, а не после публикации. Именно за этим и
 * нужен генератор: на четырёх языках руками это не удержать.
 *
 * ET и FI добавляются как ещё две записи в объект ui — остальной код
 * (роутинг, hreflang, переключатель) уже готов.
 */

export const languages = {
  ru: "Русский",
  en: "English",
} as const;

export const defaultLang = "ru" as const;
export type Lang = keyof typeof languages;

/** Цены и телефон живут в одном месте: правится один раз, меняется везде. */
export const facts = {
  phone: "+372 56277764",
  phoneHref: "tel:+37256277764",
  whatsapp: "https://wa.me/37256277764",
  telegram: "https://t.me/+37256277764",
  email: "info@estoniatransfer.ee",
  car: "Toyota Corolla",
  seats: 4,
  routes: [
    { id: "narva", price: 130, km: 210, hours: "2 ч 30 мин", hoursEn: "2 h 30 min" },
    { id: "koidula", price: 160, km: 270, hours: "3 ч 5 мин", hoursEn: "3 h 5 min" },
    { id: "luhamaa", price: 160, km: 280, hours: "3 ч 10 мин", hoursEn: "3 h 10 min" },
  ],
} as const;

export const ui = {
  ru: {
    "meta.title": "Индивидуальный трансфер по Эстонии и к границе | EstoniaTransfer",
    "meta.description":
      "Индивидуальный трансфер из Таллинна к погранпереходам Нарва, Койдула и Лухамаа: от 130 € за автомобиль. Встречаем в аэропорту и порту, работаем круглосуточно.",
    "nav.routes": "Направления",
    "nav.car": "Автомобиль",
    "nav.order": "Заказать",
    "nav.faq": "Вопросы",
    "hero.eyebrow": "Индивидуальный трансфер · Эстония",
    "hero.title.1": "Доедем туда,",
    "hero.title.2": "где кончается транспорт",
    "hero.lead":
      "Пассажирские перевозки по Эстонии и к погранпереходам с Россией. Цена известна до поездки и считается за автомобиль, а не за человека: один пассажир или четверо — сумма одна.",
    "hero.cta": "Рассчитать поездку",
    "hero.secondary": "Написать в WhatsApp",
    "hero.trust.price": "за автомобиль",
    "hero.trust.time": "круглосуточно",
    "hero.trust.seats": "места и багаж",
    "routes.eyebrow": "Цены",
    "routes.title": "Направления к границе",
    "routes.lead":
      "Фиксированная стоимость за машину целиком. Ночной выезд, пробки и ожидание её не меняют.",
    "routes.narva": "Таллинн — Нарва",
    "routes.koidula": "Таллинн — Койдула",
    "routes.luhamaa": "Таллинн — Лухамаа",
    "routes.narva.note":
      "Погранпереход в центре города. Пешая очередь обычно короче автомобильной.",
    "routes.koidula.note":
      "Автомобильный переход на юго-востоке, удобен в сторону Пскова и Печор.",
    "routes.luhamaa.note":
      "Самый южный переход, на шоссе Рига — Псков. Рейсовый транспорт сюда не идёт.",
    "routes.km": "километров",
    "routes.time": "в пути",
    "routes.other": "Нужно другое направление или трансфер в аэропорт? Посчитаем отдельно.",
    "car.eyebrow": "Автомобиль",
    "car.title": "Toyota Corolla",
    "car.lead":
      "Один автомобиль и один водитель: вы договариваетесь напрямую с тем, кто вас повезёт, без диспетчера и пересказов.",
    "car.f1": "Четыре пассажирских места",
    "car.f2": "Два больших чемодана и ручная кладь",
    "car.f3": "Климат-контроль, зимой — зимняя резина",
    "car.f4": "Детское кресло по запросу",
    "car.f5": "Встреча в аэропорту и порту с табличкой",
    "car.f6": "Оплата наличными или переводом",
    "order.eyebrow": "Заказ",
    "order.title": "Оставьте заявку",
    "order.lead":
      "Форма ещё настраивается — поля добавим под ваш процесс. Пока быстрее написать в мессенджер: отвечаем сразу.",
    "order.placeholder": "Здесь будет форма заказа",
    "order.placeholderNote":
      "Состав полей согласуем: дата, время, маршрут, число пассажиров, контакты.",
    "order.or": "или сразу в мессенджер",
    "footer.tagline":
      "Индивидуальный трансфер и пассажирские перевозки по Эстонии: аэропорт, порт, погранпереходы.",
    "footer.contacts": "Контакты",
    "footer.routes": "Направления",
    "footer.rights": "Все права защищены",
    "footer.city": "Таллинн, Эстония",
    "common.from": "от",
    "common.perCar": "за автомобиль",
    "lang.label": "Язык",
  },
  en: {
    "meta.title": "Private Transfer in Estonia and to the Border | EstoniaTransfer",
    "meta.description":
      "Private transfer from Tallinn to the Narva, Koidula and Luhamaa border crossings from €130 per car. Airport and port pickup, available around the clock.",
    "nav.routes": "Routes",
    "nav.car": "Vehicle",
    "nav.order": "Book",
    "nav.faq": "FAQ",
    "hero.eyebrow": "Private transfer · Estonia",
    "hero.title.1": "We drive where",
    "hero.title.2": "public transport stops",
    "hero.lead":
      "Passenger transport across Estonia and to the Russian border crossings. The price is agreed before departure and charged per car, not per person — one passenger or four, the sum is the same.",
    "hero.cta": "Get a price",
    "hero.secondary": "Message on WhatsApp",
    "hero.trust.price": "per car",
    "hero.trust.time": "around the clock",
    "hero.trust.seats": "seats and luggage",
    "routes.eyebrow": "Prices",
    "routes.title": "Border crossings we serve",
    "routes.lead":
      "A fixed price for the whole car. Night departures, traffic and waiting do not change it.",
    "routes.narva": "Tallinn — Narva",
    "routes.koidula": "Tallinn — Koidula",
    "routes.luhamaa": "Tallinn — Luhamaa",
    "routes.narva.note":
      "The crossing sits in the city centre; the pedestrian queue is usually shorter than the car one.",
    "routes.koidula.note":
      "A car crossing in the south-east, convenient towards Pskov and Petseri.",
    "routes.luhamaa.note":
      "The southernmost crossing, on the Riga — Pskov road. No scheduled transport reaches it.",
    "routes.km": "kilometres",
    "routes.time": "on the road",
    "routes.other": "Need another destination or an airport transfer? We will quote it.",
    "car.eyebrow": "Vehicle",
    "car.title": "Toyota Corolla",
    "car.lead":
      "One car and one driver: you arrange the trip directly with the person who will drive you, with no dispatcher in between.",
    "car.f1": "Four passenger seats",
    "car.f2": "Two large suitcases plus hand luggage",
    "car.f3": "Climate control, winter tyres in winter",
    "car.f4": "Child seat on request",
    "car.f5": "Name-board pickup at the airport and port",
    "car.f6": "Payment in cash or by transfer",
    "order.eyebrow": "Booking",
    "order.title": "Send a request",
    "order.lead":
      "The form is still being set up — fields will match your process. For now a message is faster: we reply straight away.",
    "order.placeholder": "The booking form goes here",
    "order.placeholderNote":
      "Fields to be agreed: date, time, route, number of passengers, contacts.",
    "order.or": "or message us directly",
    "footer.tagline":
      "Private transfer and passenger transport across Estonia: airport, port, border crossings.",
    "footer.contacts": "Contacts",
    "footer.routes": "Routes",
    "footer.rights": "All rights reserved",
    "footer.city": "Tallinn, Estonia",
    "common.from": "from",
    "common.perCar": "per car",
    "lang.label": "Language",
  },
} as const;

/** Ключи берём из русского: он полный по определению. */
export type UIKey = keyof (typeof ui)[typeof defaultLang];

export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    const dict = ui[lang] as Record<string, string>;
    return dict[key] ?? ui[defaultLang][key];
  };
}

/** Путь с языковым префиксом: ru → /о, en → /en/о */
export function localePath(lang: Lang, path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return lang === defaultLang ? clean : `/${lang}${clean}`;
}
