---
name: interview-prep-author
description: >-
  Use when a request creates or changes Android interview-prep content in this repo:
  add a new глава/page, expand or rewrite a параграф, assemble a методичка/конспект,
  add Q&A cards, Kotlin examples, sources, video cards, comparison tables, Mermaid
  diagrams, or fix page authoring/navigation. This skill owns the site/page contract:
  HTML skeleton, `data-page`/TOPICS wiring, component snippets, single-level параграфы,
  code escaping, `.ytcard` videos, Mermaid placement, sources, and the review checklist.
  Do not use it for pure prose polishing without page markup; use tech-author and
  ru-humanizer instead.
---

# Interview Prep Author

Помогает писать и расширять учебные материалы для подготовки к техническому собеседованию —
прежде всего многостраничный сайт-гид в этом проекте. Цель: чтобы новые главы и параграфы
были **фактически точными**, **глубокими (Middle+/Senior)** и **визуально единообразными** с
остальным сайтом, без ручной возни с разметкой и без типовых ошибок рендера.

## Почему так, а не "просто напиши HTML"

Сайт уже имеет общий дизайн-язык: `site/assets/style.css` задаёт классы компонентов, а
`site/assets/app.js` сам строит шапку, сайдбар, оглавление, навигацию prev/next, прогресс и
рендерит mermaid + подсветку кода. Если страница не следует скелету и классам — ломается
навигация, оглавление или тема. Поэтому страница главы содержит **только контент**, а каркас
добавляет `app.js`. Этот скил фиксирует контракт, чтобы не изобретать его заново каждый раз.

## Рабочий процесс

1. **Сначала ресёрч, потом верстка.** Собери факты по теме (официальная документация Android/
   Kotlin, надёжные статьи), и — если нужна видео-карточка — найди реальный YouTube-ролик
   (возьми `VIDEO_ID` из `watch?v=...` в выдаче; не выдумывай ID). Только потом строй страницу.
2. **Построй страницу** строго по скелету и компонентам. Полные сниппеты — в
   `references/components.md`. Открой этот файл перед версткой.
3. **Подключи новую главу в навигацию** (если это новая страница, а не правка существующей):
   добавь запись в массив `TOPICS` и при необходимости группу в `GROUPS` в `app.js`. См.
   раздел «Подключение главы» ниже.
4. **Прогон по чек-листу ревью** — `references/review-checklist.md`. Это ловит типовые поломки
   (неэкранированные дженерики, отступы в mermaid, битые видео, мусорные байты в конце файла).

## Скелет страницы главы (обязательный)

`data-page` должен совпадать с `id` главы в `app.js`. Пустые `#sidebar`, `.breadcrumb`, `#toc`
заполняет `app.js` — не добавляй их содержимое и не пиши шапку/оглавление/prev-next вручную.

```html
<!DOCTYPE html>
<html lang="ru" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script>(()=>{const k="aip-theme";let t=null;try{t=localStorage.getItem(k)}catch(e){}
    if(t!=="dark"&&t!=="light")t=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";
    document.documentElement.setAttribute("data-theme",t)})();</script>
  <title>{Заголовок} · Android-собес</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../assets/style.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css">
</head>
<body data-page="{ID}">
  <div class="layout">
    <aside id="sidebar"></aside>
    <div id="content">
      <article class="page">
        <div class="breadcrumb"></div>
        <header class="page-head">
          <span class="eyebrow">{Группа}</span>
          <h1>{Заголовок}</h1>
          <p class="lead">{1–2 предложения: о чём и зачем на собесе}</p>
          <div class="meta"><span class="tag lvl-mid">Middle</span><span class="tag lvl-sen">Senior</span></div>
        </header>

        <!-- 6–10 параграфов <section class="section" id="..."><h2>…</h2> … -->

        <div class="sources"><h2>Источники</h2><ol><li><a href="URL" target="_blank" rel="noopener">…</a></li></ol></div>
      </article>
    </div>
    <aside id="toc"></aside>
  </div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/kotlin.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
  <script src="../assets/app.js?v=20260621-1"></script>
</body>
</html>
```

Имя файла — `{id}.html` (по имени главы, без числового префикса). Версия `?v=…` у `app.js`
должна совпадать с остальными страницами (см. правило о cache-busting в `CLAUDE.md`).

## Состав хорошей главы

Стремись к плотному, но не водянистому материалу: на каждую главу — 6–10 параграфов. Полезный набор:
вступление «зачем на собесе», объяснение «под капотом» с trade-offs, ≥2 диаграммы mermaid,
≥2 таблицы-сравнения, ≥4 примера кода Kotlin, блок «Частые вопросы» (5–9 раскрывающихся карточек),
видео-карточка с тайм-кодом «к сути» и 4–8 реальных источников. Точные сниппеты всех компонентов —
в `references/components.md` (callout, код, таблица, Q&A, видео-карточка `.ytcard`, mermaid, источники).

## Тон и глубина

Русский язык. Уровень Middle+/Senior: объясняй механику «под капотом», компромиссы и подводные
камни, а не только определения. Код — компилируемый и идиоматичный. Хорошая проверка: прочитав
главу, кандидат может уверенно ответить на соответствующий вопрос вслух. Термины-сокращения
раскрывай при первом употреблении.

Регистр и качество текста задаёт соседний скил `tech-author` (он в паре с этим). Целевой голос —
**живой технический разбор**: «мы»/«вы»-повествование, разбор в настоящем времени, рваный ритм,
дозированная ирония — но «в меру», без сленга и мемов. Спецификация — `tech-author/references/voice.md`.

## Подключение главы в навигацию

Навигация, mind-map и сетка глав строятся из массива `TOPICS` в `site/assets/app.js`. Чтобы добавить
главу, вставь запись (и при необходимости новую группу в `GROUPS`):

```js
// GROUPS: { ключ: { title: "Название группы", color: "#hex" } }
// TOPICS (порядок = порядок в сайдбаре и prev/next):
{ id:"my-topic", file:"my-topic.html", icon:"🧩", group:"foundations",
  title:"Моя глава", short:"Короткое описание для карточки.", subs:["Тег1","Тег2","Тег3"] },
```

`id` обязан совпадать с `data-page` страницы и с именем файла (`{id}.html`, без числового
префикса). После добавления —
обнови счётчики на `index.html` при необходимости. Если редактируешь существующую страницу —
менять `app.js` не нужно.

## Важные правила (иначе сломается)

- **Параграф = `<section class="section">` + `<h2>`** — одна запись в оглавлении. Подпараграфов/`<h3>`
  как уровня нет (`группа → глава → параграф`): мелкий подпункт внутри параграфа — ран-ин
  `<p class="subhead">…</p>` (это текст, не заголовок, в оглавление не попадает).
- **Экранируй** `<`, `>`, `&` внутри `<code>`/`<pre>` как `&lt; &gt; &amp;` — иначе дженерики
  (`List&lt;T&gt;`) ломают верстку.
- **Mermaid пиши без ведущих отступов** (директива `flowchart`/`sequenceDiagram` с начала строки),
  узлы с проблемными символами бери в кавычки: `A["a, b()"]`.
- **Видео — только карточкой `.ytcard`**, не `<iframe>`: часть роликов запрещают встраивание
  (ошибка 153). Карточка ведёт на YouTube с тайм-кодом и работает всегда.
- **Файл должен заканчиваться на `</html>`** без мусорных/нулевых байтов в хвосте.

Перед сдачей — пройди `references/review-checklist.md`.
