export const meta = {
  name: 'chapter-enrichment',
  description: 'Enrich all 18 existing chapters: starred questions, FAQ, diagrams, tasks, key new paragraphs',
  phases: [ { title: 'Enrich batch 1' }, { title: 'Enrich batch 2' }, { title: 'Enrich batch 3' } ],
}

const dir = '/Users/kruz18/Documents/interview/android-interview-prep'
const pages = dir + '/site/pages/'

const CONTRACT = `
КОНТРАКТ РАЗМЕТКИ (соблюдай дословно — иначе ломается рендер):
- Редактируешь ТОЛЬКО контент внутри <article class="page"> … </article>. НЕ трогай <head>, <script>, подключение app.js/style.css/CDN, пустые #sidebar/.breadcrumb/#toc, версию app.js?v=… . Файл обязан заканчиваться на </html> без мусора.
- ПАРАГРАФ = <section class="section" id="kebab-id"><h2>Заголовок</h2>…</section>. Оглавление строится из .section>h2. Подпараграфов НЕТ: никаких <h3>/<h4>; мелкий подпункт — <p class="subhead">Текст</p>.
- «ВОПРОС СО ЗВЁЗДОЧКОЙ»: ровно ОДИН в КОНЦЕ каждого контентного параграфа (перед его </section>), как карточка:
  <details class="qa"><summary>ВОПРОС <span class="q-badge">★</span></summary><div class="ans"><p>ОТВЕТ…</p></div></details>
  В мета-секции (#video/#faq/#tasks/.sources) звёздочку НЕ ставь.
- FAQ-карточка: <details class="qa"><summary>Вопрос? <span class="q-badge">Middle|Middle+|Senior</span></summary><div class="ans"><p>…</p></div></details> — добавляется в существующую #faq.
- ЗАДАЧА: <div class="task-card"><p class="task-problem"><strong>Задача N.</strong> …</p><details class="task-solution"><summary>Показать решение</summary><div class="task-ans"><pre><code class="language-kotlin">…</code></pre><p>Объяснение…</p></div></details></div> — добавляется в существующую #tasks (продолжи нумерацию).
- КОД: <pre><code class="language-kotlin">…</code></pre>; опц. метка <div class="code-label">File.kt</div> ПЕРЕД <pre>. ЭКРАНИРУЙ < > & как &lt; &gt; &amp; (List&lt;T&gt;, Flow&lt;T&gt;, Map&lt;K,V&gt;).
- CALLOUT: <div class="callout tip|info|warn|danger"><div class="ic">💡|ℹ️|⚠️|🛑</div><div class="bd"><strong>Лейбл.</strong> …</div></div>.
- ТАБЛИЦА: <div class="table-wrap"><table><thead>…</thead><tbody>…</tbody></table></div>.
- ДИАГРАММА: <div class="diagram"><div class="mermaid">\nDIRECTIVE…\n</div><div class="cap">Подпись</div></div>. Mermaid-директива (flowchart/sequenceDiagram/stateDiagram-v2/classDiagram) С НАЧАЛА СТРОКИ, БЕЗ ведущих пробелов; узлы с (){}:,< в кавычках "…". Нестандартная схема — рукописный <svg viewBox=… role="img"><title>…</title><desc>…</desc>…</svg>, цвета через переменные (--accent,--accent-2,--text,--text-dim,--border,--panel,--danger,--warn), линии fill="none". Сравнение «по осям» — таблицей, не схемой.

КАЧЕСТВО ТЕКСТА (tech-author + ru-humanizer): русский, живой технический разбор как сильный тех-блог — «мы»/«вы», настоящее время, рваный ритм. БЕЗ ИИ-штампов: «стоит/важно отметить», «играет ключевую роль», «позволяет/обеспечивает», «не только… но и…», триколоны, «давайте рассмотрим», резюме-вода в конце блока, декоративные эмодзи в заголовках, тотальный болд. БЕЗ канцелярита. Попадай в речевой и визуальный регистр уже существующих параграфов этой же страницы.

ФАКТЫ — ТОЧНЫЕ. Ответы в плане (/tmp/gaps/<id>.json) — это проверенные факты, оформи их живо. Если добавляешь что-то сверх плана и не уверен в числе/версии/сигнатуре — сверь WebSearch (ToolSearch "select:WebSearch,WebFetch") по developer.android.com / kotlinlang.org или опусти число.

ИНФОГРАФИКА: тип под смысл, ≤2-3 оттенка, серый для нейтрального, без теней/градиентов/неона, подписи ≤5 слов, цикл не кольцом.

ДОСТУПНЫ НОВЫЕ ГЛАВЫ для кросс-ссылок (относительные): background-work.html (Фоновая работа), gradle-build.html (Gradle и сборка), rendering.html (Рендеринг и кадры).

КАК ВСТАВЛЯТЬ ВОПРОС СО ЗВЁЗДОЧКОЙ НАДЁЖНО: чтобы попасть в КОНЕЦ нужной секции, делай Edit где old_string захватывает закрытие текущей секции и открытие следующей по уникальному id, например:
  old_string:  "        </section>\\n\\n        <section class=\\"section\\" id=\\"NEXT_ID\\">"
  new_string:  "          <details class=\\"qa\\"><summary>…<span class=\\"q-badge\\">★</span></summary><div class=\\"ans\\"><p>…</p></div></details>\\n        </section>\\n\\n        <section class=\\"section\\" id=\\"NEXT_ID\\">"
Так карточка встаёт перед </section> ТЕКущей секции. Для последней контентной секции (перед #video или #faq) бери в якорь id="video"/id="faq".
`

