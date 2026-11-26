# maxima consulting — сайт

Статический сайт [maxima-consulting.ru](https://maxima-consulting.ru) и API заявок.

## Важно: слияние в `main` публикует боевой сайт

**Merge в ветку `main` автоматически выкладывает сайт maxima-consulting.ru.**

Push или merge в `main` запускает
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml): GitHub Actions
по SSH делает `git pull` на VPS и запускает `deploy/deploy.sh`. Отдельной
кнопки «опубликовать» нет. Черновики держите в отдельных ветках и в draft
pull request. Не мержите pull request в `main`, пока страницы не готовы
к публикации, и не пушьте в `main` напрямую.

Подробности сервера: [DEPLOY.md](DEPLOY.md).

## Структура

| Путь | Назначение |
| --- | --- |
| `index.html`, `uslugi.html`, лендинги `*.html` | Публичные страницы |
| `guides/` | Гайды |
| `content/blog/` | Исходники статей (MDX) |
| `public/images/blog/` | Обложки. Сборка копирует их в блог |
| `blog-app/` | Сборка блога (Vite + пререндер) |
| `blog/` | Результат сборки. **В git не хранится**: его создаёт `npm run build` на VPS и локально |
| `sitemap.xml` | Карта сайта. Её перезаписывает сборка блога |
| `server/` | Lead API: формы сайта → Bitrix24 и Telegram |
| `deploy/` | nginx и `deploy/deploy.sh` |
| `assets/` | Стили, скрипты, медиа |
| `preview-*.html`, `variant-*.html` | Черновики. В `<head>` стоит `noindex, nofollow` |
| `robots.txt` | Правила для публичного сайта. Черновики им не закрываются |
| `docs/BLOG-CONTENT.md` | Как добавлять статьи |

## Локально

Блог (результат в `blog/`, обновляется `sitemap.xml`):

```bash
cd blog-app && npm ci --legacy-peer-deps && npm run build
```

API заявок:

```bash
cd server && npm ci && npm test
```
