/**
 * Проверка, что служебный текст закрыт от сниппетов Google.
 *
 * Зачем: Google подставлял в выдачу строку формы «Заявка уходит письмом на
 * info@estoniatransfer.ee…» вместо маршрутов и цен. Лечится атрибутом
 * data-nosnippet, но его легко потерять при рефакторинге вёрстки — и узнать об
 * этом только через неделю по скриншоту выдачи. Поэтому проверка автоматическая.
 *
 * ⚠️ Атрибут действует только на div, span и section. На <aside>, <footer> и
 * <p> Google его игнорирует молча, поэтому скрипт заодно ругается, если атрибут
 * повесили на неподдерживаемый тег.
 *
 * Запуск после сборки:
 *   node tools/check-nosnippet.mjs
 *
 * Почему отдельный файл, а не node -e в одну строку: внутри `node -e '…'` в
 * Git Bash последовательность \\b схлопывается в символ backspace, регулярка
 * <div\b тихо перестаёт совпадать, и проверка рапортует о дырах, которых нет.
 * Дважды на это попался, пока не вынес код в файл.
 */

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/** Строки, которых не должно быть в сниппете: служебные, не про услугу. */
const FILLER = [
  "Заявка уходит письмом",
  "request is emailed",
  "Ответим сразу",
  "We reply instantly",
];

/** Google поддерживает атрибут только на этих тегах. */
const ALLOWED_TAGS = new Set(["div", "span", "section"]);

/** Границы каждого элемента с data-nosnippet: [начало, конец] по вложенности. */
function nosnippetRanges(html, file, problems) {
  const ranges = [];
  const open = /<([a-z]+)[^>]*\sdata-nosnippet[^>]*>/g;
  let m;
  while ((m = open.exec(html)) !== null) {
    const tag = m[1];
    if (!ALLOWED_TAGS.has(tag)) {
      problems.push(`${file}: data-nosnippet на <${tag}> — Google его там игнорирует`);
    }
    // Регулярка собирается из литерала, а не из строки: так \b остаётся \b.
    const walker = new RegExp(`<${tag}\\b|</${tag}>`, "g");
    walker.lastIndex = m.index + m[0].length;
    let depth = 1;
    let end = html.length;
    let step;
    while (depth > 0 && (step = walker.exec(html)) !== null) {
      depth += step[0].charAt(1) === "/" ? -1 : 1;
      if (depth === 0) {
        end = walker.lastIndex;
        break;
      }
    }
    ranges.push([m.index, end]);
  }
  return ranges;
}

const pages = [];
(function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (entry.name.endsWith(".html")) pages.push(p);
  }
})("dist");

const problems = [];
let checked = 0;

for (const file of pages.sort()) {
  const html = readFileSync(file, "utf8");
  const ranges = nosnippetRanges(html, file, problems);
  for (const needle of FILLER) {
    let i = -1;
    while ((i = html.indexOf(needle, i + 1)) >= 0) {
      checked += 1;
      const covered = ranges.some(([from, to]) => i > from && i < to);
      if (!covered) problems.push(`${file}: «${needle}» вне data-nosnippet`);
    }
  }
}

console.log(`Страниц: ${pages.length}, вхождений служебного текста: ${checked}`);
if (problems.length) {
  for (const p of problems) console.log(`  !! ${p}`);
  console.log(`\nПроблем: ${problems.length}`);
  process.exit(1);
}
console.log("Весь служебный текст закрыт от сниппетов.");
