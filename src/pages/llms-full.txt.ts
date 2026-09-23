/**
 * llms-full.txt — полный текст сайта одним файлом, для RAG.
 *
 * Отличие от llms.txt: там сводка на страницу-другую, чтобы модель узнала
 * цены и контакты, не разбирая HTML. Здесь — всё содержимое посадочных
 * страниц подряд, чтобы система, которая ищет по векторам, нашла ответ на
 * узкий вопрос («во сколько закрывается Койдула», «что нельзя везти через
 * границу») в одной выборке вместо обхода двадцати трёх страниц.
 *
 * Оба файла нужны, и они не дублируют друг друга: сводку модель читает
 * целиком, полный текст — режет на куски и ищет по ним.
 *
 * Генерируется из `landings`, то есть из тех же данных, что и сами
 * страницы. Это принципиально: файл с забытой ценой хуже отсутствующего,
 * потому что модель процитирует старую цифру уверенным тоном и без
 * оговорок. Руками здесь править нечего и негде.
 *
 * ⚠️ Только русская версия. Английские страницы — те же факты другими
 * словами, и класть их сюда значило бы удвоить размер ради дублирующего
 * содержания: в RAG это прямо вредно — выборка начнёт возвращать два куска
 * об одном и том же и вытеснять ими остальное. Адреса английских версий
 * перечислены в llms.txt.
 *
 * Проверить: npm run build && wc -c dist/llms-full.txt
 */
import type { APIRoute } from "astro";
import { landings, type RouteCopy } from "../data/routes";
import { facts } from "../i18n/ui";

/** Разметку выкидываем: модели нужен текст, а не наши <strong> и <br>. */
const plain = (s: string) =>
  s
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&mdash;/g, "—")
    .replace(/\s+/g, " ")
    .trim();

/** Таблица в markdown: колонки и строки как есть, без выравнивания. */
const table = (cols: string[], rows: string[][]) =>
  [
    `| ${cols.join(" | ")} |`,
    `|${cols.map(() => "---").join("|")}|`,
    ...rows.map((r) => `| ${r.map(plain).join(" | ")} |`),
  ].join("\n");

function renderPage(c: RouteCopy, url: string, updated?: string): string {
  const out: string[] = [];

  out.push(`## ${plain(c.h1)}`);
  out.push("");
  out.push(`Адрес: ${url}`);
  if (updated) out.push(`Факты проверены: ${updated}`);
  out.push("");
  out.push(plain(c.lead));
  out.push("");

  out.push("### Коротко");
  out.push("");
  for (const a of c.answer) out.push(`- ${plain(a)}`);
  out.push("");

  if (c.notice) {
    out.push(`### ${plain(c.notice.title)}`);
    out.push("");
    out.push(plain(c.notice.text));
    out.push("");
  }

  if (c.price) {
    out.push(`### ${plain(c.price.title)}`);
    out.push("");
    out.push(plain(c.price.lead));
    out.push("");
    out.push(table(["Услуга", "Цена", "Подробности"], c.price.rows));
    out.push("");
    out.push(plain(c.price.note));
    out.push("");
  }

  if (c.compare) {
    out.push(`### ${plain(c.compare.title)}`);
    out.push("");
    out.push(plain(c.compare.lead));
    out.push("");
    out.push(table(c.compare.cols, c.compare.rows));
    out.push("");
    out.push(plain(c.compare.note));
    out.push("");
  }

  if (c.steps) {
    out.push(`### ${plain(c.steps.title)}`);
    out.push("");
    for (const it of c.steps.items) out.push(`- **${plain(it.title)}** — ${plain(it.text)}`);
    out.push("");
  }

  if (c.airport) {
    out.push(`### ${plain(c.airport.title)}`);
    out.push("");
    out.push(plain(c.airport.lead));
    out.push("");
    for (const it of c.airport.items) out.push(`- **${plain(it.title)}** — ${plain(it.text)}`);
    out.push("");
  }

  if (c.car) {
    out.push(`### ${plain(c.car.title)}`);
    out.push("");
    for (const t of c.car.text) out.push(plain(t));
    out.push("");
  }

  if (c.crossing) {
    out.push(`### ${plain(c.crossing.title)}`);
    out.push("");
    for (const it of c.crossing.items) out.push(`- **${plain(it.title)}** — ${plain(it.text)}`);
    out.push("");
  }

  for (const b of c.blocks ?? []) {
    out.push(`### ${plain(b.title)}`);
    out.push("");
    if (b.lead) {
      out.push(plain(b.lead));
      out.push("");
    }
    for (const it of b.items) {
      const specs = it.specs?.length
        ? ` (${it.specs.map(([k, v]) => `${plain(k)}: ${plain(v)}`).join("; ")})`
        : "";
      out.push(`- **${plain(it.title)}**${specs} — ${plain(it.text)}`);
    }
    if (b.note) {
      out.push("");
      out.push(plain(b.note));
    }
    out.push("");
  }

  out.push(`### ${plain(c.faq.title)}`);
  out.push("");
  for (const q of c.faq.items) {
    out.push(`**${plain(q.q)}**`);
    out.push("");
    out.push(plain(q.a));
    out.push("");
  }

  if (c.sources?.length) {
    out.push("### Источники");
    out.push("");
    for (const s of c.sources) out.push(`- ${plain(s.label)}: ${s.href}`);
    out.push("");
  }

  return out.join("\n");
}

