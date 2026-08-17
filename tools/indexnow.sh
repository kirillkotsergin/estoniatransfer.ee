#!/usr/bin/env bash
# Отправка адресов в IndexNow — самый быстрый путь в индекс Bing и Яндекса.
#
# Зачем это вообще: из индекса Bing отвечают ChatGPT Search и Copilot, из
# индекса Яндекса — Алиса. Карта сайта сообщает об изменениях «когда-нибудь»,
# IndexNow — в течение минут.
#
# Как работает подтверждение владения: файл public/<ключ>.txt должен отдаваться
# по адресу https://estoniatransfer.ee/<ключ>.txt и содержать сам ключ.
# Удалите файл — отправка начнёт возвращать 403.
#
# Запуск (нужен только curl):
#   bash tools/indexnow.sh              # все страницы из карты сайта
#   bash tools/indexnow.sh /transfer-tallinn-narva/   # только указанные
#
# Повторять после заметных правок текстов и цен. Гонять после каждой мелочи
# не нужно: поисковики считают это спамом и начинают игнорировать отправки.

set -euo pipefail

KEY="8f832852ef7447b79a893e449784ffe2"
HOST="estoniatransfer.ee"
BASE="https://$HOST"

URLS=()
if [ "$#" -gt 0 ]; then
  # Явно переданные пути: bash tools/indexnow.sh /transfer-tallinn-narva/
  for p in "$@"; do URLS+=("$BASE$p"); done
else
  # Иначе берём адреса из живой карты сайта — тогда список не разъезжается
  # с сайтом: карта генерируется из тех же данных, что и страницы.
  while IFS= read -r u; do URLS+=("$u"); done < <(
    curl -fsS "$BASE/sitemap.xml" | grep -o '<loc>[^<]*</loc>' | sed -e 's|<loc>||' -e 's|</loc>||'
  )
fi

if [ "${#URLS[@]}" -eq 0 ]; then
  echo "Не набралось ни одного адреса — проверьте $BASE/sitemap.xml" >&2
  exit 1
fi

echo "Отправляем ${#URLS[@]} адресов:"
printf '  %s\n' "${URLS[@]}"

# JSON собираем руками: jq на хостинге может не быть
LIST=$(printf '"%s",' "${URLS[@]}")
BODY=$(printf '{"host":"%s","key":"%s","keyLocation":"%s/%s.txt","urlList":[%s]}' \
  "$HOST" "$KEY" "$BASE" "$KEY" "${LIST%,}")

# api.indexnow.org рассылает участникам сам, но Bing и Яндекс принимают и
# напрямую — дублируем, это дешевле, чем разбираться, кто из них пропустил.
for endpoint in \
  "https://api.indexnow.org/IndexNow" \
  "https://www.bing.com/IndexNow" \
  "https://yandex.com/indexnow"; do
  code=$(curl -sS -o /dev/null -w '%{http_code}' -X POST \
    -H "Content-Type: application/json; charset=utf-8" \
    --data "$BODY" "$endpoint")
  # 200 — принято, 202 — принято в обработку, 403 — не найден файл ключа,
  # 422 — адрес не с этого хоста, 429 — слишком часто.
  printf '%-38s %s\n' "$endpoint" "$code"
done
