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

/**
 * Дата последнего заметного изменения сайта — идёт в `lastmod` карты сайта
 * для главной. Ставим руками, а не `new Date()`: карта, у которой lastmod
 * меняется от каждой пересборки, обесценивается — краулер перестаёт ей верить.
 */
export const siteUpdated = "2026-08-31";

/**
 * Подтверждение владения в панелях вебмастеров. Метатег выводится только если
 * строка не пустая, поэтому пустые значения ничего не ломают.
 *
 * Google подтверждён TXT-записью в DNS, здесь его нет и не нужно.
 * Bing питает ChatGPT Search и Copilot, Яндекс — Алису, поэтому обе панели
 * стоит завести: код из панели вставляется сюда.
 *
 * ⚠️ Удалите значение — панель снимет подтверждение и доступ к данным пропадёт.
 */
export const verification = {
  bing: "", // <meta name="msvalidate.01"> из Bing Webmaster Tools
  yandex: "", // <meta name="yandex-verification"> из Яндекс.Вебмастера
} as const;

/**
 * Google Ads: отслеживание конверсий по клику на телефон и мессенджеры.
 *
 * ⚠️ **Пустой `id` — тега на сайте нет вообще**, ровно как с `verification`
 * выше. Так и задумано: `gtag.js` без настоящего `AW-…` не работает, а
 * placeholder в продакшене — это заявка на «почему не считается» через месяц.
 * Вписали id — включились и базовый тег, и обработчик кликов, больше нигде
 * ничего менять не нужно.
 *
 * `conversion` — имя события из панели Google Ads («Скопируйте фрагмент
 * кода»). Оно должно совпадать с названием действия-конверсии в панели
 * дословно, иначе клики уходят в никуда и это никак не проявляется.
 *
 * ⚠️ **Два условия, без которых включать бессмысленно или нельзя:**
 *
 * 1. `www.googletagmanager.com` и домены ответов обязаны стоять в CSP
 *    (`public/.htaccess`). При `default-src 'self'` браузер блокирует загрузку
 *    молча — ни ошибки на странице, ни записи в логах, только пустой отчёт в
 *    панели. Ровно та же ловушка, что была с Ahrefs, см. раздел 5.1 CLAUDE.md.
 * 2. Google Ads **ставит cookie** (`_gcl_aw`, `_gcl_au`) — в отличие от Ahrefs
 *    и нашего счётчика посещений, из-за которых баннера согласия на сайте нет.
 *    Домен `.ee`, аудитория европейская, значит нужен баннер и Consent Mode v2
 *    (`gtag('consent', 'default', …)` до загрузки тега). Иначе конверсии из
 *    ЕЭЗ приходят неполными, а сбор данных идёт без правового основания.
 */
export const googleAds = {
  id: "", // AW-XXXXXXXXX из Google Ads
  conversion: "ads_conversion___1",
} as const;

/**
 * CID карточки Google Business. Отдельной константой, а не строкой внутри
 * facts: из него собирается и адрес профиля, и `identifier` в разметке.
 */
const googleCid = "17480409347676388080";

