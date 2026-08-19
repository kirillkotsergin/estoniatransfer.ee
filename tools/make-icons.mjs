/**
 * Генератор растровых иконок из public/favicon.svg.
 *
 * Запуск: node tools/make-icons.mjs
 * Зависимости: только sharp, он уже стоит как зависимость Astro.
 *
 * Почему скриптом, а не руками: иконок семь, они должны быть согласованы между
 * собой, и любая правка логотипа иначе означает семь ручных экспортов. Правим
 * SVG — перезапускаем скрипт.
 *
 * Что получается и зачем каждый файл:
 *
 *   favicon-48x48.png      Иконка для выдачи Google. Требование у него жёсткое:
 *   favicon-96x96.png      квадрат со стороной, кратной 48 px, либо валидный
 *   favicon-192x192.png    SVG. Отдельные файлы нужны именно поэтому — внутри
 *                          .ico лежат ещё 16 и 32, которые правилу не отвечают.
 *                          192 заодно уходит в манифест как иконка ярлыка.
 *   favicon.ico            16+32+48 в одном файле, для старых браузеров и
 *                          читалок. Браузер просит его сам, если в <head>
 *                          ничего не объявлено.
 *   apple-touch-icon.png   180×180. iOS не умеет SVG и игнорирует прозрачность:
 *                          рисуем на плотном фоне без своих скруглений — систему
 *                          скруглит сама, иначе получится рамка в рамке.
 *   icon-512.png           Android, экран запуска.
 *   icon-maskable-512.png  Adaptive icon: система обрезает иконку под свою форму
 *                          (круг, квадрат со скруглением, каплю). Логотип должен
 *                          лежать внутри safe zone — центральных 80 % — иначе
 *                          обрежется. Поэтому здесь он меньше и на заливке.
 *
 * SVG остаётся основной иконкой для настольных браузеров: он масштабируется без
 * потерь и весит 341 байт.
 */
import { Buffer } from "node:buffer";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pub = path.join(root, "public");
const svgPath = path.join(pub, "favicon.svg");

/** Оранжевый бренда — тот же, что --color-brand в src/styles/global.css */
const BRAND = "#ff6a00";

const svg = await readFile(svgPath);

/**
 * Рендер SVG в PNG. density задаём под целевой размер: у sharp растеризация
 * вектора идёт по dpi, и без этого иконка 512 px выходит мыльной — она
 * увеличивается из растра 64 px, а не рисуется заново.
 */
const render = (size, { scale = 1, background = null } = {}) => {
  const inner = Math.round(size * scale);
  const density = Math.max(72, Math.round((72 * inner) / 64));
  let img = sharp(svg, { density }).resize(inner, inner, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  });

  if (scale < 1 || background) {
    const pad = size - inner;
    const top = Math.floor(pad / 2);
    const left = Math.floor(pad / 2);
    img = img.extend({
      top,
      left,
      bottom: pad - top,
      right: pad - left,
      background: background ?? { r: 0, g: 0, b: 0, alpha: 0 },
    });
  }
  if (background) img = img.flatten({ background });
  return img.png({ compressionLevel: 9 }).toBuffer();
};

/**
 * Сборка .ico. Формат простой: заголовок, по записи на каждый размер, затем
 * сами картинки. Внутрь кладём PNG — это разрешено с Vista и понимают все
 * живые браузеры, а BMP пришлось бы кодировать вручную ради IE6.
 */
const buildIco = (images) => {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = иконка, 2 = курсор
  header.writeUInt16LE(images.length, 4);

  let offset = 6 + images.length * 16;
  const entries = images.map(({ size, data }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0); // 0 означает 256
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2); // палитры нет
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // цветовых плоскостей
    e.writeUInt16LE(32, 6); // бит на пиксель
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    return e;
  });

  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
};

const out = [];

// favicon.ico: три размера в одном файле
const icoSizes = [16, 32, 48];
const icoImages = [];
for (const size of icoSizes) icoImages.push({ size, data: await render(size) });
const ico = buildIco(icoImages);
await writeFile(path.join(pub, "favicon.ico"), ico);
out.push(["favicon.ico", `${icoSizes.join("+")} px`, ico.length]);

// Остальные — обычные PNG
const png = [
  /**
   * Размеры 48, 96, 192 — не вкусовщина, а требование Google к иконке в
   * выдаче: она должна быть квадратной и кратной 48 px. Наш favicon.ico
   * содержит кадры 16, 32 и 48; 48 требованию отвечает, но два других нет, и
   * Google волен взять любой — поэтому для выдачи объявляем отдельные PNG.
   */
  ["favicon-48x48.png", 48, {}],
  ["favicon-96x96.png", 96, {}],
  ["favicon-192x192.png", 192, {}],
  // iOS: плотный фон, логотип чуть меньше поля — система скруглит сама
  ["apple-touch-icon.png", 180, { scale: 0.86, background: BRAND }],
  /**
   * Тот же файл под вторым именем. Старые iOS и часть версий Safari сами
   * запрашивают /apple-touch-icon-precomposed.png в корне, не читая <head>, и
   * без файла получают 404 — в логах он и обнаружился. Заодно это одно из
   * значений rel, которые Google принимает как иконку для выдачи.
   */
  ["apple-touch-icon-precomposed.png", 180, { scale: 0.86, background: BRAND }],
  ["icon-512.png", 512, {}],
  // maskable: логотип внутри центральных 80 %, остальное заливка
  ["icon-maskable-512.png", 512, { scale: 0.62, background: BRAND }],
];

for (const [name, size, opts] of png) {
  const data = await render(size, opts);
  await writeFile(path.join(pub, name), data);
  out.push([name, `${size}×${size}`, data.length]);
}

for (const [name, size, bytes] of out) {
  console.log(`  ${name.padEnd(24)} ${String(size).padEnd(12)} ${(bytes / 1024).toFixed(1)} КБ`);
}
console.log(`\nГотово: ${out.length} файлов в public/. Ссылки на них — в src/layouts/Base.astro.`);
