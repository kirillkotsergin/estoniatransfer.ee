/**
 * Тексты сайта по языкам.
 *
 * Русский — источник истины: ключи заводятся здесь. Если ключа нет в другом
 * языке, useTranslations возьмёт русский, а TypeScript покажет это на сборке.
 * ET и FI добавляются как ещё две записи в объект ui — роутинг, hreflang и
 * переключатель языков уже готовы.
 *
 * Смысл услуг и их набор взяты с ridego.ee (проект того же владельца), но
 * формулировки написаны заново: два сайта с одинаковыми абзацами Google
 * склеит как дубли, и просядут оба.
 *
 * ПРОВЕРЬ перед публикацией: режим работы переходов и правила пересечения
 * границы даны на август 2026 года и меняются. Ниже они стоят с оговоркой
 * «проверяйте перед поездкой» — так и оставить.
 */

export const languages = {
  ru: "Русский",
  en: "English",
} as const;

export const defaultLang = "ru" as const;
export type Lang = keyof typeof languages;

/** Цены, телефон и парк — в одном месте: правится один раз, меняется везде. */
export const facts = {
  phone: "+372 56277764",
  phoneHref: "tel:+37256277764",
  whatsapp: "https://wa.me/37256277764",
  telegram: "https://t.me/+37256277764",
  email: "info@estoniatransfer.ee",
  car: "Toyota Corolla",
  seats: 4,
  driver: "Кирилл",
  /** Место в очереди на границе — доплата к маршруту Нарва (как на ridego.ee). */
  queueSlot: { price: 50, route: "narva" as const },
  routes: [
    { id: "narva", price: 130, km: 210, hours: "2 ч 30 мин", hoursEn: "2 h 30 min" },
    { id: "koidula", price: 160, km: 270, hours: "3 ч 5 мин", hoursEn: "3 h 5 min" },
    { id: "luhamaa", price: 160, km: 280, hours: "3 ч 10 мин", hoursEn: "3 h 10 min" },
  ],
} as const;