/** Цены, телефон и парк — в одном месте: правится один раз, меняется везде. */
export const facts = {
  phone: "+372 56277764",
  phoneHref: "tel:+37256277764",
  whatsapp: "https://wa.me/37256277764",
  telegram: "https://t.me/+37256277764",
  email: "info@estoniatransfer.ee",
  /**
   * Юридические реквизиты. Названы владельцем 23.09.2026.
   *
   * Держим здесь по той же причине, что и цены: цифра, набранная руками в
   * вёрстке, однажды разойдётся с той, что в разметке, и никто не заметит —
   * подвал и JSON-LD правят в разное время и по разным поводам. Видимый текст
   * в подвале и `legalName` с `hasCredential` в SiteSchema.astro берутся
   * отсюда, разойтись им негде.
   *
   * KMKR (VAT) здесь нет: не заявлен. Появится — отдельным полем сюда и в
   * `vatID` разметки, а не в `identifier`: для НДС у schema.org своё свойство.
   */
  legal: {
    name: "Barabara OÜ",

    /** Registrikood в коммерческом регистре. Проверяется на ariregister.rik.ee. */
    registryCode: "17146802",

    /** Тегевусluba на перевозку пассажиров — документ фирмы. */
    transportLicence: "TVL005942",

    /**
     * Teenindaja kaart — карта обслуживающего лица. ТОЛЬКО ДЛЯ ВИДИМОГО
     * ТЕКСТА, в микроразметку не идёт. Разница не формальная:
     *
     * В прозе «водитель работает по карте TK23034» — правда, потому что
     * фраза приписывает карту водителю, кому её и выдали.
     *
     * В JSON-LD поставить её некуда, не соврав. На узле организации
     * (LocalBusiness) это заявление, что карта выдана OÜ, — а её выдают
     * человеку. Единственное честное место — hasCredential на узле Person,
     * но Person у нас «Кирилл» без фамилии: сопоставить не с чем, и как
     * сигнал такой узел пустой, зато ошибка в нём настоящая.
     *
     * Появится полное имя водителя и страница «О сервисе» — тогда заводим
     * Person с @id и переносим карту туда. До тех пор она живёт только в
     * тексте страниц.
     */
    serviceCard: "TK23034",

    /**
     * Орган, выдавший лицензию. Подтверждён владельцем 23.09.2026 по самому
     * документу.
     *
     * Уходит в `recognizedBy` микроразметки, то есть это проверяемое
     * утверждение о государственном органе — неверное там хуже, чем
     * отсутствующее. Учтите при правке, что орган в Эстонии менялся: до
     * 2021 года это был Maanteeamet, и на старых документах стоит он.
     */
    issuer: "Transpordiamet",
  },
  /**
   * Машина одной строкой. Отсюда её берут микроразметка (additionalProperty
   * «Автомобиль» в SiteSchema.astro) и llms.txt — то есть обе машиночитаемые
   * поверхности сразу.
   *
   * Год и «Hybrid» добавлены 23.09.2026, подтверждены владельцем. До этого
   * здесь стояло просто «Toyota Corolla», а «Hybrid» жил отдельно в alt
   * подписей к фотографиям — один автомобиль описывался двумя разными
   * строками, и alt расходился с разметкой.
   *
   * Теперь строка ОДНА на весь сайт, и её больше нигде не набирают руками:
   * 30 упоминаний в routes.ts и routes.en.ts (подписи к фото и первые фразы
   * блоков про машину), подписи в CarGallery.astro и ключи "car.title" ниже
   * собираются из неё шаблонной подстановкой.
   *
   * Меняете машину — правите только эту строку. Проверить, что руками нигде
   * не осталось: `grep -rn "Toyota Corolla" src/` должен находить только
   * комментарии.
   */
  car: "2020 Toyota Corolla Hybrid",
  seats: 4,
  /**
   * Имя в текстах — только имя, без фамилии: «За рулём Кирилл» звучит так,
   * как оно и есть, и именно этим отличается от диспетчерской службы.
   */
  driver: "Кирилл",
  /**
   * Полное имя для разметки и страницы «О сервисе». Названо владельцем
   * 24.09.2026 и разблокировало то, что до этого сделать было нельзя:
   * Person без фамилии сопоставить не с чем, и карта обслуживающего лица
   * висела в воздухе — её некуда было повесить, не соврав.
   *
   * Каноническим взято ЭСТОНСКОЕ написание: оно же стоит в документах, а
   * `hasCredential` рядом заявляет номер карты. Идентификатор и написание
   * имени в нём обязаны совпадать с тем, что можно проверить.
   *
   * `ru` — для русских текстов: по решению владельца от 13.09.2026 латиницы
   * в заголовках русской версии нет, а «Kirill Kotšergin» в H2 была бы
   * именно ей. В разметку русское написание уходит как alternateName.
   */
  driverFull: { et: "Kirill Kotšergin", ru: "Кирилл Кочергин" },
  /**
   * Стаж водителя в годах. Назван владельцем 24.09.2026.
   *
   * Числом, а не строкой «9 лет»: из него собираются и русский, и
   * английский текст, а склонения и множественное число у языков разные.
   *
   * ⚠️ Это НЕ возраст фирмы. Barabara OÜ с кодом 17146802 заметно моложе —
   * коды на 17… выдавали в двадцатых. Не подставляйте это число в
   * foundingDate организации: там оно будет неправдой, а дату регистрации
   * видно в открытом реестре, и расхождение заметят.
   *
   * В микроразметку уходит прозой в description узла Person, а не
   * отдельным свойством: подходящего свойства у schema.org нет, а
   * выдумывать ключ бессмысленно — его никто не читает.
   */
  driverYears: 9,
  /**
   * Способы оплаты. Вынесены сюда 24.09.2026, когда владелец сказал, что
   * карту принимает, — и выяснилось, что «картой нельзя» было написано в
   * восьми местах: в paymentAccepted микроразметки, в FAQ трёх страниц, на
   * «О сервисе» в двух языках и в обоих файлах для моделей.
   *
   * Восемь мест — это восемь шансов, что при следующей смене условий одно
   * забудут. Теперь строка одна, и все восемь собираются из неё.
   *
   * ⚠️ `accepted` уходит в `paymentAccepted` разметки, то есть это
   * машиночитаемое утверждение об условиях сделки. Перестанете принимать
   * карту — правьте здесь первым делом: неверное там не просто неточность,
   * а обещание, которое пассажир прочитает в выдаче и на него рассчитает.
   */
  payment: {
    ru: "наличными водителю, картой или банковским переводом",
    en: "in cash to the driver, by card or by bank transfer",
    /** Для paymentAccepted в schema.org — перечисление через запятую. */
    accepted: { ru: "Наличные, банковская карта, банковский перевод", en: "Cash, credit card, bank transfer" },
  },
  /**
   * Профиль в Google Business (заведён владельцем, подтверждён 13.09.2026).
   *
   * `profile` — канонический адрес карточки, подтверждён владельцем 13.09.2026.
   * Восстановлен из ссылки `review`: ludocid CfA6q8Cv45byEBM декодируется в
   * CID 17480409347676388080. Стоит и в `sameAs`, и под кнопкой «Смотреть
   * отзывы». Взят вместо короткой share.google/VAAG1ZLOuBKLDyJIC, потому что
   * та — цепочка редиректов на страницу поиска, а этот адрес постоянный и
   * ведёт прямо на карточку.
   *
   * `review` — ссылка, открывающая форму НАПИСАНИЯ отзыва, не список.
   * Не подписывайте её «смотреть отзывы»: откроется не то, что обещано.
   *
   * ⚠️ `rating` и `reviews` показываются в подвале как текст и НЕ уходят в
   * микроразметку. Причина в шапке reviews.ts: рейтинг с чужой площадки в
   * своей разметке Google не засчитывает, а за самоприсвоенные звёзды снимает
   * расширенные сниппеты со всего сайта.
   *
   * Обе цифры правит человек, автоматически они не обновятся. Появится
   * четвёрка — «5» здесь станет неправдой. `reviews: null` — значит число
   * неизвестно, и в бейдже выводится одна оценка без «N отзывов».
   */
  google: {
    /**
     * CID карточки отдельным полем — из него собирается `profile`, чтобы номер
     * не пришлось держать в двух местах. В разметку он уходит ещё и как
     * `identifier`: ссылка в `sameAs` заявляет тождество, а PropertyValue
     * отдаёт сам идентификатор машиночитаемо, без разбора URL.
     *
     * ⚠️ Есть второй идентификатор той же карточки — Knowledge Graph MID
     * `/g/11zx7vl1b4`, он приходит из короткой ссылки share.google. В `sameAs`
     * его пока нет: не подтверждено, что это та же карточка, а не второй
     * профиль на тот же бизнес. Подтвердится — добавить и его,
     * `https://www.google.com/search?kgmid=/g/11zx7vl1b4`.
     */
    cid: googleCid,
    profile: `https://maps.google.com/?cid=${googleCid}`,
    review: "https://g.page/r/CfA6q8Cv45byEBM/review",
    rating: 5,
    /**
     * Число отзывов на карточке. Названо владельцем 24.09.2026 — до этого
     * стояло null, и бейдж в подвале показывал одну оценку без числа.
     *
     * Правится руками: автоматически отсюда взять неоткуда, Google не
     * отдаёт карточку роботам (упирается в consent-стену). Появятся новые
     * отзывы — поднимите цифру, иначе она тихо устареет.
     *
     * ⚠️ В микроразметку по-прежнему НЕ идёт: ни rating, ни reviews. Это
     * оценка с чужой площадки, и Google её в своей разметке не засчитывает,
     * а за самоприсвоенные звёзды снимает расширенные сниппеты со всего
     * сайта. Причины подробно — в шапке reviews.ts. Звёзды в выдаче даёт
     * сама карточка Google, и она их уже даёт.
     */
    reviews: 8 as number | null,
  },
  /** Место в очереди на границе — доплата к маршруту Нарва (как на ridego.ee). */
  queueSlot: { price: 50, route: "narva" as const },
  routes: [
    { id: "narva", price: 130, km: 210, hours: "2 ч 30 мин", hoursEn: "2 h 30 min", popular: false },
    { id: "koidula", price: 160, km: 270, hours: "3 ч 5 мин", hoursEn: "3 h 5 min", popular: true },
    { id: "luhamaa", price: 160, km: 280, hours: "3 ч 10 мин", hoursEn: "3 h 10 min", popular: false },
  ],
  /**
   * Из Тарту до границы. Цена подтверждена владельцем 17.08.2026: 80 € за
   * машину до любого из двух переходов — дорога в три-четыре раза короче
   * таллиннской. Тариф один на оба направления, хотя до Лухамаа на 30 км
   * дальше: считать пассажиру две почти одинаковые цены неудобно.
   *
   * Живёт отдельно от routes, а не шестым элементом массива: по routes
   * строится блок «Направления и стоимость» на главной, и он про выезд из
   * Таллинна. Тарту — только на своей странице.
   *
   * ПРОВЕРЬ: расстояния и время даны приблизительно.
   */
  fromTartu: {
    price: 80,
    koidula: { km: 65, hours: "≈ 1 ч", hoursEn: "≈ 1 h" },
    luhamaa: { km: 95, hours: "≈ 1 ч 20 мин", hoursEn: "≈ 1 h 20 min" },
  },
  /**
   * Сквозная дорога Таллинн — Санкт-Петербург одной ценой. Названа
   * владельцем 24.09.2026: 200 € за ВСЮ дорогу — обе машины и пеший переход
   * границы между ними.
   *
   * Отдельным полем, а не элементом routes, по той же причине, что и Тарту:
   * по routes строится блок цен на главной, и он про одну машину из
   * Таллинна. Здесь машины две, и эстонская границу не пересекает.
   *
   * Почему это не сумма 130 € + 6500 ₽, хотя примерно ей и равно: пассажиру
   * не нужно доставать рубли и считать курс на границе. Это одна цена в
   * евро за дорогу целиком — и ровно она уходит в offers страницы.
   * Отдельные цены плеч остаются на своих страницах и в таблице как
   * справка: кому нужно только до Нарвы, тот платит 130 €.
   *
   * ⚠️ Не заявляйте это скидкой: 200 € примерно равны сумме плеч по
   * текущему курсу, а не дешевле их. Выгода тут в одной валюте и одной
   * договорённости, и врать про «дешевле» не нужно — это проверяется
   * калькулятором за минуту.
   */
  tallinnSpb: { price: 200, km: 360, hours: "≈ 5 ч в дороге плюс граница" },
  /**
   * Российская сторона границы. Цены названы владельцем 19.08.2026 и указаны
   * **в рублях** — это отдельная услуга с отдельной валютой, поэтому лежит не
   * в routes, а здесь. По routes строится блок цен на главной, и он про евро.
   *
   * ⚠️ Эстонская машина границу не пересекает: до пункта пропуска довозим мы,
   * дальше по России едет отдельный автомобиль. ПРОВЕРЬ у владельца, кто
   * именно его предоставляет и берётся ли предоплата в рублях, — на страницах
   * это описано обтекаемо и цифрами не подкреплено.
   *
   * ПРОВЕРЬ также расстояния и время: проставлены приблизительно.
   */
  russia: {
    currency: "₽",
    ivangorodSpb: 6500,
    kunichinaPskov: 3000,
    shumilkinoPskov: 3000,
    kunichinaShumilkinoSpb: 17000,
  },
} as const;

