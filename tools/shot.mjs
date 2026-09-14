/**
 * Скриншот одного блока страницы — чтобы проверять вёрстку глазами, а не
 * верить разметке на слово.
 *
 * Запуск в два шага:
 *   1. "C:/Program Files/Google/Chrome/Application/chrome.exe" \
 *        --headless=new --disable-gpu --remote-debugging-port=9222 about:blank
 *   2. node tools/shot.mjs <url> <out.png> [css-селектор] [ширина]
 *
 * Ширина по умолчанию 1280. Четвёртым аргументом задаётся любая другая —
 * подвал и шапку приходится смотреть и на 390, где колонки складываются
 * в одну, и «на глаз по десктопу» этого не поймать.
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

const [, , url, out, selector = "footer", width = "1280"] = process.argv;
if (!url || !out) {
  console.error("node tools/shot.mjs <url> <out.png> [селектор] [ширина]");
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
    width: Number(width),
    height: 900,
    deviceScaleFactor: 2,
    // mobile: true меняет не только ширину, но и обработку viewport-метатега
    // и масштаб шрифтов — снимок тогда не сравним с десктопным. Нам нужна
    // только ширина, поэтому false на любой ширине.
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
  // Третья ловушка, и она проявляется только на узких экранах. Без
  // captureBeyondViewport всё, что выходит за высоту окна (900), попадает в
  // кадр белым: на 1280 подвал в окно влезает и кажется, что всё работает, а
  // на 390 он растягивается на 1500+ и снимок обрезается по середине. Плюс
  // поверх верха блока оказывается залипшая шапка — она в вьюпорте, а мы
  // снимаем ниже. С этим флагом Chrome рендерит нужный кусок целиком.
  const shot = await call("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true,
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
