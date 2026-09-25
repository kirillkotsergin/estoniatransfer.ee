/**
 * Прайс-лист всех направлений — данные для страницы /marshruty/ и /en/marshruty/.
 *
 * Заведён 25.09.2026 по решению владельца: собрать на одной странице все
 * направления с ценами, по образцу таблицы estonia-transfer.ee/ru/marshruty/.
 *
 * Откуда цифры — два источника, и их нельзя путать:
 *
 * 1. Наши маршруты (Нарва, Койдула, Лухамаа, Тарту, сквозной Петербург,
 *    российская сторона) берут цену, километры и время из `facts`. Здесь они
 *    цифрами НЕ пишутся — тариф правится в ui.ts и меняется везде сразу.
 *    Там, где у конкурента цена выше (Нарва 158 €, Койдула и Лухамаа 203 €),
 *    стоит наша: решение владельца 25.09.2026 — свои цены не поднимаем.
 * 2. Новые направления (Пярну, Рига, Вильнюс и т. д.) — цены, расстояния и
 *    время взяты с таблицы конкурента 25.09.2026 и приняты владельцем как
 *    свои. Этот файл — единственное место, где они живут. Исключение —
 *    аэропорт — центр и аэропорт — порт: у конкурента 5 €, владелец
 *    назначил 20 € на оба (25.09.2026).
 *    Сквозные поездки до Пскова с пересадкой на границе подтверждены
 *    владельцем тогда же.
 *    ПРОВЕРЬ: расстояния и время у конкурента приблизительные.
 *
 * Правила, которые легко нарушить:
 * - `price: null` — цены нет (острова, паром). Такая строка показывается
 *   «по запросу» и в микроразметку НЕ идёт: нет цены — нет Offer.
 * - `minutes` — число, оно уходит в разметку как QuantitativeValue (MIN).
 *   Если время по-человечески не сводится к одному числу («4–5 ч»,
 *   «плюс граница»), подпись задаётся в `time`, а `minutes` остаётся
 *   ориентиром для разметки.
 * - `href` — путь без языкового префикса и только на существующую страницу
 *   маршрута. Английскую ссылку страница ставит сама и лишь тогда, когда у
 *   посадочной есть английская версия (`landingLangs`): у российских
 *   страниц её нет.
 * - Русские названия — «Таллинн» с двумя «н», как на всём сайте (у
 *   конкурента местами «Таллин»). Латиницы в русских подписях нет: подписи
 *   строк — заголовки ячеек таблицы, а заголовки русской версии только
 *   по-русски (решение владельца 13.09.2026). Английские — с диакритикой,
 *   как на указателях: Pärnu, Cēsis, Klaipėda.
 * - Английский текст не подстрочник, как и на посадочных: смысл и цифры те
 *   же, обороты свои.
 * - Дубль конкурента «Таллинн → Курессааре (через Виртсу)» слит со строкой
 *   «Таллинн → Сааремаа (Курессааре)»: на Сааремаа паром один, Виртсу —
 *   Куйвасту, две строки описывали одну поездку.
 */
import { facts, type Lang } from "../i18n/ui";

/**
 * Дата, когда менялись цены или состав прайса. Идёт в lastmod карты сайта,
 * в dateModified разметки и в видимое «Цены проверены» — одно поле на все три,
 * разойтись им негде. Поменяли строку — поднимите дату.
 */
export const pricelistUpdated = "2026-09-25";

/**
 * Адрес страницы по языкам, без языкового префикса. Слаг переведён — у
 * английской версии свой, /en/routes/ (решение владельца 25.09.2026; первые
 * часы она жила на /en/marshruty/, оттуда 301 в public/.htaccess). Отсюда
 * берут адрес страница, подвал, карта сайта и llms.txt — меняется здесь.
 */
export const pricelistPaths: Record<Lang, string> = { ru: "/marshruty/", en: "/routes/" };

export type Currency = "EUR" | "RUB";
type Text = Record<Lang, string>;

