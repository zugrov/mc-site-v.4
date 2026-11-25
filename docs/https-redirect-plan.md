# План: редирект http → https

Это только план. Конфиг nginx и скрипт деплоя в этом изменении не трогаем. На сервер ничего не выкладываем.

Замер 25.11.2026: `http://maxima-consulting.ru` отвечает 500, а не 301 на https. В репозитории нужный редирект уже описан, значит на машине, скорее всего, включён другой файл.

## Где лежит nginx

Из репозитория, не с живого сервера:

- Исходник: `deploy/nginx/maximaconsulting.conf`.
- Деплой: `deploy/deploy.sh` копирует его в `/etc/nginx/sites-available/maximaconsulting.conf` и делает симлинк в `/etc/nginx/sites-enabled/maximaconsulting.conf`.
- Корень сайта на сервере: `/var/www/maxima-consulting/static/mc-site-v4`.
- Репозиторий на сервере: `/opt/maxima-consulting/apps/mc-site-v.4`.
- Сертификат в файле: `/etc/letsencrypt/live/maxima-consulting.ru/`.
- Workflow `.github/workflows/deploy.yml` по пушу в `main` делает `git pull` и `bash deploy/deploy.sh`. Этот план не запускает деплой.

В том же файле уже есть:

- `listen 443` для `maxima-consulting.ru`;
- `listen 443` для `www.maxima-consulting.ru` с `return 301 https://maxima-consulting.ru$request_uri`;
- `listen 80` для обоих имён: `/.well-known/acme-challenge/` без редиректа, остальное — `return 301 https://maxima-consulting.ru$request_uri`.

`$request_uri` сохраняет путь и query.

## Что сверить на сервере до правки

Этого в репозитории нет, без этого дифф применять нельзя:

1. Какой файл реально слушает 80-й порт: `nginx -T | sed -n '/listen 80/,/^}/p'`.
2. Совпадает ли он с `deploy/nginx/maximaconsulting.conf` или это старый конфиг, default-сайт или другой `server` на `listen 80 default_server`.
3. Выпущен ли сертификат на оба имени: `certbot certificates`.
4. Кто последний раз копировал конфиг: дата файла в `sites-enabled` и не обрывается ли `deploy.sh` до `nginx -t`.

Если 500 отдаёт не nginx, а другой процесс на 80 порту, редирект в этом файле ничего не изменит. Это тоже нужно увидеть по `ss -ltnp | grep ':80'`.

## Дифф, если на сервере нет блока порта 80

Не заменять весь сайт-конфиг вслепую. Добавить только этот блок, если его нет, и не дублировать, если он уже есть.

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name maxima-consulting.ru www.maxima-consulting.ru;

    location ^~ /.well-known/acme-challenge/ {
        root /var/www/maxima-consulting/static/mc-site-v4;
        default_type "text/plain";
    }

    location / {
        return 301 https://maxima-consulting.ru$request_uri;
    }
}
```

Если https для `www` ещё не уводит на хост без www, добавить отдельно:

```nginx
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name www.maxima-consulting.ru;

    ssl_certificate /etc/letsencrypt/live/maxima-consulting.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/maxima-consulting.ru/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    return 301 https://maxima-consulting.ru$request_uri;
}
```

Пути сертификата брать из `certbot certificates`, если они другие.

## Порядок на сервере

1. Снять копию того, что включено сейчас:

```bash
cp -L /etc/nginx/sites-enabled/maximaconsulting.conf /root/maximaconsulting.conf.bak-$(date +%Y%m%d%H%M)
```

2. Вписать дифф в копию и сравнить с бэкапом: `diff -u`.
3. Положить новый файл в `sites-available` и обновить симлинк в `sites-enabled`, как это делает `apply_nginx_config` в `deploy/deploy.sh`.
4. Проверить синтаксис и только потом перечитать nginx:

```bash
nginx -t && systemctl reload nginx
```

`reload`, не `restart`. Если `nginx -t` не прошёл, конфиг не перечитывать.

## Проверка

```bash
curl -sI http://maxima-consulting.ru/uslugi | head -n 20
curl -sI "http://maxima-consulting.ru/blog/?page=2" | head -n 20
curl -sI http://www.maxima-consulting.ru/ | head -n 20
curl -sI https://www.maxima-consulting.ru/gajdy | head -n 20
curl -sI http://maxima-consulting.ru/.well-known/acme-challenge/ping | head -n 20
```

Ожидание для первых четырёх: `301` и `Location: https://maxima-consulting.ru` с тем же путём и query. Для `www` по https — тоже 301 на хост без www. Для `acme-challenge` редиректа быть не должно: 404 от nginx допустим, 301 — нет.

Потом открыть https-главную и убедиться, что она по-прежнему 200.

## Откат

```bash
cp /root/maximaconsulting.conf.bak-ДАТА /etc/nginx/sites-available/maximaconsulting.conf
ln -sfn /etc/nginx/sites-available/maximaconsulting.conf /etc/nginx/sites-enabled/maximaconsulting.conf
nginx -t && systemctl reload nginx
```

`ДАТА` — суффикс файла из шага 1. Если `nginx -t` после отката не проходит, не делать reload и вернуть предыдущее содержимое из того же бэкапа вручную.

`deploy.sh` при неудачном `nginx -t` уже копирует снимок обратно в `sites-available`. Этот план рассчитан на ручную правку, не на запуск деплоя.
