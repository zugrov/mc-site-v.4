---
name: blog
description: >-
  Публикация и оформление статей блога maxima-consulting в репозитории mc-site-v.4:
  MDX в content/blog/, обложки из Visual/, сборка blog-app, без номеров статей и без
  блоков для соцсетей. Использовать по запросу /blog, «статья в блог», «опубликовать в блог».
---

# Блог maxima-consulting (mc-site-v.4)

## Когда применять

- Новая или правка статьи в `content/blog/`
- Обложки, сборка, деплой блога
- Оформление MDX (Callout, CTA, таблицы)

Полная справка: [docs/BLOG-CONTENT.md](../../docs/BLOG-CONTENT.md).

## Жёсткие правила контента

1. **Не указывать номера статей** в заголовках, тексте и frontmatter (никаких «Статья 2»).
2. **Не публиковать короткие версии для соцсетей** (Telegram/VK/MAX) — только полноценная статья в MDX.
3. **Не использовать логотип** как обложку. Обложки — **разные визуалы из `Visual/`**, скопированные в `public/images/blog/` (см. ниже).
4. Пути к обложкам в frontmatter: **`/blog/images/blog/{slug}-cover.jpg`** или `.webp` (после сборки Vite).
5. `draft: true` — черновик (нет в списке, SSG, sitemap). Публикация: `draft: false`, актуальный `updatedAt`.
6. Коммиты — **только по явному запросу** пользователя.

## Workflow публикации

1. Создать `content/blog/{slug}.mdx` (slug = латиница и дефисы).
2. Заполнить frontmatter по схеме `blog-app/shared/blog-types.ts` (zod при сборке).
3. Тело: Markdown + `<Callout type="info|warning|success">`, таблицы. Заголовки для TOC: `##`, `###`. **Не** вставлять `<CTA />` в MDX — CTA только в шаблоне (сайдбар на desktop, один блок перед «Поделиться» на mobile).
4. Обложка:
   - Выбрать файл в `Visual/` (jpg/png или кадр из mp4).
   - Добавить пару `slug → файл` в `scripts/generate-blog-covers.sh` (секция `MAP`).
   - Запустить: `bash scripts/generate-blog-covers.sh`
   - В MDX: `coverImage` и `ogImage` = `/blog/images/blog/{slug}-cover.jpg` (или `.webp`).
5. Проверка:
   ```bash
   cd blog-app && npm test && npm run build
   ```
6. Деплой: push в `main` → `deploy/deploy.sh` собирает блог на VPS.

## Оформление UI (не ломать)

- На странице статьи **сайдбар (lg+)**: одна sticky-область (TOC с прокруткой + CTA). **Не** вешать отдельный `sticky` на TOC и CTA.
- **Под блоком «Поделиться»** в основной колонке ничего нет: без повторного CTA, без AuthorBox, без «Похожих статей».
- На **mobile** (`lg:hidden`) один CTA **перед** «Поделиться», не после.

## Категории и ссылки

- Категории для фильтра: точное совпадение строки, например `НДС и налоги`, `Управленческий учёт`.
- CTA на сайт: `https://maxima-consulting.ru/#contact`, лендинги `/nds-2026`, `/financial-diagnostics`.

## Чеклист перед отдачей пользователю

- [ ] Нет `<CTA />` в MDX и ничего лишнего под «Поделиться» (шаблон `BlogPost.tsx`)
- [ ] Нет номеров статей и блоков «короткие версии для соцсетей»
- [ ] Уникальный `slug`, `draft: false` для публикации
- [ ] Обложка из Visual → `public/images/blog/`, не логотип
- [ ] `npm test` и `npm run build` без ошибок
- [ ] При необходимости обновить `MAP` в `generate-blog-covers.sh`

## Связанные файлы

| Назначение | Путь |
| --- | --- |
| Статьи | `content/blog/*.mdx` |
| Схема frontmatter | `blog-app/shared/blog-types.ts` |
| Страница статьи | `blog-app/src/pages/BlogPost.tsx` |
| MDX-компоненты | `blog-app/src/lib/mdx-components.tsx` |
| Обложки (деплой) | `public/images/blog/` |
| Исходники визуала | `Visual/` (не в rsync, только локально) |
| Инструкция | `docs/BLOG-CONTENT.md` |