export interface PriceRow {
  /** якорь строки и хвост @id оффера в разметке — латиницей, уникален */
  id: string;
  from: Text;
  to: Text;
  /** уточнение мелким шрифтом под названием */
  note?: Text;
  km: number;
  /** паромная переправа сверх километров по суше */
  ferry?: boolean;
  minutes: number;
  /** подпись времени, если одно число врёт — см. шапку */
  time?: Text;
  price: number | null;
  /** путь нашей страницы маршрута без языкового префикса, если она есть */
  href?: string;
}

export interface PriceGroup {
  /** якорь раздела */
  id: string;
  title: Text;
  lead: Text;
  caption: Text;
  currency: Currency;
  rows: PriceRow[];
}

const route = (id: "narva" | "koidula" | "luhamaa") => facts.routes.find((r) => r.id === id)!;
const narva = route("narva");
const koidula = route("koidula");
const luhamaa = route("luhamaa");

/** Минуты наших маршрутов — те же, что в SiteSchema.astro для главной. */
const ourMinutes = { narva: 150, koidula: 185, luhamaa: 190 } as const;

/** Города, которые встречаются больше одного раза. */
const c = {
  tallinn: { ru: "Таллинн", en: "Tallinn" },
  tartu: { ru: "Тарту", en: "Tartu" },
  narva: { ru: "Нарва", en: "Narva" },
  koidula: { ru: "Койдула", en: "Koidula" },
  luhamaa: { ru: "Лухамаа", en: "Luhamaa" },
  pskov: { ru: "Псков", en: "Pskov" },
  spb: { ru: "Санкт-Петербург", en: "Saint Petersburg" },
  airport: { ru: "Аэропорт Таллинна", en: "Tallinn Airport" },
  parnu: { ru: "Пярну", en: "Pärnu" },
  haapsalu: { ru: "Хаапсалу", en: "Haapsalu" },
  riga: { ru: "Рига", en: "Riga" },
  vilnius: { ru: "Вильнюс", en: "Vilnius" },
  kaunas: { ru: "Каунас", en: "Kaunas" },
} as const;

const viaBorder = { ru: "с пересадкой на границе", en: "change of car at the border" };