const REPORT_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: {
    chapterId: { type: 'string' },
    addedStarred: { type: 'number' }, addedFaq: { type: 'number' }, addedTasks: { type: 'number' },
    addedDiagrams: { type: 'number' }, addedParagraphs: { type: 'array', items: { type: 'string' } },
    lintClean: { type: 'boolean' }, notes: { type: 'string' },
  },
  required: ['chapterId','addedStarred','addedFaq','addedTasks','addedDiagrams','addedParagraphs','lintClean','notes'],
}

const enrich = (ch, phaseTitle) => agent(
`Ты — технический автор учебного сайта подготовки к Android-собеседованию (Middle+/Senior, русский). ОБОГАЩАЕШЬ одну существующую главу.

Глава id=${ch.id}. Файл: ${pages}${ch.file}
План обогащения (читай ОБЯЗАТЕЛЬНО): ${'/tmp/gaps/'+ch.id+'.json'} — там поля starredToAdd, newFaq, newTasks, diagramsNeeded, missingParagraphTopics с готовыми проверенными фактами.

ШАГИ:
1) Прочитай план (Read /tmp/gaps/${ch.id}.json) и страницу (Read ${pages}${ch.file}).
2) Добавь ВСЕ starredToAdd: по одному ★-вопросу в КОНЕЦ соответствующей секции (по sectionId). Вопрос и ответ оформи живо и точно (ответ из плана — это факты; разверни в 1-3 абзаца, где уместно — мини-код или список). Проверь, что секция ещё не содержит ★ (не дублируй).
3) Добавь diagramsNeeded: инфографику ПОСЛЕ указанной секции afterSectionId (или внутрь неё). Сравнение «по осям» — таблицей. Соблюдай правила инфографики.
4) Добавь newTasks в #tasks (продолжи нумерацию задач).
5) Добавь newFaq в #faq (дедуп — если вопрос уже есть в главе, пропусти).
6) Из missingParagraphTopics добавь самые ценные как ПОЛНОЦЕННЫЕ новые <section class="section"> среди контентных параграфов (ДО #video/#faq) — с телом, примером кода/таблицей/диаграммой где уместно, и со своим ★-вопросом в конце. Мелкие/редкие подтемы оформи как FAQ или <p class="subhead"> внутри подходящего параграфа, чтобы не раздувать. Не гонись за количеством ради количества — качество и неизбыточность важнее.
${ch.extra || ''}
7) САМОПРОВЕРКА через Bash (исправь всё найденное):
   - grep -nP '^\\s+(flowchart|sequence|state|class|graph|erDiagram)' ${pages}${ch.file}  → пусто
   - grep -nE '<h[34]' ${pages}${ch.file}  → пусто
   - python3 -c "d=open('${pages}${ch.file}','rb').read(); print(d.count(0), d.rstrip()[-7:])"  → '0 b'</html>''
   - число '<section' == число '</section>' (grep -c)
   - в новых блоках <code> дженерики экранированы (&lt; &gt;), а не <…>
   - каждый новый <details class="qa"> и .task-card корректно закрыт.

НЕ меняй навигацию, <head>, версию app.js. Верни JSON-отчёт по схеме (фактические числа добавленного).
${CONTRACT}`,
  { label: `enrich:${ch.id}`, phase: phaseTitle, schema: REPORT_SCHEMA, effort: 'high' }
)

