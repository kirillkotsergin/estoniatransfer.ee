#!/usr/bin/env bash
# Выкладка сайта на zone.ee по SSH. Основной способ деплоя.
#
# Почему не GitHub Actions: прогон падает на шаге «Подготовить SSH» — в секрете
# ZONE_SSH_PRIVATE_KEY лежит не весь ключ, и пуши до сайта не доходят.
# Пока это не исправлено, выкладываем отсюда.
#
# Запуск:
#   bash tools/deploy.sh                # собрать и выложить
#   bash tools/deploy.sh --no-build     # выложить уже собранный dist/
#   bash tools/deploy.sh --checks-only  # только проверки по живому сайту
#
# Что проверяется — и почему здесь, а не в Search Console через шесть недель:
#
#   до отправки    карта сайта сверяется со сборкой в обе стороны: страница не
#                  может ни пропасть из карты, ни остаться в ней после
#                  переименования
#   после отправки каждый адрес отдаёт 200; каждый известный редирект
#                  укладывается в свой бюджет переходов и приводит куда надо;
#                  несуществующий адрес отдаёт 404, а не редирект; карта всё
#                  ещё совпадает с canonical, которые отдаёт сервер
#
# Требуется ssh, tar, curl и node (rsync под Windows нет, на сервере есть).

set -euo pipefail

KEY="$HOME/.ssh/estoniatransfer_deploy"
USER="virt132974"
HOST="estoniatransfer.ee"
ROOT="/data01/virt132974/domeenid/www.estoniatransfer.ee"
REMOTE="$ROOT/htdocs"
SSH=(ssh -i "$KEY" -o BatchMode=yes -o ConnectTimeout=20 "$USER@$HOST")

SITE="https://$HOST"

# Адреса, которые обязаны отдавать 200.
SMOKE_PATHS=(
  "/" "/en/"
  "/transfer-tallinn-narva/" "/transfer-narva-tallinn/"
  "/transfer-tallinn-koidula/" "/transfer-koidula-tallinn/"
  "/transfer-tallinn-luhamaa/" "/transfer-luhamaa-tallinn/"
  "/en/transfer-narva-tallinn/" "/en/transfer-luhamaa-tallinn/"
  "/transfer-ivangorod-spb/"
  "/kak-dobratsya-do-granicy/"
  "/sitemap.xml" "/robots.txt" "/llms.txt" "/favicon.ico" "/hits.php"
)

# Редиректы: <адрес>|<максимум переходов>|<куда обязан привести>.
#
# Бюджет переходов — главное здесь. Google идёт по цепочке примерно пять
# шагов, потом бросает и пишет «Ошибка переадресации», и каждый лишний шаг —
# ещё один шанс отвалиться по таймауту. Но цепочка удлиняется только по
# случайности, и ни сборка, ни проверка «отдаёт ли 200» об этом не скажут:
# адрес по-прежнему доезжает до страницы, просто дольше.
#
# Все значения измерены 23.09.2026.
REDIRECT_CHECKS=(
  "$SITE/index.html|1|$SITE/"
  "$SITE/transfer-luhamaa-tallinn|1|$SITE/transfer-luhamaa-tallinn/"
  "$SITE/en/transfer-narva-tallinn|1|$SITE/en/transfer-narva-tallinn/"

  # Старые адреса карты сайта от WordPress, все на один и тот же файл.
  "$SITE/sitemap_index.xml|1|$SITE/sitemap.xml"
  "$SITE/sitemap.txt|1|$SITE/sitemap.xml"
  "$SITE/sitemap.xml.gz|1|$SITE/sitemap.xml"
  "$SITE/sitemap.rss|1|$SITE/sitemap.xml"

  "https://www.$HOST/|1|$SITE/"
  "http://$HOST/|1|$SITE/"

  # Два перехода, и меньше не будет: zone.ee переводит на https на уровне
  # сервера, ВЫШЕ .htaccess, сохраняя при этом www в адресе. Проверено —
  # http://estoniatransfer.ee/sitemap_index.xml сначала уезжает на https с тем
  # же путём и только потом попадает в наше правило. Значит правило «убрать
  # www» физически не может отработать в том же шаге, а дописывать в
  # .htaccess принудительный https бессмысленно: до него дело не доходит.
  # Три перехода отсюда — это уже регрессия.
  "http://www.$HOST/|2|$SITE/"
)

# Несуществующий адрес обязан отдавать 404, а не редирект.
NOT_FOUND_PATH='/net-takoy-stranicy'

cd "$(dirname "$0")/.."

DO_BUILD=1
MODE='deploy'
for arg in "$@"; do
  case "$arg" in
    --no-build)    DO_BUILD=0 ;;
    --checks-only) MODE='checks' ;;
    *) echo "неизвестный ключ: $arg (есть --no-build и --checks-only)"; exit 1 ;;
  esac
done

# ---------------------------------------------------------------------------
# Проверки по живому сайту
#
# Функцией, а не куском внизу скрипта, чтобы --checks-only гонял ровно те же
# проверки без сборки и без отправки. Возвращает 1, если что-то не сошлось.
# ---------------------------------------------------------------------------

