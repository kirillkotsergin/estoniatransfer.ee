#!/usr/bin/env bash
# Кто из поисковиков и ИИ-ботов ходил на сайт — сводка по логам Apache на zone.ee.
#
# Зачем: единственный способ узнать, дошли ли правки до краулеров, — посмотреть,
# заходили ли они. Search Console показывает это с задержкой в дни, а Ahrefs
# Analytics ботов не считает вовсе (их скрипт исполняется только в браузере).
#
# ⚠️ Формат логов у Zone НЕ combined, типовые рецепты с `awk '{print $4}'` тут
# врут. Строка выглядит так:
#   estoniatransfer.ee 2026-09-13T19:18:36.074264Z 66.249.73.234 60804 - - \
#   "GET /robots.txt HTTP/1.1" 200 7958 "-" "Mozilla/5.0 (compatible; Googlebot…"
# То есть: $1 домен, $2 время ISO, $3 IP, запрос и User-Agent — в кавычках.
# Отсюда все разборы ниже идут через sed по кавычкам, а не по номерам полей.
#
# Логи ротируются посуточно и жмутся в .gz, поэтому смотрим и архивы тоже:
# без zcat вы увидите только сегодняшний день и решите, что боты пропали.
#
# Запуск (нужен только ssh):
#   bash tools/bots.sh                          # сводка за всё, что есть в логах
#   bash tools/bots.sh /transfer-narva-tallinn/ # кто заходил на конкретный адрес

set -euo pipefail

KEY="$HOME/.ssh/estoniatransfer_deploy"
USER="virt132974"
HOST="estoniatransfer.ee"
LOGS="/data01/virt132974/domeenid/www.$HOST/logs"
SSH=(ssh -i "$KEY" -o BatchMode=yes -o ConnectTimeout=20 "$USER@$HOST")

# Отдельно поисковые и отдельно ИИ: это разные новости. Googlebot пришёл —
# страница попадёт в выдачу. GPTBot пришёл — текст попадёт в ответ ассистента.
SEARCH="Googlebot|bingbot|YandexBot|Yandex[A-Za-z]+|DuckDuckBot|SeznamBot|PetalBot|Applebot"
AI="GPTBot|OAI-SearchBot|ChatGPT-User|ClaudeBot|anthropic-ai|Claude-Web|PerplexityBot|Perplexity-User|CCBot|Google-Extended|Meta-ExternalAgent|Bytespider|Amazonbot|cohere-ai|Diffbot|TimpiBot"
SOCIAL="facebookexternalhit|Twitterbot|TelegramBot|WhatsApp|Slackbot|LinkedInBot"
SEO="AhrefsBot|SemrushBot|MJ12bot|DotBot|BLEXBot"

# Один заход по ssh на всё: каждое соединение к zone.ee стоит около секунды.
"${SSH[@]}" "
  set -eu
  cat_all() { { zcat $LOGS/apache.ssl.access.log.*.gz $LOGS/apache.access.log.*.gz 2>/dev/null || true
                cat  $LOGS/apache.ssl.access.log  $LOGS/apache.access.log  2>/dev/null || true; }; }

  TOTAL=\$(cat_all | wc -l)
  FROM=\$(cat_all | sed -nE 's/^[^ ]+ ([0-9]{4}-[0-9]{2}-[0-9]{2})T.*/\1/p' | sort | head -1)
  TILL=\$(cat_all | sed -nE 's/^[^ ]+ ([0-9]{4}-[0-9]{2}-[0-9]{2})T.*/\1/p' | sort | tail -1)
  echo \"Запросов в логах: \$TOTAL   период: \$FROM — \$TILL\"

  show() {
    echo
    echo \"── \$1 ──\"
    cat_all | grep -oiE \"\$2\" | sort -f | uniq -ci | sort -rn | sed 's/^/  /'
  }
  show 'Поисковые роботы'  '$SEARCH'
  show 'ИИ-боты'           '$AI'
  show 'Соцсети и мессенджеры' '$SOCIAL'
  show 'SEO-сканеры'       '$SEO'

  # ⚠️ Разбор строки ВСЕГДА якорим на ^[^\"]* — «от начала строки до первой
  # кавычки». Без якоря .* съедает строку до ПОСЛЕДНЕЙ кавычки (конец
  # User-Agent), и под шаблон статуса попадает длительность запроса: в сводке
  # появляются «коды ответа» 997 и 839, а число 404 завышается втрое.
  # Наступал на это дважды, поэтому написано подробно. sed -n + флаг p:
  # строки, которые под шаблон не подошли, молча выбрасываем, а не считаем.
  REQ='s/^[^\"]*\"[A-Z]+ ([^ ?\"]+)[^\"]*\" ([0-9]{3}) .*/\2 \1/p'

  echo
  echo '── Что боты читали чаще всего ──'
  cat_all | grep -iE '$SEARCH|$AI' | sed -nE \"\$REQ\" \
    | cut -d' ' -f2 | sort | uniq -c | sort -rn | head -12 | sed 's/^/  /'

  echo
  echo '── Ошибки, которые получали боты (не 200/304) ──'
  BAD=\$(cat_all | grep -iE '$SEARCH|$AI' | sed -nE \"\$REQ\" \
    | grep -vE '^(200|304) ' | sort | uniq -c | sort -rn | head -12)
  if [ -n \"\$BAD\" ]; then echo \"\$BAD\" | sed 's/^/  /'; else echo '  нет — все ответы 200 или 304'; fi

  if [ -n \"${1:-}\" ]; then
    echo
    echo '── Кто заходил на ${1:-} ──'
    cat_all | grep \"GET ${1:-} \" \
      | sed -E 's/^[^ ]+ ([0-9T:.-]+)Z ([0-9.]+) .*\" ([0-9]{3}) [0-9]+ \"[^\"]*\" \"([^\"]*)\".*/  \1  \2  \3  \4/' \
      | cut -c1-150 | tail -25
  fi
"
