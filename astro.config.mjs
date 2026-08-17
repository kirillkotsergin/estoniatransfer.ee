import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// Статическая сборка: Node нужен только здесь, на сервере его нет и не нужно.
// Все страницы всех языков превращаются в готовые HTML-файлы, которые Apache
// отдаёт за ~50 мс. Для SEO это ровно то же, что SSR, только быстрее и без
// процесса, который может умереть.
export default defineConfig({
  site: "https://estoniatransfer.ee",
  output: "static",
  trailingSlash: "always",
  build: {
    // каждая страница — каталог с index.html, поэтому URL без .html
    format: "directory",
  },
  i18n: {
    defaultLocale: "ru",
    // ET и FI добавляются сюда же, когда будут переводы: остальной код готов
    locales: ["ru", "en"],
    routing: {
      // русский лежит в корне, английский — в /en/
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
