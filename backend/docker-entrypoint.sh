#!/bin/sh
set -e

[ -f .env ] || cp .env.example .env
grep -q '^APP_KEY=.\+' .env || php artisan key:generate --force
php artisan migrate --force
php artisan storage:link 2>/dev/null || true

exec "$@"