export const priceGroups: PriceGroup[] = [
  {
    id: "granica",
    title: { ru: "К погранпереходам с Россией", en: "To the Russian border" },
    lead: {
      ru: "Наше основное направление: довозим до пункта пропуска в Нарве, Койдуле или Лухамаа и встречаем после него. Эстонская машина границу не пересекает — на маршрутах до Пскова и Петербурга по России едет вторая машина, а цена одна за всю дорогу.",
      en: "This is what we do most: a drive to the checkpoint at Narva, Koidula or Luhamaa, and a pickup on the way back. Our Estonian car stays on this side — for Pskov and Saint Petersburg a second car takes over in Russia, and you still pay one price for the whole trip.",
    },
    caption: {
      ru: "Трансфер к погранпереходам: цена за автомобиль, обратно от перехода — столько же",
      en: "Border crossing transfers: price per car, the same back from the border",
    },
    currency: "EUR",
    rows: [
      {
        id: "tallinn-narva",
        from: c.tallinn,
        to: c.narva,
        note: { ru: "пешеходный переход в центре города", en: "walk-through crossing in the town centre" },
        km: narva.km,
        minutes: ourMinutes.narva,
        price: narva.price,
        href: "/transfer-tallinn-narva/",
      },
      {
        id: "tallinn-koidula",
        from: c.tallinn,
        to: c.koidula,
        note: { ru: "автомобильный переход, дорога через Тарту", en: "road crossing, the route runs via Tartu" },
        km: koidula.km,
        minutes: ourMinutes.koidula,
        price: koidula.price,
        href: "/transfer-tallinn-koidula/",
      },
      {
        id: "tallinn-luhamaa",
        from: c.tallinn,
        to: c.luhamaa,
        note: { ru: "трасса Рига — Псков, автобусов нет", en: "on the Riga — Pskov road, no buses go there" },
        km: luhamaa.km,
        minutes: ourMinutes.luhamaa,
        price: luhamaa.price,
        href: "/transfer-tallinn-luhamaa/",
      },
      {
        id: "tartu-koidula",
        from: c.tartu,
        to: c.koidula,
        km: facts.fromTartu.koidula.km,
        minutes: 60,
        price: facts.fromTartu.price,
        href: "/transfer-tartu-koidula-luhamaa/",
      },
      {
        id: "tartu-luhamaa",
        from: c.tartu,
        to: c.luhamaa,
        km: facts.fromTartu.luhamaa.km,
        minutes: 80,
        price: facts.fromTartu.price,
        href: "/transfer-tartu-koidula-luhamaa/",
      },
      { id: "narva-koidula", from: c.narva, to: c.koidula, km: 269, minutes: 200, price: 202 },
      { id: "narva-luhamaa", from: c.narva, to: c.luhamaa, km: 284, minutes: 210, price: 213 },
      {
        id: "tallinn-spb",
        from: c.tallinn,
        to: c.spb,
        note: {
          ru: "две машины, границу в Нарве проходите пешком",
          en: "two cars, you cross on foot at Narva",
        },
        km: facts.tallinnSpb.km,
        minutes: 300,
        time: { ru: "≈ 5 ч + граница", en: "≈ 5 h + border" },
        price: facts.tallinnSpb.price,
        href: "/transfer-tallinn-spb/",
      },
      {
        id: "tallinn-pskov",
        from: c.tallinn,
        to: c.pskov,
        note: viaBorder,
        km: 290,
        minutes: 220,
        time: { ru: "≈ 3 ч 40 мин + граница", en: "≈ 3 h 40 min + border" },
        price: 218,
      },
      {
        id: "narva-pskov",
        from: c.narva,
        to: c.pskov,
        note: viaBorder,
        km: 345,
        minutes: 250,
        time: { ru: "≈ 4 ч 10 мин + граница", en: "≈ 4 h 10 min + border" },
        price: 259,
      },
    ],
  },
  {
    id: "estonia",
    title: { ru: "По Эстонии", en: "Within Estonia" },
    lead: {
      ru: "Аэропорт, порт, курорты и города Эстонии. Подаём машину к любому адресу, а не только к вокзалу или центру: если нужного города в таблице нет, пришлите адреса — посчитаем по той же логике.",
      en: "The airport, the harbour, seaside resorts and towns across Estonia. We pick up at any address, not just a station or the centre — if your town is missing from the table, send us both addresses and we will quote it the same way.",
    },
    caption: { ru: "Трансфер по Эстонии: цена за автомобиль", en: "Transfers within Estonia: price per car" },
    currency: "EUR",
    rows: [
      {
        id: "airport-center",
        from: c.airport,
        to: { ru: "центр Таллинна", en: "Tallinn city centre" },
        note: { ru: "встреча с табличкой, рейс отслеживаем", en: "name board in arrivals, we track your flight" },
        km: 4,
        minutes: 15,
        price: 20,
      },
      {
        id: "airport-port",
        from: c.airport,
        to: { ru: "пассажирский порт", en: "passenger port" },
        km: 5,
        minutes: 15,
        price: 20,
      },
      { id: "tallinn-parnu", from: c.tallinn, to: c.parnu, km: 130, minutes: 100, price: 98 },
      { id: "tallinn-tartu", from: c.tallinn, to: c.tartu, km: 185, minutes: 120, price: 139 },
      { id: "tallinn-haapsalu", from: c.tallinn, to: c.haapsalu, km: 100, minutes: 90, price: 75 },
      {
        id: "tallinn-rakvere",
        from: c.tallinn,
        to: { ru: "Раквере", en: "Rakvere" },
        km: 100,
        minutes: 80,
        price: 75,
      },
      {
        id: "tallinn-viljandi",
        from: c.tallinn,
        to: { ru: "Вильянди", en: "Viljandi" },
        km: 160,
        minutes: 120,
        price: 120,
      },
      {
        id: "tallinn-kuressaare",
        from: c.tallinn,
        to: { ru: "Курессааре", en: "Kuressaare" },
        note: {
          ru: "Сааремаа, паром Виртсу — Куйвасту",
          en: "Saaremaa, via the Virtsu — Kuivastu ferry",
        },
        km: 220,
        ferry: true,
        minutes: 210,
        price: null,
      },
      {
        id: "tallinn-kardla",
        from: c.tallinn,
        to: { ru: "Кярдла", en: "Kärdla" },
        note: {
          ru: "Хийумаа, паром Рохукюла — Хельтермаа",
          en: "Hiiumaa, via the Rohuküla — Heltermaa ferry",
        },
        km: 165,
        ferry: true,
        minutes: 240,
        price: null,
      },
      { id: "tartu-parnu", from: c.tartu, to: c.parnu, km: 175, minutes: 130, price: 131 },
      { id: "tartu-narva", from: c.tartu, to: c.narva, km: 175, minutes: 140, price: 131 },
      { id: "parnu-haapsalu", from: c.parnu, to: c.haapsalu, km: 105, minutes: 90, price: 79 },
    ],
  },
  {
    id: "baltia",
    title: { ru: "В Латвию и Литву", en: "To Latvia and Lithuania" },
    lead: {
      ru: "Из Таллинна и Тарту в Ригу, Вильнюс, Каунас и на побережье — без пересадок и без привязки к расписанию автобуса. Эстония, Латвия и Литва — в Шенгенской зоне, постоянного паспортного контроля на этих границах нет.",
      en: "From Tallinn and Tartu to Riga, Vilnius, Kaunas and the coast — door to door, with no bus timetable to fit around. All three Baltic states are in Schengen, so there is no routine passport check at these borders.",
    },
    caption: {
      ru: "Трансфер в Латвию и Литву: цена за автомобиль",
      en: "Transfers to Latvia and Lithuania: price per car",
    },
    currency: "EUR",
    rows: [
      {
        id: "tallinn-riga",
        from: c.tallinn,
        to: c.riga,
        note: { ru: "аэропорт или центр", en: "airport or city centre" },
        km: 310,
        minutes: 240,
        price: 233,
      },
      { id: "tartu-riga", from: c.tartu, to: c.riga, km: 250, minutes: 210, price: 188 },
      {
        id: "tallinn-sigulda",
        from: c.tallinn,
        to: { ru: "Сигулда", en: "Sigulda" },
        km: 280,
        minutes: 220,
        price: 210,
      },
      {
        id: "tallinn-cesis",
        from: c.tallinn,
        to: { ru: "Цесис", en: "Cēsis" },
        km: 260,
        minutes: 210,
        price: 195,
      },
      {
        id: "tallinn-valmiera",
        from: c.tallinn,
        to: { ru: "Валмиера", en: "Valmiera" },
        km: 215,
        minutes: 170,
        price: 161,
      },
      {
        id: "tallinn-liepaja",
        from: c.tallinn,
        to: { ru: "Лиепая", en: "Liepāja" },
        km: 490,
        minutes: 360,
        price: 368,
      },
      { id: "tallinn-vilnius", from: c.tallinn, to: c.vilnius, km: 605, minutes: 420, price: 454 },
      { id: "tallinn-kaunas", from: c.tallinn, to: c.kaunas, km: 540, minutes: 390, price: 405 },
      {
        id: "tallinn-klaipeda",
        from: c.tallinn,
        to: { ru: "Клайпеда", en: "Klaipėda" },
        km: 585,
        minutes: 420,
        price: 439,
      },
      { id: "riga-vilnius", from: c.riga, to: c.vilnius, km: 295, minutes: 210, price: 221 },
      { id: "riga-kaunas", from: c.riga, to: c.kaunas, km: 265, minutes: 200, price: 199 },
      { id: "vilnius-kaunas", from: c.vilnius, to: c.kaunas, km: 105, minutes: 80, price: 79 },
    ],
  },
  {
    id: "rossiya",
    title: { ru: "По российской стороне границы", en: "On the Russian side" },
    lead: {
      ru: "Встреча сразу за пунктом пропуска и дорога до Пскова или Петербурга. Это отдельная машина уже в России, поэтому и расчёт здесь в рублях. Обратно, от города до перехода, — та же цена.",
      en: "A pickup right after the Russian checkpoint and the drive on to Pskov or Saint Petersburg. This is a separate car on the Russian side, which is why these fares are in roubles. The same price applies in the other direction.",
    },
    caption: {
      ru: "Трансфер от российских пунктов пропуска: цена за автомобиль в рублях",
      en: "Transfers from the Russian checkpoints: price per car, in roubles",
    },
    currency: "RUB",
    rows: [
      {
        id: "ivangorod-spb",
        from: { ru: "Ивангород", en: "Ivangorod" },
        to: c.spb,
        km: 150,
        minutes: 150,
        price: facts.russia.ivangorodSpb,
        href: "/transfer-ivangorod-spb/",
      },
      {
        id: "kunichina-pskov",
        from: { ru: "Куничина Гора", en: "Kunichina Gora" },
        to: c.pskov,
        km: 55,
        minutes: 60,
        price: facts.russia.kunichinaPskov,
        href: "/transfer-kunichina-gora-pskov/",
      },
      {
        id: "shumilkino-pskov",
        from: { ru: "Шумилкино", en: "Shumilkino" },
        to: c.pskov,
        km: 55,
        minutes: 60,
        price: facts.russia.shumilkinoPskov,
        href: "/transfer-shumilkino-pskov/",
      },
      {
        id: "kunichina-shumilkino-spb",
        from: { ru: "Куничина Гора или Шумилкино", en: "Kunichina Gora or Shumilkino" },
        to: c.spb,
        km: 300,
        minutes: 270,
        time: { ru: "≈ 4–5 ч", en: "≈ 4–5 h" },
        price: facts.russia.kunichinaShumilkinoSpb,
        href: "/transfer-kunichina-shumilkino-spb/",
      },
    ],
  },
];