async function withRetry(fn, tries = 3) {
  for (let i = 0; i < tries; i++) {
    const r = await fn()
    if (r) return r
    log(`retry ${i + 1} failed, retrying…`)
  }
  return null
}

const CH = [
  // batch 1 — coding/system-design heavy + biggest
  { id:'algorithms', file:'algorithms.html', batch:1, extra:
`ДОПОЛНИТЕЛЬНО (важно): добавь как НОВЫЕ параграфы: «Куча и приоритетная очередь» (PriorityQueue/heapify, O(log n) push/pop, O(n) build-heap; задача Kth Largest через кучу размера k; упомяни Merge K Sorted Lists) и «Монотонный стек» (как именованный паттерн: Daily Temperatures / Next Greater Element; кросс-ссылка на уже существующую задачу Sliding Window Maximum). В #tasks добавь: Coin Change (DP снизу-вверх), Longest Common Subsequence (2D-таблица), Number of Islands (BFS/DFS по сетке), Binary Search on Answer в стиле Koko Eating Bananas. Для каждой задачи — компилируемое Kotlin-решение и разбор сложности.` },
  { id:'coroutines', file:'coroutines.html', batch:1, extra:
`ДОПОЛНИТЕЛЬНО (Android live-coding, очень частые): добавь в #tasks 3-4 задачи с компилируемым Kotlin: (а) реализовать debounce с нуля (сброс таймера на новой эмиссии) и в разборе сравнить debounce vs throttleFirst vs sample (поле ввода vs тап по кнопке); (б) retry с экспоненциальным backoff + jitter и предикатом retryOn (не ретраить 401/неисправимые); назвать .retry(3) анти-паттерном; (в) свой промежуточный оператор Flow через flow { upstream.collect { … emit() } } (например pairwise или throttleLatest); (г) token-bucket rate limiter (пополнение токенов во времени, всплески до ёмкости, suspend/reject при пустом). Если уместно — короткий параграф «Операторы потока: debounce/throttle/sample» среди контентных.` },
  { id:'system-design', file:'system-design.html', batch:1, extra:
`ДОПОЛНИТЕЛЬНО: добавь ПОЛНОЦЕННЫЕ параграфы-кейсы: «Кейс: чат/мессенджер» (WebSocket vs FCM при оффлайне, ACK sent/delivered/read, presence/last seen, упорядочивание clientSeq+серверный timestamp, идемпотентность отправки, группы/fan-out, влияние Doze, кратко E2E; сравни с лентой) и «Кейс: библиотека загрузки изображений» (fluent API load(url).into(view), Engine-координатор, Fetcher/Decoder, двухуровневый MemoryCache(LRU)+DiskCache, bitmap pooling, downsampling под размер, отмена при rebind ViewHolder, привязка к lifecycle). Добавь параграф/таблицу «Транспорт реального времени» (short/long polling, SSE, WebSocket, gRPC streaming, MQTT — батарея/переподключения/бэкграунд). В существующий кэш-параграф или trade-offs вшей stale-while-revalidate, request dedup (in-flight), prefetch. Эти кейсы — отдельные ★-вопросы тоже.` },
  { id:'kotlin', file:'kotlin.html', batch:1 },
  { id:'compose', file:'compose.html', batch:1, extra:
`ДОПОЛНИТЕЛЬНО: добавь параграф «Доступность (accessibility) в Compose» (semantics{}, contentDescription, mergeDescendants, размеры тач-таргетов ≥48dp, тестирование TalkBack, минимум WCAG для контраста). Если в главе нет — короткий параграф про CompositionLocal vs staticCompositionLocalOf (tracked/untracked reads) и жизненный цикл композиции (enter/recompose/leave) — но только если не дублирует существующее.` },
  { id:'architecture', file:'architecture-di.html', batch:1, extra:
`ДОПОЛНИТЕЛЬНО: добавь параграф «Навигация и deep links» (Navigation Component / Navigation-Compose, back stack, type-safe аргументы с @Serializable, single-activity, App Links + assetlinks.json autoVerify, custom scheme vs https, deferred deep links). Если в главе уже есть про навигацию — расширь, не дублируй.` },

  // batch 2
  { id:'components', file:'android-components.html', batch:2, extra:
`ДОПОЛНИТЕЛЬНО: где про Service/фон — добавь кросс-ссылку на новую главу <a href="background-work.html">Фоновая работа</a> (WorkManager/FGS/AlarmManager) как «глубже здесь», не дублируя её содержимое.` },
  { id:'threads', file:'threads.html', batch:2, extra:
`ДОПОЛНИТЕЛЬНО: если мало про ART/GC — короткий параграф или subhead «Память и GC на Android (ART)»: generational/concurrent GC, куча, утечки через Context/статику, отличие от JVM HotSpot, LMK. Кросс-ссылка на <a href="profiling.html">Профилирование</a>.` },
  { id:'network', file:'network.html', batch:2, extra:
`ДОПОЛНИТЕЛЬНО: добавь параграф «Загрузка изображений (Coil/Glide)» (многоуровневый кэш память+диск, bitmap pooling, downsampling под размер view, отмена при rebind, размер либ, Coil под Compose, проблема width=0).` },
  { id:'storage', file:'data-storage.html', batch:2 },
  { id:'security', file:'security.html', batch:2 },
  { id:'profiling', file:'profiling.html', batch:2, extra:
`ДОПОЛНИТЕЛЬНО: где про кадры/jank — кросс-ссылка на новую главу <a href="rendering.html">Рендеринг и кадры</a> (Choreographer/VSYNC) как «механика кадра здесь», не дублируя.` },

  // batch 3
  { id:'oop-solid', file:'oop-solid.html', batch:3 },
  { id:'executors', file:'executors.html', batch:3 },
  { id:'looper-handler', file:'looper-handler.html', batch:3 },
  { id:'testing', file:'testing.html', batch:3, extra:
`ДОПОЛНИТЕЛЬНО: добавь короткий параграф «CI/CD для Android» (pipeline: lint → unit → instrumented на эмуляторе, подпись, дистрибуция Play tracks / App Distribution, кэш Gradle в CI, флейки и shard). Кросс-ссылка на <a href="gradle-build.html">Gradle и сборка</a>.` },
  { id:'terminology', file:'terminology.html', batch:3, extra:
`ДОПОЛНИТЕЛЬНО: эта глава — глоссарий из таблиц без #faq. Добавь секцию #faq (6-8 карточек) ПЕРЕД #tasks с реальными вопросами на различение близких терминов (race condition vs data race; идемпотентность vs чистота vs детерминизм; какие HTTP-методы идемпотентны; coupling vs cohesion). ★-вопросы — в конце каждой контентной секции (таблицы тоже считаются параграфами с h2).` },
  { id:'behavioral', file:'behavioral.html', batch:3 },
]

const runBatch = (n) => parallel(CH.filter(c => c.batch === n).map(c => () => withRetry(() => enrich(c, `Enrich batch ${n}`))))

// NOTE: batch 1 (algorithms, coroutines, system-design, kotlin, compose, architecture)
// already completed in a prior run — skip it so it is not re-enriched (double ★).
phase('Enrich batch 2'); const b2 = await runBatch(2)
phase('Enrich batch 3'); const b3 = await runBatch(3)

return { batch2: b2.filter(Boolean), batch3: b3.filter(Boolean) }
