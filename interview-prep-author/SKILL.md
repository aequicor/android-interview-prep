---
name: interview-prep-author
description: >-
  Author and extend technical interview-prep study material — especially the Android
  interview-prep site in this project (an index.html + site/pages/NN-*.html multi-page
  guide with a shared style.css / app.js). Use this skill whenever the user wants to add
  a new topic page, expand or refine an existing section, build a study guide / "методичка",
  or produce consistent learning content with diagrams, comparison tables, Kotlin code
  examples, Q&A cards, timestamped video cards and cited sources. Trigger for requests like
  "добавь страницу про X", "расширь раздел Y", "сделай новую тему для сайта подготовки",
  "напиши конспект по Z", "собери методичку", or any interview-prep content work — even if
  the user doesn't say the word "skill". Research the facts first, then build from the
  templates, then run the review checklist.
---

# Interview Prep Author

Помогает писать и расширять учебные материалы для подготовки к техническому собеседованию —
прежде всего многостраничный сайт-гид в этом проекте. Цель: чтобы новые страницы и разделы
были **фактически точными**, **глубокими (Middle+/Senior)** и **визуально единообразными** с
остальным сайтом, без ручной возни с разметкой и без типовых ошибок рендера.

## Почему так, а не "просто напиши HTML"

Сайт уже имеет общий дизайн-язык: `site/assets/style.css` задаёт классы компонентов, а
`site/assets/app.js` сам строит шапку, сайдбар, оглавление, навигацию prev/next, прогресс и
рендерит mermaid + подсветку кода. Если страница не следует скелету и классам — ломается
навигация, оглавление или тема. Поэтому страница темы содержит **только контент**, а каркас
добавляет `app.js`. Этот скил фиксирует контракт, чтобы не изобретать его заново каждый раз.

## Рабочий процесс

1. **Сначала ресёрч, потом верстка.** Собери факты по теме (официальная документация Android/
   Kotlin, надёжные статьи), и — если нужна видео-карточка — найди реальный YouTube-ролик
   (возьми `VIDEO_ID` из `watch?v=...` в выдаче; не выдумывай ID). Только потом строй страницу.
2. **Построй страницу** строго по скелету и компонентам. Полные сниппеты — в
   `references/components.md`. Открой этот файл перед версткой.
3. **Подключи новую тему в навигацию** (если это новая страница, а не правка существующей):
   добавь запись в массив `TOPICS` и при необходимости группу в `GROUPS` в `app.js`. См.
   раздел «Подключение темы» ниже.
4. **Прогон по чек-листу ревью** — `references/review-checklist.md`. Это ловит типовые поломки
   (неэкранированные дженерики, отступы в mermaid, битые видео, мусорные байты в конце файла).

## Скелет страницы темы (обязательный)

`data-page` должен совпадать с `id` темы в `app.js`. Пустые `#sidebar`, `.breadcrumb`, `#toc`
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
          <span class="eyebrow">Тема {NN} · {Группа}</span>
          <h1>{Заголовок}</h1>
          <p class="lead">{1–2 предложения: о чём и зачем на собесе}</p>
          <div class="meta"><span class="tag lvl-mid">Middle</span><span class="tag lvl-sen">Senior</span></div>
        </header>

        <!-- 6–10 секций <section class="section" id="..."><h2>…</h2> … -->

        <div class="sources"><h2>Источники</h2><ol><li><a href="URL" target="_blank" rel="noopener">…</a></li></ol></div>
      </article>
    </div>
    <aside id="toc"></aside>
  </div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/kotlin.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
  <script src="../assets/app.js"></script>
</body>
</html>
```

## Состав хорошего раздела

Стремись к плотному, но не водянистому материалу: на каждую тему — 6–10 секций. Полезный набор:
вступление «зачем на собесе», объяснение «под капотом» с trade-offs, ≥2 диаграммы mermaid,
≥2 таблицы-сравнения, ≥4 примера кода Kotlin, блок «Частые вопросы» (5–9 раскрывающихся карточек),
видео-карточка с тайм-кодом «к сути» и 4–8 реальных источников. Точные сниппеты всех компонентов —
в `references/components.md` (callout, код, таблица, Q&A, видео-карточка `.ytcard`, mermaid, источники).

## Тон и глубина

Русский язык. Уровень Middle+/Senior: объясняй механику «под капотом», компромиссы и подводные
камни, а не только определения. Код — компилируемый и идиоматичный. Хорошая проверка: прочитав
раздел, кандидат может уверенно ответить на соответствующий вопрос вслух. Термины-сокращения
раскрывай при первом употреблении.

## Подключение темы в навигацию

Навигация, mind-map и сетка тем строятся из массива `TOPICS` в `site/assets/app.js`. Чтобы добавить
страницу, вставь запись (и при необходимости новую группу в `GROUPS`):

```js
// GROUPS: { ключ: { title: "Название группы", color: "#hex" } }
// TOPICS (порядок = порядок в сайдбаре и prev/next):
{ id:"my-topic", n:"15", file:"15-my-topic.html", icon:"🧩", group:"foundations",
  title:"Моя тема", short:"Короткое описание для карточки.", subs:["Тег1","Тег2","Тег3"] },
```

`id` обязан совпадать с `data-page` страницы и с её именем файла-основой. После добавления —
обнови счётчики на `index.html` при необходимости. Если редактируешь существующую страницу —
менять `app.js` не нужно.

## Важные правила (иначе сломается)

- **Экранируй** `<`, `>`, `&` внутри `<code>`/`<pre>` как `&lt; &gt; &amp;` — иначе дженерики
  (`List&lt;T&gt;`) ломают верстку.
- **Mermaid пиши без ведущих отступов** (директива `flowchart`/`sequenceDiagram` с начала строки),
  узлы с проблемными символами бери в кавычки: `A["a, b()"]`.
- **Видео — только карточкой `.ytcard`**, не `<iframe>`: часть роликов запрещают встраивание
  (ошибка 153). Карточка ведёт на YouTube с тайм-кодом и работает всегда.
- **Файл должен заканчиваться на `</html>`** без мусорных/нулевых байтов в хвосте.

Перед сдачей — пройди `references/review-checklist.md`.
