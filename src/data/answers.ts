/**
 * Короткие ответы на конкретные вопросы — блок «Ответы коротко» на главной.
 *
 * Зачем отдельно от FAQ. Обычный FAQ отвечает на вопросы о сервисе: как
 * оплатить, встречаете ли в аэропорту. Здесь другое: сюда собраны вопросы,
 * которые задают не сайту, а ассистенту — «как добраться из Таллинна до
 * границы в Нарве», «сколько стоит трансфер до Лухамаа». Ответ на каждый
 * начинается с числа или прямого «да/нет», потому что модель цитирует первое
 * предложение, а не абзац целиком.
 *
 * ⚠️ Блок ВИДИМЫЙ и таким должен остаться. Скрытый текст с ответами для ботов —
 * это cloaking: Google снимает за него страницу целиком, а модели всё равно
 * читают ту же разметку, что и браузер. Ничего, кроме риска, скрытие не даёт.
 *
 * Вопросы отсюда попадают в FAQPage вместе с вопросами обычного FAQ — оба блока
 * на одной странице, поэтому разметка не расходится с видимым текстом. Две
 * FAQPage на страницу ставить нельзя, поэтому список собирается в Faq.astro.
 *
 * Цены подставляются из facts: правится тариф — правится здесь автоматически.
 */
import { facts } from "../i18n/ui";
import type { Lang } from "../i18n/ui";

const price = (id: "narva" | "koidula" | "luhamaa") =>
  facts.routes.find((r) => r.id === id)!.price;

export interface Answer {
  q: string;
  a: string;
}

export const answers: Record<Lang, Answer[]> = {
  ru: [
    {
      q: "Как добраться из Таллинна до границы в Нарве?",
      a: `Четыре способа. Индивидуальный трансфер — ${price("narva")} € за машину, 210 км и около 2 часов 30 минут, с высадкой у самого пункта пропуска. Автобус Lux Express — от 9 € с человека, но привозит на автовокзал Нарвы, откуда до перехода ещё около 2 км пешком. Поезд Elron — 13–23 €, тоже до вокзала. Своя машина через Нарву не проходит: переход пешеходный.`,
    },
    {
      q: "Сколько стоит частный трансфер до Лухамаа?",
      a: `${price("luhamaa")} € за автомобиль целиком из Таллинна — до четырёх пассажиров с багажом, 280 км и около 3 часов 10 минут через Тарту и Выру. Из Тарту тот же переход стоит ${facts.fromTartu.price} €. Рейсового транспорта до Лухамаа не существует, поэтому туда едут либо своей машиной, либо трансфером.`,
    },
    {
      q: "Сколько стоит трансфер Таллинн — Койдула?",
      a: `${price("koidula")} € за машину, 270 км через Тарту, около 3 часов 5 минут. Койдула — автомобильный переход: границу пересекают, не выходя из салона, но очередь на выезд бронируется заранее в системе GoSwift. Из Тарту до Койдулы — ${facts.fromTartu.price} € и около часа.`,
    },
    {
      q: "Через какие переходы можно проехать на машине, а где только пешком?",
      a: "На машине — Койдула и Лухамаа, обе с бронью очереди в GoSwift. Нарва только пешеходная: легковые автомобили через неё не пропускают, границу проходят по мосту в Ивангород. Все три перехода работают с 7:00 до 19:00 и на ночь закрываются. Режим меняется — сверяйтесь с politsei.ee перед поездкой.",
    },
    {
      q: "Можно заказать трансфер на ночь или к открытию границы в 7:00?",
      a: "Да, выезд возможен в любое время суток, и ночная поездка не дороже дневной. Это основная причина, по которой к открытию перехода едут трансфером: первый автобус приходит в Нарву позже, а поезда так рано не ходят.",
    },
    {
      q: "Как заказать и какой телефон?",
      a: `Напишите в WhatsApp или Telegram на ${facts.phone} либо позвоните — отвечает сам водитель, без диспетчера. В сообщении нужны дата, время, адрес и переход; в ответ придёт подтверждение с ценой и точным часом выезда. Предоплаты нет, расчёт наличными или переводом после поездки.`,
    },
  ],

  en: [
    {
      q: "How do I get from Tallinn to the border at Narva?",
      a: `Four ways. A private transfer costs €${price("narva")} for the car, 210 km and about 2 hours 30 minutes, with a drop-off at the checkpoint itself. The Lux Express coach starts at €9 per person but stops at Narva bus station, about 2 km short of the crossing. The Elron train is €13–23, also to the station. Your own car cannot use Narva: the crossing is for pedestrians only.`,
    },
    {
      q: "How much is a private transfer to Luhamaa?",
      a: `€${price("luhamaa")} for the whole car from Tallinn — up to four passengers with luggage, 280 km and about 3 hours 10 minutes via Tartu and Võru. From Tartu the same crossing costs €${facts.fromTartu.price}. There is no scheduled transport to Luhamaa at all, so people arrive either in their own car or by transfer.`,
    },
    {
      q: "How much is the Tallinn — Koidula transfer?",
      a: `€${price("koidula")} per car, 270 km via Tartu, about 3 hours 5 minutes. Koidula is a road crossing: you cross without leaving the car, but the exit queue has to be booked in advance in the GoSwift system. From Tartu to Koidula it is €${facts.fromTartu.price} and about an hour.`,
    },
    {
      q: "Which crossings can I drive through and which are on foot?",
      a: "By car — Koidula and Luhamaa, both requiring a GoSwift queue booking. Narva is pedestrian only: cars are not let through and the border is crossed on the bridge to Ivangorod. All three work from 7:00 to 19:00 and close for the night. The hours change — check politsei.ee before you travel.",
    },
    {
      q: "Can I book a transfer at night or for the 7:00 border opening?",
      a: "Yes, departures are possible at any hour and a night trip costs no more than a daytime one. That is the main reason people take a transfer to reach the opening: the first coach gets to Narva later and trains do not run that early.",
    },
    {
      q: "How do I book, and what is the phone number?",
      a: `Message WhatsApp or Telegram on ${facts.phone}, or call — the driver answers himself, with no dispatcher. Send the date, the time, the address and the crossing; you get back a confirmation with the price and the exact departure hour. No prepayment: cash or bank transfer after the ride.`,
    },
  ],
};
