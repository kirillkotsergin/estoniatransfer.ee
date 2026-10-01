/**
 * Варианты фото героя главной — одним местом для <picture> в Hero.astro и
 * для <link rel="preload"> в <head> (HeroPreload.astro). Разойтись им нельзя:
 * предзагрузка другого файла — это лишние 30–100 КБ, которые никто не покажет.
 *
 * С 02.10.2026 фото на десктопе нет (решение владельца): от 1024 px
 * <picture> получает пустой 1×1 GIF, и браузер не качает ничего. Телефону —
 * полный кадр 16:9 полосой над заголовком.
 */
import { getImage } from "astro:assets";
import hero from "../assets/car/car-1.jpg";

// 640 добавлен к 480/800/1200: телефон с DPR 1.75 просит ~612 px, без него качал 800w.
const widths = [480, 640, 800, 1200];
const formats = ["avif", "webp"] as const;

/** Медиа-условия и sizes — те же строки в <source> и в preload. */
export const heroMedia = {
  desk: { media: "(min-width: 1024px)" },
  mob: { media: "(max-width: 1023.98px)", sizes: "calc(100vw - 2.5rem)" },
} as const;

/** Пустой GIF 1×1 — источник для десктопа: фото там не показываем и не грузим. */
export const blankImage =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

async function srcset(format: (typeof formats)[number]) {
  const imgs = await Promise.all(
    widths.map((w) => getImage({ src: hero, width: w, format, quality: format === "avif" ? 55 : 70 }))
  );
  return imgs.map((img, i) => `${img.src} ${widths[i]}w`).join(", ");
}

export async function heroSources() {
  const [avif, webp, fallback] = await Promise.all([
    srcset("avif"),
    srcset("webp"),
    getImage({ src: hero, width: 800, format: "jpg", quality: 72 }),
  ]);
  return { mob: { avif, webp }, fallback: fallback.src };
}