/** «≈ 2 ч 30 мин» / «≈ 2 h 30 min» из минут, если своя подпись не задана. */
export function formatTime(row: PriceRow, lang: Lang): string {
  if (row.time) return row.time[lang];
  const [hu, mu] = lang === "ru" ? ["ч", "мин"] : ["h", "min"];
  const h = Math.floor(row.minutes / 60);
  const m = row.minutes % 60;
  return `≈ ${[h && `${h} ${hu}`, m && `${m} ${mu}`].filter(Boolean).join(" ")}`;
}

export function formatKm(row: PriceRow, lang: Lang): string {
  const ferry = lang === "ru" ? " + паром" : " + ferry";
  return `≈ ${row.km} ${lang === "ru" ? "км" : "km"}${row.ferry ? ferry : ""}`;
}

/**
 * Цена по правилам языка: «17 000 ₽» и «130 €» по-русски, «₽17,000» и «€130»
 * по-английски — как уже пишут английские страницы. Пробел неразрывный:
 * сумма не должна рваться на строки.
 */
export function formatPrice(price: number | null, currency: Currency, lang: Lang): string {
  if (price === null) return lang === "ru" ? "по запросу" : "on request";
  const sign = currency === "EUR" ? "€" : "₽";
  return lang === "ru"
    ? `${price.toLocaleString("ru-RU")} ${sign}`
    : `${sign}${price.toLocaleString("en-GB")}`;
}

/** Все строки с ценой — для llms.txt и разметки. */
export const pricedRows = priceGroups.flatMap((g) =>
  g.rows.filter((r) => r.price !== null).map((r) => ({ ...r, currency: g.currency }))
);
