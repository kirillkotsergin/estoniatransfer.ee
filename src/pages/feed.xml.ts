/**
 * Atom-фид обновлений страниц.
 *
 * Зачем он на сайте, где нет блога: фид — это подписка, а карта сайта нет.
 * Агрегатор или пайплайн, который однажды на него подписался, узнаёт о
 * правке сам, без обхода. Боты его и спрашивают: в логах есть запросы
 * /sitemap.rss, которые до 23.09.2026 отдавали 404.
 *
 * ⚠️ Чего он НЕ делает, чтобы не было завышенных ожиданий: он не приведёт
 * ClaudeBot и PerplexityBot. Те берут адреса из графа внешних ссылок, а не
 * из фидов, и пока на сайт никто не ссылается, подписываться на этот фид
 * будет некому. Фид ускоряет доставку тем, кто уже ходит.
 *
 * Atom, а не RSS 2.0: у Atom обязательный `updated` в каждой записи и
 * строгий RFC 3339, то есть именно то, ради чего фид тут и заводится —
 * дата правки. В RSS дата необязательна и формат вольный.
 *
 * Только русские версии. Английская страница — тот же факт на другом
 * языке: пара записей об одной правке для подписчика выглядит как две
 * новости, а новость одна. Адреса /en/ перечислены в llms.txt.
 *
 * Проверить: npm run build && head -40 dist/feed.xml
 */
import type { APIRoute } from "astro";
import { landings } from "../data/routes";
import { facts, siteUpdated } from "../i18n/ui";

/** XML-экранирование: в заголовках и описаниях есть & и кавычки. */
const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

/**
 * Atom требует RFC 3339 с временем и зоной, а `updated` у нас — дата.
 * Добавляем полночь UTC: время правки мы не храним, и выдумывать его,
 * подставляя момент сборки, нельзя — тогда фид «обновлялся» бы при каждой
 * пересборке и подписчик получал бы ложные уведомления.
 */
const rfc3339 = (date: string) => `${date}T00:00:00Z`;

export const GET: APIRoute = ({ site }) => {
  const origin = site?.origin ?? "https://estoniatransfer.ee";
  const self = `${origin}/feed.xml`;

  const entries = landings
    .filter((l) => l.copy.ru && l.updated)
    .map((l) => ({
      url: `${origin}/${l.slug}/`,
      title: l.copy.ru!.breadcrumb,
      summary: l.copy.ru!.description,
      updated: l.updated as string,
    }))
    // Свежие сверху: подписчик читает фид с начала.
    .sort((a, b) => b.updated.localeCompare(a.updated));

  const feedUpdated = entries[0]?.updated ?? siteUpdated;

  const body = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="ru">
  <title>EstoniaTransfer — обновления страниц</title>
  <subtitle>Цены, часы работы погранпереходов и правила пересечения границы: что менялось и когда.</subtitle>
  <link rel="self" type="application/atom+xml" href="${self}"/>
  <link rel="alternate" type="text/html" href="${origin}/"/>
  <id>${origin}/</id>
  <updated>${rfc3339(feedUpdated)}</updated>
  <author>
    <name>${esc(facts.legal.name)}</name>
    <email>${facts.email}</email>
    <uri>${origin}/o-servise/</uri>
  </author>
  <rights>Данные можно цитировать со ссылкой на ${origin}/</rights>
${entries
  .map(
    (e) => `  <entry>
    <title>${esc(e.title)}</title>
    <link rel="alternate" type="text/html" href="${e.url}"/>
    <id>${e.url}</id>
    <updated>${rfc3339(e.updated)}</updated>
    <summary type="text">${esc(e.summary)}</summary>
  </entry>`
  )
  .join("\n")}
</feed>
`;

  return new Response(body, {
    headers: { "Content-Type": "application/atom+xml; charset=utf-8" },
  });
};
