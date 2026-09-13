/**
 * Скриншот одного блока страницы — чтобы проверять вёрстку глазами, а не
 * верить разметке на слово.
 *
 * Запуск в два шага:
 *   1. "C:/Program Files/Google/Chrome/Application/chrome.exe" \
 *        --headless=new --disable-gpu --remote-debugging-port=9222 about:blank
 *   2. node tools/shot.mjs <url> <out.png> [css-селектор]
 *
 * ⚠️ Две ловушки, ради которых файл и существует.
 *
 * Первая: `clip` у Page.captureScreenshot задаётся в координатах СТРАНИЦЫ, а
 * getBoundingClientRect отдаёт координаты вьюпорта. Без прибавки scrollX/scrollY
 * кадр уезжает к началу документа, и на выходе пустой белый прямоугольник —
 * выглядит как «блок не отрисовался», хотя с блоком всё в порядке.
 *
 * Вторая: ширину окна headless-хрома НЕ задаёт --window-size, страница
 * рендерится шире и скриншот просто обрезается. Настоящую ширину ставит только
 * Emulation.setDeviceMetricsOverride — та же причина описана в measure-header.mjs.
 */
import { writeFileSync } from "node:fs";

const [, , url, out, selector = "footer"] = process.argv;
if (!url || !out) {
  console.error("node tools/shot.mjs <url> <out.png> [селектор]");
  process.exit(1);
}

const list = await fetch("http://localhost:9222/json/list").then((r) => r.json());
const page = list.find((t) => t.type === "page");
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
  const r = pending.get(m.id);
  if (r) {
    r(m.result);
    pending.delete(m.id);
  }
};

ws.onopen = async () => {
  await call("Emulation.setDeviceMetricsOverride", {
    width: 1280,
    height: 900,
    deviceScaleFactor: 2,
    mobile: false,
  });
  await call("Page.navigate", { url });
  await new Promise((r) => setTimeout(r, 2500));

  const { result } = await call("Runtime.evaluate", {
    expression: `(() => {
      // Блоки появляются по классу .reveal (прозрачность + сдвиг), анимацию
      // запускает IntersectionObserver при прокрутке. На снимке это ловится
      // как «блок не отрисовался»: кадр пустой, хотя вёрстка цела. Для
      // скриншота состояние «уже показано» — единственное осмысленное.
      document.querySelectorAll(".reveal").forEach((e) => e.classList.remove("reveal"));
      const el = document.querySelector(${JSON.stringify(selector)});
      if (!el) return null;
      el.scrollIntoView({ block: "center", behavior: "instant" });
      const b = el.getBoundingClientRect();
      return { x: b.x + scrollX, y: b.y + scrollY, width: b.width, height: b.height };
    })()`,
    returnByValue: true,
  });

  if (!result.value) {
    console.error("элемент не найден:", selector);
    process.exit(1);
  }

  const b = result.value;
  const pad = 20;
  const shot = await call("Page.captureScreenshot", {
    format: "png",
    clip: {
      x: Math.max(0, b.x - pad),
      y: Math.max(0, b.y - pad),
      width: b.width + pad * 2,
      height: b.height + pad * 2,
      scale: 2,
    },
  });
  writeFileSync(out, Buffer.from(shot.data, "base64"));
  console.log(`сохранено: ${out} (${Math.round(b.width)}×${Math.round(b.height)} css px)`);
  process.exit(0);
};
