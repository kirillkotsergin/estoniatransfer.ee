/**
 * Сверка карты сайта с теми страницами, которые на самом деле собрались.
 *
 * Просто вывести список адресов из карты — половина дела и почти ничего не
 * доказывает: карта, в которой страницы нет, сама по себе выглядит совершенно
 * правильной. Смысл в сверке в обе стороны, поэтому здесь проверяется:
 *
 *   1. Каждая собранная страница есть в карте. Страницы, о которой поисковик
 *      не узнал, для него не существует — именно так URL и попадает в отчёт
 *      «Обнаружена, не проиндексирована».
 *   2. Каждый адрес из карты действительно собран. Ловит остатки от
 *      переименованной или удалённой страницы.
 *   3. Каждый <loc> заканчивается слэшем и живёт на https://estoniatransfer.ee
 *      — иначе карта расходится с `trailingSlash: "always"` и с .htaccess, и
 *      поисковик получает по своей же карте 301 вместо страницы.
 *   4. Каждый <loc> совпадает с `rel=canonical` самой страницы. Карта,
 *      предлагающая неканонический адрес, — это готовый отчёт «Страница
 *      является копией».
 *   5. Каждый hreflang-альтернат сам присутствует в карте. Ссылка на перевод,
 *      которого в карте нет, — ошибка в Search Console.
 *
 * Запуск после сборки:
 *   npm run build && node tools/check-sitemap.mjs
 *
 * Или по живому сайту — тогда заодно проверяется, что сервер отдаёт карту:
 *   node tools/check-sitemap.mjs https://estoniatransfer.ee
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";

const TARGET = (process.argv[2] ?? "dist").replace(/[\\/]+$/, "");
const LIVE = /^https?:\/\//.test(TARGET);
const ORIGIN = "https://estoniatransfer.ee";

/**
 * Страницы, которые собираются, но в карте им не место.
 *
 * ⚠️ Список исключений, а не выключатель проверки. Каждая строка здесь —
 * осознанное решение, и у каждой должна быть причина рядом. Пустая строка
 * без объяснения через месяц превращается в «страница потерялась, и никто
 * не заметил» — ровно то, от чего эта проверка защищает.
 */
const NOT_IN_SITEMAP = new Set([
  // Отдаётся по любому несуществующему адресу; в индексе ей делать нечего.
  "/404.html",

  // Политика конфиденциальности временно скрыта из показа — решение
  // владельца 24.09.2026 до вычитки текста. Страница ЖИВА и отдаёт
  // `noindex, follow`, просто не в карте. Подробности и порядок возврата —
  // в шапке src/pages/privacy.astro.
  "/privacy/",
  "/en/privacy/",
]);

const problems = [];
const fail = (msg) => problems.push(msg);

// ---------------------------------------------------------------------------
// Чтение: каталог и живой сайт отличаются только здесь
// ---------------------------------------------------------------------------

async function load(pathname) {
  if (LIVE) {
    const res = await fetch(new URL(pathname, TARGET));
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.text();
  }
  // '/transfer-luhamaa-tallinn/' -> 'dist/transfer-luhamaa-tallinn/index.html'
  const file = pathname.endsWith("/") ? `${pathname}index.html` : pathname;
  return readFileSync(join(TARGET, file), "utf8");
}

/** Все .html из сборки в виде адресов ('/en/transfer-narva-tallinn/'). */
function builtPages(dir = TARGET, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) builtPages(full, out);
    else if (entry.name.endsWith(".html")) {
      const rel = "/" + relative(TARGET, full).split(sep).join("/");
      out.push(rel.replace(/\/index\.html$/, "/"));
    }
  }
  return out;
}

const tags = (xml, tag) =>
  [...xml.matchAll(new RegExp(`<${tag}>([^<]+)</${tag}>`, "g"))].map((m) => m[1].trim());

// ---------------------------------------------------------------------------
// Карта сайта у нас одна и плоская (src/pages/sitemap.xml.ts), но если она
// когда-нибудь станет индексом — разберём и такой вариант, а не упадём.
// ---------------------------------------------------------------------------

console.log(`Проверяем ${LIVE ? TARGET : `${TARGET}/`}\n`);

