FROM php:8.3-cli AS base

# System packages and PHP extensions
RUN apt-get update && apt-get install -y \
    git unzip curl libpng-dev libonig-dev libxml2-dev \
    libzip-dev libpq-dev libcurl4-openssl-dev libssl-dev \
    zlib1g-dev libicu-dev g++ libevent-dev procps \
    && docker-php-ext-install pdo pdo_mysql pdo_pgsql mbstring zip exif pcntl bcmath sockets intl

# Swoole installation (for Octane)
RUN curl -L -o swoole.tar.gz https://github.com/swoole/swoole-src/archive/refs/tags/v5.1.0.tar.gz \
    && tar -xf swoole.tar.gz \
    && cd swoole-src-5.1.0 \
    && phpize \
    && ./configure \
    && make -j$(nproc) \
    && make install \
    && docker-php-ext-enable swoole

# Node.js 20 (Vite compatible for frontend build)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Composer installation
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copia todos los archivos del proyecto (incluye artisan y frontend)
COPY . .

# Instala dependencias PHP/Laravel
RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

# Instala y compila el frontend (Inertia/React/Vite)
RUN npm install && npm run build

# Limpia cache Laravel
RUN php artisan config:clear \
    && php artisan route:clear \
    && php artisan view:clear

# File permissions para Laravel
RUN chown -R www-data:www-data /var/www \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

EXPOSE 9000

CMD ["sh", "-c", "php artisan config:cache && php artisan route:cache && php artisan view:cache && php artisan octane:start --server=swoole --host=0.0.0.0 --port=9000"]
