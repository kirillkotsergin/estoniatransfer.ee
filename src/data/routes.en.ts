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
      caption: "Toyota Corolla — the actual car that will come for you",
      text: [
        "Toyota Corolla: four passenger seats, climate control and a boot that swallows two large suitcases plus hand luggage. This is the driver's own car, not a rotating fleet vehicle, so the interior is clean. Winter tyres in winter, working air conditioning in summer — the road to Narva is long enough for both to matter.",
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
          a: `Yes, at the same price — ${eur("narva")}. Arrange the return in advance: taxis almost never wait at the Narva checkpoint, especially in the evening. You can book both trips in one message.`,
        },
      ],
    },
    links: [
      { label: "Transfer Tallinn — Koidula", note: eur("koidula"), href: "/transfer-tallinn-koidula/" },
      { label: "Transfer Tallinn — Luhamaa", note: eur("luhamaa"), href: "/transfer-tallinn-luhamaa/" },
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
      caption: "Toyota Corolla — the boot takes two large suitcases",
      text: [
        "Toyota Corolla: four passenger seats, climate control, a boot for two large suitcases and hand luggage. Koidula is nearly an hour further than Narva, so winter tyres in winter and working air conditioning in summer are not a formality here.",
        "Kirill is at the wheel and he answers WhatsApp and Telegram himself: you deal with the driver directly, without a dispatcher. He speaks Russian and gets by in English. A stop or a drop-off in Tartu is possible on the way — mention it in advance.",
      ],
    },
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
      ],
    },
    links: [
      { label: "Transfer Tallinn — Narva", note: eur("narva"), href: "/transfer-tallinn-narva/" },
      { label: "Transfer Tallinn — Luhamaa", note: eur("luhamaa"), href: "/transfer-tallinn-luhamaa/" },
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
      caption: "Toyota Corolla — four seats and two suitcases for 280 kilometres",
      text: [
        "Toyota Corolla: four passenger seats, climate control, a boot for two large suitcases and hand luggage. At 280 kilometres this is the longest of our Estonian routes, so the car runs on winter tyres in winter and with working air conditioning in summer. We stop halfway, and that time is already allowed for.",
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
      ],
    },
    links: [
      { label: "Transfer Tallinn — Koidula", note: eur("koidula"), href: "/transfer-tallinn-koidula/" },
      { label: "Transfer Tallinn — Narva", note: eur("narva"), href: "/transfer-tallinn-narva/" },
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
      caption: "Toyota Corolla — the same car as on the Tallinn routes",
      text: [
        "Toyota Corolla: four passenger seats, climate control, two large suitcases in the boot. From Tartu the drive takes about an hour, but it runs on local roads through Setomaa and Võru, so winter tyres in winter matter as much here as on the long routes.",
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
  "kak-dobratsya-do-granicy": {
    title: "How to get from Tallinn to the Russian border: a guide",
    description:
      "Coach, train, car or transfer: what each costs and how far you walk to the Narva, Koidula and Luhamaa crossings. Opening hours, GoSwift queue, Narva hotels.",
    ogDescription:
      "Every way to reach the border crossings from Tallinn: prices, journey times, opening hours and the GoSwift queue.",
    breadcrumb: "How to reach the border",
    h1: "How to get from Tallinn to the Russian border: Narva, Koidula, Luhamaa",
    badge: "Guide · updated 17 August 2026",
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
    ],
    price: {
      eyebrow: "Transfer",
      title: `A private transfer: €${facts.routes[0].price}–${facts.routes[1].price} per car`,
      lead:
        "This is what we do. A Toyota Corolla, departure at any hour of the day and a drop-off at the checkpoint itself rather than at a station two kilometres away. We collect you from an address, from Tallinn airport or from the cruise port, and help with the luggage.",
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
