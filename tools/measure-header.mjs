/**
 * Замер строки шапки на реальных ширинах экрана.
 *
 * Зачем нужен: на глаз ширину шапки не прикинуть, а ошибка стоит дорого —
 * элемент уезжает за край или появляется горизонтальный скролл, и на своём
 * широком мониторе этого не видно. Скрипт печатает координаты каждого элемента
 * строки и говорит, остался ли штатный отступ 20 px справа.
 *
 * ⚠️ Ловушка, ради которой всё и написано: `chrome --headless --window-size=360,800`
 * окно НЕ сужает. Страница рендерится шире (внутри было 500 px), а скриншот
 * просто обрезается по краю — и выглядит это в точности как переполнение,
 * которого нет. Настоящую ширину задаёт только Emulation.setDeviceMetricsOverride,
 * им скрипт и пользуется.
 *
 * Запуск в три шага:
 *
 *   1. npm run build && npx astro preview --port 4322
 *   2. "C:/Program Files/Google/Chrome/Application/chrome.exe" \
 *        --headless=new --disable-gpu --remote-debugging-port=9222 about:blank
 *   3. node tools/measure-header.mjs http://localhost:4322/ 360 390 640 768 1024
 *
 * Ширины по умолчанию покрывают все точки переключения: 340 (до появления
 * мессенджеров), 360 и 390 (телефоны), 640 (появляется кнопка с номером),
 * 768 и 900 (планшет с навигацией), 1024 и 1280 (десктоп).
 *
 * Рядом с отчётом кладёт скриншоты шапки в tools/.screens/ — их удобно открыть
 * глазами после того, как цифры сошлись.
 */
import { mkdirSync, writeFileSync } from "node:fs";

const [, , target = "http://localhost:4322/", ...rest] = process.argv;
const widths = rest.length ? rest.map(Number) : [340, 360, 390, 640, 768, 900, 1024, 1280];
const OUT = new URL("./.screens/", import.meta.url);

const targets = await fetch("http://localhost:9222/json/list").then((r) => r.json());
const page = targets.find((t) => t.type === "page");
if (!page) {
  console.error("Chrome с --remote-debugging-port=9222 не найден, см. шапку файла");
  process.exit(1);
}

const ws = new WebSocket(page.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();
const call = (method, params = {}) =>
  new Promise((resolve) => {
    const n = ++id;
    pending.set(n, resolve);
    ws.send(JSON.stringify({ id: n, method, params }));
  });

ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  const resolve = pending.get(m.id);
  if (resolve) {
    resolve(m.result);
    pending.delete(m.id);
  }
};

/** Считается в браузере: видимые дети строки шапки и запас справа */
const GEOMETRY = `(() => {
  const row = document.querySelector("header > div");
  const box = row.getBoundingClientRect();
  const kids = [...row.children]
    .filter((el) => getComputedStyle(el).display !== "none")
    .map((el) => {
      const b = el.getBoundingClientRect();
      return { tag: el.tagName.toLowerCase(), x: Math.round(b.x), right: Math.round(b.right) };
    });
  return {
    vw: innerWidth,
    rowRight: Math.round(box.right),
    lastRight: kids.length ? kids[kids.length - 1].right : 0,
    scroll: Math.round(document.documentElement.scrollWidth - innerWidth),
    kids,
  };
})()`;

ws.onopen = async () => {
  mkdirSync(OUT, { recursive: true });
  let bad = 0;

  for (const width of widths) {
    await call("Emulation.setDeviceMetricsOverride", {
      width,
      height: 760,
      deviceScaleFactor: 2,
      mobile: width < 768,
    });
    await call("Page.navigate", { url: target });
    await new Promise((r) => setTimeout(r, 1200));

    const { result } = await call("Runtime.evaluate", { expression: GEOMETRY, returnByValue: true });
    const v = result.value;
    const slack = v.rowRight - v.lastRight;
    // 20 px — это padding px-5 у строки. Меньше — элемент лезет в отступ,
    // отрицательное значение вместе со scroll > 0 — горизонтальный скролл.
    const ok = slack >= 20 && v.scroll <= 0;
    if (!ok) bad++;

    console.log(
      `\n${ok ? "ok" : "!!"} ${width}px (вьюпорт ${v.vw}) — запас справа ${slack}px` +
        (v.scroll > 0 ? `, горизонтальный скролл ${v.scroll}px` : "")
    );
    for (const k of v.kids) {
      console.log(`     ${k.tag.padEnd(5)} ${String(k.x).padStart(4)} … ${String(k.right).padStart(4)}`);
    }

    const shot = await call("Page.captureScreenshot", {
      format: "png",
      clip: { x: 0, y: 0, width, height: 78, scale: 2 },
    });
    writeFileSync(new URL(`./header-${width}.png`, OUT), Buffer.from(shot.data, "base64"));
  }

  console.log(bad ? `\nПроблемных ширин: ${bad}` : "\nВсе ширины в порядке");
  ws.close();
  process.exit(bad ? 1 : 0);
};
