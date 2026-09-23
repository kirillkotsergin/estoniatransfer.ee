/**
 * Английские тексты посадочных страниц.
 *
 * Живут отдельным файлом, а не рядом с русскими в routes.ts: тот файл и так
 * под тысячу строк, а перевод удобнее читать и править целиком. Ключ объекта —
 * slug страницы; routes.ts подмешивает эти блоки в landings как copy.en.
 *
 * Это не подстрочник с русского. Смысл и цифры те же, но формулировки свои:
 * дословный перевод русских оборотов по-английски читается неестественно, а
 * поисковику важны обороты, которыми ищут по-английски — «transfer to the
 * Russian border», «taxi Tallinn Narva», «how to cross the border».
 *
 * Ссылки внутри текста ведут на /en/… — префикс языка добавляется только для
 * полей links[].href (их прогоняет localePath), а внутри HTML его нужно
 * ставить руками.
 */
import { facts } from "../i18n/ui";
import type { RouteCopy, RouteId } from "./routes";

const eur = (id: RouteId) => `€${facts.routes.find((r) => r.id === id)!.price}`;
const queue = `€${facts.queueSlot.price}`;
const tartu = `€${facts.fromTartu.price}`;
/**
 * Запись маршрута из facts целиком — для обратных страниц, у которых нет
 * routeId. Цена, километры и время у них те же, что у поездки из Таллинна, но
 * связывать страницу с facts через routeId нельзя: почему, написано у записи
 * «Нарва — Таллинн» в routes.ts.
 */
const spec = (id: RouteId) => facts.routes.find((r) => r.id === id)!;

