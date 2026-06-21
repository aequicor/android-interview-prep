export const meta = {
  name: 'fact-deslop-review',
  description: 'Independent fact-check + AI-marker review of enriched chapters; surgical fixes only',
  phases: [ { title: 'Review batch 1' }, { title: 'Review batch 2' } ],
}

const dir = '/Users/kruz18/Documents/interview/android-interview-prep'
const pages = dir + '/site/pages/'

const SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: {
    chapterId: { type: 'string' },
    factIssuesFixed: { type: 'array', items: { type: 'string' }, description: 'each: what was wrong + the correction' },
    markerFixes: { type: 'array', items: { type: 'string' } },
    logicFixes: { type: 'array', items: { type: 'string' } },
    visualFixes: { type: 'array', items: { type: 'string' } },
    remainingConcerns: { type: 'array', items: { type: 'string' }, description: 'issues you were NOT confident enough to fix — for human review' },
    lintClean: { type: 'boolean' },
    verdict: { type: 'string', enum: ['clean','minor-fixes','needs-attention'] },
  },
  required: ['chapterId','factIssuesFixed','markerFixes','logicFixes','visualFixes','remainingConcerns','lintClean','verdict'],
}

const review = (ch, phaseTitle) => agent(
`Ты — придирчивый технический редактор-фактчекер материала для подготовки к Android-собеседованию (Middle+/Senior, русский). Ревьюишь ОДНУ главу. Цель — поймать ФАКТИЧЕСКИЕ ОШИБКИ и грубые ИИ-штампы, не повредив хороший текст.

Файл: ${pages}${ch.file}

ПРАВИЛО ПРАВКИ (критично): меняй что-либо ТОЛЬКО если уверен, что это ОШИБКА. При сомнении — НЕ трогай, занеси в remainingConcerns. Правки хирургические (минимальные Edit), НЕ переписывай разделы, НЕ удаляй секции, НЕ меняй структуру/разметку/навигацию/<head>/версию app.js. Сохраняй живой авторский голос.

ЧТО ПРОВЕРЯТЬ (приоритет — факты):
1) ГОРЯЧИЕ ЗОНЫ ФАКТОВ. Сверь и при явной ошибке исправь:
   - Соответствие версия Android ↔ API level ↔ поведение (частый сдвиг ±1). Напр.: Doze — Android 6.0/API 23; background execution limits — 8.0/API 26; scoped storage — 10/API 29; FGS types обязательны — 14/API 34; SCHEDULE_EXACT_ALARM — 12/API 31; notification runtime permission — 13/API 33.
   - Сигнатуры API, имена методов/классов, ключи Gradle/Manifest — должны быть реальными.
   - Числа («в N раз», размеры, тайминги, дефолты), бюджет кадра (16.6 мс @60Гц), мин. период PeriodicWork (15 мин) и т.п.
   - Deprecated-статус: не советуется ли как актуальное то, что устарело (или наоборот).
   Если не уверен в конкретном числе/версии/сигнатуре — проверь WebSearch (ToolSearch "select:WebSearch,WebFetch") по developer.android.com / kotlinlang.org. Не нашёл подтверждения и сомневаешься — в remainingConcerns, НЕ выдумывай правку.
2) ЛОГИКА. Внутренние противоречия, неверные причинно-следственные связи, ответ ★-вопроса, который не отвечает на вопрос, код, который не скомпилируется или противоречит тексту.
3) ИИ-МАРКЕРЫ (только грубые). «стоит/важно отметить», «играет ключевую роль», «позволяет/обеспечивает» как пустая связка, «не только… но и…», «давайте рассмотрим», канцелярит, тотальный болд, декоративные эмодзи в заголовках. Заменяй штамп на конкретный факт, а не выкидывай смысл.
4) ВИЗУАЛ (только тривиальное и безопасное). Mermaid с захардкоженными hex-цветами, которые НЕ читаются в одной из тем — поправь только если очевидно сломано; иначе в remainingConcerns. НЕ перерисовывай схемы целиком.

ПОСЛЕ ПРАВОК — самопроверка Bash (всё должно остаться чистым):
  grep -cP '^\\s+(flowchart|sequenceDiagram|stateDiagram|classDiagram|graph|erDiagram)' ${pages}${ch.file}  → 0
  grep -cE '<h[34][ >]' ${pages}${ch.file}  → 0
  python3 -c "d=open('${pages}${ch.file}','rb').read(); print(d.count(0), d.rstrip()[-7:])"  → 0 b'</html>'
  grep -oc '<section' ${pages}${ch.file}  == grep -oc '</section>'
  grep -oc '<details' ${pages}${ch.file}  == grep -oc '</details>'
Если что-то сломал — почини. Верни отчёт по схеме (verdict: clean если правок не было; minor-fixes если мелкие; needs-attention если нашёл серьёзное, но не смог уверенно починить).`,
  { label: `review:${ch.id}`, phase: phaseTitle, schema: SCHEMA, effort: 'high' }
)

async function withRetry(fn, tries = 3) {
  for (let i = 0; i < tries; i++) { const r = await fn(); if (r) return r; log(`retry ${i+1}`) }
  return null
}

const CH = [
  { id:'algorithms', file:'algorithms.html', b:1 },
  { id:'coroutines', file:'coroutines.html', b:1 },
  { id:'system-design', file:'system-design.html', b:1 },
  { id:'kotlin', file:'kotlin.html', b:1 },
  { id:'compose', file:'compose.html', b:1 },
  { id:'architecture', file:'architecture-di.html', b:1 },
  { id:'background-work', file:'background-work.html', b:1 },
  { id:'gradle-build', file:'gradle-build.html', b:1 },
  { id:'rendering', file:'rendering.html', b:1 },
  { id:'components', file:'android-components.html', b:1 },
  { id:'threads', file:'threads.html', b:1 },
  { id:'network', file:'network.html', b:2 },
  { id:'storage', file:'data-storage.html', b:2 },
  { id:'security', file:'security.html', b:2 },
  { id:'profiling', file:'profiling.html', b:2 },
  { id:'testing', file:'testing.html', b:2 },
  { id:'executors', file:'executors.html', b:2 },
  { id:'looper-handler', file:'looper-handler.html', b:2 },
  { id:'oop-solid', file:'oop-solid.html', b:2 },
  { id:'terminology', file:'terminology.html', b:2 },
  { id:'behavioral', file:'behavioral.html', b:2 },
]

phase('Review batch 1')
const b1 = await parallel(CH.filter(c=>c.b===1).map(c => () => withRetry(() => review(c, 'Review batch 1'))))
phase('Review batch 2')
const b2 = await parallel(CH.filter(c=>c.b===2).map(c => () => withRetry(() => review(c, 'Review batch 2'))))

return { batch1: b1.filter(Boolean), batch2: b2.filter(Boolean) }
