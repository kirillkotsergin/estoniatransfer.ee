/**
 * Что изменилось между двумя картами сайта.
 *
 * Печатает пути страниц, у которых `lastmod` стал другим или которых
 * раньше не было. Нужен ровно для одного: отправлять в IndexNow только
 * изменённое, а не весь сайт после каждой выкладки.
 *
 * Почему это важно, а не педантизм. Поисковики считают повторную отправку
 * неизменившихся адресов спамом и начинают игнорировать отправки целиком —
 * то есть привычка слать все 27 URL «на всякий случай» однажды отключит
 * канал, ради которого он и заведён. Отправка двух правленых страниц —
 * сигнал, отправка всего сайта при правке одной запятой — шум.
 *
 * Запуск:
 *   node tools/changed-urls.mjs <старая-карта.xml> <новая-карта.xml>
 *
 * Печатает пути по одному в строке, готовые для tools/indexnow.sh.
 * Ничего не изменилось — не печатает ничего и выходит с кодом 0.
 */
import { readFileSync } from "node:fs";

/** loc → lastmod из карты сайта. Разбор строкой: XML тут предсказуемый, свой. */
function parse(file) {
  const map = new Map();
  let xml;
  try {
    xml = readFileSync(file, "utf8");
  } catch {
    return null; // файла нет или не читается — отличаем от «пустой карты»
  }
  if (!xml.includes("<urlset")) return null; // не карта: 404, заглушка хостера
  for (const block of xml.split("<url>").slice(1)) {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1]?.trim();
    const mod = block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1]?.trim() ?? "";
    if (loc) map.set(loc, mod);
  }
  return map;
}

const [oldFile, newFile] = process.argv.slice(2);
if (!oldFile || !newFile) {
  console.error("Использование: node tools/changed-urls.mjs <старая.xml> <новая.xml>");
  process.exit(2);
}

const before = parse(oldFile);
const after = parse(newFile);

if (!after) {
  console.error(`Не читается новая карта ${newFile} — нечего сравнивать.`);
  process.exit(2);
}

/*
 * Старой карты нет — значит живой сайт был недоступен в момент снимка.
 * Такое уже случалось: 23.09 хостинг отказывал на всех портах посреди
 * выкладки. Отправлять в этом случае ВЕСЬ сайт нельзя: причина отправки
 * была бы «мы не смогли посмотреть», а поисковик увидит 27 адресов разом.
 * Молчим и говорим об этом вслух.
 */
if (!before) {
  console.error(`Старая карта ${oldFile} недоступна — пропускаю отправку в IndexNow.`);
  process.exit(0);
}

const changed = [];
for (const [loc, mod] of after) {
  const was = before.get(loc);
  if (was === undefined || was !== mod) changed.push(loc);
}

/*
 * Предохранитель. Если изменилось больше половины сайта — это почти
 * наверняка не правка текстов, а ошибка: съехал формат lastmod, сменился
 * домен, карта пересобралась целиком. Отправлять такое в IndexNow вредно,
 * поэтому печатаем ноль адресов и объясняем, что произошло.
 */
const limit = Math.max(5, Math.ceil(after.size / 2));
if (changed.length > limit) {
  console.error(
    `Изменилось ${changed.length} адресов из ${after.size} — это похоже на сбой, ` +
      `а не на правку. Отправка пропущена. Если так и задумано, запустите ` +
      `tools/indexnow.sh вручную.`
  );
  process.exit(0);
}

for (const loc of changed) {
  console.log(new URL(loc).pathname);
}
