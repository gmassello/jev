#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
BASE="${BASE_URL:-http://localhost:3001}"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
curl -s "$BASE" | grep -q '<title>Jev Playground' || { echo "el server no responde en $BASE: PORT=3001 npm start" >&2; exit 1; }
node scripts/charla-pdf.mjs "$TMP/charla.html"
"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf="$TMP/charla.pdf" "file://$TMP/charla.html" > "$TMP/chrome.log" 2>&1 &
PID=$!
for _ in $(seq 1 60); do grep -q "bytes written" "$TMP/chrome.log" && break; sleep 1; done
kill "$PID" 2>/dev/null || true
grep -q "bytes written" "$TMP/chrome.log" || { echo "Chrome no imprimió el PDF" >&2; exit 1; }
cp "$TMP/charla.pdf" docs/charla.pdf
OUT="${CHARLA_COPY-$HOME/Downloads/Jev · Pulso IA - Playground paso a paso.pdf}"
[ -z "$OUT" ] || cp docs/charla.pdf "$OUT"
pdfinfo docs/charla.pdf | grep -E "Pages|Page size"
