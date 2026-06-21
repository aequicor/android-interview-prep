# Библиотека компонентов (классы из site/assets/style.css)

Готовые сниппеты. Копируй и наполняй. Все классы уже стилизованы в `style.css` — новые CSS писать
не нужно.

## Параграф
```html
<section class="section" id="kebab-id">
  <h2>Заголовок параграфа</h2>
  <p>Текст. Внутри — <code>inline-код</code>, <strong>акцент</strong>, <em>пояснение</em>.</p>
</section>
```
Оглавление (`#toc`) строится автоматически из `.section > h2` — по одной записи на параграф. Давай
параграфам осмысленные `id`.

**Подпараграфов нет** (`группа → глава → параграф`). Для мелкого подпункта внутри параграфа — текстовый
ран-ин `<p class="subhead">…</p>`: это не заголовок и не уровень навигации (в оглавление не попадает).
```html
<p class="subhead">Короткий ярлык подпункта</p>
<p>Пояснение…</p>
```

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

### Вопрос со звёздочкой (рендерится как полоска «★ Дополнительно»)
Пишется той же `.qa`-карточкой, но бейдж — `★` (а не уровень). На загрузке `app.js` (`upgradeStarred()`)
сам сворачивает её в узкую полоску «★ Дополнительно»: вопрос виден только после раскрытия. Отдельной
разметки и CSS писать не нужно — только бейдж `★`. Ставится один раз, в конце контентного параграфа.
```html
<details class="qa">
  <summary>Глубокий «под капотом» вопрос, выше базового уровня параграфа? <span class="q-badge">★</span></summary>
  <div class="ans"><p>Развёрнутый ответ: механизм, неочевидный кейс, «почему именно так».</p></div>
</details>
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

## Задачи (карточки с коллапсируемым решением)

Секция с практическими задачами. Условие видно всегда, решение скрыто под «▶ Показать решение».
```html
<section class="section" id="tasks">
  <h2>Задачи</h2>

  <div class="task-card">
    <p class="task-problem"><strong>Задача 1.</strong> Описание задачи — конкретное, как условие на LeetCode.</p>
    <details class="task-solution">
      <summary>Показать решение</summary>
      <div class="task-ans">
        <pre><code class="language-kotlin">fun solution(): ReturnType {
    // решение
}</code></pre>
        <p>Объяснение: суть решения, сложность, подводные камни.</p>
      </div>
    </details>
  </div>

  <div class="task-card">
    <p class="task-problem"><strong>Задача 2.</strong> …</p>
    <details class="task-solution">
      <summary>Показать решение</summary>
      <div class="task-ans">
        <pre><code class="language-kotlin">// …</code></pre>
        <p>Объяснение: …</p>
      </div>
    </details>
  </div>
</section>
```
Размещай перед `<div class="sources">`. Экранируй `<`, `>`, `&` в `<code>` как `&lt; &gt; &amp;`.

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