export const ui = {
  ru: {
    // 51 знак. Ключ впереди, бренда нет намеренно: его пока никто не ищет, а
    // место в выдаче стоит отдать словам, которые люди вводят сами.
    "meta.title": "Трансфер Таллинн — Нарва, Койдула, Лухамаа от 130 €",
    // 151 знак. Описание переписано 13.09.2026: в выдаче Google подставлял
    // вместо него служебную строку формы («Заявка уходит письмом…»), поэтому
    // здесь теперь направления и цены — то, ради чего на сниппет кликают.
    // Сам по себе текст показ не гарантирует, Google волен переписать сниппет;
    // от служебных строк защищает data-nosnippet в OrderForm и Footer.
    "meta.description": `Индивидуальный трансфер по Эстонии. Направления: Таллинн — Нарва (от ${facts.routes[0].price} €), Койдула (${facts.routes[1].price} €), Лухамаа (${facts.routes[2].price} €). Комфортно, безопасно, от двери до двери.`,

    "nav.routes": "Направления",
    "nav.car": "Автомобиль",
    "nav.how": "Как заказать",
    "nav.order": "Заявка",
    "nav.faq": "Вопросы",

    "hero.eyebrow": "Индивидуальный трансфер · Эстония",
    // H1 главной. Две части — это одна строка с переносом, а не два заголовка:
    // вместе они дают «Трансфер из Таллинна до границы Нарва, Койдула, Лухамаа»,
    // то есть ровно то, что вводят в поиске. Вторая половина выделена цветом,
    // поэтому текст и разбит — правите формулировку, следите, чтобы склейка
    // двух частей читалась как одна фраза.
    "hero.title.1": "Трансфер из Таллинна",
    "hero.title.2": "до границы Нарва, Койдула, Лухамаа",
    "hero.lead":
      "Комфортная поездка без лишнего стресса: забудьте о пересадках, потере времени на автовокзалах и нервотрепке с таксометром — наша цена фиксируется заранее и не растет из-за пробок на дорогах.",
    "hero.cta": "Рассчитать поездку",
    "hero.secondary": "Написать в WhatsApp",
    "perks.title": "Что входит в цену",
    "perks.1": "Стоимость фиксируется до поездки: ни пробки, ни ночной выезд её не меняют",
    "perks.2": "Встреча в аэропорту и круизном порту — водитель ждёт с табличкой",
    "perks.3": "Задержали самолёт — ждём столько, сколько нужно, без доплаты",
    "perks.4": "Детское кресло привезём по запросу, за багаж не доплачиваете",
    "perks.5": "Расчёт наличными, картой или переводом, предоплату не берём",

    "routes.eyebrow": "Цены",
    "routes.title": "Трансфер Нарва, Койдула и Лухамаа: направления и цены",
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
    "routes.km.short": "км",
    "routes.more": "Подробнее",
    "routes.popular": "Часто выбирают",
    "addon.toggle": "Добавить к заявке",
    "addon.added": "Добавлено в заявку",
    "routes.latin":
      "Те же маршруты в латинице, как их пишут в билетах и картах: Tallinn — Narva, Tallinn — Koidula, Tallinn — Luhamaa. Из Тарту — Tartu — Koidula и Tartu — Luhamaa.",

    // Общий каркас посадочных страниц маршрутов. Сами тексты — в src/data/routes.ts
    "bc.home": "Главная",
    "route.badge": "Маршрут",
    "route.wa": "Заказать в WhatsApp",
    "route.order": "Оставить заявку",
    "route.more": "Куда ещё возим",
    "route.sources": "Источники",
    "route.checked": "Цены и факты на этой странице проверены",
    "route.checkedNote":
      "Режим работы переходов и правила пересечения границы меняются — перед поездкой сверяйтесь с politsei.ee.",
    "table.service": "Услуга",
    "table.price": "Цена",
    "table.details": "Подробности",

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
    "why.title": "Чем трансфер отличается от такси и автобуса",
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
    "car.title": `${facts.car}: машина для поездки к границе`,
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

    "fab.label": "Заказать",
    "fab.title": "Заказ трансфера",
    "fab.text": "Выберите удобный способ связи:",
    "fab.wa": "Написать в WhatsApp",
    "fab.tg": "Написать в Telegram",
    "fab.call": "Позвонить",
    "fab.close": "Закрыть",

    "form.from": "Поездка из",
    "form.to": "Едем до",
    "form.date": "Дата поездки",
    "form.pax": "Количество пассажиров",
    "form.name": "Ваше имя",
    "form.phone": "Номер телефона",
    "form.email": "Электронная почта",
    "form.optional": "необязательно",
    "form.queue": "Место в очереди на границе",
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

    "answers.eyebrow": "Ответы коротко",
    "faq.eyebrow": "Частые вопросы",
    "faq.title": "Трансфер до границы: частые вопросы",
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
    "footer.allRoutes": "Все направления и цены",
    "footer.useful": "Полезное",
    "footer.russia": "Из России",
    "footer.rights": "Все права защищены",
    // Баннер согласия. Текст короткий намеренно: длинная юридическая
    // простыня в баннере читается хуже, а подробности — по ссылке, куда
    // закон их и отправляет.
    "consent.title": "Cookie для рекламы",
    "consent.text":
      "Мы используем cookie Google Ads, чтобы понимать, какая реклама приводит заказы. Без вашего согласия они не устанавливаются. Аналитика посещений работает без cookie в любом случае.",
    "consent.more": "Подробнее в политике конфиденциальности",
    "consent.accept": "Принять",
    "consent.decline": "Отклонить",
    "consent.reopen": "Настройки cookie",
    "footer.about": "О сервисе",
    "footer.privacy": "Конфиденциальность",
    // Реквизиты в подвале. Слово «Лицензия» целиком, а не «Лиц.»: строка
    // читается и человеком, и моделью, а сокращение экономит четыре знака
    // ценой понятности.
    "legal.regCode": "Рег. код",
    "legal.licence": "Лицензия на перевозку пассажиров",
    "footer.hits": "Посещений:",
    // Вторая половина пилюли счётчика. Отдельный ключ от form.today
    // («Сегодня» в календаре заявки): там подпись кнопки, здесь — метка
    // числа, и переводы у них могут разойтись.
    "footer.hitsToday": "сегодня",
    "footer.city": "Таллинн, Эстония",

    // Звёзды в карточке aria-hidden, поэтому оценку скринридеру сообщает
    // отдельная строка — без неё бейдж читался бы как «5.0» без контекста.
    "google.stars": "Оценка 5 из 5 на Google",
    "google.text": "Отличные отзывы клиентов",
    "google.cta": "Смотреть отзывы в Google",
    "google.write": "Написать отзыв",

    "common.from": "от",
    "common.perCar": "за автомобиль",
    "lang.label": "Язык",
  },

  en: {
    // было 61 знак — Google обрезал хвост вместе с брендом
    "meta.title": "Transfer Tallinn — Narva, Koidula, Luhamaa from €130",
    "meta.description":
      "Private transfer from Tallinn to the Russian border: Narva €130, Koidula and Luhamaa €160 per car. Airport and cruise port pickup, departures at any hour.",

    "nav.routes": "Routes",
    "nav.car": "Vehicle",
    "nav.how": "How it works",
    "nav.order": "Request",
    "nav.faq": "FAQ",

    "hero.eyebrow": "Private transfer · Estonia",
    "hero.title.1": "Transfer from Tallinn",
    "hero.title.2": "to the border: Narva, Koidula, Luhamaa",
    "hero.lead":
      "Passenger transport from Tallinn to the Narva, Koidula and Luhamaa checkpoints. We pick you up at the door and drive you right to the barrier — no changes, no waiting at a bus station, no meter ticking in traffic.",
    "hero.cta": "Get a price",
    "hero.secondary": "Message on WhatsApp",
    "perks.title": "What the price covers",
    "perks.1": "The fare is fixed before departure: traffic and night trips do not change it",
    "perks.2": "Pickup at the airport and cruise port — the driver waits with a name board",
    "perks.3": "If your flight is delayed we wait as long as needed, at no extra cost",
    "perks.4": "A child seat on request, and no surcharge for luggage",
    "perks.5": "Pay in cash, by card or by bank transfer; no prepayment required",

    "routes.eyebrow": "Prices",
    "routes.title": "Transfer to Narva, Koidula and Luhamaa: routes and fares",
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
    "routes.km.short": "km",
    "routes.more": "Details",
    "routes.popular": "Most chosen",
    "addon.toggle": "Add to the request",
    "addon.added": "Added to the request",
    "routes.latin":
      "The same routes in Cyrillic, the way Russian-speaking passengers search for them: Таллинн — Нарва, Таллинн — Койдула, Таллинн — Лухамаа.",

    "bc.home": "Home",
    "route.badge": "Route",
    "route.wa": "Order on WhatsApp",
    "route.order": "Send a request",
    "route.more": "Where else we drive",
    "route.sources": "Sources",
    "route.checked": "Prices and facts on this page were last checked",
    "route.checkedNote":
      "Crossing hours and border rules change — check politsei.ee before you travel.",
    "table.service": "Service",
    "table.price": "Price",
    "table.details": "Details",

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
    "why.title": "How a transfer differs from a taxi or a bus",
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
    "car.title": `${facts.car}: the car for your border run`,
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

    "fab.label": "Book",
    "fab.title": "Book a transfer",
    "fab.text": "Choose how to reach us:",
    "fab.wa": "Message on WhatsApp",
    "fab.tg": "Message on Telegram",
    "fab.call": "Call",
    "fab.close": "Close",

    "form.from": "From",
    "form.to": "To",
    "form.date": "Travel date",
    "form.pax": "Passengers",
    "form.name": "Your name",
    "form.phone": "Phone number",
    "form.email": "Email",
    "form.optional": "optional",
    "form.queue": "A booked slot in the border queue",
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

    "answers.eyebrow": "Short answers",
    "faq.eyebrow": "FAQ",
    "faq.title": "Border transfer: common questions",
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
    "footer.allRoutes": "All routes and prices",
    "footer.useful": "Useful",
    "footer.russia": "From Russia",
    "footer.rights": "All rights reserved",
    "consent.title": "Advertising cookies",
    "consent.text":
      "We use Google Ads cookies to see which ads bring bookings. They are not set without your consent. Visitor analytics works without cookies either way.",
    "consent.more": "More in the privacy policy",
    "consent.accept": "Accept",
    "consent.decline": "Decline",
    "consent.reopen": "Cookie settings",
    "footer.about": "About us",
    "footer.privacy": "Privacy",
    "legal.regCode": "Reg. code",
    "legal.licence": "Passenger transport licence",
    "footer.hits": "Visits:",
    "footer.hitsToday": "today",
    "footer.city": "Tallinn, Estonia",

    "google.stars": "Rated 5 out of 5 on Google",
    "google.text": "Excellent customer reviews",
    "google.cta": "View reviews on Google",
    "google.write": "Write a review",

    "common.from": "from",
    "common.perCar": "per car",
    "lang.label": "Language",
  },
} as const;