export const en: Record<string, RouteCopy> = {
  // ─────────────────────────── Tallinn — Narva ───────────────────────────
  "transfer-tallinn-narva": {
    title: `Transfer Tallinn — Narva: ${eur("narva")} per car | EstoniaTransfer`,
    description:
      "Private transfer from Tallinn to the Narva border crossing: €130 per car, 210 km and about 2 h 30 min. Airport pickup with a name board, round the clock.",
    ogDescription:
      "210 km to the Narva checkpoint, about 2 h 30 min. A fixed price per car, pickup at Tallinn airport, any hour of the day.",
    breadcrumb: "Transfer Tallinn — Narva",
    h1: "Transfer Tallinn — Narva",
    lead:
      "We pick you up at your flat, hotel, the airport or the cruise port and drive you straight to the checkpoint in Narva — 210 kilometres of highway, roughly two and a half hours. No meter: you know the fare before departure, and neither traffic nor the number of passengers changes it.",
    kmNote: "of highway",
    answer: [
      `<strong>In short.</strong> The Tallinn to Narva transfer costs <strong>${eur("narva")}</strong> for the whole car — up to four passengers with luggage. The distance is 210 km and the drive takes about <strong>2 hours 30 minutes</strong>. We leave at any hour, including the middle of the night.`,
      `The fare covers the name-board pickup at Tallinn airport, waiting for your flight, loading the suitcases and a child seat. The only extra is a booked slot in the border queue — ${queue} on top.`,
      "The Narva checkpoint is for pedestrians only and works during the day, so we count the departure time backwards from its opening hours — that way you never arrive at a closed gate. <em>Opening hours change; check them before you travel.</em>",
    ],
    price: {
      eyebrow: "Price",
      title: `Private transfer to the Narva border: what ${eur("narva")} covers`,
      lead:
        "The fare belongs to the car, not to the seat. One passenger or four, two suitcases or five, midday or three in the morning — the sum stays the same.",
      caption: "Tallinn — Narva transfer fares and extras",
      rows: [
        ["Tallinn — Narva", eur("narva"), "the whole car, up to 4 passengers with luggage"],
        ["Narva — Tallinn", eur("narva"), "the return trip at the same price"],
        [
          "A booked slot in the border queue",
          `+${queue}`,
          "we reserve the time in advance so you do not wait for hours",
        ],
        [
          "Airport or cruise port pickup",
          "€0",
          "a name board in the arrivals hall; waiting for the flight is not billed",
        ],
        [
          "Luggage, child seat, night departure",
          "€0",
          "no surcharge for the hour of the day or the number of bags",
        ],
      ],
      note:
        "<strong>Paying.</strong> Cash to the driver or a bank transfer, in euros. No prepayment — the ride first, the settlement after. We confirm the price by message before departure so you have it in writing.",
      extra: [
        {
          title: "Why the price is per car and not per person",
          text: `It is fairer to the passenger. A bus or a train sells you a seat, so a family of three pays three times what one person pays. Here you pay for the road once: ${eur("narva")} is the cost of 210 kilometres, not of the seats taken. For two people it almost always beats a metered taxi, and for four it beats it clearly.`,
        },
      ],
    },
    airport: {
      eyebrow: "Airport and port",
      title: "Transfer from Tallinn airport to Narva",
      lead:
        "You have landed in Tallinn and you need the border — on this route that is the most common story. Lennart Meri airport sits four kilometres from the centre, so the drive to Narva starts right at the terminal.",
      items: [
        {
          title: "Name board in the arrivals hall",
          text: "Leave your flight number when you book: the driver tracks the arrival and waits at the baggage-hall exit. No hunting for a parking spot, no phone calls explaining where you are standing.",
        },
        {
          title: "If your flight is delayed",
          text: "The meeting time moves with the actual landing — the price does not change and the booking is not cancelled. At night there are almost no free cars at the terminal, and few drivers take a two-hundred-kilometre run, which is exactly why this trip is booked in advance.",
        },
        {
          title: "From the port, the stations and your door",
          text: "The same terms if you arrive by cruise ship at the Old Port, by train or by coach: give us the flight number or the ship's name and we will meet you at the exit. We also collect from any address in Tallinn — Lasnamäe, Kristiine, Pirita, the Old Town.",
        },
      ],
      cta: "Book an airport pickup",
      waText: "Hello! I need a transfer from Tallinn airport to Narva. Flight number: ",
    },
    steps: {
      eyebrow: "How the trip works",
      title: "From request to checkpoint",
      items: [
        {
          title: "We agree the time",
          text: "Send the date, the address and the hour that suits you. Flying or arriving by ship — the flight number or the vessel name. You get back a confirmation with the price and the exact departure time.",
        },
        {
          title: "We leave Tallinn",
          text: "Pickup from any district, from a hotel, the airport or the port. We load the suitcases ourselves and charge nothing for them. The driver arrives early rather than «in about fifteen minutes».",
        },
        {
          title: "The road through Rakvere and Jõhvi",
          text: "Two and a half hours of even highway. We can stop for coffee and a stretch on the way — that time is already in the plan and costs nothing extra.",
        },
        {
          title: "Drop-off at the border",
          text: "We stop at the Narva-1 checkpoint, where the pedestrian crossing to Ivangorod begins. You clear the border yourself: anything from half an hour to several hours, depending on the queue.",
        },
      ],
    },
    compare: {
      eyebrow: "Comparison",
      title: "Taxi Tallinn — Narva, bus, train or transfer",
      lead:
        "Honestly: if you travel alone and light, the bus is several times cheaper. People choose a transfer for the time and for being driven to the barrier itself.",
      caption: "Ways to get from Tallinn to Narva: price, time, convenience",
      cols: ["Way", "Price", "Time", "What matters"],
      rows: [
        [
          "EstoniaTransfer private car",
          `${eur("narva")} per car`,
          "≈ 2 h 30 min",
          "door to checkpoint, departure at any hour, price known in advance",
        ],
        [
          "Metered taxi",
          "by the meter, unknown upfront",
          "≈ 2 h 30 min",
          "drivers take long runs reluctantly: the empty way back is in the fare too",
        ],
        [
          "Lux Express coach",
          "from €9 per person",
          "≈ 3 h",
          "the cheapest option, but on a timetable and from bus station to bus station",
        ],
        [
          "Elron train",
          "€13–23 per person",
          "≈ 2 h 50 min",
          "a few departures a day, and a walk from Narva station to the crossing",
        ],
      ],
      note:
        "<strong>When nothing else will do.</strong> An early border crossing: the checkpoint opens at 7:00 and the first coach arrives later. A night landing. Travelling with a child, a pram or four suitcases. And the way back — catching a car at the Narva crossing is close to impossible.",
    },
    car: {
      eyebrow: "The car",
      title: "What you travel in and who drives",
      caption: `${facts.car} — the actual car that will come for you`,
      text: [
        `${facts.car}: four passenger seats, climate control and a boot that swallows two large suitcases plus hand luggage. This is the driver's own car, not a rotating fleet vehicle, so the interior is clean. Winter tyres in winter, working air conditioning in summer — the road to Narva is long enough for both to matter.`,
        "Kirill is at the wheel, and he is the one answering WhatsApp and Telegram. You arrange things directly with the person who will drive you: no dispatcher, nothing lost in retelling. He speaks Russian and gets by in English.",
      ],
    },
    crossing: {
      eyebrow: "The border crossing",
      title: "What to know about the border in Narva",
      items: [
        {
          title: "Narva is crossed on foot only",
          text: 'Cars are not let through here: the crossing is a pedestrian bridge over the Narva river into Ivangorod. So we drive you to the checkpoint and you walk from there. If you need to cross by car, that means <a href="/en/transfer-tallinn-koidula/">Koidula</a> or Luhamaa.',
        },
        {
          title: "Opening hours and the queue",
          text: 'The checkpoint works during the day, from 7:00 to 19:00, and closes for the night. Pedestrians do not book a slot in GoSwift, but at weekends and before public holidays a queue of people builds up — allow spare time. Check the current hours at <a href="https://www.politsei.ee/en" target="_blank" rel="noopener">politsei.ee</a>.',
        },
        {
          title: "If you miss the closing time",
          text: "You will spend the night in Narva and cross in the morning. There are not many hotels by the crossing and they sell out before holidays — book ahead, and take a departure time with a margin.",
        },
        {
          title: "Phone numbers, just in case",
          text: "Narva-1 checkpoint — <strong>+372 333 1600</strong>, the Russian side in Ivangorod — <strong>+7 81375 5-29-78</strong>. The Estonian Police and Border Guard Board — <strong>+372 612 3000</strong>.",
        },
      ],
    },
    faq: {
      eyebrow: "FAQ",
      title: "Transfer Tallinn — Narva: common questions",
      items: [
        {
          q: "How much does the Tallinn — Narva transfer cost?",
          a: `${eur("narva")} for the whole car: the number of passengers, the number of suitcases and the hour of the day do not change it. Nights, early mornings and public holidays cost the same. The only extra is a booked slot in the border queue if you want one — ${queue} on top. Cash or bank transfer, no prepayment.`,
        },
        {
          q: "How long is the drive?",
          a: "About 2 hours 30 minutes — 210 km of highway through Rakvere and Jõhvi. Longer in snow and heavy traffic. If a train or coach is waiting for you on the other side, leave with time in hand: no transport makes the border itself any faster.",
        },
        {
          q: "Do you meet passengers at Tallinn airport?",
          a: "Yes. Send the flight number and the driver will track the arrival and wait in the arrivals hall with a name board. Waiting after landing is not billed and a delayed flight does not change the price. We meet the same way at the cruise port, the railway station and the coach station.",
        },
        {
          q: "Why is this better than a metered taxi?",
          a: "The sum is known before departure and does not grow with traffic, the car is booked for your trip only, and the driver knows from the start that he is going to a border checkpoint. City taxis take intercity runs reluctantly: they return empty, and that mileage ends up in the fare anyway.",
        },
        {
          q: "Do you drive the other way, from the border to Tallinn?",
          a: `Yes, at the same price — ${eur("narva")}, and it has a page of its own: <a href="/en/transfer-narva-tallinn/">Narva — Tallinn</a>. It covers the meeting point after control, free waiting in the queue and paying in roubles. Arrange the return in advance: taxis almost never wait at the Narva checkpoint, especially in the evening.`,
        },
      ],
    },
    links: [
      { label: "Transfer Tallinn — Koidula", note: eur("koidula"), href: "/transfer-tallinn-koidula/" },
      { label: "Transfer Tallinn — Luhamaa", note: eur("luhamaa"), href: "/transfer-tallinn-luhamaa/" },
      { label: "Back: Narva — Tallinn", note: eur("narva"), href: "/transfer-narva-tallinn/" },
      { label: "All routes and prices", href: "/#routes" },
      { label: "The car and the driver", href: "/#car" },
    ],
    cta: {
      title: "Shall we drive to Narva?",
      text: "Send the date, the time and the address — we will confirm the car, the price and the exact departure hour in one message.",
    },
    waText: "Hello! I would like to book a transfer from Tallinn to Narva.",
    schema: {
      name: "Transfer Tallinn — Narva",
      alternateName: [
        "Taxi Tallinn — Narva",
        "Private transfer to the Narva border crossing",
        "Tallinn airport to Narva transfer",
      ],
      serviceType: "Private transfer to a border crossing",
      description:
        "Private transfer from Tallinn to the Narva checkpoint: 210 km, about 2 h 30 min, €130 for the whole car. Pickup at Tallinn airport and the cruise port, available around the clock.",
      areaServed: [
        { type: "City", name: "Tallinn" },
        { type: "City", name: "Narva" },
      ],
    },
  },

  // ─────────────────────────── Narva — Tallinn ───────────────────────────
  // Английская версия обратной страницы (14.09.2026). Русская появилась 13.09,
  // и правило «заголовки только по-русски» — про неё: здесь язык страницы
  // английский, поэтому Narva — Tallinn в заголовках стоит естественно.
  //
  // Текст не перевод русского абзац за абзацем: по-английски эту дорогу ищут
  // как «Narva to Tallinn airport transfer», и страница отвечает на это прямо.
  "transfer-narva-tallinn": {
    title: `Transfer Narva — Tallinn: ${eur("narva")} from the border`,
    description:
      "Private transfer Narva — Tallinn: €130 per car from the border crossing to the city. The driver waits on the Estonian side and waiting in the queue is free.",
    ogDescription:
      "Return transfer from the Narva checkpoint to Tallinn: €130 per car, the driver waits on the Estonian side, drop-off at the airport terminal.",
    breadcrumb: "Narva — Tallinn",
    h1: "Transfer and taxi Narva — Tallinn: the way back from the border",
    badge: `Return route · ${eur("narva")} per car`,
    footer: { label: "Narva — Tallinn", note: eur("narva") },
    stats: [
      { value: eur("narva"), label: "per car" },
      { value: spec("narva").hoursEn, label: "on the road" },
      { value: `${spec("narva").km} km`, label: "border to city" },
    ],
    offers: [{ name: "Transfer Narva — Tallinn", price: String(spec("narva").price) }],
    lead:
      "You have walked across the bridge and you are standing on the Estonian side with your suitcases — that is where our part begins. We collect you at the Narva-1 checkpoint and drive you to Tallinn: 210 kilometres, about two and a half hours, drop-off at the airport terminal, the cruise port, a hotel or any address. How long the queue kept you makes no difference to the price.",
    notice: {
      title: "The crossing is closed at night",
      text: "Narva-1 works in daytime and shuts completely for the night, so you cannot walk out to a waiting car at two in the morning — the crossing has to wait until the next day. Plan to leave the queue well before closing time. <em>Opening hours change; check them before you travel.</em>",
    },
    answer: [
      `<strong>In short.</strong> Narva to Tallinn costs <strong>${eur("narva")}</strong> for the whole car — up to four passengers with luggage. It is 210 km from the border to Tallinn, about <strong>2 hours 30 minutes</strong>. The car waits on the Estonian side of the checkpoint, not at a bus station across town.`,
      "<strong>Waiting is not billed.</strong> Nobody can say in advance how long the queue will take, so we do not ask for an exact hour: give us an approximate one and the driver will wait. <strong>No prepayment</strong>, and you can settle <strong>in euros or in roubles</strong>, in cash, by card or by transfer.",
      'On the signs the Estonian checkpoint is marked Narva-1; the Russian side across the river is Ivangorod. Need the other direction, from Tallinn to the border? That is the <a href="/en/transfer-tallinn-narva/">Tallinn — Narva</a> page, at the same price.',
    ],
    price: {
      eyebrow: "Price",
      title: "What the Narva — Tallinn taxi costs",
      lead:
        "The fare is the same as towards the border: the way back is not a separate service and does not cost more. You pay for the car rather than for a seat, so a family of four pays what one passenger pays.",
      caption: "Narva — Tallinn transfer fares and extras",
      rows: [
        ["Narva — Tallinn", eur("narva"), "the whole car, up to 4 passengers with luggage"],
        [
          "Waiting at the checkpoint",
          "€0",
          "the queue cannot be predicted, so waiting time is not billed",
        ],
        [
          "Drop-off at Tallinn airport or the port",
          "€0",
          "we take you to the terminal itself, not to the nearest stop",
        ],
        [
          "Luggage, child seat, late departure",
          "€0",
          "no surcharge for suitcases or for the evening",
        ],
      ],
      note:
        "<strong>Paying.</strong> Cash to the driver — <strong>in euros or in roubles</strong> — by card or by bank transfer. On the way back that matters more than it sounds: Russian bank cards do not work in Estonia and there may be no exchange office at the crossing. No prepayment: the ride first, the settlement after.",
      extra: [
        {
          title: "Why the return trip is booked in advance",
          text: "There is no taxi rank at the Narva checkpoint waiting for passengers. During the day you can sometimes arrange something on the spot; in the evening almost never, because local drivers do not drive out to a closing crossing. Add suitcases, a child and a Russian SIM card that may not work in Estonia, and there is simply nothing to call a car with. A transfer booked in advance removes the whole chain: the driver is already there and knows who he is waiting for.",
        },
        {
          title: "If you are going further than Tallinn",
          text: `From Narva we also drive to <a href="/en/transfer-tartu-koidula-luhamaa/">Tartu</a>, to the port for a particular ferry and to Riga — those are quoted separately, so send the route and the time. The way back to the border is still ${eur("narva")}: if you return in a few days, both trips can be booked in one message.`,
        },
      ],
    },
    airport: {
      eyebrow: "Airport and port",
      title: "From Narva to Tallinn airport and the port",
      lead:
        "The most common reason for this trip is a flight or a ferry out of Tallinn. What matters here is not the price but counting backwards: from check-in, through two and a half hours of driving, to the moment you walk out of the checkpoint.",
      items: [
        {
          title: "A flight from Lennart Meri airport",
          text: "Give us the flight number and we will work out when you need to be out of the border queue to make check-in comfortably. On tickets and departure boards the airport is Tallinn Airport, code TLL; it sits four kilometres from the centre, so the drive ends at the terminal door. If the crossing dragged on and the margin is gone, the driver tells you on the way rather than on arrival.",
        },
        {
          title: "Ferries to Helsinki and Stockholm",
          text: "We drop you at the right terminal in the Old Port — ferries and cruise berths have different entrances, so tell us the vessel or the operator in advance. Allow the same margin as for a flight: time at the border goes unpredictably and the ferry does not wait.",
        },
        {
          title: "Trains, coaches and a night in town",
          text: "We also drive to the Baltic station, the coach station or a hotel, if you have a night in Tallinn between the border and your flight. Name the address when you book: there is no district surcharge — Lasnamäe and Pirita cost what the Old Town costs.",
        },
      ],
      cta: "Book a transfer to the airport",
      waText: "Hello! I need a transfer from Narva to Tallinn airport. Flight number: ",
    },
    steps: {
      eyebrow: "How the trip works",
      title: "How the way back from Narva works",
      items: [
        {
          title: "Tell us the date and roughly when you expect to be out",
          text: "An exact hour is not needed — «in the morning» or «after lunch» is enough. If a flight or a ferry follows, give us its departure time and we will count backwards. You get a confirmation with the price, the car's registration and the driver's phone number: save it <strong>before</strong> you cross, because reception on the other side can disappear.",
        },
        {
          title: "The driver waits on the Estonian side",
          text: "The car stands at the Narva-1 checkpoint, on the side you come out on after control. You will not have to search the car park: the driver meets you at the exit. If the queue takes longer than you expected, he waits — that changes neither the price nor the booking.",
        },
        {
          title: "The road through Jõhvi and Rakvere",
          text: "Two hundred and ten kilometres of even highway, about two and a half hours. We can stop for coffee and a stretch on the way — after hours on your feet in a queue that is usually worth more than twenty minutes saved, and there is nothing extra to pay for it.",
        },
        {
          title: "Drop-off wherever you need",
          text: "An airport terminal, a berth in the port, a station, a hotel or your front door — we drive to the address, not to the nearest main street. We unload the suitcases ourselves; you settle after the ride, in cash in euros or roubles, or by transfer.",
        },
      ],
    },
    compare: {
      eyebrow: "Comparison",
      title: "Narva — Tallinn: transfer, train or coach",
      lead:
        "An honest comparison: travelling alone with a backpack and no evening flight, the train and the coach are several times cheaper. The difference is where they leave from and whose timetable they keep — and from the border you first have to reach them.",
      caption: "Ways to get from Narva to Tallinn: price, time, convenience",
      cols: ["Way", "Price", "Time", "What matters"],
      rows: [
        [
          "EstoniaTransfer private car",
          `${eur("narva")} per car`,
          "≈ 2 h 30 min",
          "the driver waits at the checkpoint, drop-off at the terminal or your address",
        ],
        [
          "Elron train",
          "€13–23 per person",
          "≈ 2 h 50 min",
          "the station is not far from the crossing, but there are few departures and the last one leaves long before night",
        ],
        [
          "Lux Express coach",
          "from €9 per person",
          "≈ 3 h",
          "the cheapest way: bus station to bus station, with a walk to it carrying your luggage",
        ],
        [
          "Taxi off the street",
          "by the meter, unknown upfront",
          "≈ 2 h 30 min",
          "cars rarely wait at the crossing, and in the evening there are none at all",
        ],
      ],
      note:
        "<strong>When there is barely a choice.</strong> An evening crossing, once the timetable is over. A flight or a ferry out of Tallinn the same day. A child, a pram or four suitcases between two people. And the drive straight after the queue, when working out connections is the last thing you want.",
    },
    car: {
      eyebrow: "The car",
      title: "The car waiting for you at the border",
      caption: `${facts.car} — the actual car that will come for you`,
      text: [
        `${facts.car}: four passenger seats, two large suitcases plus hand luggage in the boot, working climate control. After a few hours in a queue that is more than a formality — the cabin is warm in winter and cool in summer, and you can finally sit down. In winter the car is on winter tyres: the road from Narva runs across open country where the snow drifts.`,
        "Kirill is at the wheel — the same person who answers WhatsApp and Telegram, and the one who will actually arrive. There is no dispatcher in between: you arrange everything with the driver himself. He speaks Russian, gets by in English, knows the road to the crossing and takes it for granted that the hour you clear the queue is an estimate.",
      ],
    },
    crossing: {
      eyebrow: "The border crossing",
      title: "Where you are met in Narva",
      items: [
        {
          title: "The meeting point is the Estonian side of Narva-1",
          text: "The Narva crossing is for pedestrians: from Ivangorod you walk over the bridge across the Narva river and come out at the Narva-1 checkpoint, already in Estonia. That is where you are met — at the exit after control. The registration number and the driver's phone arrive in the confirmation beforehand, so neither of you has to make roaming calls.",
        },
        {
          title: "If the queue drags on",
          text: "We wait. It is built into the service: a passenger does not control the speed of a border queue, and billing for it would be odd. Message us from the other side if you can; if there is no signal, never mind — the driver is there anyway.",
        },
        {
          title: "If you do not make it before closing",
          text: "The crossing shuts for the night and you stay on the Russian side until morning. Write as soon as that becomes clear and we will move the trip. We hold none of your money, so moving it costs nothing.",
        },
        {
          title: "Phone numbers, just in case",
          text: "Narva-1 checkpoint — <strong>+372 333 1600</strong>, the Russian side in Ivangorod — <strong>+7 81375 5-29-78</strong>. The Estonian Police and Border Guard Board — <strong>+372 612 3000</strong>.",
        },
      ],
    },
    /**
     * ⚠️ Числовых лимитов на ввоз в Эстонию здесь нет намеренно — как и в
     * русской версии: они различаются по товарам и меняются, а ошибка в цифре
     * стоит пассажиру изъятого багажа. Вместо чисел — ссылка на emta.ee.
     */
    blocks: [
      {
        eyebrow: "Entering Estonia",
        title: "What to allow for when entering Estonia through Narva",
        lead:
          "As of September 2026. Rules on this direction change several times a year — check politsei.ee and the customs service before you travel; links at the end of the section.",
        layout: "accordion",
        headings: true,
        place: "bottom",
        items: [
          {
            title: "Phones and money right after the border",
            text: "The commonest problem on the way back is not customs but being unable to call or pay.<br><br>• A Russian SIM card may not work in Estonia at all: most operators have roaming switched off;<br>• cards issued by Russian banks are not accepted here, in taxis or at ticket desks;<br>• there may be no exchange office or cash machine at the checkpoint itself;<br>• so save the driver's number and the car's registration <strong>before</strong> you cross;<br>• <strong>you can pay us in roubles</strong> — there is no need to change money for the transfer.",
          },
          {
            title: "What you may bring into Estonia",
            text: 'Imports from Russia are restricted by both customs and sanctions rules. The limits depend on the goods and they change, so there are deliberately no figures here: check them at <a href="https://www.emta.ee/en" target="_blank" rel="noopener nofollow">emta.ee</a> before you travel.<br><br>• The officer at the border always has the final say;<br>• keep receipts for expensive items to hand, not at the bottom of a suitcase;<br>• prescription medicines with controlled substances need the prescription and a translation;<br>• we drive you to Tallinn, but the contents of your luggage are your responsibility, and we do not advise on customs.',
          },
          {
            title: "The best time to cross",
            text: "Morning beats evening almost every time.<br><br>• At opening the queue is at its shortest and your margin before a flight survives;<br>• it grows towards evening, and after closing you cannot cross at all — that means a night on the Russian side;<br>• at weekends and before public holidays the wait is longer at any hour;<br>• if a plane or a ferry is waiting in Tallinn, allow at least half a day: no transport makes the border itself faster.",
          },
        ],
        note:
          'Worth checking before you set off: <a href="https://www.politsei.ee/en" target="_blank" rel="noopener nofollow">politsei.ee</a> for opening hours and crossing rules, <a href="https://www.emta.ee/en" target="_blank" rel="noopener nofollow">emta.ee</a> for what you may bring into Estonia.',
      },
    ],
    faq: {
      eyebrow: "FAQ",
      title: "Transfer Narva — Tallinn: common questions",
      items: [
        {
          q: "How much does the Narva — Tallinn transfer cost?",
          a: `${eur("narva")} for the whole car — the same as towards the border. The number of passengers, the number of suitcases and the hour of the day do not change it, and waiting at the checkpoint is not billed. Cash or bank transfer, no prepayment.`,
        },
        {
          q: "How long is the drive from the border in Narva to Tallinn?",
          a: "About 2 hours 30 minutes — 210 km of highway through Jõhvi and Rakvere. Longer in snow and heavy traffic. Clearing the border is not included in that: the queue takes anything from half an hour to several hours and cannot be predicted.",
        },
        {
          q: "Where exactly will the car be waiting?",
          a: "On the Estonian side of the Narva-1 checkpoint, at the exit after control. The registration number and the driver's phone come in the confirmation beforehand — save them before you cross, because reception on the other side may not work.",
        },
        {
          q: "What if I come out later than planned?",
          a: "The driver waits and there is no surcharge for it — which is why we do not need an exact hour. If you fail to cross before closing altogether, message us and we will move the trip to another day at no cost.",
        },
        {
          q: "Can I pay in roubles?",
          a: "Yes. We take both euros and roubles, in cash, by card or by transfer. There is no need to hunt for an exchange office after the border — there may not be one at the crossing, and Russian bank cards do not work in Estonia. We take no prepayment in any currency.",
        },
        {
          q: "Will you take me straight to Tallinn airport?",
          a: "Yes, to the right terminal and with no surcharge for the drop-off. Give us the flight number when you book and we will work out when you need to be out of the queue to make check-in. We also drive to the cruise port, the Baltic station and the coach station.",
        },
        {
          q: "Can I book both directions at once?",
          a: `Yes, and it is the easiest way: both trips at ${eur("narva")}, booked in one message. The drive from Tallinn to the border is described on the <a href="/en/transfer-tallinn-narva/">Tallinn — Narva</a> page, together with the queue slot you can book for leaving Estonia.`,
        },
      ],
    },
    links: [
      { label: "Transfer Tallinn — Narva", note: eur("narva"), href: "/transfer-tallinn-narva/" },
      {
        label: "Back from Koidula: Koidula — Tallinn",
        note: eur("koidula"),
        href: "/transfer-koidula-tallinn/",
      },
      {
        label: "Back from Luhamaa: Luhamaa — Tallinn",
        note: eur("luhamaa"),
        href: "/transfer-luhamaa-tallinn/",
      },
      { label: "How to reach the border: every option", href: "/kak-dobratsya-do-granicy/" },
      { label: "All routes and prices", href: "/#routes" },
    ],
    cta: {
      title: "Book a transfer from the border to Tallinn",
      text: "Send the date and roughly when you expect to clear the checkpoint — we will confirm the car, the price and the driver's number in one message. No prepayment; we wait on the Estonian side.",
    },
    waText: "Hello! I need a transfer from the border in Narva to Tallinn.",
    schema: {
      name: "Transfer Narva — Tallinn",
      alternateName: [
        "Taxi Narva — Tallinn",
        "Narva to Tallinn airport transfer",
        "Private transfer from the Narva border crossing",
        "Taxi from the Narva checkpoint to Tallinn",
      ],
      serviceType: "Private transfer from a border crossing",
      description:
        "Private transfer from the Narva checkpoint to Tallinn: 210 km, about 2 h 30 min, €130 for the whole car. The driver waits on the Estonian side of the crossing; drop-off at the airport terminal, the port or any address.",
      areaServed: [
        { type: "City", name: "Narva" },
        { type: "City", name: "Tallinn" },
      ],
    },
  },

  // ────────────────────────── Tallinn — Koidula ──────────────────────────
  "transfer-tallinn-koidula": {
    title: `Transfer Tallinn — Koidula, ${eur("koidula")} | EstoniaTransfer`,
    description:
      "Transfer and taxi Tallinn — Koidula: €160 for the whole car, 270 km via Tartu, about 3 hours on the road. Pickup from your address, the airport or the port.",
    ogDescription:
      "270 km to the Koidula border crossing, about 3 hours. A fixed price per car, pickup from any address in Tallinn.",
    breadcrumb: "Transfer Tallinn — Koidula",
    h1: "Transfer Tallinn — Koidula",
    lead:
      "Koidula is a road checkpoint in south-east Estonia, opposite Kunichina Gora on the Russian side. From Tallinn it is 270 kilometres and about three hours through Tartu. We collect you from an address, the airport or the port and bring you to the gates themselves.",
    kmNote: "via Tartu",
    answer: [
      `<strong>In short.</strong> The Tallinn to Koidula transfer costs <strong>${eur("koidula")}</strong> for the whole car — up to four passengers with luggage. The drive takes about <strong>3 hours 5 minutes</strong>, 270 km through Tartu.`,
      "Unlike pedestrian-only Narva, Koidula is a road crossing: you cross without leaving the car. The exit queue is booked in the GoSwift system and the checkpoint works during the day only. <em>Hours and rules change — check them before you travel.</em>",
      `Already in Tartu? The road from there is half as long and cheaper — <a href="/en/transfer-tartu-koidula-luhamaa/">${tartu} instead of ${eur("koidula")}</a>.`,
    ],
    price: {
      eyebrow: "Price",
      title: `What ${eur("koidula")} covers`,
      lead:
        "We charge for the car, not for the person: however many of you travel, you pay once. Neither a night departure nor traffic on the way out of Tallinn changes the fare.",
      caption: "Fares for the transfer to the Koidula border crossing",
      rows: [
        ["Tallinn — Koidula", eur("koidula"), "the whole car, up to 4 passengers with luggage"],
        ["Koidula — Tallinn", eur("koidula"), "the return trip at the same price"],
        [
          "Airport or cruise port pickup",
          "€0",
          "a name board in the arrivals hall; waiting for the flight is not billed",
        ],
        [
          "Luggage, child seat, night departure",
          "€0",
          "no surcharge for bags, the seat or the hour of the day",
        ],
        ["From Tartu to the crossing", tartu, "≈ 65 km and about an hour, a separate route"],
      ],
      note:
        "<strong>Paying.</strong> Cash to the driver or a bank transfer, in euros. No prepayment: the road first, the settlement after. The confirmation with the price arrives by message before departure.",
      extra: [
        {
          title: "Why Koidula costs more than Narva",
          text: `The road is sixty kilometres longer and takes almost an hour more — hence ${eur("koidula")} against <a href="/en/transfer-tallinn-narva/">${eur("narva")} to Narva</a>. In return you cross by car rather than on foot, which with suitcases is a different experience altogether.`,
        },
      ],
    },
    steps: {
      eyebrow: "How the trip works",
      title: "Three hours to the south-eastern border",
      items: [
        {
          title: "We agree the departure time",
          text: "Send the date and the hour you need to be at the border. The crossing works in daytime only, so we count the departure from Tallinn backwards from that, leaving room for the drive and for the control.",
        },
        {
          title: "Pickup in Tallinn",
          text: "From a flat, a hotel, the airport or the cruise port. We load the luggage ourselves, charge nothing for bags and bring a child seat on request.",
        },
        {
          title: "The road through Tartu",
          text: "First the Tallinn — Tartu highway, then towards Võru and Setomaa. The way is longer than to Narva, so we stop halfway for coffee and a stretch — that time is already allowed for.",
        },
        {
          title: "Drop-off at the checkpoint",
          text: "We bring you to the Koidula gates. You clear the control yourself; if you need a car waiting on the Russian side, say so in advance and we will help line it up.",
        },
      ],
    },
    compare: {
      eyebrow: "Comparison",
      title: "Taxi to Koidula, the Ecolines coach or a transfer",
      lead:
        "Koidula has a quirk of its own: almost no scheduled transport goes to the checkpoint itself. The coach passes by on its way to Pskov, and the train drops you two kilometres from the border — the rest is on foot with your bags.",
      caption: "Ways to get from Tallinn to the Koidula border crossing",
      cols: ["Way", "Price", "Time", "What matters"],
      rows: [
        [
          "EstoniaTransfer private car",
          `${eur("koidula")} per car`,
          "≈ 3 h 5 min",
          "door to the gates of the crossing, departure at the hour that suits you",
        ],
        [
          "Ecolines coach Tallinn — Pskov",
          "see the booking system",
          "≈ 7 h",
          "334 km, passes through Koidula, but all passengers clear control together",
        ],
        [
          "Elron train with a change",
          "Elron fares",
          "Tallinn — Tartu plus line R46",
          "a couple of trains a day on that stretch, then about 2 km from the station",
        ],
        [
          "Your own car",
          "fuel",
          "≈ 3 h",
          "needs a GoSwift queue booking; weekend slots go early",
        ],
      ],
      note:
        "<strong>When a transfer earns its keep.</strong> If the queue is already booked for a specific hour, a car adapts to it and a coach or train does not. And the last stretch through Põlva and Setomaa runs on local roads where scheduled transport simply does not go.",
    },
    car: {
      eyebrow: "The car",
      title: "What you travel in",
      caption: `${facts.car} — the boot takes two large suitcases`,
      text: [
        `${facts.car}: four passenger seats, climate control, a boot for two large suitcases and hand luggage. Koidula is nearly an hour further than Narva, so winter tyres in winter and working air conditioning in summer are not a formality here.`,
        "Kirill is at the wheel and he answers WhatsApp and Telegram himself: you deal with the driver directly, without a dispatcher. He speaks Russian and gets by in English. A stop or a drop-off in Tartu is possible on the way — mention it in advance.",
      ],
    },
    /**
     * The English page had no `blocks` at all — the Russian one carries three
     * (customs, visa, onward travel) that were never translated. This adds
     * the array with the credentials block only; the other three remain a
     * gap worth closing separately.
     *
     * Wording is written for this page rather than copied from the guide:
     * 270 km and a booked queue slot make a different argument for checking
     * a licence than a comparison article does. The same paragraph on eight
     * pages reads as template filler, which is what CLAUDE.md warns about.
     */
    blocks: [
      {
        eyebrow: "The operator",
        title: "Who runs the service",
        lead:
          "Koidula is 270 kilometres away and needs a booked exit slot — a journey where you depend on the driver and the car for several hours. So the numbers below are worth checking, and not only ours: carrying passengers for payment is a licensed activity in Estonia, the numbers are public, and an operator who cannot produce them is working outside the law, with no insurance covering your trip.",
        layout: "cards",
        place: "bottom",
        items: [
          {
            title: "Legal entity",
            specs: [
              ["Name", facts.legal.name],
              ["Registry code", facts.legal.registryCode],
            ],
            text: "Entered in the Estonian Commercial Register; the code can be checked at ariregister.rik.ee.",
          },
          {
            title: "Passenger transport licence",
            specs: [["Number", facts.legal.transportLicence]],
            text: "Issued to the company by the Estonian Transport Administration (Transpordiamet).",
          },
          {
            title: "The driver",
            specs: [["Service card", facts.legal.serviceCard]],
            text: `The same person every time, speaking English and Russian. The car is a ${facts.car} with four passenger seats.`,
          },
        ],
      },
    ],
    crossing: {
      eyebrow: "The border crossing",
      title: "What to know about Koidula",
      items: [
        {
          title: "The crossing works in daytime only",
          text: "Koidula is open from 7:00 to 19:00 and closes completely for the night. Plan to arrive with time to spare: a queue builds up at the barrier towards the evening and the last cars may not make it through.",
        },
        {
          title: "The queue is booked in advance",
          text: 'Leaving Estonia by car means booking a slot in the GoSwift system — <a href="https://www.eestipiir.ee/" target="_blank" rel="noopener">eestipiir.ee</a>. At weekends there is almost nothing left, so take the time early. We cannot make the booking for you.',
        },
        {
          title: "On foot or by car",
          text: 'Koidula is a road crossing, and that is its main difference from <a href="/en/transfer-tallinn-narva/">Narva</a>. If you plan to walk across, check the procedure beforehand: the rules here have changed more than once and differ between crossings.',
        },
        {
          title: "Phone numbers, just in case",
          text: 'Koidula checkpoint — <strong>+372 786 1800</strong>, the Russian side at Kunichina Gora — <strong>+7 811 489-34-21</strong>. The Police and Border Guard Board — <strong>+372 612 3000</strong>, hours and rules at <a href="https://www.politsei.ee/en" target="_blank" rel="noopener">politsei.ee</a>.',
        },
      ],
    },
    faq: {
      eyebrow: "FAQ",
      title: "Transfer Tallinn — Koidula: common questions",
      items: [
        {
          q: "How much does the Tallinn — Koidula transfer cost?",
          a: `${eur("koidula")} for the whole car. The sum is the same for one passenger and for four, by night as by day. Luggage, a child seat and the name-board pickup are already included, and we take no prepayment.`,
        },
        {
          q: "How long is the drive to Koidula?",
          a: "About 3 hours 5 minutes, 270 km through Tartu. Longer in winter and in heavy traffic, which is why we leave with a margin when you need the crossing at opening time.",
        },
        {
          q: "Why is Koidula more expensive than Narva?",
          a: `The road is sixty kilometres longer and takes almost an hour more — hence ${eur("koidula")} against ${eur("narva")} to Narva. In return, Koidula is crossed by car rather than on foot.`,
        },
        {
          q: "Do I need to book a slot in GoSwift?",
          a: "If you cross the border by car, yes — the time is taken in advance in the GoSwift system, and weekend slots go quickly. We cannot book it for you: that is done yourself at eestipiir.ee.",
        },
        {
          q: "Can we stop in Tartu on the way?",
          a: `The route runs through Tartu, so a stop or a drop-off there is entirely possible — tell us in advance and we will work it out. And if you start in Tartu, there is a separate transfer to Koidula for ${tartu}, about an hour on the road.`,
        },
        {
          q: "Do you drive the other way, from the border to Tallinn?",
          a: `Yes, at the same price — ${eur("koidula")}, and it has a page of its own: <a href="/en/transfer-koidula-tallinn/">Koidula — Tallinn</a>. Arrange it in advance: there is no taxi rank at the crossing and no scheduled transport leaves it.`,
        },
      ],
    },
    links: [
      { label: "Transfer Tallinn — Narva", note: eur("narva"), href: "/transfer-tallinn-narva/" },
      { label: "Transfer Tallinn — Luhamaa", note: eur("luhamaa"), href: "/transfer-tallinn-luhamaa/" },
      { label: "Back: Koidula — Tallinn", note: eur("koidula"), href: "/transfer-koidula-tallinn/" },
      { label: "From Tartu to the border", note: tartu, href: "/transfer-tartu-koidula-luhamaa/" },
      { label: "All routes and prices", href: "/#routes" },
    ],
    cta: {
      title: "Shall we drive to Koidula?",
      text: "Send the date and the hour you need to be at the border — we will confirm the car and the price in one message.",
    },
    waText: "Hello! I would like to book a transfer from Tallinn to Koidula.",
    schema: {
      name: "Transfer Tallinn — Koidula",
      alternateName: [
        "Taxi Koidula",
        "Taxi Tallinn — Koidula",
        "Transfer Tallinn — Kunichina Gora",
      ],
      serviceType: "Private transfer to a border crossing",
      description:
        "Private transfer from Tallinn to the Koidula border crossing: 270 km via Tartu, about 3 h 5 min, €160 for the whole car. Pickup from any address in Tallinn.",
      areaServed: [
        { type: "City", name: "Tallinn" },
        { type: "Place", name: "Koidula" },
      ],
    },
  },

  // ─────────────────────────── Koidula — Tallinn ───────────────────────────
  // Английская версия второй обратной страницы (14.09.2026). Своя фактура —
  // станция в двух километрах от перехода, на которую рассчитывают те, кто
  // прочитал про неё в интернете; страница отвечает на это прямо.
  "transfer-koidula-tallinn": {
    title: `Transfer Koidula — Tallinn: ${eur("koidula")} from the border`,
    description:
      "Private transfer Koidula — Tallinn: €160 per car from the border crossing. The driver waits on the Estonian side and waiting in the queue is free.",
    ogDescription:
      "Return transfer from the Koidula checkpoint to Tallinn: €160 per car, 270 km via Tartu, the driver waits on the Estonian side.",
    breadcrumb: "Koidula — Tallinn",
    h1: "Transfer and taxi Koidula — Tallinn: the way back from the border",
    badge: `Return route · ${eur("koidula")} per car`,
    footer: { label: "Koidula — Tallinn", note: eur("koidula") },
    stats: [
      { value: eur("koidula"), label: "per car" },
      { value: spec("koidula").hoursEn, label: "on the road" },
      { value: `${spec("koidula").km} km`, label: "border to city" },
    ],
    offers: [{ name: "Transfer Koidula — Tallinn", price: String(spec("koidula").price) }],
    lead:
      "Control is behind you and the barrier is up — that is where our part begins. We collect you on the Estonian side of Koidula and drive you to Tallinn: 270 kilometres via Tartu, about three hours, drop-off at the airport terminal, the port, a hotel or any address. There is no town and no taxi rank around the crossing, which is why the car back from here is booked in advance rather than found on the spot.",
    notice: {
      title: "No scheduled transport leaves the crossing",
      // ПРОВЕРЬ: пара поездов в день и 2 км до станции — те же данные, что в
      // таблице сравнения на странице «Tallinn — Koidula».
      text: "Not a single bus leaves Koidula itself. The railway station is two kilometres from the checkpoint, but there are only a couple of trains a day on the line, and with suitcases that route looks easier on a map than on the ground. <em>Timetables and opening hours change — check them before you travel.</em>",
    },
    answer: [
      `<strong>In short.</strong> Koidula to Tallinn costs <strong>${eur("koidula")}</strong> for the whole car — up to four passengers with luggage. It is 270 km via Tartu, about <strong>3 hours 5 minutes</strong>. The car waits on the Estonian side of the checkpoint, at the exit from its grounds.`,
      "<strong>Waiting is not billed.</strong> Nobody can say how long the queue on the Russian side will hold you, so we do not need an exact hour: give us an approximate one and the driver will wait. <strong>No prepayment</strong>, and you can settle <strong>in euros or in roubles</strong>, in cash, by card or by transfer.",
      'The Russian side of this crossing is called Kunichina Gora; the Estonian side is Koidula. Need the other direction, from Tallinn to the border? That is the <a href="/en/transfer-tallinn-koidula/">Tallinn — Koidula</a> page, at the same price.',
    ],
    price: {
      eyebrow: "Price",
      title: "What the Koidula — Tallinn taxi costs",
      lead:
        "The fare is the same as towards the border: the way back is not a separate service. You pay for the car rather than for a seat, so two, three or four passengers cost the same, and luggage does not change the sum.",
      caption: "Koidula — Tallinn transfer fares and extras",
      rows: [
        ["Koidula — Tallinn", eur("koidula"), "the whole car, up to 4 passengers with luggage"],
        [
          "Waiting at the checkpoint",
          "€0",
          "the border queue cannot be predicted, so waiting time is not billed",
        ],
        [
          "Drop-off at Tallinn airport or the port",
          "€0",
          "we take you to the terminal itself, not to the nearest stop",
        ],
        ["Koidula — Tartu", tartu, "if Tallinn is not where you need: ≈ 65 km, about an hour"],
        [
          "Luggage, child seat, late departure",
          "€0",
          "no surcharge for suitcases or for the evening",
        ],
      ],
      note:
        "<strong>Paying.</strong> Cash to the driver — <strong>in euros or in roubles</strong> — by card or by bank transfer. There is no exchange office and no cash machine at Koidula, and Russian bank cards are not accepted in Estonia, so roubles help here more often than it sounds. No prepayment: the ride first, the settlement after.",
      extra: [
        {
          title: "Why you cannot simply hail a car at Koidula",
          text: "The crossing sits in Setomaa, away from the main roads: 65 kilometres to Tartu, 270 to Tallinn, and Võru as the nearest town. There is no taxi rank at the checkpoint and no cars waiting — there are simply not that many local drivers. There is nobody to call through an app, and a Russian SIM card may not work in Estonia at all. A transfer booked in advance removes the whole chain: the driver is already there and knows who he is waiting for.",
        },
        {
          title: "If Tallinn is not where you are going",
          text: `From Koidula we also drive to <a href="/en/transfer-tartu-koidula-luhamaa/">Tartu</a> for ${tartu}, and to Pärnu, Riga or the airport for a particular flight — those are quoted separately, so send the route and the time. The way back to the crossing is still ${eur("koidula")}: if you return in a few days, both trips can be booked in one message.`,
        },
      ],
    },
    airport: {
      eyebrow: "Airport and port",
      title: "From Koidula to Tallinn airport and the port",
      lead:
        "Most of these trips are booked for a flight or a ferry. What matters is the countdown: three hours of driving plus an unpredictable border, and from that we work out when you need to be out of the checkpoint.",
      items: [
        {
          title: "A flight from Lennart Meri airport",
          text: "Give us the flight number and we will count the departure time backwards from check-in. On tickets and departure boards the airport is Tallinn Airport, code TLL; it is four kilometres from the centre, so the drive ends at the terminal door. If the border ate your margin, the driver tells you on the way rather than on arrival.",
        },
        {
          title: "Ferries to Helsinki and Stockholm",
          text: "We drop you at the right terminal in the Old Port; ferries and cruise berths have different entrances, so name the vessel or the operator in advance. Allow the same margin as for a flight — the ferry does not wait either.",
        },
        {
          title: "Tartu on the way, not as a detour",
          text: `The road from Koidula to Tallinn runs through Tartu anyway, so a drop-off there complicates nothing: tell us in advance and we will stop at the station, at Tartu airport or at an address. If Tallinn is not needed at all, the trip to Tartu costs ${tartu}.`,
        },
      ],
      cta: "Book a transfer to the airport",
      waText: "Hello! I need a transfer from Koidula to Tallinn airport. Flight number: ",
    },
    steps: {
      eyebrow: "How the trip works",
      title: "How the way back from Koidula works",
      items: [
        {
          title: "Tell us the date and roughly when you expect to be out",
          text: "An exact hour is not needed — «in the morning» or «after lunch» is enough. If a flight or a ferry follows, give us its departure time and we will count backwards. The confirmation carries the price, the car's registration and the driver's phone: save it <strong>before</strong> you cross, because reception on the Russian side can disappear.",
        },
        {
          title: "The driver waits beyond the control building",
          text: "The car stands on the Estonian side of Koidula, at the exit from the checkpoint grounds. This is a road crossing, so people come out in different ways — some in the car that brought them to the border, some on foot after control; either way you are met at the exit.",
        },
        {
          title: "The road through Setomaa and Tartu",
          text: "First the local roads towards Põlva and Tartu, then the highway to Tallinn: 270 kilometres, about three hours. Halfway we stop for coffee and a stretch — after hours at the border that is usually worth more than twenty minutes saved, and the stop costs nothing extra.",
        },
        {
          title: "Drop-off wherever you need",
          text: "An airport terminal, a berth in the port, a station, a hotel or your front door — we drive to the address, not to the nearest main street. We unload the suitcases ourselves; you settle after the ride, in euros or roubles, in cash, by card or by transfer.",
        },
      ],
    },
    compare: {
      eyebrow: "Comparison",
      title: "Koidula — Tallinn: transfer, train or coach",
      lead:
        "The comparison is honest but short: there is almost nothing to compare at Koidula. The coach to Tallinn passes by, the train leaves from a station two kilometres away, and both options begin with walking there carrying your bags.",
      caption: "Ways to get from the Koidula crossing to Tallinn",
      cols: ["Way", "Price", "Time", "What matters"],
      // ПРОВЕРЬ цены и расписания перевозчиков: данные на сентябрь 2026.
      rows: [
        [
          "EstoniaTransfer private car",
          `${eur("koidula")} per car`,
          "≈ 3 h 5 min",
          "the driver waits at the checkpoint, drop-off at the terminal or your address",
        ],
        [
          "Elron train with a change",
          "Elron fares",
          "line R46 plus Tartu — Tallinn",
          "about 2 km on foot to the station, and only a couple of trains a day on the line",
        ],
        [
          "Ecolines coach Pskov — Tallinn",
          "see the booking system",
          "≈ 7 h",
          "it runs through the crossing, but boarding at the checkpoint itself is not provided for",
        ],
        [
          "Taxi from Võru or Tartu",
          "by the meter plus the approach",
          "≈ 3 h 30 min",
          "it has to be called in advance: no cars wait at the crossing, and the empty run out to it is in the fare",
        ],
      ],
      note:
        "<strong>When there is barely a choice.</strong> Crossing in the afternoon, once the train has gone. A flight or a ferry out of Tallinn the same day. A child, a pram or four suitcases between two people. And any situation in which two kilometres to the station means two kilometres along the verge with your luggage.",
    },
    car: {
      eyebrow: "The car",
      title: "The car waiting for you at Koidula",
      caption: `${facts.car} — the actual car that will come for you`,
      text: [
        `${facts.car}: four passenger seats, two large suitcases plus hand luggage in the boot, working climate control. On this route that is not a formality: the drive from Koidula is nearly an hour longer than the Narva one, and it starts where you have already spent hours at the border. In winter the car is on winter tyres — the first stretch runs on the local Setomaa roads, which are not the first to be cleared.`,
        "Kirill is at the wheel — the same person who answers WhatsApp and Telegram, and the one who will actually arrive. No dispatcher in between: you arrange everything with the driver himself. He speaks Russian, gets by in English, and takes it for granted that the hour you clear the queue is an estimate.",
      ],
    },
    crossing: {
      eyebrow: "The border crossing",
      title: "Where you are met at Koidula",
      items: [
        {
          title: "The meeting point is the Estonian side of Koidula",
          text: "The Russian side of the crossing is Kunichina Gora, the Estonian one is Koidula — that is how it is signposted. We meet you at the exit from the checkpoint grounds, immediately beyond the control building. The registration number and the driver's phone arrive in the confirmation beforehand, so neither of you has to make roaming calls.",
        },
        {
          title: "The queue for entering Estonia",
          // ПРОВЕРЬ: что бронь GoSwift нужна только на выезд из Эстонии.
          text: 'A GoSwift booking is needed to <strong>leave</strong> Estonia, not to enter it: the queue on the Russian side is their own and we have no influence on its speed. That is exactly why we do not fix a meeting time — we wait. Opening hours are published at <a href="https://www.politsei.ee/en" target="_blank" rel="noopener">politsei.ee</a>.',
        },
        {
          title: "If you do not make it before closing",
          text: "Koidula works in daytime and shuts completely for the night — then you stay on the Russian side until morning. Write as soon as that becomes clear and we will move the trip to another day at no cost: we hold none of your money.",
        },
        {
          title: "Phone numbers, just in case",
          text: "Koidula checkpoint — <strong>+372 786 1800</strong>, the Russian side at Kunichina Gora — <strong>+7 811 489-34-21</strong>. The Estonian Police and Border Guard Board — <strong>+372 612 3000</strong>.",
        },
      ],
    },
    /**
     * ⚠️ Числовых лимитов на ввоз в Эстонию здесь нет намеренно — как и в
     * русской версии. Не «дополняйте» этот блок нормами по памяти.
     */
    blocks: [
      {
        eyebrow: "Entering Estonia",
        title: "What to allow for when entering Estonia through Koidula",
        lead:
          "As of September 2026. Rules on this direction change several times a year — check politsei.ee and the customs service before you travel; links at the end of the section.",
        layout: "accordion",
        headings: true,
        place: "bottom",
        items: [
          {
            title: "Phones, money and no infrastructure at all",
            text: "Koidula is not a town crossing: on the Estonian side there is no shop, no exchange office, no cash machine and no taxi rank.<br><br>• A Russian SIM card may not work in Estonia at all: most operators have roaming switched off;<br>• cards issued by Russian banks are not accepted here;<br>• there is nowhere to get euros on the spot — the nearest cash machines are in Võru and Tartu;<br>• so save the driver's number and the car's registration <strong>before</strong> you cross;<br>• <strong>you can pay us in roubles</strong> — no need to look for an exchange office.",
          },
          {
            title: "What you may bring into Estonia",
            text: 'Imports from Russia are restricted by both customs and sanctions rules. The limits depend on the goods and they change, so there are deliberately no figures here: check them at <a href="https://www.emta.ee/en" target="_blank" rel="noopener nofollow">emta.ee</a> before you travel.<br><br>• The officer at the border always has the final say;<br>• keep receipts for expensive items to hand, not at the bottom of a suitcase;<br>• prescription medicines with controlled substances need the prescription and a translation;<br>• we drive you to Tallinn, but the contents of your luggage are your responsibility, and we do not advise on customs.',
          },
          {
            title: "A road crossing: how people come out of it",
            // ПРОВЕРЬ: порядок прохода пешком через Койдулу — правила менялись.
            text: "Koidula takes cars, and that changes the picture compared with pedestrian Narva.<br><br>• A passenger driven to the border from the Russian side is cleared in Estonia and walks out of the checkpoint grounds alone;<br>• the rules for crossing on foot here have changed — if you are travelling without a car, check them in advance;<br>• how long control takes depends on the queue on the Russian side, not on the Estonian one;<br>• our part begins beyond the barrier and does not depend on how you came out.",
          },
        ],
        note:
          'Worth checking before you set off: <a href="https://www.politsei.ee/en" target="_blank" rel="noopener nofollow">politsei.ee</a> for opening hours and crossing rules, <a href="https://www.emta.ee/en" target="_blank" rel="noopener nofollow">emta.ee</a> for what you may bring into Estonia.',
      },
    ],
    faq: {
      eyebrow: "FAQ",
      title: "Transfer Koidula — Tallinn: common questions",
      items: [
        {
          q: "How much does the Koidula — Tallinn transfer cost?",
          a: `${eur("koidula")} for the whole car — the same as towards the border. The number of passengers, the number of suitcases and the hour of the day do not change it, and waiting at the checkpoint is not billed. Cash or bank transfer, no prepayment.`,
        },
        {
          q: "How long is the drive from Koidula to Tallinn?",
          a: "About 3 hours 5 minutes — 270 km via Tartu. Longer in winter and in heavy traffic. Clearing the border is not included: the queue on the Russian side takes anything from half an hour to several hours and cannot be predicted.",
        },
        {
          q: "Where exactly will the car be waiting?",
          a: "On the Estonian side of the Koidula checkpoint, at the exit from its grounds, immediately beyond the control building. The registration number and the driver's phone come in the confirmation beforehand — save them before you cross, because reception on the Russian side may not work.",
        },
        {
          q: "What if the queue holds me up for hours?",
          a: "The driver waits and there is no surcharge for it — which is why we do not need an exact hour. If you fail to cross before closing altogether, message us and we will move the trip to another day at no cost.",
        },
        {
          q: "Can I pay in roubles?",
          a: "Yes. We take both euros and roubles, in cash, by card or by transfer. There is no exchange office or cash machine at Koidula and Russian bank cards do not work in Estonia, so you will not have to change money for the transfer. We take no prepayment in any currency.",
        },
        {
          q: "Can I leave Koidula by train or coach?",
          // ПРОВЕРЬ расписания: пара поездов в день и маршрут Ecolines через
          // переход — данные на сентябрь 2026.
          a: "In theory yes, in practice it is awkward. The station is two kilometres from the checkpoint and the line has only a couple of trains a day; the Pskov — Tallinn coach runs through the crossing but boarding at the checkpoint itself is not provided for. With suitcases or a child both options look easier on a map than on the ground. Timetables change — check them before you travel.",
        },
        {
          q: "Will you take me straight to Tallinn airport?",
          a: "Yes, to the right terminal and with no surcharge for the drop-off. Give us the flight number when you book and we will work out when you need to be out of the border queue to make check-in. We also drive to the cruise port, the Baltic station and the coach station.",
        },
        {
          q: "Can I book both directions at once?",
          a: `Yes, and it is the easiest way: both trips at ${eur("koidula")}, booked in one message. The drive from Tallinn to the border is described on the <a href="/en/transfer-tallinn-koidula/">Tallinn — Koidula</a> page, together with the GoSwift booking you need for leaving Estonia.`,
        },
      ],
    },
    links: [
      {
        label: "Transfer Tallinn — Koidula",
        note: eur("koidula"),
        href: "/transfer-tallinn-koidula/",
      },
      {
        label: "Back from Luhamaa: Luhamaa — Tallinn",
        note: eur("luhamaa"),
        href: "/transfer-luhamaa-tallinn/",
      },
      {
        label: "Back from Narva: Narva — Tallinn",
        note: eur("narva"),
        href: "/transfer-narva-tallinn/",
      },
      { label: "From Koidula to Tartu", note: tartu, href: "/transfer-tartu-koidula-luhamaa/" },
      { label: "All routes and prices", href: "/#routes" },
    ],
    cta: {
      title: "Book a transfer from Koidula to Tallinn",
      text: "Send the date and roughly when you expect to clear the checkpoint — we will confirm the car, the price and the driver's number in one message. No prepayment; we wait on the Estonian side.",
    },
    waText: "Hello! I need a transfer from the border at Koidula to Tallinn.",
    schema: {
      name: "Transfer Koidula — Tallinn",
      alternateName: [
        "Taxi Koidula — Tallinn",
        "Koidula to Tallinn airport transfer",
        "Private transfer from the Koidula border crossing",
        "Transfer Kunichina Gora — Tallinn",
      ],
      serviceType: "Private transfer from a border crossing",
      description:
        "Private transfer from the Koidula border crossing to Tallinn: 270 km via Tartu, about 3 h 5 min, €160 for the whole car. The driver waits on the Estonian side; drop-off at the airport terminal, the port or any address.",
      areaServed: [
        { type: "Place", name: "Koidula" },
        { type: "City", name: "Tallinn" },
      ],
    },
  },

  // ────────────────────────── Tallinn — Luhamaa ──────────────────────────
  "transfer-tallinn-luhamaa": {
    title: `Transfer Tallinn — Luhamaa, ${eur("luhamaa")} | EstoniaTransfer`,
    description:
      "Transfer from Tallinn to the Luhamaa crossing on the Riga — Pskov road: €160 per car, 280 km, about 3 h 10 min. No scheduled transport reaches it at all.",
    ogDescription:
      "280 km to the Luhamaa border crossing, about 3 h 10 min. A fixed price per car, departure at any hour.",
    breadcrumb: "Transfer Tallinn — Luhamaa",
    h1: "Transfer Tallinn — Luhamaa",
    lead:
      "Luhamaa is Estonia's southernmost road crossing and it sits directly on the Riga — Pskov road. From Tallinn that is 280 kilometres and about three hours ten minutes through Tartu and Võru. We drive you to the gates from any address; the price is for the whole car.",
    kmNote: "Riga — Pskov road",
    answer: [
      `<strong>In short.</strong> The Tallinn to Luhamaa transfer costs <strong>${eur("luhamaa")}</strong> for the whole car, up to four passengers with luggage. The drive takes about <strong>3 hours 10 minutes</strong>, 280 km through Tartu and Võru. It is a road crossing, open in daytime, and the exit queue is booked in GoSwift. <em>Hours change — check them before you travel.</em>`,
      "<strong>The one thing that sets Luhamaa apart: no scheduled transport goes there.</strong> No coach, no train — the nearest town is Võru, and from it there are still some thirty kilometres to the border. So people arrive either in their own car or by transfer.",
    ],
    price: {
      eyebrow: "Price",
      title: `What ${eur("luhamaa")} covers`,
      lead:
        "Luhamaa is the furthest of the three crossings, yet the fare matches Koidula: ten extra kilometres are not worth a separate price. We charge per car, not per passenger, and the hour of the day does not matter.",
      caption: "Fares for the transfer to the Luhamaa border crossing",
      rows: [
        [
          "Tallinn — Luhamaa",
          eur("luhamaa"),
          "280 km, about 3 h 10 min, up to 4 passengers with luggage",
        ],
        ["Luhamaa — Tallinn", eur("luhamaa"), "the return trip at the same price"],
        ["From Tartu, if you start there", tartu, "≈ 95 km and about 1 h 20 min via Võru"],
        [
          "Airport or cruise port pickup",
          "€0",
          "a name board in the arrivals hall; waiting for the flight is not billed",
        ],
        [
          "Early departure for the opening",
          "€0",
          "to reach the border by 7:00 we leave at night — no surcharge for that",
        ],
      ],
      note:
        "<strong>Paying.</strong> Cash to the driver or a bank transfer, in euros. No prepayment: the road first, the settlement after. We confirm the price by message before departure.",
      extra: [
        {
          title: "Luhamaa or Koidula — which to choose",
          text: 'The price and the time are nearly identical: <a href="/en/transfer-tallinn-koidula/">Koidula</a> is ten kilometres closer, while Luhamaa sits on the Riga — Pskov road itself, so if you continue towards Pskov there is no detour. Often it is not geography that decides but the queue — check the free GoSwift slots for your date.',
        },
      ],
    },
    steps: {
      eyebrow: "How the trip works",
      title: "Through Tartu and Võru to the border",
      items: [
        {
          title: "We count back from the opening hours",
          text: "First we look at the hour you need to be at the border, and set the departure from that. The crossing is daytime only and the road is long, so sometimes we leave at night — which does not change the price.",
        },
        {
          title: "Pickup in Tallinn",
          text: "An address, a hotel, the airport or the cruise port — whatever suits. We load the suitcases ourselves, charge nothing for luggage and bring a child seat on request.",
        },
        {
          title: "280 kilometres of road",
          text: "Tartu, Võru, then out onto the Riga — Pskov road. This is the longest of our Estonian routes, so we stop halfway for coffee and a stretch.",
        },
        {
          title: "Drop-off at the checkpoint",
          text: "We bring you to the Luhamaa gates. You clear the control yourself; if a car should meet you on the other side, tell us in advance and we will help arrange it.",
        },
      ],
    },
    compare: {
      eyebrow: "Why a transfer",
      title: "You cannot reach Luhamaa by public transport",
      lead:
        "That is geography, not a sales line. Narva has both a coach and a train, and a Pskov service runs through Koidula. Nothing goes to Luhamaa.",
      caption: "Ways to get from Tallinn to the Luhamaa border crossing",
      cols: ["Way", "Price", "Time", "What matters"],
      rows: [
        [
          "EstoniaTransfer private car",
          `${eur("luhamaa")} per car`,
          "≈ 3 h 10 min",
          "door to the gates of the crossing, departure at any hour",
        ],
        [
          "Scheduled coach to the crossing",
          "—",
          "—",
          "does not exist: neither to the checkpoint nor to Luhamaa village nearby",
        ],
        [
          "Coach to Võru plus a taxi",
          "ticket plus taxi",
          "longer, with a change",
          "some 30 km remain from Võru and a car has to be arranged in advance",
        ],
        [
          "International coach to Pskov",
          "carrier's fare",
          "depends on the service",
          "passes by; it does not set passengers down at the crossing",
        ],
        ["Your own car", "fuel", "≈ 3 h", "needs a GoSwift queue booking"],
      ],
      note:
        "<strong>Without dressing it up.</strong> Travelling alone and light, it is cheaper to take a coach to Narva and cross on foot. Luhamaa is chosen when it has to be Luhamaa: crossing by car, getting straight onto the Riga — Pskov road, or escaping the queues on peak days.",
    },
    car: {
      eyebrow: "The car",
      title: "What you travel in",
      caption: `${facts.car} — four seats and two suitcases for 280 kilometres`,
      text: [
        `${facts.car}: four passenger seats, climate control, a boot for two large suitcases and hand luggage. At 280 kilometres this is the longest of our Estonian routes, so the car runs on winter tyres in winter and with working air conditioning in summer. We stop halfway, and that time is already allowed for.`,
        "Kirill is at the wheel and he answers WhatsApp and Telegram himself. He speaks Russian and gets by in English. A child seat comes on request; if you travel with a pet, mention it in advance.",
      ],
    },
    crossing: {
      eyebrow: "The border crossing",
      title: "A trip to Luhamaa: what to know about the crossing",
      items: [
        {
          title: "A road crossing, open in daytime",
          text: "Luhamaa takes cars from 7:00 to 19:00 and closes for the night. It is worth arriving well before closing: a queue gathers at the barrier towards the evening and the last cars may not get through.",
        },
        {
          title: "The queue is booked in GoSwift",
          text: 'Cars take their crossing time in advance in the GoSwift system — <a href="https://www.eestipiir.ee/" target="_blank" rel="noopener">eestipiir.ee</a>. We cannot book the slot for you, but we will explain how and bring you at the appointed hour.',
        },
        {
          title: "There is no town and no transport nearby",
          text: "The nearest settlement is Luhamaa village and the nearest town is Võru, some thirty kilometres away. There is no shop and no waiting taxi at the crossing, so buy water and food in Võru and arrange the car back in advance.",
        },
        {
          title: "Phone numbers, just in case",
          text: 'Luhamaa checkpoint — <strong>+372 786 1830</strong>, the Russian side at Shumilkino — <strong>+7 811 489-83-21</strong>. The Police and Border Guard Board — <strong>+372 612 3000</strong>, hours at <a href="https://www.politsei.ee/en" target="_blank" rel="noopener">politsei.ee</a>.',
        },
      ],
    },
    faq: {
      eyebrow: "FAQ",
      title: "Transfer Tallinn — Luhamaa: common questions",
      items: [
        {
          q: "How much does the Tallinn — Luhamaa transfer cost?",
          a: `${eur("luhamaa")} for the whole car, up to four passengers. There is no surcharge for luggage, a child seat or the hour of the day — the night departure for the opening of the crossing is included too. Cash or bank transfer, no prepayment.`,
        },
        {
          q: "How long does it take to reach Luhamaa?",
          a: "About 3 hours 10 minutes, 280 km through Tartu and Võru. It is the longest of the three routes and winter weather makes it longer still.",
        },
        {
          q: "Can I get to Luhamaa without a car?",
          a: "Practically not. There is no scheduled transport to the checkpoint or to the neighbouring village of Luhamaa, and the nearest town, Võru, is thirty kilometres away. International coaches to Pskov pass by without stopping at the crossing. That leaves your own car or a transfer.",
        },
        {
          q: "Luhamaa or Koidula — which should I choose?",
          a: "The distance and the price are almost the same: Koidula is slightly closer, Luhamaa is handier if you continue along the Riga — Pskov road. Often the queue decides — check the free GoSwift slots for your date.",
        },
        {
          q: "Do you meet passengers at Tallinn airport?",
          a: "Yes — at the airport, the cruise port and the stations. Send the flight number or the ship's name: the driver tracks the arrival and waits with a name board, and waiting after landing is not billed.",
        },
        {
          q: "Do you drive the other way, from the border to Tallinn?",
          a: `Yes, at the same price — ${eur("luhamaa")}, and it has a page of its own: <a href="/en/transfer-luhamaa-tallinn/">Luhamaa — Tallinn</a>. Here the return matters even more than elsewhere: no scheduled transport leaves the crossing and the nearest town is thirty kilometres away.`,
        },
      ],
    },
    links: [
      { label: "Transfer Tallinn — Koidula", note: eur("koidula"), href: "/transfer-tallinn-koidula/" },
      { label: "Transfer Tallinn — Narva", note: eur("narva"), href: "/transfer-tallinn-narva/" },
      { label: "Back: Luhamaa — Tallinn", note: eur("luhamaa"), href: "/transfer-luhamaa-tallinn/" },
      { label: "From Tartu to the border", note: tartu, href: "/transfer-tartu-koidula-luhamaa/" },
      { label: "All routes and prices", href: "/#routes" },
    ],
    cta: {
      title: "Shall we drive to Luhamaa?",
      text: "Send the date and the hour you need to be at the border — we will work out the departure and confirm the price in one message.",
    },
    waText: "Hello! I would like to book a transfer from Tallinn to Luhamaa.",
    schema: {
      name: "Transfer Tallinn — Luhamaa",
      alternateName: [
        "Trip to Luhamaa",
        "Taxi Tallinn — Luhamaa",
        "Transfer Tallinn — Shumilkino",
      ],
      serviceType: "Private transfer to a border crossing",
      description:
        "Private transfer from Tallinn to the Luhamaa crossing on the Riga — Pskov road: 280 km through Tartu and Võru, about 3 h 10 min, €160 for the whole car.",
      areaServed: [
        { type: "City", name: "Tallinn" },
        { type: "Place", name: "Luhamaa" },
      ],
    },
  },

  // ─────────────────────────── Luhamaa — Tallinn ───────────────────────────
  // Английская версия третьей обратной страницы (14.09.2026). Единственный
  // довод, который здесь нужен, — вокруг перехода нет ничего: ни автобуса, ни
  // магазина, ни такси, ближайший город в тридцати километрах. Рекламных
  // усилений не добавлять, факт сильнее любого из них.
  "transfer-luhamaa-tallinn": {
    title: `Transfer Luhamaa — Tallinn: ${eur("luhamaa")} from the border`,
    description:
      "Private transfer Luhamaa — Tallinn: €160 per car. No scheduled transport leaves the crossing at all, so the driver waits for you at the checkpoint itself.",
    ogDescription:
      "Return transfer from the Luhamaa checkpoint to Tallinn: €160 per car, 280 km via Võru and Tartu, the driver waits on the Estonian side.",
    breadcrumb: "Luhamaa — Tallinn",
    h1: "Transfer and taxi Luhamaa — Tallinn: how to get away from the crossing",
    badge: `Return route · ${eur("luhamaa")} per car`,
    footer: { label: "Luhamaa — Tallinn", note: eur("luhamaa") },
    stats: [
      { value: eur("luhamaa"), label: "per car" },
      { value: spec("luhamaa").hoursEn, label: "on the road" },
      { value: `${spec("luhamaa").km} km`, label: "border to city" },
    ],
    offers: [{ name: "Transfer Luhamaa — Tallinn", price: String(spec("luhamaa").price) }],
    lead:
      "You walk out of the Luhamaa checkpoint and you are standing on the Riga — Pskov road: no town, no bus stop, no taxi waiting. That is where our part begins — 280 kilometres via Võru and Tartu, about three hours ten minutes, drop-off at the airport terminal, the port, a hotel or any address. We wait as long as the border keeps you.",
    notice: {
      title: "Not a single bus leaves Luhamaa",
      // ПРОВЕРЬ: отсутствие рейсов до деревни Люта и 30 км до Выру — те же
      // данные, что в таблице сравнения на странице «Tallinn — Luhamaa».
      text: "That is literal: there is no scheduled transport from the checkpoint and none from the neighbouring village of Lüta either. The nearest town is Võru, about thirty kilometres away, and there is nothing to get there with. This is why the ride back from Luhamaa is arranged in advance rather than decided on the spot. <em>Opening hours change; check them before you travel.</em>",
    },
    answer: [
      `<strong>In short.</strong> Luhamaa to Tallinn costs <strong>${eur("luhamaa")}</strong> for the whole car — up to four passengers with luggage. It is 280 km via Võru and Tartu, about <strong>3 hours 10 minutes</strong>. The car waits on the Estonian side, at the exit from the checkpoint grounds.`,
      "<strong>Waiting is not billed.</strong> Nobody predicts the queue on the Russian side, so an exact hour is not needed: give us an approximate one and the driver will wait. <strong>No prepayment</strong>, and you can settle <strong>in euros or in roubles</strong>, in cash, by card or by transfer.",
      'The Russian side of this crossing is Shumilkino; the Estonian one is Luhamaa. Need the other direction, from Tallinn to the border? That is the <a href="/en/transfer-tallinn-luhamaa/">Tallinn — Luhamaa</a> page, at the same price.',
    ],
    price: {
      eyebrow: "Price",
      title: "What the Luhamaa — Tallinn taxi costs",
      lead:
        "The fare matches both the outbound trip and the Koidula one: ten kilometres do not justify a separate price. You pay for the car rather than for a seat, so four passengers cost what one costs.",
      caption: "Luhamaa — Tallinn transfer fares and extras",
      rows: [
        ["Luhamaa — Tallinn", eur("luhamaa"), "the whole car, up to 4 passengers with luggage"],
        [
          "Waiting at the checkpoint",
          "€0",
          "the border queue cannot be predicted, so waiting time is not billed",
        ],
        [
          "Drop-off at Tallinn airport or the port",
          "€0",
          "we take you to the terminal itself, not to the nearest stop",
        ],
        ["Luhamaa — Tartu", tartu, "≈ 95 km via Võru, about 1 h 20 min"],
        [
          "Luggage, child seat, late departure",
          "€0",
          "no surcharge for suitcases or for the evening",
        ],
      ],
      note:
        "<strong>Paying.</strong> Cash to the driver — <strong>in euros or in roubles</strong> — by card or by bank transfer. There is no exchange office, cash machine or shop at Luhamaa, and Russian bank cards are not accepted in Estonia: roubles are effectively the only money that works here. No prepayment: the ride first, the settlement after.",
      extra: [
        {
          title: "Why nothing can be «sorted out on the spot» here",
          text: "Narva has a town and a railway station; Koidula has at least a station two kilometres away. Luhamaa has nothing: the crossing stands on the Riga — Pskov road, the nearest village is Lüta and the nearest town is Võru, thirty kilometres off. No taxi rank, no bus stop, not even a shop to ask for advice in. Add a Russian SIM card that may not work in Estonia and there is nothing to call a car with. That is why the ride back from here is booked before you cross, not after.",
        },
        {
          title: "If you are heading for Riga or Tartu instead",
          text: `Luhamaa sits directly on the Riga — Pskov road, so going south from the crossing is in fact shorter: we drive to Riga and quote it separately — send the date and the time. <a href="/en/transfer-tartu-koidula-luhamaa/">Tartu</a> costs ${tartu}, about 95 kilometres via Võru. The way back to the crossing is still ${eur("luhamaa")}: if you return in a few days, both trips can be booked in one message.`,
        },
      ],
    },
    airport: {
      eyebrow: "Airport and port",
      title: "From Luhamaa to Tallinn airport and the port",
      lead:
        "Most of these trips are booked for a flight or a ferry out of Tallinn. The counting has to be backwards and generous: three hours ten minutes of driving plus a border whose timing depends on neither of us.",
      items: [
        {
          title: "A flight from Lennart Meri airport",
          text: "Give us the flight number and we will work out when you need to be out of the checkpoint to make check-in comfortably. On tickets and departure boards the airport is Tallinn Airport, code TLL, four kilometres from the centre, so the drive ends at the terminal door. The margin here needs to be bigger than on the Narva route: the road is longer and there is no way round it.",
        },
        {
          title: "Ferries to Helsinki and Stockholm",
          text: "We drop you at the right terminal in the Old Port; ferries and cruise berths have different entrances, so name the vessel or the operator in advance. Allow the same margin as for a flight.",
        },
        {
          title: "Võru and Tartu on the way",
          text: "The route runs through Võru and Tartu, so a drop-off in either complicates nothing — just tell us in advance. From those towns onwards there are buses and trains: if you are not heading for Tallinn but for somewhere in southern Estonia, it is often cheaper to ride with us to the town and continue on scheduled transport.",
        },
      ],
      cta: "Book a transfer to the airport",
      waText: "Hello! I need a transfer from Luhamaa to Tallinn airport. Flight number: ",
    },
    steps: {
      eyebrow: "How the trip works",
      title: "How the way back from Luhamaa works",
      items: [
        {
          title: "Tell us the date and roughly when you expect to be out",
          text: "An exact hour is not needed — «in the morning» or «in the afternoon» is enough. If a flight, a ferry or a train follows, give us its departure time and we will count backwards. The confirmation carries the price, the car's registration and the driver's phone: save it <strong>before</strong> you cross, because reception on the Russian side can disappear.",
        },
        {
          title: "The driver waits at the exit from the checkpoint",
          text: "The car stands on the Estonian side of Luhamaa, at the exit from the crossing grounds. It is hard to get the place wrong: there is one road at the barrier and no second way out. If the queue takes longer than you expected, he waits — that changes neither the price nor the booking.",
        },
        {
          title: "The road through Võru and Tartu",
          text: "First thirty kilometres along the Riga — Pskov road to the Võru turn, then Tartu and the highway to Tallinn: 280 kilometres, about three hours ten minutes. This is the longest of our return routes, so halfway we stop for coffee and a stretch — that time is allowed for and costs nothing extra.",
        },
        {
          title: "Drop-off wherever you need",
          text: "An airport terminal, a berth in the port, a station, a hotel or your front door — we drive to the address, not to the nearest main street. We unload the suitcases ourselves; you settle after the ride, in euros or roubles, in cash, by card or by transfer.",
        },
      ],
    },
    compare: {
      eyebrow: "Why a transfer",
      title: "There is no public transport away from Luhamaa",
      lead:
        "This is geography rather than a sales pitch: there is hardly anything to compare. Narva has a train and a coach from the border, Koidula has a station two kilometres away. Luhamaa has neither.",
      caption: "Ways to get from the Luhamaa crossing to Tallinn",
      cols: ["Way", "Price", "Time", "What matters"],
      // ПРОВЕРЬ: отсутствие рейсов от перехода и от деревни Люта, 30 км до
      // Выру. Данные на сентябрь 2026.
      rows: [
        [
          "EstoniaTransfer private car",
          `${eur("luhamaa")} per car`,
          "≈ 3 h 10 min",
          "the driver waits at the checkpoint, drop-off at the terminal or your address",
        ],
        [
          "Scheduled bus from the crossing",
          "—",
          "—",
          "does not exist: none from the checkpoint and none from the village of Lüta",
        ],
        [
          "International coach to Tallinn",
          "operator's fare",
          "depends on the service",
          "passes by; boarding at the crossing itself is not provided for",
        ],
        [
          "Taxi from Võru",
          "by the meter plus the approach",
          "≈ 3 h 40 min",
          "has to be called in advance: Võru is thirty kilometres away and the empty run out is in the fare",
        ],
      ],
      note:
        "<strong>Without embellishment.</strong> If you travel light and do not mind changes, it is cheaper to cross at Narva, where the border has both a train and a coach. But once you have come out at Luhamaa the choice narrows to two: a car is waiting for you, or you look for one standing on the highway.",
    },
    car: {
      eyebrow: "The car",
      title: "The car waiting for you on the Riga — Pskov road",
      caption: `${facts.car} — the actual car that will come for you`,
      text: [
        `${facts.car}: four passenger seats, two large suitcases plus hand luggage, working climate control. On this route it matters more than on the others: 280 kilometres is the longest of the three drives, and it begins where there is nowhere to wait in the warm. In winter the car is on winter tyres — the stretch from the border to Võru runs across open country where the snow drifts.`,
        "Kirill is at the wheel — the same person who answers WhatsApp and Telegram, and the one who will actually arrive. No dispatcher in between: you arrange everything with the driver himself. He speaks Russian, gets by in English, and takes it for granted that the hour you clear the border is an estimate.",
      ],
    },
    crossing: {
      eyebrow: "The border crossing",
      title: "Where you are met at Luhamaa",
      items: [
        {
          title: "The meeting point is the Estonian side of Luhamaa",
          text: "The Russian side of the crossing is Shumilkino, the Estonian one is Luhamaa — that is how it is signposted. We meet you at the exit from the checkpoint grounds: there is a single road there and nowhere to miss each other. The registration number and the driver's phone arrive in the confirmation beforehand, so neither of you has to make roaming calls.",
        },
        {
          title: "The queue for entering Estonia",
          // ПРОВЕРЬ: что бронь GoSwift нужна только на выезд из Эстонии.
          text: 'A GoSwift booking is needed to <strong>leave</strong> Estonia, not to enter it: the queue on the Russian side is their own and we have no influence on its speed. That is why we do not fix a meeting time — we wait. Opening hours are published at <a href="https://www.politsei.ee/en" target="_blank" rel="noopener">politsei.ee</a>.',
        },
        {
          title: "If you do not make it before closing",
          text: "Luhamaa takes cars in daytime and shuts completely for the night — then you stay on the Russian side until morning. Write as soon as that becomes clear and we will move the trip to another day at no cost: we hold none of your money.",
        },
        {
          title: "No shop and no café nearby",
          text: "There is no shop at the crossing, no café and no shelter from the rain: the nearest are in Võru, thirty kilometres away. Bring water and food with you, especially if you are travelling with children. The car at least offers warmth and somewhere to finally sit down.",
        },
        {
          title: "Phone numbers, just in case",
          // ПРОВЕРЬ: у пункта пропуска Лухамаа в источниках встречаются два
          // разных номера — то же предупреждение, что на исходящей странице.
          text: "Luhamaa checkpoint — <strong>+372 786 1830</strong>, the Russian side at Shumilkino — <strong>+7 811 489-83-21</strong>. The Estonian Police and Border Guard Board — <strong>+372 612 3000</strong>.",
        },
      ],
    },
    /**
     * ⚠️ Числовых лимитов на ввоз в Эстонию здесь нет намеренно — как и в
     * русской версии. Не «дополняйте» этот блок нормами по памяти.
     */
    blocks: [
      {
        eyebrow: "Entering Estonia",
        title: "What to allow for when entering Estonia through Luhamaa",
        lead:
          "As of September 2026. Rules on this direction change several times a year — check politsei.ee and the customs service before you travel; links at the end of the section.",
        layout: "accordion",
        headings: true,
        place: "bottom",
        items: [
          {
            title: "Phones and money when there is nothing around",
            text: "At this crossing the absence of infrastructure is felt more keenly than the customs rules.<br><br>• A Russian SIM card may not work in Estonia at all: most operators have roaming switched off;<br>• cards issued by Russian banks are not accepted here;<br>• there is no exchange office or cash machine at the crossing — the nearest are in Võru;<br>• do not count on Wi-Fi inside the checkpoint;<br>• so save the driver's number and the car's registration <strong>before</strong> you cross;<br>• <strong>you can pay us in roubles</strong> — no need to change money for the transfer.",
          },
          {
            title: "What you may bring into Estonia",
            text: 'Imports from Russia are restricted by both customs and sanctions rules. The limits depend on the goods and they change, so there are deliberately no figures here — check them at <a href="https://www.emta.ee/en" target="_blank" rel="noopener nofollow">emta.ee</a> before you travel.<br><br>• The officer at the border has the final say, and arguing at the barrier is pointless;<br>• keep receipts for expensive items to hand, not at the bottom of a suitcase;<br>• prescription medicines with controlled substances need the prescription and a translation;<br>• we drive you to Tallinn, but the contents of your luggage are your responsibility; we do not advise on customs and do not handle paperwork.',
          },
          {
            title: "Why crossing in the morning is better",
            text: "Morning is calmer than evening here almost every time.<br><br>• At opening the queue on the Russian side is usually shorter and your margin before a flight survives;<br>• it grows towards evening, and after closing you cannot cross at all — that means finding a bed on the Russian side;<br>• at weekends and before public holidays the wait is longer at any hour;<br>• if a plane or a ferry is waiting in Tallinn, allow at least half a day: neither the border nor 280 kilometres can be done faster.",
          },
        ],
        note:
          'Worth checking before you set off: <a href="https://www.politsei.ee/en" target="_blank" rel="noopener nofollow">politsei.ee</a> for opening hours and crossing rules, <a href="https://www.emta.ee/en" target="_blank" rel="noopener nofollow">emta.ee</a> for what you may bring into Estonia.',
      },
    ],
    faq: {
      eyebrow: "FAQ",
      title: "Transfer Luhamaa — Tallinn: common questions",
      items: [
        {
          q: "How much does the Luhamaa — Tallinn transfer cost?",
          a: `${eur("luhamaa")} for the whole car — the same as towards the border. Passengers, suitcases and the hour of the day do not change it, and waiting at the checkpoint is not billed. Cash or bank transfer, no prepayment.`,
        },
        {
          q: "How long is the drive from Luhamaa to Tallinn?",
          a: "About 3 hours 10 minutes — 280 km via Võru and Tartu. This is the longest of our return routes and it takes more in winter. Clearing the border is not included: the queue on the Russian side cannot be predicted.",
        },
        {
          q: "Can I get away from Luhamaa without a transfer?",
          a: "In practice, no. There is no scheduled transport to the checkpoint or to the neighbouring village of Lüta, international coaches pass by without picking up at the crossing, and the nearest town, Võru, is thirty kilometres away. What is left is a car that comes to meet you.",
        },
        {
          q: "Where exactly will the car be waiting?",
          a: "On the Estonian side of Luhamaa, at the exit from the checkpoint grounds. There is one road there, so there is nowhere to miss each other. The registration number and the driver's phone come in the confirmation beforehand — save them before you cross, because reception on the other side may not work.",
        },
        {
          q: "What if the queue holds me up for hours?",
          a: "The driver waits and there is no surcharge: the speed of a border queue does not depend on the passenger, and billing for it would be odd. If you fail to cross before closing, message us and we will move the trip to another day at no cost.",
        },
        {
          q: "Can I pay in roubles?",
          a: "Yes. We take both euros and roubles, in cash, by card or by transfer. There is no exchange office or cash machine at Luhamaa and Russian bank cards do not work in Estonia, so you will not have to change money for the ride. We take no prepayment in any currency.",
        },
        {
          q: "Will you take me straight to Tallinn airport?",
          a: "Yes, to the right terminal and with no surcharge for the drop-off. Give us the flight number when you book and we will work out when you need to be out of the border queue to make check-in. We also drive to the cruise port, the Baltic station and the coach station.",
        },
        {
          q: "Can I book both directions at once?",
          a: `Yes — both trips at ${eur("luhamaa")}, in one message. The drive from Tallinn to the crossing is described on the <a href="/en/transfer-tallinn-luhamaa/">Tallinn — Luhamaa</a> page, together with the GoSwift booking you need for leaving Estonia.`,
        },
      ],
    },
    links: [
      {
        label: "Transfer Tallinn — Luhamaa",
        note: eur("luhamaa"),
        href: "/transfer-tallinn-luhamaa/",
      },
      {
        label: "Back from Koidula: Koidula — Tallinn",
        note: eur("koidula"),
        href: "/transfer-koidula-tallinn/",
      },
      {
        label: "Back from Narva: Narva — Tallinn",
        note: eur("narva"),
        href: "/transfer-narva-tallinn/",
      },
      { label: "From Luhamaa to Tartu", note: tartu, href: "/transfer-tartu-koidula-luhamaa/" },
      { label: "All routes and prices", href: "/#routes" },
    ],
    cta: {
      title: "Book a transfer from Luhamaa to Tallinn",
      text: "Send the date and roughly when you expect to clear the checkpoint — we will confirm the car, the price and the driver's number in one message. No prepayment; the driver will be waiting at the barrier.",
    },
    waText: "Hello! I need a transfer from the border at Luhamaa to Tallinn.",
    schema: {
      name: "Transfer Luhamaa — Tallinn",
      alternateName: [
        "Taxi Luhamaa — Tallinn",
        "Luhamaa to Tallinn airport transfer",
        "Private transfer from the Luhamaa border crossing",
        "Transfer Shumilkino — Tallinn",
      ],
      serviceType: "Private transfer from a border crossing",
      description:
        "Private transfer from the Luhamaa border crossing to Tallinn: 280 km via Võru and Tartu, about 3 h 10 min, €160 for the whole car. No scheduled transport leaves the crossing; the driver waits on the Estonian side.",
      areaServed: [
        { type: "Place", name: "Luhamaa" },
        { type: "City", name: "Tallinn" },
      ],
    },
  },

  // ─────────────────── Tartu — Koidula and Tartu — Luhamaa ───────────────────
  "transfer-tartu-koidula-luhamaa": {
    title: `Transfer Tartu — Koidula and Luhamaa, ${tartu} | EstoniaTransfer`,
    description:
      "Transfer from Tartu to the Koidula and Luhamaa crossings — €80 per car, about an hour on the road. Pickup from an address, the station or Tartu airport.",
    ogDescription:
      "From Tartu to the Koidula and Luhamaa crossings — €80 per car, about an hour on the road. Departure timed to the opening hours.",
    breadcrumb: "From Tartu to the border",
    h1: "Transfer Tartu — Koidula and Tartu — Luhamaa",
    badge: `From Tartu · ${tartu} per car`,
    footer: { label: "From Tartu to the border", note: tartu },
    stats: [
      { value: tartu, label: "per car" },
      { value: facts.fromTartu.koidula.hoursEn, label: "to Koidula" },
      { value: facts.fromTartu.luhamaa.hoursEn, label: "to Luhamaa" },
    ],
    offers: [
      { name: "Transfer Tartu — Koidula", price: String(facts.fromTartu.price) },
      { name: "Transfer Tartu — Luhamaa", price: String(facts.fromTartu.price) },
    ],
    lead: `From Tartu the border is several times closer than from Tallinn: about 65 kilometres and an hour to Koidula, about 95 kilometres and an hour twenty to Luhamaa. Hence the different price — ${tartu} for the whole car to either crossing. We collect you from an address, the station or Tartu airport and bring you straight to the checkpoint.`,
    answer: [
      `<strong>In short.</strong> A transfer from Tartu to the border costs <strong>${tartu}</strong> for the whole car — up to four passengers with luggage, to Koidula and to Luhamaa alike. <strong>Koidula</strong> is about 65 km and an hour through Põlva and Setomaa; <strong>Luhamaa</strong> is about 95 km and 1 hour 20 minutes via Võru. Both are road crossings and both work in daytime.`,
      "The road is short, so from Tartu you can almost always leave at a civilised hour rather than half the night in advance, as from Tallinn. <em>The opening hours of the crossings change — check them before you travel.</em>",
      `Back from the border to Tartu costs the same ${tartu}: tell us roughly when you expect to clear the checkpoint and the car will be waiting.`,
    ],
    price: {
      eyebrow: "Price",
      title: `What ${tartu} from Tartu covers`,
      lead:
        "One fare for both crossings and both directions. The price is for the whole car, not per passenger: one person or four, the sum is the same.",
      caption: "Routes from Tartu: price, distance and time",
      rows: [
        ["Tartu — Koidula", tartu, "≈ 65 km, about an hour through Põlva and Setomaa"],
        ["Tartu — Luhamaa", tartu, "≈ 95 km, about 1 h 20 min via Võru"],
        ["Back from the border to Tartu", tartu, "the same price in the other direction"],
        [
          "Pickup at Tartu airport or the station",
          "€0",
          "a name board at the exit; waiting for the flight is not billed",
        ],
        [
          "Luggage, child seat, early departure",
          "€0",
          "to reach the crossing at 7:00 it is enough to leave Tartu around six",
        ],
      ],
      note:
        "<strong>Paying.</strong> Cash to the driver or a bank transfer, in euros. No prepayment: the road first, the settlement after. We confirm the price by message before departure so you have it in writing.",
      extra: [
        {
          title: "Koidula or Luhamaa — which to choose",
          text: 'Both are road crossings open in daytime, but they lead to different places. Behind <a href="/en/transfer-tallinn-koidula/">Koidula</a> lie Petseri and Pskov, with Kunichina Gora on the other side. <a href="/en/transfer-tallinn-luhamaa/">Luhamaa</a> puts you straight onto the Riga — Pskov road via Võru. The price is identical, so the choice comes down to your plans across the border or to the free GoSwift slots.',
        },
        {
          title: "Why Luhamaa is further yet costs the same",
          text: `Thirty kilometres do not justify a separate tariff, and quoting a passenger two nearly identical prices for the same service is awkward. So both directions are ${tartu}. From Tallinn the difference in distance is real and the prices differ accordingly: <a href="/en/transfer-tallinn-narva/">${eur("narva")}</a> to Narva against <a href="/en/transfer-tallinn-koidula/">${eur("koidula")}</a> to the southern crossings.`,
        },
      ],
    },
    steps: {
      eyebrow: "How the trip works",
      title: "An hour from Tartu to the barrier",
      items: [
        {
          title: "We pick the crossing and the time",
          text: "Tell us the hour you need to be at the border. Both crossings are daytime only and the drive is short, so from Tartu a convenient departure time is almost always possible.",
        },
        {
          title: "Pickup in Tartu",
          text: "From a flat or hotel, from the coach station on Turu, the railway station or Tartu airport in Ülenurme. We load the luggage ourselves.",
        },
        {
          title: "The road through Setomaa or Võru",
          text: "To Koidula we go via Põlva and Setomaa, to Luhamaa via Võru on the road towards Riga and Pskov. The drive is short but empty: fill up and buy water in town.",
        },
        {
          title: "Drop-off at the checkpoint",
          text: "We bring you right to the crossing. You clear the border yourself; a car on the Russian side is a separate trip — say so in advance.",
        },
      ],
    },
    compare: {
      eyebrow: "Comparison",
      title: "Train, coach or transfer",
      lead:
        "Plainly: a train does run from Tartu to Koidula and for a single traveller it is cheaper than a transfer. The point of a car is different — there are few departures, the station has to be reached with your bags, and a train does not adapt to your hour at the border. For four people the arithmetic flips: €80 for everyone against four tickets.",
      caption: "Ways to get from Tartu to Koidula and Luhamaa",
      cols: ["Way", "Price", "Time", "What matters"],
      rows: [
        [
          "EstoniaTransfer private car",
          `${tartu} per car`,
          "≈ 1 h to Koidula",
          "door to the gates of the crossing, departure at the hour that suits you",
        ],
        [
          "Elron train, line R46",
          "Elron fares",
          "depends on the service",
          "cheaper to Koidula, but a couple of trains a day and about 2 km from the station",
        ],
        [
          "Coach to Võru plus a taxi",
          "ticket plus taxi",
          "with a change",
          "nothing scheduled reaches Luhamaa; some 30 km remain from Võru",
        ],
        ["Your own car", "fuel", "≈ 1 h", "needs a GoSwift queue booking"],
      ],
      note:
        "<strong>When a transfer earns its keep.</strong> An early departure for the opening of the crossing, heavy luggage, travelling with children, and Luhamaa above all: nothing scheduled goes there at all. The road through Setomaa and Võru is also empty — fill up while you are still in Tartu.",
    },
    car: {
      eyebrow: "The car",
      title: "What you travel in",
      caption: `${facts.car} — the same car as on the Tallinn routes`,
      text: [
        `${facts.car}: four passenger seats, climate control, two large suitcases in the boot. From Tartu the drive takes about an hour, but it runs on local roads through Setomaa and Võru, so winter tyres in winter matter as much here as on the long routes.`,
        "Kirill is at the wheel and he answers WhatsApp and Telegram himself — you deal with the driver directly, without a dispatcher. He speaks Russian and gets by in English. A child seat comes on request.",
      ],
    },
    crossing: {
      eyebrow: "What to know",
      title: "About both crossings and leaving Tartu",
      items: [
        {
          title: "The crossings work in daytime only",
          text: "Koidula and Luhamaa take cars from 7:00 to 19:00 and close for the night. From Tartu that is rather an advantage: to be there for the opening it is enough to leave around six in the morning, not in the middle of the night.",
        },
        {
          title: "The queue is booked in GoSwift",
          text: 'If you cross by car — your own or one meeting you — the queue time is taken in advance at <a href="https://www.eestipiir.ee/" target="_blank" rel="noopener">eestipiir.ee</a>. We drive you to the checkpoint but cannot book the slot for you.',
        },
        {
          title: "Tartu airport and the stations",
          text: "We collect from the airport in Ülenurme, from the railway station and from the coach station on Turu. Leave the flight or train number and the driver will track the arrival and meet you with a name board.",
        },
        {
          title: "Checkpoint phone numbers",
          text: 'Koidula — <strong>+372 786 1800</strong>, Luhamaa — <strong>+372 786 1830</strong>. The Police and Border Guard Board — <strong>+372 612 3000</strong>, hours and rules at <a href="https://www.politsei.ee/en" target="_blank" rel="noopener">politsei.ee</a>.',
        },
      ],
    },
    faq: {
      eyebrow: "FAQ",
      title: "From Tartu to the border: the short answers",
      items: [
        {
          q: "How much does a transfer from Tartu to the border cost?",
          a: `${tartu} for the whole car — to Koidula and to Luhamaa alike. The price does not depend on the number of passengers or the hour of departure: an early start for the opening of the crossing adds nothing. Luggage and a child seat are included and we take no prepayment.`,
        },
        {
          q: "How long does it take from Tartu to Koidula and Luhamaa?",
          a: "About 65 km and an hour to Koidula through Põlva and Setomaa; about 95 km and 1 hour 20 minutes to Luhamaa via Võru. Both crossings are daytime only, so we count the departure from their opening hours rather than the other way round.",
        },
        {
          q: "Do you drive back from the border to Tartu?",
          a: `Yes, the return works at the same ${tartu}: Koidula — Tartu and Luhamaa — Tartu. Tell us roughly when you expect to clear the checkpoint and the car will be waiting there: taxis almost never stand at these crossings.`,
        },
        {
          q: "Why is Luhamaa further yet the price is the same?",
          a: `Thirty kilometres do not justify a separate tariff, and quoting two nearly identical prices for the same service is awkward for the passenger. So both directions from Tartu cost ${tartu}.`,
        },
        {
          q: "Can I reach these crossings by train or coach?",
          a: "An Elron train on line R46 runs to Koidula, but there are only a couple a day and about two kilometres remain from the station to the checkpoint. Nothing scheduled goes to Luhamaa at all: the nearest town, Võru, is thirty kilometres from the border.",
        },
        {
          q: "Can you drive from Tartu to Tallinn airport?",
          a: "We can, but that is a different route at a different price — write to us and we will quote it. Ready prices are on the Tallinn route pages.",
        },
      ],
    },
    links: [
      { label: "Transfer Tallinn — Koidula", note: eur("koidula"), href: "/transfer-tallinn-koidula/" },
      { label: "Transfer Tallinn — Luhamaa", note: eur("luhamaa"), href: "/transfer-tallinn-luhamaa/" },
      { label: "Transfer Tallinn — Narva", note: eur("narva"), href: "/transfer-tallinn-narva/" },
      { label: "All routes and prices", href: "/#routes" },
    ],
    cta: {
      title: "Heading from Tartu to the border?",
      text: `Send the date, the crossing and the address — we will pick a departure time around the opening hours and confirm ${tartu} in one message.`,
    },
    waText: "Hello! I would like to book a transfer from Tartu to the border.",
    schema: {
      name: "Transfer from Tartu to the Koidula and Luhamaa border crossings",
      alternateName: ["Taxi Tartu — Koidula", "Taxi Tartu — Luhamaa"],
      serviceType: "Private transfer to a border crossing",
      description:
        "Private transfer from Tartu to the Koidula (about 65 km, an hour) and Luhamaa (about 95 km, 1 h 20 min) border crossings — €80 for the whole car. Pickup at Tartu airport and the station.",
      areaServed: [
        { type: "City", name: "Tartu" },
        { type: "Place", name: "Koidula" },
        { type: "Place", name: "Luhamaa" },
      ],
    },
  },

  // ───────────────────────── Guide: how to reach the border ─────────────────────────
  /**
   * Helsinki → Tallinn → the border. Mirror of the Russian entry; see the
   * comment there for why this is a guide rather than a service page (we do
   * not sell the ferry) and why there is no separate port-pickup fare.
   */
  "iz-helsinki-v-peterburg": {
    title: "Helsinki to Saint Petersburg via Tallinn: the route in 2026",
    description:
      "There is no direct Helsinki–Petersburg service. The route runs through Tallinn: ferry, transfer to the border and a crossing on foot at Narva. Times and prices.",
    ogDescription:
      "Helsinki to Saint Petersburg through Tallinn: a 2–2.5 hour ferry, a transfer to the Narva crossing and a walk across. We meet you at the port at no extra cost.",
    breadcrumb: "Helsinki to Petersburg",
    h1: "How to get from Helsinki to Saint Petersburg via Tallinn",
    badge: "Route guide · updated 24 September 2026",
    footer: { label: "From Helsinki to the border", note: "via Tallinn" },
    stats: [
      { value: "2–2.5 h", label: "ferry to Tallinn" },
      { value: "2.5 h", label: "Tallinn to the border" },
      { value: "on foot", label: "crossing at Narva" },
    ],
    lead:
      "There is no longer a direct train or a direct coach from Helsinki to Saint Petersburg. What remains is the route through Estonia, and it works: a ferry across the gulf, a car to the border and a crossing on foot at Narva. It takes a day — and with sensible planning one day rather than two. Below is how to fit the pieces together without ending up at a closed checkpoint.",
    answer: [
      "<strong>In short.</strong> Four legs. <strong>The ferry, Helsinki to Tallinn</strong> — 2 to 2.5 hours, several sailings a day, tickets from Tallink, Viking Line or Eckerö Line. <strong>Tallinn to Narva</strong> — 210 km and about 2 h 30 min. <strong>The border</strong> — on foot, anything from half an hour to several hours. <strong>Ivangorod to Petersburg</strong> — another 150 km and 2 h 30 min.",
      `<strong>Our part</strong> starts at the Tallinn ferry terminal and ends at the checkpoint: ${eur("narva")} per car to Narva, or ${facts.tallinnSpb.price} € for the through journey to Petersburg, where a second car is already waiting on the Russian side. Meeting you at the port is included — there is no separate fare for it.`,
      "<strong>What decides everything</strong> is the sailing time. The Narva crossing closes at 19:00, and you count backwards from that: a morning ferry leaves room for the queue, an afternoon one is tight, and an evening one means a night in Tallinn or in Narva.",
    ],
    notice: {
      title: "We do not sell ferry tickets",
      text: "You buy the ferry yourself — from Tallink, Viking Line or Eckerö Line, directly or through an aggregator. We do not resell them and take no commission. Our part begins at the Tallinn terminal: send us the sailing number and the car will be there when it docks.",
    },
    compare: {
      eyebrow: "Comparison",
      title: "Getting from Tallinn to the border",
      lead:
        "The ferry is the same for everyone; the difference starts in Tallinn. Figures are as of September 2026 from the carriers — check before you travel.",
      caption: "From the Tallinn ferry terminal to the Narva crossing: coach, train or transfer",
      cols: ["Option", "From the port", "Time to Narva", "Price", "What to consider"],
      rows: [
        [
          "Lux Express coach",
          "your own way to the terminal",
          "≈ 3 h",
          "from €9",
          "cheapest; port to coach station and Narva station to the crossing are on you",
        ],
        [
          "Elron train",
          "your own way to Balti jaam",
          "≈ 2 h 50 min",
          "€13–23",
          "faster than the coach; the same two changes with luggage",
        ],
        [
          "Transfer to Narva",
          "we meet you at the terminal",
          "≈ 2 h 30 min",
          `€${facts.routes[0].price} per car`,
          "ferry to barrier with no changes",
        ],
        [
          "Through transfer to Petersburg",
          "we meet you at the terminal",
          "≈ 2 h 30 min plus the border",
          `€${facts.tallinnSpb.price} for both cars`,
          "a second car waits in Ivangorod; all in euros",
        ],
      ],
      note:
        "<strong>The real difference is not price but the number of changes.</strong> Off a ferry you already have your luggage with you: the coach and the train add two more moves with suitcases — to the station in Tallinn, and from the station in Narva to the checkpoint. A transfer removes both.",
    },
    price: {
      eyebrow: "Prices",
      title: "What our part of the journey costs",
      lead:
        "The ferry is separate and you book it yourself. Below is only what we do, from the Tallinn terminal onwards. Prices are per car, not per passenger.",
      caption: "Transfer prices from the Tallinn ferry terminal to the border and to Petersburg",
      rows: [
        ["Tallinn port — Narva, to the checkpoint", eur("narva"), "210 km, about 2 h 30 min"],
        [
          "Tallinn port — Saint Petersburg, through",
          `€${facts.tallinnSpb.price}`,
          "both cars and the walk between them",
        ],
        ["Tallinn port — Koidula", eur("koidula"), "270 km, crossed by car rather than on foot"],
        ["Meeting at the terminal with a name board", "€0", "ferry waiting time is not charged"],
        ["Luggage, child seat, night departure", "€0", "no surcharges"],
      ],
      note:
        "If the ferry is late we wait, exactly as with a delayed flight: we track the sailing and there is no charge for it. No prepayment either — you settle after the journey.",
    },
    blocks: [
      {
        eyebrow: "Planning",
        title: "Fitting the ferry and the border into one day",
        lead:
          "The only genuinely difficult part is the timetable. Everything else is settled in advance with one message.",
        headings: true,
        items: [
          {
            title: "Count backwards from 19:00",
            text: "The Narva-1 crossing closes at 19:00. Tallinn to the checkpoint is 2 h 30 min, plus a margin for the queue, which stretches into hours in summer and on public holidays. That means leaving Tallinn by the middle of the day, which means a morning ferry.",
            specs: [
              ["Crossing closes", "19:00"],
              ["Tallinn to the border", "≈ 2 h 30 min"],
              ["Sensible margin for the queue", "at least 2 hours"],
            ],
          },
          {
            title: "A morning ferry is the only reliable option",
            text: "Sailings from Helsinki start early and take 2 to 2.5 hours. A morning ferry leaves a full day of margin. An afternoon one only works if the queue happens to be short, and that is not something to plan around.",
          },
          {
            title: "An evening ferry means an overnight stop",
            text: "Not a disaster, but a choice: stay in Tallinn and leave in the morning, or drive to Narva in the evening and sleep there so you are first at the crossing. Narva hotels with addresses are in the <a href=\"/en/kak-dobratsya-do-granicy/\">general border guide</a>.",
          },
          {
            title: "What to send us in advance",
            text: "The sailing number and the date. We check the timetable and the arrival time ourselves: the car will be at the terminal even if the ferry runs late. We confirm the exact fare by message before departure.",
          },
        ],
        note:
          "<strong>The return works the same way.</strong> We collect you at the exit from the Narva checkpoint and drive you to the Tallinn ferry terminal for your sailing — <a href=\"/en/transfer-narva-tallinn/\">Narva to Tallinn</a>, €130. Arrange it in advance: finding a car at the border is close to impossible.",
      },
    ],
    crossing: {
      eyebrow: "The border crossing",
      title: "What to know about Narva",
      items: [
        {
          title: "On foot only",
          text: "The Friendship Bridge is closed to cars: the Narva border is crossed on foot through a covered walkway. Vehicles use <a href=\"/en/transfer-tallinn-koidula/\">Koidula</a> or Luhamaa, which is a different road and a different price.",
        },
        {
          title: "Hours and the queue",
          text: "07:00 to 19:00, closed overnight. The queue takes anything from half an hour to several hours and cannot be predicted. <em>The hours have changed several times in the past two years — check politsei.ee before you travel.</em>",
        },
        {
          title: "Passports and visas",
          text: "Finnish and other EU citizens need a visa to enter Russia, and not every crossing accepts the electronic one. We are not a border authority and cannot arrange it — check official sources in advance, because being turned away at the border does not refund the journey.",
        },
      ],
    },
    faq: {
      eyebrow: "Questions",
      title: "Common questions about the route from Helsinki",
      items: [
        {
          q: "Can you get from Helsinki to Saint Petersburg in one day?",
          a: "Yes, on a morning ferry. The crossing takes 2 to 2.5 hours, Tallinn to the border 2 h 30 min, the walk across anything from half an hour to several hours, and then 2 h 30 min to Petersburg. Around ten hours in total with a kind queue. An afternoon ferry makes it risky: the crossing closes at 19:00 and latecomers are not let through.",
        },
        {
          q: "Do you sell ferry tickets?",
          a: "No. You book the ferry yourself with Tallink, Viking Line or Eckerö Line, directly or through an aggregator. We do not resell them and take no commission. Our part starts at the Tallinn terminal: send the sailing number and the car will be there when it docks.",
        },
        {
          q: "Does meeting at the port cost more than a hotel pickup?",
          a: "No, the price is the same. The port is part of the standard fare, like the airport, a hotel or any address in Tallinn: €130 per car to Narva, €200 for the through journey to Petersburg. We meet you at the terminal with a name board, help with the luggage, and ferry waiting time is not charged.",
        },
        {
          q: "What happens if the ferry is delayed?",
          a: "Nothing. We track the sailing and arrive for the actual docking time — there is no waiting charge, exactly as with delayed flights. If the delay is bad enough that the crossing can no longer be reached before closing, we will say so honestly and suggest moving the departure to the morning rather than driving you to a closed gate.",
        },
      ],
    },
    links: [
      {
        label: "Tallinn to Narva transfer",
        note: `${eur("narva")}, 210 km`,
        href: "/transfer-tallinn-narva/",
      },
      {
        label: "Tallinn to Saint Petersburg, through",
        note: `€${facts.tallinnSpb.price}, both cars`,
        href: "/transfer-tallinn-spb/",
      },
      {
        label: "How to reach the border: every option",
        note: "Narva, Koidula and Luhamaa",
        href: "/kak-dobratsya-do-granicy/",
      },
      {
        label: "Back again: Narva to Tallinn",
        note: "to the ferry, €130",
        href: "/transfer-narva-tallinn/",
      },
    ],
    cta: {
      title: "We will meet you at the Tallinn ferry terminal",
      text: "Send the sailing number and the date — we will check the timetable, confirm the exact fare and be at the terminal when you dock. Need the whole way to Petersburg? We will arrange both cars in one message.",
    },
    waText:
      "Hello! I am arriving in Tallinn by ferry from Helsinki and need a transfer to the border. Sailing number and date: ",
    schema: {
      name: "Helsinki to Saint Petersburg via Tallinn",
      alternateName: ["Из Хельсинки в Санкт-Петербург через Таллинн"],
      serviceType: "Transfer from the Tallinn ferry terminal to the border crossing",
      description:
        "Getting from Helsinki to Saint Petersburg through Tallinn: a ferry across the gulf, a transfer from the port to the Narva checkpoint and a border crossing on foot. Timings, prices and how to do it in one day.",
      areaServed: [
        { type: "City", name: "Helsinki" },
        { type: "City", name: "Tallinn" },
        { type: "City", name: "Narva" },
        { type: "City", name: "Saint Petersburg" },
      ],
    },
  },

  "kak-dobratsya-do-granicy": {
    // Narva leads and is named as a place, not as "the border": "how to get
    // from Tallinn to Narva" is the most searched of the three legs, and the
    // page previously answered it only with the word "border". Koidula and
    // Luhamaa stay in the title — the page covers all three, and the stats
    // block says so.
    title: "How to Get from Tallinn to Narva, Koidula and Luhamaa",
    description:
      "How to get from Tallinn to Narva, Koidula and Luhamaa: coach, train, car or private transfer. Prices, journey times, crossing hours and the GoSwift queue.",
    ogDescription:
      "Every way to reach the border crossings from Tallinn: prices, journey times, opening hours and the GoSwift queue.",
    breadcrumb: "How to reach the border",
    h1: "How to get from Tallinn to the Russian border: Narva, Koidula, Luhamaa",
    badge: "Guide · updated 23 September 2026",
    footer: { label: "How to reach the border" },
    stats: [
      { value: "210 km", label: "to Narva" },
      { value: "270 km", label: "to Koidula" },
      { value: "280 km", label: "to Luhamaa" },
    ],
    lead:
      "Four ways to reach the checkpoints — with prices, journey times and the honest caveats: where you are dropped two kilometres short of the border and where you are taken to the barrier itself. The figures were collected in August 2026 from carriers' own sites; both prices and timetables on this route change often.",
    answer: [
      "<strong>In short.</strong> There are four ways from Tallinn to the border. <strong>The coach</strong> is cheapest: Lux Express to Narva from €9 and about three hours, while the international services of Baltic Shuttle, Anniston and Ecolines carry on further — to Ivangorod, Pskov and Saint Petersburg. <strong>The train</strong>, Elron, reaches Narva station in about 2 h 50 min; for Koidula it means Tartu and a change onto line R46. <strong>Your own car</strong> can only use Koidula or Luhamaa, and needs a GoSwift queue booking. <strong>A private transfer</strong> costs €130–160 for the whole car, leaves at any hour and drops you at the checkpoint itself.",
      "<strong>About the crossings themselves.</strong> Narva works from 7:00 to 19:00 and takes pedestrians only: cars are not let through. Koidula and Luhamaa accept cars, also from 7:00 to 19:00, and close for the night. <em>The hours have changed several times over the past two years — check politsei.ee before you travel.</em>",
      "The fork in the road is simple. If you cross on foot and travel light, a coach to Narva is the cheapest answer. If you have luggage, children, an early slot at the border, or you need Koidula or Luhamaa, where almost nothing scheduled goes, the last stretch has to be covered by car.",
    ],
    compare: {
      eyebrow: "Comparison",
      title: "Every option in one table",
      lead:
        "Prices and timetables are as of August 2026, taken from the carriers. Check them on the carrier's site before you travel: on this route both change often.",
      caption: "How to get from Tallinn to the Narva, Koidula and Luhamaa border crossings",
      cols: ["Way", "Where it drops you", "Time", "Price", "How you cross"],
      rows: [
        [
          "EstoniaTransfer",
          "at the checkpoint itself",
          "2 h 30 min — 3 h 10 min",
          `€${facts.routes[0].price}–${facts.routes[1].price} per car`,
          "passengers cross on their own, on foot or onward by coach",
        ],
        [
          "Lux Express coach",
          "Narva bus station, ≈ 2 km to the crossing",
          "≈ 3 h 15 min",
          "from €9 per person",
          "on your own, on foot across the bridge",
        ],
        [
          "Baltic Shuttle coach",
          "Narva, then Ivangorod and Saint Petersburg",
          "≈ 2 h 45 min to Narva",
          "from €35 to Saint Petersburg",
          "on foot across the bridge; the coach waits up to two hours",
        ],
        [
          "Anniston coach",
          "Pskov and Saint Petersburg",
          "depends on the queue",
          "from €42 to Saint Petersburg",
          "by the carrier's rules — ask when buying the ticket",
        ],
        [
          "Ecolines coach",
          "Pskov via Koidula",
          "≈ 7 h, 334 km",
          "in the booking system",
          "control inside the checkpoint buildings, no walking",
        ],
        [
          "Elron train",
          "Narva station; Koidula via Tartu",
          "≈ 2 h 50 min to Narva",
          "€13–23 one way",
          "on your own, about 2 km from the station to the crossing",
        ],
        [
          "Your own car",
          "Koidula or Luhamaa only",
          "3 h — 3 h 15 min",
          "fuel and the GoSwift fee",
          "the exit queue is booked in advance in GoSwift",
        ],
      ],
      note:
        "<strong>What to read as the main column.</strong> Not the price but «where it drops you»: two kilometres from Narva station to the checkpoint with suitcases turn a cheap ticket into a miserable finish, and to Koidula and Luhamaa nothing scheduled reaches the gates at all.",
    },
    blocks: [
      /**
       * Section targeting "how to get from Tallinn to Narva" — the most
       * searched of the three legs. Added 23.09.2026 INSTEAD of a separate
       * page, deliberately: a page of its own would be the third covering
       * the same ground (/en/transfer-tallinn-narva/ already exists), Google
       * would treat them as duplicates and all three would lose.
       *
       * So the carriers are NOT repeated here — they are below, in "Each
       * option on its own", and duplicating them within one page is as
       * harmful as duplicating them across pages. This covers only what is
       * specific to Narva: city or crossing, the two kilometres, and
       * counting backwards from closing time.
       *
       * Figures come from the table above rather than being written afresh;
       * within one page they have no right to disagree.
       */
      {
        eyebrow: "This leg",
        title: "Tallinn to Narva: what to decide before buying a ticket",
        lead:
          "The busiest of the three directions, and the only one where you cross on foot. That makes the choice about more than the fare: what decides it is two kilometres that no ticket mentions.",
        headings: true,
        items: [
          {
            title: "Are you going to Narva the city, or to the crossing?",
            text:
              "This matters more than price. Narva's railway station and bus terminal are both in the centre; the Narva-1 crossing is roughly another two kilometres beyond them. If the city is your destination, there is no question — the train and the coach put you exactly where you want to be, and paying for a car is pointless. If the border is your destination, those two kilometres are your problem, and you solve them with whatever luggage you brought.",
            specs: [
              ["Narva station to the crossing", "≈ 2 km on foot"],
              ["A transfer drops you", "at the checkpoint itself"],
            ],
          },
          {
            title: "How much luggage you have",
            text:
              "With a backpack it barely matters — two flat kilometres take half an hour. Two suitcases per person changes the picture completely, and changes it twice: first in Tallinn, where you still have to reach Balti jaam or the coach terminal, then again in Narva. A journey that looks like a single ticket turns out to be three separate moves with your bags.",
          },
          {
            title: "What time you need to be at the crossing",
            text:
              "Narva-1 operates from 07:00 to 19:00, and you should count backwards from that, not forwards from a convenient departure. The queue is unpredictable: on public holidays and through the summer it eats hours. A service arriving in Narva late in the afternoon technically makes it, and in practice can leave you at a closed crossing booking an unplanned hotel — there is a section on Narva hotels below, and that is exactly why it exists.",
            specs: [
              ["Narva-1 hours", "07:00 – 19:00, pedestrians only"],
              ["Allow for the queue", "hours in summer and on holidays, not minutes"],
            ],
          },
          {
            title: "Train, coach and car on this leg",
            text:
              "Briefly, using the figures from the table above. The Lux Express coach is the cheapest option, from €9 and about 3 h 15 min to the bus station. The Elron train is faster than the coach at roughly 2 h 50 min to the station, and costs €13–23. A private transfer is 2 h 30 min and €130 for the whole car, but runs from your door to the barrier itself, without two changes carrying suitcases. For four people it comes out below four tickets; travelling alone and light, it is clearly more expensive — and that is the honest answer.",
            specs: [
              ["Lux Express coach", "from €9 · ≈ 3 h 15 min · to the bus station"],
              ["Elron train", "€13–23 · ≈ 2 h 50 min · to the station"],
              ["Private transfer", "€130 per car · ≈ 2 h 30 min · to the crossing"],
            ],
          },
        ],
        note:
          "<strong>The short version.</strong> Travelling light and heading into the city — take the coach or the train, there is nothing to pay extra for. Heading to the border with luggage, children, or straight from the airport — price the whole journey including those two kilometres, not the ticket.",
      },
      {
        eyebrow: "In detail",
        title: "Each option on its own",
        lead:
          "What is worth knowing before you buy a ticket: where the service leaves from, how far you walk to the crossing and where the catch is.",
        layout: "accordion",
        items: [
          {
            title: "Lux Express: the Tallinn — Narva coach",
            specs: [
              ["Departs from", "Tallinn coach station, Lastekodu 46"],
              ["Services a day", "around 15"],
              ["Journey", "≈ 3 h 15 min"],
              ["Price", "from €9 one way"],
            ],
            text: "The most frequent and the cheapest way to Narva. The coaches run along the highway through Rakvere and Jõhvi; there is Wi-Fi, sockets, a toilet and air conditioning, and a class with more legroom. Tickets are cheaper booked ahead and on a weekday. <strong>The catch:</strong> the coach brings you to Narva bus station, not to the border — about two kilometres remain to the pedestrian checkpoint, some 20–25 minutes on foot with a suitcase. With luggage and children that is the least pleasant part of the trip.",
            link: { label: "luxexpress.eu", href: "https://luxexpress.eu/" },
          },
          {
            title: "Baltic Shuttle: Tallinn — Narva — Ivangorod — Saint Petersburg",
            specs: [
              ["Departures", "00:40, 06:50 and 09:45 from Tallinn coach station"],
              ["Arrival in Narva", "03:40, 09:35 and 12:15"],
              ["Price", "from €35 to Saint Petersburg"],
              ["Luggage", "one piece up to 30 kg plus hand luggage"],
            ],
            text: "A through ticket to Saint Petersburg: Baltic Shuttle takes you to Narva, passengers cross on foot along the covered walkway over the bridge into Ivangorod, and a Russian carrier picks them up on the other side. The coach on the Estonian side waits up to two hours after the crossing. A child ticket starts at €20, under-12s at €28, under-26s and pensioners at €32. <strong>The separate route through Koidula and Pskov has been suspended since 1 July 2026</strong> — if you find it in older articles, those services no longer run.",
            link: { label: "balticshuttle.ee", href: "https://balticshuttle.ee/" },
          },
          {
            title: "Anniston: Tallinn — Pskov — Saint Petersburg",
            specs: [
              ["Departure", "08:20 on Tuesdays, Thursdays and Saturdays"],
              ["From", "Tallinn coach station, Lastekodu 46"],
              ["Price", "from €42 to Saint Petersburg"],
            ],
            text: "A service to Pskov and Saint Petersburg three times a week. The carrier warns of this itself: because of delays at the checkpoints the actual arrival time differs widely from the timetable — do not plan anything urgent for the day you arrive. Which crossing your service uses depends on the route and the day; ask when buying, because that decides whether you walk.",
            link: { label: "anniston.ee", href: "https://anniston.ee/" },
          },
          {
            title: "Ecolines: Tallinn — Pskov via Koidula",
            specs: [
              ["Distance", "334 km"],
              ["Journey", "≈ 7 h"],
              ["Crossing", "Koidula — Kunichina Gora"],
              ["Price", "shown when you pick a date"],
            ],
            text: "On the Pskov route Ecolines uses the southern road crossing at Koidula. The advantage is that <strong>the border is cleared inside the checkpoint buildings</strong>, with no walk across a bridge — with suitcases and children that is noticeably easier than Narva. The timetable changed several times during 2026, so check the date and the fare in the booking system for your day of travel.",
            link: { label: "ecolines.net", href: "https://ecolines.net/" },
          },
          {
            title: "Elron train: Tallinn — Narva and Tartu — Koidula",
            specs: [
              ["Tallinn — Narva", "about 5 trains a day, ≈ 2 h 50 min"],
              ["Price", "€13–23 one way"],
              ["To Koidula", "line R46 from Tartu, ≈ 1 h 20 min"],
              ["Koidula station", "about 2 km from the border"],
            ],
            text: 'The train is the most predictable public transport to Narva: it does not sit in traffic, it is faster than the coach, and there is room for bicycles and luggage. But Narva station, like the bus station, is not at the border — about two kilometres remain to the pedestrian crossing. Koidula by rail takes two steps: Tallinn — Tartu, then the local R46 line with stops at Põlva, Veriora, Orava and Piusa. There are a couple of trains a day on that stretch and about two kilometres from the station to the checkpoint with no transport. If you are already in Tartu, you can reach the crossing <a href="/en/transfer-tartu-koidula-luhamaa/">by car in about an hour for ' + tartu + '</a>.',
            link: { label: "elron.ee", href: "https://elron.ee/" },
          },
          {
            title: "Your own car and the GoSwift queue",
            specs: [
              ["Through Narva", "not possible: the crossing is pedestrian"],
              ["Through Koidula", "yes, 7:00–19:00"],
              ["Through Luhamaa", "yes, 7:00–19:00"],
              ["Queue", "booked at eestipiir.ee"],
            ],
            text: "Cars may only use the southern crossings: Koidula (via Tartu and Põlva) or Luhamaa (on the Riga — Pskov road, at Luhamaa village in Setomaa parish). A place in the queue is booked in advance in the GoSwift system; cars that enter the waiting area without a booking join the live queue and go through if slots are left in that hour. Both crossings are closed at night, so arriving in the morning makes sense. And if you leave the car in Estonia and cross on foot, Narva is usually faster — and a transfer will take you to the crossing.",
            link: { label: "eestipiir.ee", href: "https://www.eestipiir.ee/" },
          },
        ],
      },
      {
        eyebrow: "Where to sleep",
        title: "Hotels in Narva if you miss the crossing",
        lead:
          "The crossing closes at 19:00, and delays at control sometimes mean staying the night. The town is compact: almost every hotel is 5–15 minutes from the checkpoint.",
        layout: "cards",
        place: "bottom",
        items: [
          {
            title: "Narva Hotell",
            specs: [["Address", "A. Puškini tn 6"]],
            text: "A classic hotel by Peter's Square, a couple of steps from the border. A 24-hour reception, a restaurant and free Wi-Fi.",
          },
          {
            title: "Inger Hotell",
            specs: [["Address", "A. Puškini tn 28"]],
            text: "A comfortable option with a 24-hour reception. Modest rooms, a restaurant and free Wi-Fi.",
          },
          {
            title: "Central Hotel",
            specs: [["Address", "Lavretsovi tn 5"]],
            text: "A small hotel in the centre, close to the main routes. It has its own parking.",
          },
          {
            title: "H18B Eurohotel",
            specs: [["Address", "Hariduse tn 18b"]],
            text: "A budget option with high ratings — if you simply need a comfortable night.",
          },
          {
            title: "Narva Port Hostel",
            specs: [["Address", "Jõe tn 3"]],
            text: "An inexpensive hostel with the basics, near the river.",
          },
          {
            title: "Narva Kangelaste 2 Apartments",
            specs: [["Address", "Kangelaste prospekt 2"]],
            text: "Apartments with a kitchen: useful if you want to unpack and cook. The Astri shopping centre is nearby.",
          },
        ],
        note:
          '<strong>A tip.</strong> Before public holidays the rooms go quickly. If you can see you will not clear control before 19:00, book the night in advance. The full list of the town\'s hotels is at <a href="https://visitnarva.ee/" target="_blank" rel="noopener nofollow">visitnarva.ee</a>.',
      },
      /**
       * Operator credentials on the page itself. They already sit in the
       * footer of all 23 pages, but that is small print under a copyright
       * line; here they are in context, on the page where the reader is
       * deciding who to travel with.
       *
       * The service card is described as the DRIVER's, not the company's,
       * which keeps the sentence true. It does not go into the structured
       * data at all — the reason is in facts.legal.
       *
       * Numbers come from facts.legal rather than being typed here: a figure
       * typed into prose eventually disagrees with the footer and the markup.
       */
      {
        eyebrow: "The operator",
        title: "Who runs the service",
        lead:
          "Carrying passengers for payment is a licensed activity in Estonia, and the numbers below are verifiable in public registers. Ask any operator you arrange a border run with for theirs: someone who cannot produce them is working outside the law, and you would have no insurance if something went wrong.",
        layout: "cards",
        place: "bottom",
        items: [
          {
            title: "Legal entity",
            specs: [
              ["Name", facts.legal.name],
              ["Registry code", facts.legal.registryCode],
            ],
            text: "Entered in the Estonian Commercial Register. The code can be checked at ariregister.rik.ee.",
          },
          {
            title: "Passenger transport licence",
            specs: [["Number", facts.legal.transportLicence]],
            text: "Issued to the company. Without it, carrying passengers for payment is not permitted and insurance does not apply during the journey.",
          },
          {
            title: "The driver",
            specs: [["Service card", facts.legal.serviceCard]],
            text: `The same person every time, speaking English and Russian. The car is a ${facts.car} with four passenger seats.`,
          },
        ],
      },
    ],
    price: {
      eyebrow: "Transfer",
      title: `A private transfer: €${facts.routes[0].price}–${facts.routes[1].price} per car`,
      lead:
        `This is what we do. A ${facts.car}, departure at any hour of the day and a drop-off at the checkpoint itself rather than at a station two kilometres away. We collect you from an address, from Tallinn airport or from the cruise port, and help with the luggage.`,
      caption: "Transfer fares from Tallinn to the border crossings",
      rows: [
        ["Tallinn — Narva", eur("narva"), "210 km, about 2 h 30 min, pedestrian crossing"],
        ["Tallinn — Koidula", eur("koidula"), "270 km, about 3 h 5 min, via Tartu"],
        ["Tallinn — Luhamaa", eur("luhamaa"), "280 km, about 3 h 10 min, via Võru"],
        ["From Tartu to Koidula or Luhamaa", tartu, "about an hour on the road, separate page"],
        ["A booked slot in the border queue", `+${queue}`, "for the Narva route only"],
      ],
      note:
        "<strong>When a transfer wins.</strong> For four people it comes out comparable to coach tickets, and for an early departure timed to the 7:00 opening public transport has no answer at all: the first coach reaches Narva later. The price is fixed — traffic, a night departure and the number of suitcases do not change it.",
    },
    crossing: {
      eyebrow: "The crossings",
      title: "Narva, Koidula and Luhamaa: how they differ",
      items: [
        {
          title: "Narva — on foot only, 7:00–19:00",
          text: 'A town crossing in the centre of Narva: a pedestrian bridge over the Narva river into Ivangorod. The checkpoint is closed to cars, so people walk — with suitcases, children and prams. Pedestrians do not need a GoSwift booking, but at weekends and on holidays the live queue can be long. <a href="/en/transfer-tallinn-narva/">A transfer to the Narva crossing</a> costs ' + eur("narva") + '.',
        },
        {
          title: "Koidula — cars and coaches, 7:00–19:00",
          text: 'A road crossing in the south-east, opposite Kunichina Gora, 270 km from Tallinn. Control is cleared inside the checkpoint buildings without stepping outside, which is why the coach routes to Pskov use it. At night, from 19:00 to 7:00, it is closed. Koidula railway station is about two kilometres from the border. <a href="/en/transfer-tallinn-koidula/">A transfer to Koidula</a> costs ' + eur("koidula") + '.',
        },
        {
          title: "Luhamaa — cars, 7:00–19:00",
          text: 'A crossing on the Riga — Pskov road at Luhamaa village in Setomaa parish, 280 km from Tallinn; Shumilkino lies opposite. International coaches to Pskov and Saint Petersburg use Luhamaa, and their passengers clear the border without leaving the vehicle. Closed at night. <a href="/en/transfer-tallinn-luhamaa/">A transfer to Luhamaa</a> costs ' + eur("luhamaa") + '.',
        },
        {
          title: "What matters about the GoSwift queue",
          text: 'GoSwift (<a href="https://www.eestipiir.ee/" target="_blank" rel="noopener nofollow">eestipiir.ee</a>) is the official system for booking a place in the queue to leave Estonia by vehicle; it does not concern pedestrians. Cars that enter the waiting area without a booking are registered in the live queue automatically and pass if slots remain in the current hour. Before public holidays the slots are taken early.',
        },
      ],
    },
    faq: {
      eyebrow: "FAQ",
      title: "Short and to the point",
      items: [
        {
          q: "How much does it cost to get from Tallinn to Narva?",
          a: `By Lux Express coach from €9 per person, by Elron train €13–23, by private transfer ${eur("narva")} for the whole car with up to four people. The coach and the train bring you to Narva's stations, about two kilometres short of the pedestrian crossing; the transfer takes you to the checkpoint itself.`,
        },
        {
          q: "Can I cross the border at Narva by car?",
          a: "No, the Narva checkpoint is for pedestrians: cars are not let through. Border crossings by car are Koidula and Luhamaa, with a queue slot booked in the GoSwift system.",
        },
        {
          q: "What time do the crossings close?",
          a: "Narva, Koidula and Luhamaa work from 7:00 to 19:00 and close for the night. The hours have changed several times over the past two years, so check politsei.ee before you travel.",
        },
        {
          q: "How do I reach Koidula from Tallinn without a car?",
          a: `There is no direct public transport to the checkpoint itself. Three options: a coach to Pskov that passes through Koidula, the Tallinn — Tartu train with a change onto line R46 to Koidula station plus a two-kilometre walk, or a private transfer from door to border for ${eur("koidula")}.`,
        },
        {
          q: "How do I reach Luhamaa?",
          a: "Under your own steam, only by car or on an international coach to Pskov and Saint Petersburg: there is no scheduled transport to the crossing or to the nearest village, and some thirty kilometres remain from Võru to the border. So Luhamaa is usually reached by private car or by transfer.",
        },
        {
          q: "Which is faster — coach, train or transfer?",
          a: "To Narva: the train takes about 2 h 50 min, the coach about 3 h 15 min, a transfer 2 h 30 min — and it spends no time on the way from the station to the crossing. To Koidula and Luhamaa nothing public is quick: there are no direct services to the checkpoints.",
        },
        {
          q: "Can I leave at night to be at the border when it opens?",
          a: "Coaches and trains do not run that early: the first coach reaches Narva around half past six in the morning, and you still have to walk to the crossing. A transfer leaves at any hour — an early departure for the 7:00 opening is ordinary work for us, with no night surcharge.",
        },
        {
          q: "Where can I stay in Narva if I miss the crossing?",
          a: "Most of the town's hotels are 5–15 minutes from the checkpoint. Comfortable: Narva Hotell (A. Puškini tn 6), Inger Hotell (A. Puškini tn 28), Central Hotel (Lavretsovi tn 5). Budget: H18B Eurohotel (Hariduse tn 18b), Narva Port Hostel (Jõe tn 3) and Narva Kangelaste 2 Apartments (Kangelaste prospekt 2).",
        },
      ],
    },
    sources: [
      { label: "luxexpress.eu", href: "https://luxexpress.eu/" },
      { label: "balticshuttle.ee", href: "https://balticshuttle.ee/" },
      { label: "anniston.ee", href: "https://anniston.ee/" },
      { label: "ecolines.net", href: "https://ecolines.net/" },
      { label: "elron.ee", href: "https://elron.ee/" },
      { label: "eestipiir.ee", href: "https://www.eestipiir.ee/" },
      { label: "politsei.ee", href: "https://www.politsei.ee/en" },
      { label: "visitnarva.ee", href: "https://visitnarva.ee/" },
    ],
    links: [
      { label: "Transfer Tallinn — Narva", note: eur("narva"), href: "/transfer-tallinn-narva/" },
      { label: "Transfer Tallinn — Koidula", note: eur("koidula"), href: "/transfer-tallinn-koidula/" },
      { label: "Transfer Tallinn — Luhamaa", note: eur("luhamaa"), href: "/transfer-tallinn-luhamaa/" },
      { label: "From Tartu to the border", note: tartu, href: "/transfer-tartu-koidula-luhamaa/" },
    ],
    cta: {
      title: "We drive you to the crossing itself",
      text: "Send the date, the time and the address — we will confirm the car, the price and the exact departure hour in one message.",
    },
    waText: "Hello! I would like to book a transfer to the border.",
    schema: {
      name: "How to get from Tallinn to the Russian border",
      serviceType: "Guide to reaching the border crossings",
      description:
        "Coach, train, your own car and a private transfer to the Narva, Koidula and Luhamaa border crossings: prices, journey times, opening hours, the GoSwift queue and hotels in Narva.",
      areaServed: [
        { type: "City", name: "Tallinn" },
        { type: "City", name: "Narva" },
        { type: "Place", name: "Koidula" },
        { type: "Place", name: "Luhamaa" },
      ],
    },
  },
};