checks() {
  local failed=0 p code out hops final label entry url max_hops want

  echo "▸ проверка адресов"
  for p in "${SMOKE_PATHS[@]}"; do
    code=$(curl -sS -o /dev/null -w '%{http_code}' -L --max-time 25 "$SITE$p" || echo 000)
    printf '  %-38s %s\n' "$p" "$code"
    [ "$code" = "200" ] || failed=1
  done

  # --max-redirs 8 заведомо больше любого бюджета в таблице: на петле лимит
  # исчерпается, curl вернёт ненулевой код, и мы попадём в ветку «не 200»
  # вместо того, чтобы висеть.
  echo "▸ проверка цепочек редиректов"
  for entry in "${REDIRECT_CHECKS[@]}"; do
    IFS='|' read -r url max_hops want <<<"$entry"

    out=$(curl -sS -o /dev/null -L --max-redirs 8 --max-time 25 \
            -w '%{num_redirects} %{http_code} %{url_effective}' "$url" 2>/dev/null) \
      || out='0 000 -'
    read -r hops code final <<<"$out"

    label="${url#http://}"; label="${label#https://}"

    if [ "$code" != "200" ]; then
      printf '  %-46s %s\n' "$label" "$code (или петля)"
      failed=1
    elif [ "$hops" -gt "$max_hops" ]; then
      printf '  %-46s переходов %s, бюджет %s\n' "$label" "$hops" "$max_hops"
      echo "    цепочка удлинилась — смотрите порядок правил в public/.htaccess"
      failed=1
    elif [ "$final" != "$want" ]; then
      printf '  %-46s приводит на %s\n' "$label" "$final"
      failed=1
    else
      printf '  %-46s %s переход → 200\n' "$label" "$hops"
    fi
  done

  out=$(curl -sS -o /dev/null -L --max-redirs 8 --max-time 25 \
          -w '%{num_redirects} %{http_code}' "$SITE$NOT_FOUND_PATH" 2>/dev/null) \
    || out='0 000'
  read -r hops code <<<"$out"
  if [ "$code" = "404" ] && [ "$hops" -eq 0 ]; then
    printf '  %-46s 404 без редиректа\n' "несуществующий адрес"
  else
    printf '  %-46s %s после %s переход(ов)\n' "несуществующий адрес" "$code" "$hops"
    failed=1
  fi

  # Сверка со сборкой прошла до отправки. Здесь проверяется, что сервер карту
  # отдаёт и что каждый <loc> всё ещё сходится с canonical в том HTML, который
  # сейчас лежит на сервере.
  echo "▸ карта сайта по живому сайту"
  node tools/check-sitemap.mjs "$SITE" 2>&1 | sed 's/^/  /' || failed=1

  return "$failed"
}

if [ "$MODE" = 'checks' ]; then
  if checks; then echo "▸ всё сошлось"; exit 0; fi
  echo "▸ проверки не прошли"
  exit 1
fi

# ---------------------------------------------------------------------------
# Сборка и проверка артефакта
# ---------------------------------------------------------------------------

if [ "$DO_BUILD" -eq 1 ]; then
  echo "▸ сборка"
  npm run build
fi

# Проверка готовности до отправки: пустой или недособранный dist смысла
# выкладывать нет, а на сервере уже лежит рабочий сайт.
[ -s dist/index.html ] || { echo "dist/index.html пуст или отсутствует"; exit 1; }
FILES=$(find dist -type f | wc -l)
[ "$FILES" -ge 20 ] || { echo "в dist всего $FILES файлов — похоже на сломанную сборку"; exit 1; }
echo "▸ файлов к выкладке: $FILES"

# Сверка карты со сборкой — здесь, до отправки: страница, пропавшая из карты,
# не ломает сайт и ничем себя не выдаёт, её просто никто не найдёт.
echo "▸ карта сайта против сборки"
node tools/check-sitemap.mjs dist 2>&1 | sed 's/^/  /' \
  || { echo "▸ карта расходится со сборкой — не выкладываю"; exit 1; }

# ---------------------------------------------------------------------------
# Отправка
# ---------------------------------------------------------------------------

# tar, а не rsync: локального rsync под Windows нет. Точка в «-C dist -cf - .»
# обязательна, иначе не уедут .htaccess и другие файлы с точкой.
#
# -m на распаковке гасит предупреждения про время файлов: часы сервера отстают
# на десятки секунд, и tar иначе ругается на «timestamp in the future».
#
# Такая выкладка НЕ удаляет лишние файлы на сервере. Это осознанно: рядом с
# сайтом лежат hits.json (уровнем выше) и it-api.php, а «умное» удаление
# однажды уже снесло рабочий сайт в соседнем проекте.
echo "▸ отправка"
tar -C dist -cf - . 2>/dev/null | "${SSH[@]}" "cd '$REMOTE' && tar -xmf -"

if checks; then
  echo "▸ готово"
else
  echo "▸ выложено, но проверки не прошли — смотрите выше"
  exit 1
fi
