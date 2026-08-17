#!/usr/bin/env bash
# Выкладка сайта на zone.ee по SSH. Основной способ деплоя.
#
# Почему не GitHub Actions: прогон падает на шаге «Подготовить SSH» — в секрете
# ZONE_SSH_PRIVATE_KEY лежит не весь ключ, и пуши до сайта не доходят.
# Пока это не исправлено, выкладываем отсюда.
#
# Запуск:
#   bash tools/deploy.sh            # собрать и выложить
#   bash tools/deploy.sh --no-build # выложить уже собранный dist/
#
# Требуется только ssh и tar (rsync под Windows нет, на сервере есть).

set -euo pipefail

KEY="$HOME/.ssh/estoniatransfer_deploy"
USER="virt132974"
HOST="estoniatransfer.ee"
ROOT="/data01/virt132974/domeenid/www.estoniatransfer.ee"
REMOTE="$ROOT/htdocs"
SSH=(ssh -i "$KEY" -o BatchMode=yes -o ConnectTimeout=20 "$USER@$HOST")

cd "$(dirname "$0")/.."

if [ "${1:-}" != "--no-build" ]; then
  echo "▸ сборка"
  npm run build
fi

# Проверка готовности до отправки: пустой или недособранный dist смысла
# выкладывать нет, а на сервере уже лежит рабочий сайт.
[ -s dist/index.html ] || { echo "dist/index.html пуст или отсутствует"; exit 1; }
FILES=$(find dist -type f | wc -l)
[ "$FILES" -ge 20 ] || { echo "в dist всего $FILES файлов — похоже на сломанную сборку"; exit 1; }
echo "▸ файлов к выкладке: $FILES"

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

echo "▸ проверка"
FAIL=0
for p in "/" "/en/" "/transfer-tallinn-narva/" "/kak-dobratsya-do-granicy/" "/sitemap.xml" "/favicon.ico" "/hits.php"; do
  code=$(curl -sS -o /dev/null -w '%{http_code}' "https://$HOST$p")
  printf '  %-34s %s\n' "$p" "$code"
  [ "$code" = "200" ] || FAIL=1
done

[ "$FAIL" = "0" ] || { echo "▸ что-то отдаёт не 200 — проверьте вручную"; exit 1; }
echo "▸ готово"