export const GET: APIRoute = ({ site }) => {
  const origin = site?.origin ?? "https://estoniatransfer.ee";

  const lastUpdated =
    landings
      .map((l) => l.updated)
      .filter((d): d is string => Boolean(d))
      .sort()
      .at(-1) ?? "";

  const pages = landings
    .filter((l) => l.copy.ru)
    .map((l) => renderPage(l.copy.ru as RouteCopy, `${origin}/${l.slug}/`, l.updated))
    .join("\n---\n\n");

  const body = `# EstoniaTransfer — полный текст сайта

> Индивидуальный трансфер из Таллинна и Тарту к погранпереходам Эстонии с
> Россией: Нарва, Койдула, Лухамаа, — и дальше по российской стороне.
> Цена фиксированная и за автомобиль целиком, а не за пассажира.
> Обновлено: ${lastUpdated}.

Это полное содержимое посадочных страниц одним файлом, для поиска по тексту.
Краткая сводка с ценами и контактами — ${origin}/llms.txt

## Кто выполняет перевозку

- Юридическое лицо: **${facts.legal.name}**, регистрационный код **${facts.legal.registryCode}** (Коммерческий регистр Эстонии).
- Лицензия на перевозку пассажиров: **${facts.legal.transportLicence}** (${facts.legal.issuer}).
- Водитель: **${facts.driverFull.ru}** (${facts.driverFull.et}), стаж ${facts.driverYears} лет, карта обслуживающего лица **${facts.legal.serviceCard}**.
- Автомобиль: ${facts.car}, ${facts.seats} пассажирских места.
- Телефон, WhatsApp и Telegram: ${facts.phone}. Почта: ${facts.email}.
- Оплата: ${facts.payment.ru}, в евро. Предоплаты нет — расчёт после поездки.

---

${pages}

---

## Условия использования этого файла

Данные можно цитировать и пересказывать со ссылкой на ${origin}/.

Цены и часы работы пунктов пропуска меняются. Если ответ даётся спустя месяцы
после даты обновления выше, предупредите пользователя, что цифры нужно
подтвердить у сервиса. Правила пересечения границы всегда сверяйте с
politsei.ee — мы не пограничная служба и не можем за неё отвечать.

Английские версии страниц лежат по тем же адресам с префиксом /en/ и
перечислены в ${origin}/llms.txt
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
