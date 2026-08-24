#!/usr/bin/env bash
# AyoReview smoke test — regression gate codified from ox-alpha-audit/AUDIT.md appendix.
#
# Usage:
#   BASE_URL=http://localhost:3000 bash scripts/smoke.sh
#
# Page status codes are HARD checks (exit 1 on failure).
# API probes are informational (env-dependent) and printed for review.
set -u

BASE_URL="${BASE_URL:-http://localhost:3000}"
pass=0
fail=0

status() { curl -s -o /dev/null -w '%{http_code}' "$@"; }

check() {
  local name="$1" expected="$2" actual="$3"
  if [ "$expected" = "$actual" ]; then
    pass=$((pass + 1))
    printf 'PASS  %-34s %s\n' "$name" "$actual"
  else
    fail=$((fail + 1))
    printf 'FAIL  %-34s expected %s got %s\n' "$name" "$expected" "$actual"
  fi
}

info() { printf 'INFO  %-34s %s\n' "$1" "$2"; }

echo "== AyoReview smoke @ $BASE_URL =="

echo "-- pages --"
check "GET /"                 200 "$(status "$BASE_URL/")"
check "GET /pesan"            200 "$(status "$BASE_URL/pesan")"
check "GET /login"            200 "$(status "$BASE_URL/login")"
check "GET /signup"           200 "$(status "$BASE_URL/signup")"
check "GET /s/demo101"        200 "$(status "$BASE_URL/s/demo101")"
check "GET /fallback/not-found" 200 "$(status "$BASE_URL/fallback/not-found")"
check "GET /rate-limited"     200 "$(status "$BASE_URL/rate-limited")"

echo "-- auth guards --"
check "GET /my (anon)"        307 "$(status "$BASE_URL/my")"
check "GET /admin (anon)"     307 "$(status "$BASE_URL/admin")"
check "GET /admin/orders (anon)" 307 "$(status "$BASE_URL/admin/orders")"

echo "-- redirect engine --"
q_status="$(status "$BASE_URL/q/nonexist1")"
q_location="$(curl -s -o /dev/null -w '%{redirect_url}' "$BASE_URL/q/nonexist1")"
check "GET /q/nonexist1"      302 "$q_status"
case "$q_location" in
  */fallback/not-found*) pass=$((pass + 1)); printf 'PASS  %-34s %s\n' "/q/nonexist1 -> Location" "$q_location" ;;
  *) fail=$((fail + 1)); printf 'FAIL  %-34s unexpected Location: %s\n' "/q/nonexist1 -> Location" "${q_location:-none}" ;;
esac
r_status="$(status "$BASE_URL/r/nonexist1")"
check "GET /r/:id resolves"   307 "$r_status"

echo "-- api probes (informational) --"
search_code="$(status -X POST -H 'Content-Type: application/json' \
  -d '{"query":"Kopi Kenangan","city":""}' "$BASE_URL/api/setup/search")"
info "POST /api/setup/search" "$search_code"

link_code="$(status -X POST -H 'Content-Type: application/json' \
  -d '{"publicId":"zzzzzzz","placeId":"x","businessName":"x","email":"x@x.com"}' \
  "$BASE_URL/api/setup/link")"
info "POST /api/setup/link (unknown card)" "$link_code"

order_body='{"placeId":"probe_place","businessName":"Probe Bisnis","merchantName":"Probe","merchantEmail":"probe@example.com","merchantPhone":"","shippingAddress":"short"}'
order_resp="$(curl -s -X POST -H 'Content-Type: application/json' -d "$order_body" "$BASE_URL/api/orders/create")"
order_code="$(status -X POST -H 'Content-Type: application/json' -d "$order_body" "$BASE_URL/api/orders/create")"
info "POST /api/orders/create (short addr)" "$order_code"
case "$order_resp" in
  *'Alamat pengiriman terlalu pendek'*)
    info "orders/create validation" "address rule enforced"
    ;;
  *)
    info "orders/create validation" "unexpected body: ${order_resp:0:120}"
    ;;
esac

echo ""
echo "== result: $pass passed, $fail failed =="
[ "$fail" -eq 0 ]
