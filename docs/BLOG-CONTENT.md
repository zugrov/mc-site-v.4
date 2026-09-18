# Наполнение блога maxima-consulting.ru

Инструкция для редакторов и авторов: как добавлять и обновлять статьи без CMS и базы данных.

## Структура в репозитории

| Что | Путь |
| --- | --- |
| Статьи (MDX + frontmatter) | `content/blog/*.mdx` |
| Обложки и иллюстрации | `public/images/blog/` |
| Исходники интерфейса блога | `blog-app/` |
| Собранный сайт (артефакт SSG) | `blog/` (генерируется при сборке) |
| Карта сайта | `sitemap.xml` (обновляется в `postbuild`) |

Публичные URL:

- список: `https://maxima-consulting.ru/blog/`
- статья: `https://maxima-consulting.ru/blog/{slug}/`

Деплой: при `deploy/deploy.sh` на VPS выполняется `npm ci` и `npm run build` в `blog-app` перед `rsync`. Подробности — в [DEPLOY.md](../DEPLOY.md#блог).

---

## Новая статья: пошагово

### 1. Создать файл

Скопируйте любую статью из `content/blog/` и переименуйте, например:

`content/blog/moya-novaya-statya.mdx`

Имя файла может отличаться от `slug`, но удобно держать их **одинаковыми** (латиница, дефисы).

### 2. Заполнить frontmatter

Блок между `---` в начале файла обязателен. При ошибке в полях сборка (`npm run build`) завершится с сообщением валидации **zod** (`blog-app/shared/blog-types.ts`).

```yaml
---
title: "Заголовок для H1 и SEO"
description: "Краткое описание для карточки, meta description и соцсетей (1–2 предложения)"
slug: "moya-novaya-statya"
date: "2026-09-16"
updatedAt: "2026-09-16"
category: "НДС и налоги"
tags: ["НДС-2026", "УСН"]
coverImage: "/blog/images/blog/moya-novaya-statya.webp"
author: "Максим Зугров"
draft: false
ogImage: "/blog/images/blog/moya-novaya-statya.webp"
---
```

**Правила полей:**

| Поле | Требования |
| --- | --- |
| `title` | Непустая строка |
| `description` | Непустая строка |
| `slug` | Только `a-z`, `0-9`, дефисы: `^[a-z0-9]+(?:-[a-z0-9]+)*$` |
| `date`, `updatedAt` | Формат `YYYY-MM-DD` |
| `category` | Произвольная строка; фильтр на `/blog/?category=...` сравнивает **точное** совпадение |
| `tags` | Массив, минимум один тег; влияет на блок «Похожие статьи» |
| `coverImage` | Путь к обложке (см. раздел про изображения) |
| `author` | Имя автора |
| `draft` | `true` — статья **не** попадает в список, SSG и sitemap; по умолчанию `false` |
| `readingTimeMinutes` | Опционально; иначе считается из текста (~200 слов/мин) |
| `ogImage` | Опционально; если нет — берётся `coverImage` |
| `canonicalUrl` | Опционально; по умолчанию `https://maxima-consulting.ru/blog/{slug}/` |

**Черновик:** `draft: true` — можно коммитить, на сайте статьи не будет.

**Публикация:** `draft: false`, при правках обновляйте `updatedAt` (попадает в `lastmod` в sitemap).

### 3. Обложка и картинки

**Не используйте логотип** как обложку. Исходники — разные файлы из **`Visual/`** (фото или кадр из mp4).

1. Для новой статьи добавьте пару `slug` → файл в `scripts/generate-blog-covers.sh` (массивы `SLUGS` / `SOURCES`).
2. Запустите: `bash scripts/generate-blog-covers.sh` — файлы попадут в `public/images/blog/{slug}-cover.jpg` (или `.webp`).
3. В frontmatter: `coverImage` и `ogImage` = **`/blog/images/blog/{slug}-cover.jpg`** (путь после сборки Vite).

`Visual/` в деплой не попадает (см. `.gitignore`); в git коммитятся только обложки в `public/images/blog/`.

Обложка на странице статьи загружается с приоритетом; картинки в тексте — с `loading="lazy"` (см. компонент `img` в MDX).

### 4. Тело статьи (MDX)

После второго `---` — Markdown и встроенные компоненты.

**Заголовки и оглавление:** для бокового TOC используйте `##` и `###`. H1 на странице уже из поля `title`.

**Callout:**

```mdx
<Callout type="info">
Текст врезки.
</Callout>
```

Типы: `info` (по умолчанию), `warning`, `success`.

**CTA:** не добавляйте `<CTA />` в MDX. На desktop CTA в сайдбаре; на mobile — один раз **перед** «Поделиться». После «Поделиться» в колонке статьи ничего нет (без автора и «похожих»).

**Таблица** — обычный Markdown; стили применяются автоматически.

**Картинка в тексте:**

```mdx
![Подпись](/blog/images/blog/shema.webp)
```

**Ссылки:**

- форма на главной: `https://maxima-consulting.ru/#contact`
- лендинги: `/nds-2026`, `/financial-diagnostics`

Образец оформления: `content/blog/nds-2026-usn-kto-platit-i-marzha.mdx`.

### 5. Сборка и проверка локально

```bash
cd blog-app
npm install --legacy-peer-deps   # при первом запуске или после смены package.json
npm test
npm run build
```

Проверьте:

- `blog/index.html` — карточка новой статьи;
- `blog/{slug}/index.html` — текст, обложка, meta в `<head>`.

Пересборка главной и лендингов вместе с блогом:

```bash
python3 scripts/publish_landings.py
```

### 6. Деплой

Закоммитьте изменения в `content/blog/`, при необходимости `public/images/blog/`, и запушьте в `main`. GitHub Actions запустит `deploy/deploy.sh`, который соберёт блог на VPS.

---

## Категории и теги

- **Категории** — рубрики на индексе (чипы фильтра). Новая категория появится автоматически. Для единообразия переиспользуйте существующие, например: `НДС и налоги`, `Управленческий учёт`, `Кейсы`.
- **Теги** — для «Похожих статей» (пересечение тегов + совпадение категории).

---

## Пагинация и фильтры

На индексе **10 статей на страницу**:

- `https://maxima-consulting.ru/blog/?page=2`
- `https://maxima-consulting.ru/blog/?category=НДС%20и%20налоги`
- комбинация: `?category=...&page=2`

Отдельные HTML для каждой страницы пагинации не генерируются — фильтр работает на клиенте после загрузки списка постов.

---

## Редактирование и снятие с публикации

| Задача | Действие |
| --- | --- |
| Правка текста | правка `.mdx`, обновление `updatedAt`, `npm run build` |
| Снять с сайта | `draft: true` + сборка |
| Сменить URL | новый `slug` = новый URL; при необходимости редирект в nginx |
| Удалить | удалить `.mdx`, пересобрать блог |

---

## Чеклист перед публикацией

- [ ] `draft: false`
- [ ] Уникальный `slug`
- [ ] `title` и `description` без опечаток
- [ ] Обложка в `public/images/blog/`, путь в frontmatter: `/blog/images/blog/...`
- [ ] `updatedAt` актуальна
- [ ] `npm test` и `npm run build` без ошибок
- [ ] В `sitemap.xml` появился URL поста

---

## Частые ошибки сборки

| Симптом | Причина |
| --- | --- |
| Zod error на `slug` | кириллица, пробелы, подчёркивания |
| Неверная дата | не формат `YYYY-MM-DD` |
| Статьи нет в списке | `draft: true` или ошибка frontmatter |
| Битая обложка | неверный путь; используйте `/blog/images/blog/...` |
| Дублирующий `slug` | два файла с одинаковым `slug` в frontmatter |

---

## Куда править код (не контент)

| Задача | Где |
| --- | --- |
| Skill агента `/blog` | `.cursor/skills/blog/SKILL.md` |
| Обложки из Visual | `scripts/generate-blog-covers.sh` |
| Новые MDX-компоненты, вёрстка | `blog-app/src/`, `blog-app/src/lib/mdx-components.tsx` |
| Схема frontmatter | `blog-app/shared/blog-types.ts` |
| Пункт «Блог» на главной | `variant-pro.html` → `python3 scripts/publish_landings.py` |
| Nginx для `/blog/` | `deploy/nginx/maximaconsulting.conf` |
| Тесты frontmatter | `blog-app/tests/` |

---

## SEO после публикации

- Проверить страницу в [Rich Results Test](https://search.google.com/test/rich-results) (тип `BlogPosting`).
- Убедиться, что пост есть в `https://maxima-consulting.ru/sitemap.xml`.
