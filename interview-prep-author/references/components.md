# Библиотека компонентов (классы из site/assets/style.css)

Готовые сниппеты. Копируй и наполняй. Все классы уже стилизованы в `style.css` — новые CSS писать
не нужно.

## Секция
```html
<section class="section" id="kebab-id">
  <h2>Заголовок секции</h2>
  <h3>Подзаголовок</h3>
  <p>Текст. Внутри — <code>inline-код</code>, <strong>акцент</strong>, <em>пояснение</em>.</p>
</section>
```
Оглавление (`#toc`) строится автоматически из `.section > h2` и `> h3`. Давай секциям осмысленные `id`.

## Callout (акцентные блоки)
Варианты класса: `info` (ℹ️), `tip` (💡), `warn` (⚠️), `danger` (🛑).
```html
<div class="callout tip">
  <div class="ic">💡</div>
  <div class="bd"><strong>Совет.</strong> Короткая мысль, которую важно подчеркнуть.</div>
</div>
```

## Код Kotlin (с подсветкой highlight.js)
Опциональная подпись-«ярлык файла» идёт ПЕРЕД `<pre>`. Экранируй `<`, `>`, `&`.
```html
<div class="code-label">UserViewModel.kt</div>
<pre><code class="language-kotlin">class UserViewModel : ViewModel() {
    private val _state = MutableStateFlow(UiState())
    val state: StateFlow&lt;UiState&gt; = _state.asStateFlow()
}</code></pre>
```

## Таблица-сравнение
```html
<div class="table-wrap">
  <table>
    <thead><tr><th>Критерий</th><th>Вариант A</th><th>Вариант B</th></tr></thead>
    <tbody>
      <tr><td>Связанность</td><td>Жёсткая</td><td>Слабая</td></tr>
    </tbody>
  </table>
</div>
```

## Q&A (раскрывающиеся карточки «Частые вопросы»)
Бейдж уровня: `Middle` / `Middle+` / `Senior`.
```html
<section class="section" id="faq">
  <h2>Частые вопросы интервьюера</h2>
  <details class="qa">
    <summary>Вопрос, который задаст интервьюер? <span class="q-badge">Middle+</span></summary>
    <div class="ans"><p>Развёрнутый ответ: суть, нюансы, пример.</p></div>
  </details>
</section>
```

## Видео-карточка с тайм-кодом (ВМЕСТО iframe)
Часть роликов запрещает встраивание (ошибка 153), поэтому используем надёжную карточку-ссылку.
`?t=СЕК` и `▶ с M:SS` должны соответствовать. Превью — `img.youtube.com/vi/<ID>/hqdefault.jpg`.
Для длинных докладов ставь тайм-код «после вступления», для коротких туториалов — `с начала`.
```html
<section class="section" id="video">
  <h2>Видео-разбор</h2>
  <a class="ytcard" href="https://youtu.be/VIDEO_ID?t=SEC" target="_blank" rel="noopener">
    <span class="yt-thumb" style="background-image:url('https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg')">
      <span class="yt-play"></span>
      <span class="yt-time">▶ с M:SS</span>
    </span>
    <span class="yt-meta">
      <strong>Название ролика</strong>
      <span class="yt-by">Автор · язык</span>
      <span class="yt-why">Суть: <b>с M:SS</b> — что именно смотреть.</span>
    </span>
  </a>
</section>
```
Несколько роликов — несколько `<a class="ytcard">…</a>` подряд внутри одной секции.

## Диаграмма Mermaid
КРИТИЧНО: код mermaid пиши БЕЗ ведущих отступов (директива с начала строки). Узлы с символами
`(){}:,<` бери в кавычки. Хорошие типы: `flowchart`, `sequenceDiagram`, `stateDiagram-v2`, `classDiagram`.
```html
<div class="diagram">
<div class="mermaid">
flowchart LR
  A["Старт"] --> B{"Условие?"}
  B -->|да| C["Действие"]
  B -->|нет| D["Иначе"]
</div>
<div class="cap">Подпись к схеме</div>
</div>
```

## Источники (в конце страницы)
Приоритет: developer.android.com, kotlinlang.org. 4–8 реальных ссылок.
```html
<div class="sources">
  <h2>Источники</h2>
  <ol>
    <li><a href="https://developer.android.com/…" target="_blank" rel="noopener">Название</a> — что там.</li>
  </ol>
</div>
```

## Прочие готовые классы
- `.tag`, `.tag.lvl-mid`, `.tag.lvl-sen`, `.tag.hot` — бейджи в шапке.
- `.grid.cols-2` / `.grid.cols-3` — сетка карточек.
- `.card` — простая карточка-контейнер.
- `kbd` — клавиша; `code` — инлайн-код.