let root;
try {
  root = await load("/sitemap.xml");
} catch (err) {
  console.error(`Не читается /sitemap.xml — ${err.message}`);
  console.error("Сначала `npm run build`, либо смотрите src/pages/sitemap.xml.ts.");
  process.exit(1);
}

const sources = [];
if (root.includes("<sitemapindex")) {
  for (const child of tags(root, "loc")) sources.push(new URL(child).pathname);
  console.log(`sitemap.xml — это индекс, внутри карт: ${sources.length}`);
} else {
  sources.push("/sitemap.xml");
}

/** loc -> { hreflang: href } по всем картам. */
const sitemap = new Map();

for (const name of sources) {
  const xml = name === "/sitemap.xml" && sources.length === 1 ? root : await load(name);

  // Режем по <url>, чтобы альтернаты остались при своём <loc>.
  for (const block of xml.split("<url>").slice(1)) {
    const loc = tags(block, "loc")[0];
    if (!loc) continue;
    const alternates = Object.fromEntries(
      [...block.matchAll(/hreflang="([^"]+)"\s+href="([^"]+)"/g)].map((m) => [m[1], m[2]])
    );
    if (sitemap.has(loc)) fail(`${loc} встречается в карте дважды`);
    sitemap.set(loc, alternates);
  }
  console.log(`  ${name} — адресов: ${tags(xml, "loc").length}`);
}

// ---------------------------------------------------------------------------
// Вывод и проверки
// ---------------------------------------------------------------------------

console.log(`\nАдреса в карте (${sitemap.size}):\n`);
for (const [loc, alternates] of [...sitemap].sort()) {
  const langs = Object.keys(alternates);
  console.log(`  ${loc}${langs.length ? `   [${langs.join(" ")}]` : "   [без переводов]"}`);
}

const locPaths = new Set([...sitemap.keys()].map((u) => new URL(u).pathname));

// 3. Форма каждого <loc>.
for (const loc of sitemap.keys()) {
  if (!loc.startsWith(`${ORIGIN}/`)) fail(`${loc} — не на ${ORIGIN}`);
  if (!loc.endsWith("/")) fail(`${loc} — без слэша на конце, сервер ответит на него 301`);
}

// 1 + 2. Сверка в обе стороны.
if (LIVE) {
  console.log("\n(живой сайт: сверку со сборкой пропускаем, читать нечего)");
} else {
  const built = builtPages().filter((p) => !NOT_IN_SITEMAP.has(p));
  for (const page of built) {
    if (!locPaths.has(page)) fail(`${page} собрана, но В КАРТЕ ЕЁ НЕТ`);
  }
  for (const path of locPaths) {
    if (!built.includes(path)) fail(`${path} есть в карте, но не собрана`);
  }
  console.log(`\nСобрано страниц: ${built.length} (+${NOT_IN_SITEMAP.size} вне карты намеренно)`);
}

// 4. Адрес из карты обязан совпадать с canonical самой страницы.
for (const path of locPaths) {
  let html;
  try {
    html = await load(path);
  } catch (err) {
    fail(`${path} есть в карте, но не читается — ${err.message}`);
    continue;
  }
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const expected = new URL(path, ORIGIN).href;
  if (!canonical) fail(`${path} — нет <link rel="canonical">`);
  else if (canonical !== expected) fail(`${path} — canonical ${canonical}, а в карте ${expected}`);
}

// 5. Альтернаты обязаны сами быть в карте.
// Русские страницы (Ивангород, Псков) переводов не имеют и альтернатов не
// содержат вовсе — это нормально, проверяется только то, что объявлено.
for (const [loc, alternates] of sitemap) {
  for (const [lang, href] of Object.entries(alternates)) {
    if (!sitemap.has(href)) fail(`${loc}: hreflang="${lang}" ведёт на ${href}, а его в карте нет`);
  }
}

console.log("");
if (problems.length) {
  for (const p of problems) console.error(`  ОШИБКА  ${p}`);
  console.error(`\nПроблем: ${problems.length}`);
  process.exit(1);
}
console.log(`Порядок — ${sitemap.size} адресов, все канонические, со слэшем и связаны между собой.`);
