FROM php:8.4-fpm AS base

RUN apt-get update && apt-get install -y \
    git unzip libzip-dev libsqlite3-dev libpng-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo pdo_sqlite pdo_mysql zip bcmath mbstring exif pcntl gd \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

COPY . .
RUN composer dump-autoload --optimize \
    && touch database/database.sqlite \
    && php artisan config:clear

RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
