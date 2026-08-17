/**
 * Карта сайта, собранная из данных.
 *
 * Раньше `public/sitemap.xml` лежал руками, и это ломалось предсказуемо:
 * страницу добавили, в карту дописать забыли. Теперь единственный источник —
 * массив `landings` и список языков, поэтому карта не может отстать от сайта.
 *
 * Что здесь важно:
 * - `lastmod` берётся из поля `updated` страницы, а не из даты сборки. Карта,
 *   в которой все даты меняются от каждой пересборки, обесценивается: краулер
 *   перестаёт считать `lastmod` сигналом.
 * - `xhtml:link` выводится только у страниц, у которых перевод реально есть.
 *   Ссылка на несуществующий перевод — ошибка в Search Console.
 * - Адреса со слэшем на конце, как `trailingSlash: "always"` в конфиге. Карта,
 *   расходящаяся с `canonical` хотя бы слэшем, показывает поисковику два URL.
 *
 * Проверить результат: `npm run build && cat dist/sitemap.xml`.
 */
import type { APIRoute } from "astro";
import { landings } from "../data/routes";
import { languages, localePath, defaultLang, siteUpdated, type Lang } from "../i18n/ui";

const allLangs = Object.keys(languages) as Lang[];

interface Entry {
  path: string;
  /** языки, на которых страница существует */
  langs: Lang[];
  lastmod: string;
  changefreq: string;
  priority: string;
}

export const GET: APIRoute = ({ site }) => {
  const origin = site?.origin ?? "https://estoniatransfer.ee";
  const abs = (lang: Lang, path: string) => new URL(localePath(lang, path), origin).href;

  const entries: Entry[] = [
    { path: "/", langs: allLangs, lastmod: siteUpdated, changefreq: "monthly", priority: "1.0" },
    ...landings.map((r) => ({
      path: `/${r.slug}/`,
      langs: Object.keys(r.copy) as Lang[],
      lastmod: r.updated ?? siteUpdated,
      // у гида цены перевозчиков и часы работы переходов меняются чаще, чем
      // наши тарифы, поэтому обход ему нужен более частый
      changefreq: r.kind === "guide" ? "weekly" : "monthly",
      priority: r.kind === "guide" ? "0.8" : "0.9",
    })),
  ];

  const urls = entries
    .flatMap((e) =>
      e.langs.map((lang) => {
        const alternates =
          e.langs.length > 1
            ? [
                ...e.langs.map(
                  (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${abs(l, e.path)}"/>`
                ),
                `    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(defaultLang, e.path)}"/>`,
              ]
            : [];
        return [
          "  <url>",
          `    <loc>${abs(lang, e.path)}</loc>`,
          `    <lastmod>${e.lastmod}</lastmod>`,
          `    <changefreq>${e.changefreq}</changefreq>`,
          // русская версия приоритетнее английской: аудитория русскоязычная
          `    <priority>${lang === defaultLang ? e.priority : (Number(e.priority) - 0.1).toFixed(1)}</priority>`,
          ...alternates,
          "  </url>",
        ].join("\n");
      })
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Файл генерируется из src/data/routes.ts, править его руками бессмысленно. -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