/** Города для формы. value — язык-независимый id, подпись переводится. */
export const cities = {
  tallinn: { ru: "Таллинн", en: "Tallinn" },
  tartu: { ru: "Тарту", en: "Tartu" },
  narva: { ru: "Нарва", en: "Narva" },
  koidula: { ru: "Койдула", en: "Koidula" },
  luhamaa: { ru: "Лухамаа", en: "Luhamaa" },
  // Пярну и Рига — с прайсом /marshruty/ (25.09.2026), по запросу владельца:
  // самые частые направления оттуда, которых форма раньше не знала.
  parnu: { ru: "Пярну", en: "Pärnu" },
  riga: { ru: "Рига", en: "Riga" },
  // Российская сторона: пункты пропуска и города, куда идут поездки оттуда
  ivangorod: { ru: "Ивангород", en: "Ivangorod" },
  kunichina: { ru: "Куничина Гора", en: "Kunichina Gora" },
  shumilkino: { ru: "Шумилкино", en: "Shumilkino" },
  pskov: { ru: "Псков", en: "Pskov" },
  spb: { ru: "Санкт-Петербург", en: "Saint Petersburg" },
} as const;

export type CityId = keyof typeof cities;

// Тарту появился вместе со страницей /transfer-tartu-koidula-luhamaa/: если
// страница обещает выезд из Тарту, форма обязана его принимать.
// ВАЖНО: тот же список продублирован в public/send.php ($allowedCities) —
// добавляете город здесь, добавляйте и там, иначе заявка вернёт 422.
export const fromOrder: CityId[] = [
  "tallinn",
  "tartu",
  "narva",
  "koidula",
  "luhamaa",
  "parnu",
  "riga",
  "ivangorod",
  "kunichina",
  "shumilkino",
  "pskov",
  "spb",
];
export const toOrder: CityId[] = [
  "narva",
  "koidula",
  "luhamaa",
  "tallinn",
  "tartu",
  "parnu",
  "riga",
  "pskov",
  "spb",
  "ivangorod",
  "kunichina",
  "shumilkino",
];

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

/**
 * Склонение слова «отзыв» рядом с числом в бейдже Google.
 *
 * Русское правило нельзя свести к «один или много»: 1 отзыв, 3 отзыва,
 * 5 отзывов, но 11 отзывов и 21 отзыв. Английское — можно, и поэтому общая
 * формула на два языка здесь не годится: по русскому правилу вышло бы
 * «21 review».
 */
export function reviewsWord(lang: Lang, n: number): string {
  if (lang !== "ru") return n === 1 ? "review" : "reviews";
  const ones = n % 10;
  const tens = n % 100;
  if (tens >= 11 && tens <= 14) return "отзывов";
  if (ones === 1) return "отзыв";
  if (ones >= 2 && ones <= 4) return "отзыва";
  return "отзывов";
}

/** Путь с языковым префиксом: ru → /путь, en → /en/путь */
export function localePath(lang: Lang, path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return lang === defaultLang ? clean : `/${lang}${clean}`;
}