export const ui = {
  ru: {
    "meta.title": "Индивидуальный трансфер Таллинн — граница | EstoniaTransfer",
    "meta.description":
      "Частный трансфер из Таллинна к погранпереходам Нарва, Койдула и Лухамаа: 130–160 € за автомобиль целиком. Встречаем в аэропорту и порту, выезжаем в любое время суток.",

    "nav.routes": "Направления",
    "nav.car": "Автомобиль",
    "nav.how": "Как заказать",
    "nav.order": "Заявка",
    "nav.faq": "Вопросы",

    "hero.eyebrow": "Индивидуальный трансфер · Эстония",
    "hero.title.1": "Личный трансфер",
    "hero.title.2": "к погранпереходам Эстонии",
    "hero.lead":
      "Пассажирские перевозки из Таллинна к пунктам пропуска Нарва, Койдула и Лухамаа. Забираем от двери и довозим прямо к шлагбауму: без пересадок, без ожидания на автовокзале и без счётчика, который набегает в пробке.",
    "hero.cta": "Рассчитать поездку",
    "hero.secondary": "Написать в WhatsApp",
    "hero.trust.price": "за автомобиль",
    "hero.trust.time": "выезд в любое время",
    "hero.trust.seats": "места и багаж",

    "perks.title": "Что входит в цену",
    "perks.1": "Стоимость фиксируется до поездки: ни пробки, ни ночной выезд её не меняют",
    "perks.2": "Встреча в аэропорту и круизном порту — водитель ждёт с табличкой",
    "perks.3": "Задержали самолёт — ждём столько, сколько нужно, без доплаты",
    "perks.4": "Детское кресло привезём по запросу, за багаж не доплачиваете",
    "perks.5": "Расчёт наличными водителю или переводом, предоплату не берём",

    "routes.eyebrow": "Цены",
    "routes.title": "Направления и стоимость",
    "routes.lead":
      "Цена указана за машину целиком, а не за пассажира: поедет один человек или четверо — сумма та же. Нужен маршрут, которого нет в списке, или поездка в аэропорт — посчитаем отдельно.",
    "routes.narva": "Таллинн — Нарва",
    "routes.koidula": "Таллинн — Койдула",
    "routes.luhamaa": "Таллинн — Лухамаа",
    "routes.narva.note":
      "Пункт пропуска стоит прямо в городе. Границу здесь проходят пешком, и очередь у пешеходов обычно движется быстрее автомобильной.",
    "routes.koidula.note":
      "Автомобильный переход на юго-востоке страны, дорога идёт через Тарту. Удобен, если дальше вам в сторону Печор и Пскова.",
    "routes.luhamaa.note":
      "Самый южный переход, на шоссе Рига — Псков. Рейсовый транспорт до него не доходит, поэтому сюда едут либо на своей машине, либо трансфером.",
    "routes.km": "километров",
    "routes.time": "в пути",
    "addon.title": "Место в очереди на границе",
    "addon.text":
      "Займём для вас время в очереди заранее — переходите в назначенный час, а не стоите вместе со всеми. Доплата к маршруту в Нарву.",
    "routes.other": "Другое направление, поездка в аэропорт или обратный путь от границы — напишите, назовём цену.",

    "how.eyebrow": "Как это работает",
    "how.title": "Четыре шага от заявки до границы",
    "how.1.title": "Согласуем время",
    "how.1.text":
      "Пришлите дату, адрес и маршрут. В ответ получите точное время выезда и подтверждённую цену — считаем её от часов работы перехода, чтобы вы не приехали к закрытым воротам.",
    "how.2.title": "Забираем от двери",
    "how.2.text":
      "От квартиры, отеля, аэропорта или круизного порта — где скажете. Если летите, оставьте номер рейса: водитель отследит его сам и встретит с табличкой.",
    "how.3.title": "Дорога",
    "how.3.text":
      "Едем по шоссе без пересадок. По пути можно остановиться размяться и выпить кофе — время на это заложено, отдельной платы за остановку нет.",
    "how.4.title": "Высадка у пункта пропуска",
    "how.4.text":
      "Привозим к самому шлагбауму. Границу вы проходите самостоятельно; если дальше нужна машина уже на российской стороне, скажите заранее — поможем состыковать.",

    "why.eyebrow": "Почему так",
    "why.title": "Чем это отличается от такси и автобуса",
    "why.1.title": "Сумма известна заранее",
    "why.1.text":
      "Никакого счётчика: цену вы видите до выезда и платите ровно её, сколько бы времени ни заняла дорога.",
    "why.2.title": "Машина только ваша",
    "why.2.text":
      "Автомобиль закреплён за вашей поездкой. Никто не подсаживается по пути, маршрут не меняется в чужих интересах.",
    "why.3.title": "Выезд в любой час",
    "why.3.text":
      "Переходы открываются рано, и к открытию удобнее выезжать ночью. Автобус так не умеет, а мы работаем круглосуточно.",
    "why.4.title": "Разговор напрямую",
    "why.4.text":
      "Вы общаетесь с водителем, а не с диспетчером: договорённости не теряются при пересказе, а изменения решаются одним сообщением.",

    "car.eyebrow": "Автомобиль",
    "car.title": "Toyota Corolla",
    "car.lead":
      "Одна машина и один водитель на всю поездку. Салон чистый: это личный автомобиль, а не сменная машина таксопарка.",
    "car.f1": "Четыре пассажирских места",
    "car.f2": "Два больших чемодана плюс ручная кладь",
    "car.f3": "Климат-контроль, зимой — зимняя резина",
    "car.f4": "Детское кресло по запросу",
    "car.f5": "Встреча с табличкой в аэропорту и порту",
    "car.f6": "Оплата наличными или переводом",

    "driver.role": "Ваш водитель",
    "driver.text":
      "За рулём всегда один человек — он же отвечает на сообщения и звонки. Вы заранее знаете, кто вас повезёт, и обсуждаете детали напрямую, без диспетчера. Говорит по-русски.",
    "driver.photoAlt": "Кирилл — водитель EstoniaTransfer",

    "order.eyebrow": "Заявка",
    "order.title": "Оставьте заявку",
    "order.or": "или сразу в мессенджер",

    "form.from": "Поездка из",
    "form.to": "Едем до",
    "form.date": "Дата поездки",
    "form.pax": "Количество пассажиров",
    "form.name": "Ваше имя",
    "form.phone": "Номер телефона",
    "form.email": "Электронная почта",
    "form.optional": "необязательно",
    "form.choose": "Выберите",
    "form.pickDate": "Выберите дату",
    "form.submit": "Отправить заявку",
    "form.sending": "Отправляем…",
    "form.note":
      "Заявка уходит письмом на info@estoniatransfer.ee. Данные нужны только для ответа и нигде не хранятся.",
    "form.ok": "Спасибо! Заявка отправлена, скоро свяжемся.",
    "form.fail": "Не удалось отправить. Напишите в WhatsApp — ответим сразу.",
    "form.errSame": "Города отправления и назначения совпадают",
    "form.errRequired": "Заполните обязательные поля",
    "form.today": "Сегодня",
    "form.clear": "Сбросить",
    "form.prevMonth": "Предыдущий месяц",
    "form.nextMonth": "Следующий месяц",

    "faq.eyebrow": "Частые вопросы",
    "faq.title": "Коротко о главном",
    "faq.q1": "Сколько стоит трансфер и что входит в эту сумму?",
    "faq.a1":
      "До Нарвы — 130 €, до Койдулы и Лухамаа — 160 € за автомобиль целиком. В сумму уже входят встреча с табличкой, помощь с багажом, детское кресло и ожидание рейса. Доплат за ночное время и количество чемоданов нет. Отдельно оплачивается только место в очереди на границе, если оно нужно: плюс 50 € к маршруту в Нарву.",
    "faq.q2": "Сколько занимает дорога?",
    "faq.a2":
      "До Нарвы около 2 часов 30 минут, до Койдулы примерно 3 часа, до Лухамаа — 3 часа 10 минут. В снегопад и в плотном движении дольше, поэтому к открытию перехода выезжаем с запасом.",
    "faq.q3": "Можно пересечь границу, не выходя из машины?",
    "faq.a3":
      "Через Койдулу и Лухамаа — да, это автомобильные переходы, но очередь на выезд бронируется заранее в системе GoSwift. Через Нарву границу проходят пешком. Режим работы переходов меняется, поэтому сверяйте его перед поездкой.",
    "faq.q4": "Вы встречаете в аэропорту и порту?",
    "faq.a4":
      "Да. Оставьте номер рейса или название судна — водитель отследит прибытие и будет ждать с табличкой у выхода. Задержка рейса цену не меняет и заказ не отменяет.",
    "faq.q5": "Как оплатить поездку?",
    "faq.a5":
      "Наличными водителю или банковским переводом, в евро. Предоплату не берём: сначала поездка, потом расчёт. Цену подтверждаем сообщением до выезда, чтобы у вас остался письменный ответ.",

    "footer.tagline":
      "Индивидуальный трансфер и пассажирские перевозки по Эстонии: аэропорт, круизный порт, погранпереходы Нарва, Койдула и Лухамаа.",
    "footer.contacts": "Контакты",
    "footer.routes": "Направления",
    "footer.rights": "Все права защищены",
    "footer.city": "Таллинн, Эстония",

    "common.from": "от",
    "common.perCar": "за автомобиль",
    "lang.label": "Язык",
  },

  en: {
    "meta.title": "Private Transfer Tallinn — Border Crossings | EstoniaTransfer",
    "meta.description":
      "Private transfer from Tallinn to the Narva, Koidula and Luhamaa border crossings: €130–160 for the whole car. Airport and port pickup, departures at any hour.",

    "nav.routes": "Routes",
    "nav.car": "Vehicle",
    "nav.how": "How it works",
    "nav.order": "Request",
    "nav.faq": "FAQ",

    "hero.eyebrow": "Private transfer · Estonia",
    "hero.title.1": "Your own transfer",
    "hero.title.2": "to Estonia's border crossings",
    "hero.lead":
      "Passenger transport from Tallinn to the Narva, Koidula and Luhamaa checkpoints. We pick you up at the door and drive you right to the barrier — no changes, no waiting at a bus station, no meter ticking in traffic.",
    "hero.cta": "Get a price",
    "hero.secondary": "Message on WhatsApp",
    "hero.trust.price": "per car",
    "hero.trust.time": "any hour",
    "hero.trust.seats": "seats and luggage",

    "perks.title": "What the price covers",
    "perks.1": "The fare is fixed before departure: traffic and night trips do not change it",
    "perks.2": "Pickup at the airport and cruise port — the driver waits with a name board",
    "perks.3": "If your flight is delayed we wait as long as needed, at no extra cost",
    "perks.4": "A child seat on request, and no surcharge for luggage",
    "perks.5": "Pay the driver in cash or by bank transfer; no prepayment required",

    "routes.eyebrow": "Prices",
    "routes.title": "Routes and fares",
    "routes.lead":
      "The price is for the whole car, not per seat: one passenger or four, the sum stays the same. Need a route that is not listed, or an airport run? We will quote it.",
    "routes.narva": "Tallinn — Narva",
    "routes.koidula": "Tallinn — Koidula",
    "routes.luhamaa": "Tallinn — Luhamaa",
    "routes.narva.note":
      "The checkpoint sits inside the city. The border here is crossed on foot, and the pedestrian queue usually moves faster than the car one.",
    "routes.koidula.note":
      "A car crossing in the south-east, reached via Tartu. Convenient if you continue towards Petseri and Pskov.",
    "routes.luhamaa.note":
      "The southernmost crossing, on the Riga — Pskov road. No scheduled transport reaches it, so people arrive either by their own car or by transfer.",
    "routes.km": "kilometres",
    "routes.time": "on the road",
    "addon.title": "A booked slot in the border queue",
    "addon.text":
      "We reserve your place in the queue in advance, so you cross at an agreed hour instead of waiting with everyone else. Charged on top of the Narva route.",
    "routes.other": "Another destination, an airport run or the return trip from the border — message us for a price.",

    "how.eyebrow": "How it works",
    "how.title": "Four steps from request to border",
    "how.1.title": "We agree the time",
    "how.1.text":
      "Send the date, the address and the route. You get back an exact departure time and a confirmed price — we count backwards from the checkpoint's opening hours so you never arrive at a closed gate.",
    "how.2.title": "Door-to-door pickup",
    "how.2.text":
      "From your flat, hotel, the airport or the cruise port — wherever you say. Flying in? Leave the flight number and the driver will track it and meet you with a name board.",
    "how.3.title": "The drive",
    "how.3.text":
      "A single ride along the highway with no changes. We can stop for a coffee and a stretch on the way — that time is already allowed for, with nothing extra to pay.",
    "how.4.title": "Drop-off at the checkpoint",
    "how.4.text":
      "We bring you to the barrier itself. You cross the border on your own; if you need a car waiting on the Russian side, tell us in advance and we will help line it up.",

    "why.eyebrow": "Why this way",
    "why.title": "How it differs from a taxi or a bus",
    "why.1.title": "The sum is known upfront",
    "why.1.text":
      "No meter: you see the price before departure and pay exactly that, however long the drive turns out to be.",
    "why.2.title": "The car is yours alone",
    "why.2.text":
      "The vehicle is booked for your trip only. Nobody else is picked up along the way and the route is not changed for someone else.",
    "why.3.title": "Departures at any hour",
    "why.3.text":
      "Crossings open early, and it is easier to leave at night to be there when they do. A bus cannot do that; we work around the clock.",
    "why.4.title": "You talk to the driver",
    "why.4.text":
      "No dispatcher in between: nothing gets lost in retelling, and any change is settled in a single message.",

    "car.eyebrow": "Vehicle",
    "car.title": "Toyota Corolla",
    "car.lead":
      "One car and one driver for the whole trip. The interior is clean because this is a private car, not a rotating taxi-fleet vehicle.",
    "car.f1": "Four passenger seats",
    "car.f2": "Two large suitcases plus hand luggage",
    "car.f3": "Climate control, winter tyres in winter",
    "car.f4": "Child seat on request",
    "car.f5": "Name-board pickup at the airport and port",
    "car.f6": "Payment in cash or by transfer",

    "driver.role": "Your driver",
    "driver.text":
      "The same person is always behind the wheel and answers your messages and calls. You know in advance who will drive you and settle the details directly, with no dispatcher. Speaks Russian.",
    "driver.photoAlt": "Kirill — the EstoniaTransfer driver",

    "order.eyebrow": "Request",
    "order.title": "Send a request",
    "order.or": "or message us directly",

    "form.from": "From",
    "form.to": "To",
    "form.date": "Travel date",
    "form.pax": "Passengers",
    "form.name": "Your name",
    "form.phone": "Phone number",
    "form.email": "Email",
    "form.optional": "optional",
    "form.choose": "Select",
    "form.pickDate": "Pick a date",
    "form.submit": "Send request",
    "form.sending": "Sending…",
    "form.note":
      "The request is emailed to info@estoniatransfer.ee. We use the details only to reply and store nothing.",
    "form.ok": "Thank you! The request has been sent, we will get back to you shortly.",
    "form.fail": "Could not send. Message us on WhatsApp — we reply straight away.",
    "form.errSame": "Pick-up and drop-off are the same",
    "form.errRequired": "Please fill the required fields",
    "form.today": "Today",
    "form.clear": "Clear",
    "form.prevMonth": "Previous month",
    "form.nextMonth": "Next month",

    "faq.eyebrow": "FAQ",
    "faq.title": "The short answers",
    "faq.q1": "What does the transfer cost and what is included?",
    "faq.a1":
      "Narva is €130; Koidula and Luhamaa are €160 for the whole car. The fare already covers the name-board pickup, help with luggage, a child seat and waiting for your flight. There is no surcharge for night trips or extra suitcases. The only extra is a booked slot in the border queue, if you want one: €50 on top of the Narva route.",
    "faq.q2": "How long is the drive?",
    "faq.a2":
      "About 2 hours 30 minutes to Narva, roughly 3 hours to Koidula and 3 hours 10 minutes to Luhamaa. Snow and heavy traffic make it longer, so we leave with time in hand when the crossing opens.",
    "faq.q3": "Can I cross the border without leaving the car?",
    "faq.a3":
      "Through Koidula and Luhamaa, yes — these are car crossings, though the exit queue has to be booked in advance in the GoSwift system. Narva is crossed on foot. Opening hours change, so check them before you travel.",
    "faq.q4": "Do you meet passengers at the airport and the port?",
    "faq.a4":
      "Yes. Leave the flight number or the ship's name and the driver will track the arrival and wait with a name board. A delayed flight changes neither the price nor the booking.",
    "faq.q5": "How do I pay?",
    "faq.a5":
      "In cash to the driver or by bank transfer, in euros. No prepayment: the ride first, the settlement after. We confirm the price by message before departure so you have it in writing.",

    "footer.tagline":
      "Private transfer and passenger transport across Estonia: airport, cruise port and the Narva, Koidula and Luhamaa border crossings.",
    "footer.contacts": "Contacts",
    "footer.routes": "Routes",
    "footer.rights": "All rights reserved",
    "footer.city": "Tallinn, Estonia",

    "common.from": "from",
    "common.perCar": "per car",
    "lang.label": "Language",
  },
} as const;

/** Города для формы. value — язык-независимый id, подпись переводится. */
export const cities = {
  tallinn: { ru: "Таллинн", en: "Tallinn" },
  narva: { ru: "Нарва", en: "Narva" },
  koidula: { ru: "Койдула", en: "Koidula" },
  luhamaa: { ru: "Лухамаа", en: "Luhamaa" },
} as const;

export type CityId = keyof typeof cities;

export const fromOrder: CityId[] = ["tallinn", "narva", "koidula", "luhamaa"];
export const toOrder: CityId[] = ["narva", "koidula", "luhamaa", "tallinn"];

/** Месяцы и дни недели для своего календаря: Intl не тянем. */
export const calendar = {
  ru: {
    months: [
      "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
      "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
    ],
    days: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
  },
  en: {
    months: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ],
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
} as const;

export type UIKey = keyof (typeof ui)[typeof defaultLang];

export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    const dict = ui[lang] as Record<string, string>;
    return dict[key] ?? ui[defaultLang][key];
  };
}

/** Путь с языковым префиксом: ru → /путь, en → /en/путь */
export function localePath(lang: Lang, path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return lang === defaultLang ? clean : `/${lang}${clean}`;
}
