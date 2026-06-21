/* ============================================================
   Android Interview Prep — shared app logic
   Навигация, mind-map, поиск, прогресс (localStorage), TOC, тема, закладки
   ============================================================ */

const GROUPS = {
  reference:   { title: "Справочник инженера",    color: "#9aa7b4" },
  foundations: { title: "Язык и проектирование", color: "#3ddc84" },
  platform:    { title: "Платформа Android",      color: "#58a6ff" },
  core:        { title: "Алгоритмы и структуры данных", color: "#f0a020" },
  concurrency: { title: "Многопоточность",         color: "#ff7b54" },
  ui:          { title: "UI / Compose",            color: "#d2a8ff" },
  data:        { title: "Данные и сеть",           color: "#2dd4bf" },
  quality:     { title: "Безопасность и качество", color: "#f85149" },
  design:      { title: "Дизайн и софт-скиллы",    color: "#ec6cb9" },
};

const TOPICS = [
  { id:"terminology",   file:"terminology.html",      icon:"📖", group:"reference", title:"Терминология инженера",
    short:"Мини-словарь слов, которые часто звучат на собесе: контракт, инвариант, coupling/cohesion, идемпотентность, race condition и др. — с формулировками «как сказать на интервью».", subs:["Контракт","Coupling","Идемпотентность"] },
  { id:"oop-solid",     file:"oop-solid.html",        icon:"🧱", group:"foundations", title:"ООП и SOLID",
    short:"ООП (объектно-ориентированное программирование), SOLID (пять принципов проектирования) и GoF-паттерны («Банда четырёх») в Android.", subs:["SOLID","Паттерны","Композиция"] },
  { id:"kotlin",        file:"kotlin.html",           icon:"🟣", group:"foundations", title:"Язык Kotlin",
    short:"Null-safety (безопасность от null), sealed/data-классы (закрытые и дата-классы), дженерики, делегаты и inline (встраивание).", subs:["Null-safety","Дженерики","Делегаты"] },
  { id:"components",    file:"android-components.html",icon:"📱", group:"platform", title:"Android-компоненты + IPC",
    short:"Service (служба), BroadcastReceiver (приёмник событий), ContentProvider (поставщик данных), Binder и AIDL (Android Interface Definition Language, язык описания интерфейса Android) для IPC (межпроцессного взаимодействия). Activity и Fragment вынесены в отдельные главы.", subs:["Service","Receiver","Binder/AIDL"] },
  { id:"activity",      file:"activity.html",          icon:"🪟", group:"platform", title:"Activity",
    short:"Lifecycle, сохранение состояния, process death, Activity Result API, task/back stack, launch modes и флаги вроде isFinishing/isChangingConfigurations.", subs:["Lifecycle","isFinishing","Back stack"] },
  { id:"fragment",      file:"fragment.html",          icon:"🧩", group:"platform", title:"Fragment",
    short:"Два lifecycle, viewLifecycleOwner, FragmentManager, транзакции, back stack, state loss, DialogFragment и Fragment Result API.", subs:["Transactions","viewLifecycleOwner","Result API"] },
  { id:"background-work", file:"background-work.html",  icon:"⏳", group:"platform", title:"Фоновая работа",
    short:"Doze и App Standby, лимиты фона, WorkManager (гарантированная отложенная работа), foreground service и типы FGS, AlarmManager (точное время) и FCM как стратегия пробуждения. Когда что выбирать.", subs:["WorkManager","FGS","AlarmManager"] },
  { id:"algorithms",    file:"algorithms.html",       icon:"🧮", group:"core", title:"Алгоритмы и структуры",
    short:"ArrayList (динамический массив), HashMap (хэш-таблица), concurrent-коллекции (потокобезопасные), Big-O (асимптотическая сложность) и задачи.", subs:["HashMap","Concurrent","Big-O"] },
  { id:"threads",       file:"threads.html",          icon:"🧵", group:"concurrency", title:"Потоки и память JVM",
    short:"Thread и Runnable, гонки данных, synchronized, volatile и happens-before, deadlock/livelock/starvation, CAS и lock-free (атомики, ABA, VarHandle).", subs:["happens-before","synchronized","CAS"] },
  { id:"looper-handler", file:"looper-handler.html",   icon:"🔁", group:"concurrency", title:"Looper и Handler",
    short:"Петля событий главного потока: Looper, MessageQueue, Handler и Message; отложенные сообщения, HandlerThread, барьеры синхронизации и связь с ANR.", subs:["Looper","MessageQueue","HandlerThread"] },
  { id:"executors",     file:"executors.html",         icon:"🧰", group:"concurrency", title:"Executor и пулы потоков",
    short:"ExecutorService и ThreadPoolExecutor: модель роста пула, очереди задач, политики отказа, ScheduledExecutorService, Future и почему AsyncTask устарел.", subs:["ThreadPool","Очереди","Rejection"] },
  { id:"coroutines",    file:"coroutines.html",        icon:"🌀", group:"concurrency", title:"Корутины и Flow",
    short:"suspend как стейт-машина (CPS), Dispatchers, launch/async, structured concurrency, кооперативная отмена, suspendCancellableCoroutine и Flow (cold/hot, backpressure).", subs:["suspend/CPS","Structured","Flow"] },
  { id:"compose",       file:"compose.html",          icon:"🎨", group:"ui", title:"Jetpack Compose",
    short:"remember (запоминание состояния), slot table (таблица слотов), рекомпозиция, side effects (побочные эффекты) и stable (стабильность).", subs:["Slot-table","Recompose","SubcomposeLayout"] },
  { id:"rendering",     file:"rendering.html",        icon:"🖼️", group:"ui", title:"Рендеринг и кадры",
    short:"Конвейер кадра: VSYNC и Choreographer, UI Thread и RenderThread, бюджет кадра. Jank и его измерение (JankStats, Perfetto, Macrobenchmark), overdraw, производительность списков и Baseline Profiles.", subs:["VSYNC","Jank","Baseline Profiles"] },
  { id:"architecture",  file:"architecture-di.html",  icon:"🏛️", group:"foundations", title:"Архитектура и DI",
    short:"MVVM/MVI (Model-View-ViewModel и Model-View-Intent — паттерны представления), Clean Architecture (чистая архитектура), multi-module (многомодульность), Hilt/Dagger для DI (dependency injection, внедрения зависимостей) и Navigation (навигация).", subs:["MVVM/MVI","Clean","Hilt"] },
  { id:"storage",       file:"data-storage.html",     icon:"💾", group:"data", title:"Хранение данных",
    short:"DataStore (хранилище ключ-значение), encrypted storage (зашифрованное хранилище), Room/SQLite (локальная база данных) и Keystore (хранилище ключей).", subs:["DataStore","Room","Encrypted"] },
  { id:"network",       file:"network.html",          icon:"🌐", group:"data", title:"Сеть",
    short:"HTTP (протокол передачи гипертекста), TLS/HTTPS (Transport Layer Security и защищённый HTTP — шифрованное соединение), OkHttp, Retrofit и обработка ошибок.", subs:["TLS/HTTPS","OkHttp","Pinning"] },
  { id:"security",      file:"security.html",         icon:"🔐", group:"quality", title:"Безопасность",
    short:"Шифрование, Keystore (хранилище ключей), биометрия, Frida (инструмент динамического анализа) и защита приложения.", subs:["Keystore","Биометрия","Frida"] },
  { id:"profiling",     file:"profiling.html",        icon:"⚡", group:"quality", title:"Профилирование",
    short:"Profiler (профилировщик), LeakCanary (поиск утечек), Baseline Profiles (профили базовой оптимизации), cold start (холодный старт) и R8 (оптимизатор).", subs:["Утечки","Startup","R8"] },
  { id:"testing",       file:"testing.html",          icon:"🧪", group:"quality", title:"Тестирование",
    short:"JUnit (фреймворк тестирования), MockK (моки), тесты корутин, Espresso и Compose UI-тесты (проверка пользовательского интерфейса).", subs:["MockK","runTest","Espresso"] },
  { id:"gradle-build",  file:"gradle-build.html",     icon:"🛠️", group:"quality", title:"Gradle и сборка",
    short:"Фазы Gradle и граф задач, build variants, ускорение сборки, KSP vs kapt, модуляризация, R8 и App Bundle.", subs:["Фазы","R8","App Bundle"] },
  { id:"system-design", file:"system-design.html",    icon:"🗺️", group:"design", title:"Системный дизайн",
    short:"Фреймворк ответа, offline-first (сначала локальные данные), синхронизация и кейсы: лента, чат.", subs:["Offline-first","Кэш","Sync"] },
  { id:"behavioral",    file:"behavioral.html",       icon:"💬", group:"design", title:"Поведенческое интервью",
    short:"STAR (Situation, Task, Action, Result — ситуация, задача, действие, результат), истории, процесс найма и вопросы компании.", subs:["STAR","Истории","Процесс"] },
];

const SPECIAL_PAGES = {
  "interview-test": {
    file: "interview-test.html",
    icon: "✓",
    title: "Тестирование",
    groupTitle: "Проверка готовности",
    short: "Собеседование в формате теста: вопросы по Android Middle+/Senior, отчёт о пробелах и ссылки на параграфы для повторения.",
  },
};

const INTERVIEW_TEST_KEY = "aip-interview-test-v2";
const INTERVIEW_TEST_QUESTIONS = [
  {
    id: "terminology-idempotency-retry",
    level: "Middle+",
    area: "Термины",
    topicId: "terminology",
    sectionId: "idempotency",
    question: "Платёжный `POST` ушёл, клиент получил timeout, а сервер мог уже списать деньги. Какой контракт нужен, чтобы retry не создал дубль?",
    options: [
      "Идемпотентный ключ операции: повтор с тем же ключом возвращает прежний результат, а не создаёт новый платёж.",
      "Correlation id в логах: по нему удобно найти все попытки одного клиентского действия.",
      "Exponential backoff с jitter: он снижает нагрузку при массовых повторах.",
      "Короткий client timeout: UI быстрее отдаёт управление пользователю."
    ],
    answer: 0,
    gap: "Идемпотентность: retry опасен без серверной дедупликации.",
    explain: "Backoff, timeout и логи полезны, но не отвечают на главный вопрос: что будет, если первая попытка всё-таки дошла до сервера. Для unsafe-операции нужен идемпотентный ключ или другой серверный механизм дедупликации.",
    refs: [
      { topicId: "terminology", sectionId: "idempotency", label: "Терминология → Идемпотентность" },
      { topicId: "network", sectionId: "http", label: "Сеть → HTTP и retries" }
    ]
  },
  {
    id: "oop-solid-viewmodel-fake",
    level: "Middle+",
    area: "Проектирование",
    topicId: "oop-solid",
    sectionId: "solid",
    question: "Нужно unit-тестировать `UserViewModel`, но она сама создаёт `Retrofit` и `UserRepositoryImpl`. Какой ход чинит именно тестируемость?",
    options: [
      "Передать во ViewModel `UserRepository` как зависимость снаружи; в тесте подставить fake.",
      "Сделать `Retrofit` singleton: это уменьшит лишнее создание сетевого клиента.",
      "Поднять fake-сервер: так можно проверить сетевой контракт в интеграционном тесте.",
      "Вынести DTO-маппинг из UI: это уменьшит протекание data-слоя в presentation."
    ],
    answer: 0,
    gap: "DIP и DI: что именно надо инвертировать для unit-теста.",
    explain: "Все варианты могут быть полезны, но unit-тест ViewModel требует заменить внешний мир. Для этого ViewModel должна зависеть от абстракции, полученной снаружи, а не собирать конкретный репозиторий и сеть внутри себя.",
    refs: [
      { topicId: "oop-solid", sectionId: "solid", label: "ООП и SOLID → SOLID" },
      { topicId: "architecture", sectionId: "testing", label: "Архитектура и DI → Тестируемость" }
    ]
  },
  {
    id: "kotlin-platform-type-boundary",
    level: "Middle+",
    area: "Kotlin",
    topicId: "kotlin",
    sectionId: "interop",
    question: "Java SDK без nullability-аннотаций вернул `String!`. Где лучше снять риск `null`, чтобы он не разъехался по Kotlin-коду?",
    options: [
      "На границе: проверить/нормализовать значение и дальше отдать доменной модели уже `String` или `String?` с явным смыслом.",
      "В Java-коде, если он ваш: nullability-аннотации помогают Kotlin точнее вывести тип.",
      "`!!` у самой границы делает падение ранним и заметным, если команда сознательно принимает такой контракт.",
      "Контрактный тест на SDK полезен: он ловит изменение поведения поставщика до релиза."
    ],
    answer: 0,
    gap: "Platform type: nullability неизвестна, ответственность на вашем коде.",
    explain: "Аннотации и тесты помогают, а `!!` иногда осознанно ставят как fail-fast. Но главный приём для production-кода — не тащить `String!` дальше: на границе сделать проверку и превратить значение в явный nullable/non-null контракт.",
    refs: [
      { topicId: "kotlin", sectionId: "null-safety", label: "Kotlin → Null-safety" },
      { topicId: "kotlin", sectionId: "interop", label: "Kotlin → Java interop" }
    ]
  },
  {
    id: "kotlin-variance-readonly-api",
    level: "Middle+",
    area: "Kotlin",
    topicId: "kotlin",
    sectionId: "generics",
    question: "Функция только читает животных и ей нужен доступ по индексу. Какой публичный параметр примет `List<Cat>` там, где ожидаются `Animal`, и не пообещает mutation?",
    options: [
      "`fun render(items: List<Animal>)`: `List` ковариантен и read-only на уровне API.",
      "`fun render(items: Iterable<Animal>)`: тоже read-only, но без индексного доступа.",
      "`fun render(items: MutableList<Animal>)`: даёт запись в список и сужает совместимость mutable-коллекций.",
      "`fun render(items: Array<Animal>)`: массив даёт индекс, но остаётся mutable и инвариантным."
    ],
    answer: 0,
    gap: "Variance и выбор минимального API-контракта.",
    explain: "`List<out T>` безопасен как producer: из него читают `Animal`, но не кладут новых животных. `MutableList` и `Array` уже обещают mutation, а `Iterable` слишком общий для условия с индексами.",
    refs: [
      { topicId: "kotlin", sectionId: "generics", label: "Kotlin → Дженерики и variance" }
    ]
  },
  {
    id: "kotlin-scope-apply-builder",
    level: "Middle+",
    area: "Kotlin",
    topicId: "kotlin",
    sectionId: "scope-fns",
    question: "Нужно создать объект, настроить свойства и вернуть сам объект: `User().___ { name = value }`. Что поставить в пропуск?",
    options: [
      "`apply`: блок работает с receiver `this`, наружу возвращается исходный объект.",
      "`also`: наружу тоже возвращается объект, но внутри он приходит как `it`; удобно для логов и побочных действий.",
      "`let`: объект приходит как `it`, а результатом будет последняя строка блока.",
      "`run`: блок работает с receiver `this`, а результатом будет последняя строка блока."
    ],
    answer: 0,
    gap: "Scope-функции: receiver/аргумент и возвращаемое значение.",
    explain: "Все scope-функции похожи, поэтому вопрос на точность. Для builder-style настройки нужен receiver и возврат того же объекта — это `apply`.",
    refs: [
      { topicId: "kotlin", sectionId: "scope-fns", label: "Kotlin → Scope-функции" }
    ]
  },
  {
    id: "components-foreground-service-choice",
    level: "Middle+",
    area: "Android-компоненты",
    topicId: "components",
    sectionId: "service",
    question: "Пользователь сам запустил запись трека, процесс должен идти сейчас и быть видимым в уведомлении. Что ближе к правильному компоненту?",
    options: [
      "Foreground service с подходящим типом: работа видима пользователю и идёт прямо сейчас.",
      "WorkManager: он хорош для гарантированной отложенной работы с условиями и retry.",
      "BroadcastReceiver: он удобен как короткая точка входа на событие с быстрым handoff.",
      "Bound service: он удобен, когда клиент держит соединение с сервисом и вызывает его API."
    ],
    answer: 0,
    gap: "Service lifetime: видимая текущая работа vs отложенная гарантия.",
    explain: "Ключевые слова в условии — «пользователь запустил», «сейчас» и «видимо в уведомлении». WorkManager закрывает другой класс задач: выполнить позже, когда условия позволят.",
    refs: [
      { topicId: "components", sectionId: "service", label: "Android-компоненты → Service" },
      { topicId: "background-work", sectionId: "foreground-service", label: "Фоновая работа → Foreground service" }
    ]
  },
  {
    id: "activity-process-death-state",
    level: "Middle+",
    area: "Activity",
    topicId: "activity",
    sectionId: "saved-state",
    question: "Поворот сохраняет query поиска, а после убийства процесса query пропадает. Где должен жить маленький ключ восстановления?",
    options: [
      "`SavedStateHandle` или saved instance state: маленькое сериализуемое UI-состояние переживает process death.",
      "`ViewModel`: она хорошо держит состояние между configuration changes, пока жив процесс.",
      "База данных: она нужна, если это уже долговечный черновик или доменные данные.",
      "`onDestroy()`: там удобно освобождать ресурсы при штатном уничтожении owner-а."
    ],
    answer: 0,
    gap: "Configuration change ≠ process death.",
    explain: "ViewModel решает поворот, но не смерть процесса. Для query, tab, id и других маленьких ключей восстановления берут `SavedStateHandle`/Bundle; большие и долговечные данные держат в хранилище.",
    refs: [
      { topicId: "activity", sectionId: "saved-state", label: "Activity → Saved state и process death" },
      { topicId: "activity", sectionId: "failure-modes", label: "Activity → Failure modes" }
    ]
  },
  {
    id: "fragment-view-lifecycle",
    level: "Middle+",
    area: "Fragment",
    topicId: "fragment",
    sectionId: "fragment-lifecycle",
    question: "Fragment ушёл в back stack: `onDestroyView()` уже был, а новый emit Flow трогает старый binding. Что исправляет именно lifetime UI?",
    options: [
      "Собирать Flow в `viewLifecycleOwner.lifecycleScope` через `repeatOnLifecycle(...)`, а binding очищать в `onDestroyView()`.",
      "Lifecycle самого Fragment подходит для работы, которая не обращается к уничтоженной View.",
      "Shared ViewModel подходит для общего состояния между экранами или nav graph.",
      "Fragment Result API подходит для одноразового результата между фрагментами."
    ],
    answer: 0,
    gap: "Fragment lifecycle vs view lifecycle: `viewLifecycleOwner`.",
    explain: "Все варианты про реальные инструменты Fragment, но binding живёт ровно столько, сколько View. Всё, что рендерит UI, привязывают к `viewLifecycleOwner`, иначе подписка переживёт `onDestroyView()`.",
    refs: [
      { topicId: "fragment", sectionId: "fragment-lifecycle", label: "Fragment → Два lifecycle" },
      { topicId: "fragment", sectionId: "failure-modes", label: "Fragment → Failure modes" }
    ]
  },
  {
    id: "background-exact-alarm",
    level: "Middle+",
    area: "Фон",
    topicId: "background-work",
    sectionId: "alarmmanager",
    question: "Приложение-будильник должно прозвенеть ровно в 07:30. Какая ось выбора важнее всего?",
    options: [
      "Точное пользовательское время: для будильника/таймера нужен exact alarm и готовность пройти ограничения платформы.",
      "Гарантированная отложенная работа: WorkManager хорош, когда точный момент не важен.",
      "Серверный срочный триггер: high-priority FCM подходит для входящего события извне.",
      "Бережное пакетирование: inexact alarm экономит батарею, когда допустимо окно срабатывания."
    ],
    answer: 0,
    gap: "AlarmManager vs WorkManager: точность времени не равна гарантии выполнения.",
    explain: "Условие требует не «когда-нибудь гарантированно», а конкретный момент, значимый для пользователя. Это редкий законный случай exact alarm; для синхронизаций и выгрузок логов он обычно не нужен.",
    refs: [
      { topicId: "background-work", sectionId: "alarmmanager", label: "Фоновая работа → AlarmManager" },
      { topicId: "background-work", sectionId: "choose", label: "Фоновая работа → Что выбирать" }
    ]
  },
  {
    id: "algorithms-lru-o1",
    level: "Middle+",
    area: "Алгоритмы",
    topicId: "algorithms",
    sectionId: "lru",
    question: "Нужно реализовать LRU-cache с `get/put` за O(1). Какой инвариант структуры делает задачу решаемой?",
    options: [
      "`HashMap` ведёт ключ к узлу, а двусвязный список хранит порядок доступа; узел можно перецепить за O(1).",
      "`PriorityQueue` быстро отдаёт минимум/максимум и хорошо подходит для top-K.",
      "`TreeMap` держит ключи отсортированными и даёт диапазонные запросы за O(log n).",
      "`ArrayDeque` даёт дешёвые операции на концах и удобен для очереди или стека."
    ],
    answer: 0,
    gap: "LRU: мапа для доступа, список для порядка.",
    explain: "LeetCode-ловушка в том, что одной мапы или одной очереди мало. Нужно и найти элемент по ключу, и мгновенно переместить его в «самый свежий» конец порядка доступа.",
    refs: [
      { topicId: "algorithms", sectionId: "lru", label: "Алгоритмы → LRU-кэш" },
      { topicId: "algorithms", sectionId: "linked-tree-map", label: "Алгоритмы → LinkedHashMap" }
    ]
  },
  {
    id: "threads-volatile-counter",
    level: "Senior",
    area: "Потоки",
    topicId: "threads",
    sectionId: "memory-model",
    question: "`@Volatile var counter = 0` увеличивают через `counter++` из нескольких потоков. Какой ответ объясняет именно баг?",
    options: [
      "`@Volatile` даёт видимость отдельных чтений/записей, но не атомарность read-modify-write.",
      "Один actor/thread, владеющий счётчиком, убирает гонку за счёт confinement.",
      "`synchronized` вокруг инкремента тоже чинит счётчик, потому что даёт mutual exclusion.",
      "`LongAdder` полезен для счётчиков под высокой конкуренцией, когда подходит его модель чтения."
    ],
    answer: 0,
    gap: "Visibility vs atomicity в Java/Kotlin memory model.",
    explain: "Остальные варианты — рабочие техники в своих условиях. Но ошибка `volatile++` именно в том, что инкремент состоит из чтения, вычисления и записи, а другой поток может вклиниться между ними.",
    refs: [
      { topicId: "threads", sectionId: "memory-model", label: "Потоки и память JVM → Memory model" },
      { topicId: "threads", sectionId: "cas", label: "Потоки и память JVM → CAS" }
    ]
  },
  {
    id: "looper-update-ui",
    level: "Middle+",
    area: "Looper",
    topicId: "looper-handler",
    sectionId: "event-loop",
    question: "Фоновый поток получил результат и должен обновить `TextView`. Какой ход отвечает именно за переход на UI-поток?",
    options: [
      "`Handler(Looper.getMainLooper()).post { ... }` или `Dispatchers.Main`: работа попадёт в очередь главного Looper.",
      "`HandlerThread` создаёт отдельный поток с Looper для последовательной фоновой очереди.",
      "`postDelayed` ставит сообщение на будущее время, а `removeCallbacks` помогает снять устаревшую работу.",
      "`Choreographer` синхронизирует callback-и кадра с VSYNC."
    ],
    answer: 0,
    gap: "Main Looper: обновление UI проходит через очередь главного потока.",
    explain: "Все варианты про реальные механизмы Looper-мира, но TextView можно трогать только с главного потока. Поэтому нужен hop в Main queue, а не просто «ещё один Looper».",
    refs: [
      { topicId: "looper-handler", sectionId: "event-loop", label: "Looper и Handler → Event loop" },
      { topicId: "looper-handler", sectionId: "handler-thread", label: "Looper и Handler → HandlerThread" }
    ]
  },
  {
    id: "executors-unbounded-queue",
    level: "Senior",
    area: "Executor",
    topicId: "executors",
    sectionId: "growth-model",
    question: "`ThreadPoolExecutor(4, 20, ..., LinkedBlockingQueue())` под нагрузкой остаётся на 4 потоках. Что объясняет это поведение?",
    options: [
      "После заполнения core новые задачи принимает неограниченная очередь, поэтому до `maximumPoolSize` пул не дорастает.",
      "Ограниченная очередь или `SynchronousQueue` меняют баланс между ростом пула, очередью и backpressure.",
      "`CallerRunsPolicy` может притормозить producer-а, потому что часть задач выполнится в вызывающем потоке.",
      "`prestartAllCoreThreads()` заранее запускает core-потоки, чтобы первые задачи не платили за старт worker-а."
    ],
    answer: 0,
    gap: "ThreadPoolExecutor: порядок core → queue → maximum.",
    explain: "`maximumPoolSize` не означает «расти до 20 при любой нагрузке». Executor растёт сверх core, когда очередь не принимает задачу; unbounded queue почти всегда принимает.",
    refs: [
      { topicId: "executors", sectionId: "growth-model", label: "Executor и пулы → Модель роста" },
      { topicId: "executors", sectionId: "queues", label: "Executor и пулы → Очереди" }
    ]
  },
  {
    id: "coroutines-immediate-await",
    level: "Middle+",
    area: "Корутины",
    topicId: "coroutines",
    sectionId: "launch-async",
    question: "Код делает `val a = async { loadA() }.await(); val b = async { loadB() }.await()`. Почему это почти не параллелизм?",
    options: [
      "Первый `await()` сразу ждёт результат, поэтому вторая корутина создаётся только после первой.",
      "`coroutineScope` связывает дочерние корутины с родителем и ждёт их завершения.",
      "`supervisorScope` меняет распространение ошибок между дочерними задачами.",
      "`awaitAll()` удобен, когда уже есть несколько `Deferred` и нужно дождаться результатов."
    ],
    answer: 0,
    gap: "Параллелизм появляется между стартом `async` и `await`, а не от слова `async` само по себе.",
    explain: "Остальные варианты описывают полезные инструменты корутин, но причина здесь проще: нет окна, где две работы идут одновременно. Сначала стартуют оба `async`, потом делают `await`.",
    refs: [
      { topicId: "coroutines", sectionId: "launch-async", label: "Корутины и Flow → launch vs async" },
      { topicId: "coroutines", sectionId: "structured-concurrency", label: "Корутины и Flow → Structured concurrency" }
    ]
  },
  {
    id: "coroutines-cpu-cancellation",
    level: "Middle+",
    area: "Корутины",
    topicId: "coroutines",
    sectionId: "cancellation",
    question: "Тяжёлый CPU-цикл без suspend-вызовов досчитался до конца после отмены scope. Что забыли в теле цикла?",
    options: [
      "Кооперативную проверку отмены: `ensureActive()`, `isActive` или `yield()` в разумных точках.",
      "`NonCancellable` полезен для короткой suspend-очистки в `finally` после отмены.",
      "`withTimeout` отменяет блок через `TimeoutCancellationException`, когда истёк лимит времени.",
      "Отмена parent scope отменяет дочерние корутины, если они участвуют в structured concurrency."
    ],
    answer: 0,
    gap: "Отмена корутин кооперативная.",
    explain: "Структурная отмена выставит Job в cancelled, но CPU-код должен сам проверять этот факт. Без suspension point или ручной проверки цикл спокойно добежит до конца.",
    refs: [
      { topicId: "coroutines", sectionId: "cancellation", label: "Корутины и Flow → Кооперативная отмена" }
    ]
  },
  {
    id: "flow-events-stateflow",
    level: "Middle+",
    area: "Flow",
    topicId: "coroutines",
    sectionId: "flow",
    question: "ViewModel шлёт навигацию через `MutableStateFlow<NavEvent?>`; повторное событие иногда не видно. Какой перенос чинит модель, а не симптом?",
    options: [
      "Навигацию вынести в `SharedFlow(replay=0)` или `Channel`; `StateFlow` оставить для текущего UI-state.",
      "`StateFlow` отлично подходит для состояния экрана: у него всегда есть последнее значение.",
      "`distinctUntilChanged()` полезен для state-шумов, но для одинаковых событий он только подчеркнёт проблему.",
      "Сброс в `null` после события встречается в legacy-коде, но создаёт гонки с lifecycle и повторной доставкой."
    ],
    answer: 0,
    gap: "StateFlow — состояние, а не очередь событий.",
    explain: "Событие и состояние отвечают на разные вопросы. Состояние можно перечитать после поворота; событие нужно доставить один раз в правильный момент. Поэтому меняют носитель, а не подбирают сбросы.",
    refs: [
      { topicId: "coroutines", sectionId: "flow", label: "Корутины и Flow → Flow" },
      { topicId: "architecture", sectionId: "event-carriers", label: "Архитектура и DI → Носитель события" }
    ]
  },
  {
    id: "flow-statein-ui",
    level: "Senior",
    area: "Flow",
    topicId: "coroutines",
    sectionId: "state-share-in",
    question: "Репозиторий отдаёт холодный `Flow<List<Item>>`, а экрану нужен текущий UI-state во ViewModel. Какой ход ближе к канону?",
    options: [
      "`stateIn(viewModelScope, SharingStarted.WhileSubscribed(...), initial)`: появляется `StateFlow` с текущим значением.",
      "`shareIn(...)` удобен, когда нескольким подписчикам нужен общий горячий поток без обязательного current state.",
      "Ручной `collect` в `init` и запись в `MutableStateFlow` возможны, но это больше кода и больше мест для ошибки.",
      "Холодный `Flow` хорош на границе репозитория: он начинает работу только при сборе."
    ],
    answer: 0,
    gap: "`stateIn`/`shareIn`: состояние экрана нуждается в текущем значении.",
    explain: "Во ViewModel обычно нужен observable state: есть initial value, есть последнее значение для нового коллектора, есть политика старта. Это как раз `stateIn`; `shareIn` решает соседнюю, но другую задачу.",
    refs: [
      { topicId: "coroutines", sectionId: "state-share-in", label: "Корутины и Flow → stateIn / shareIn" },
      { topicId: "architecture", sectionId: "reactive", label: "Архитектура и DI → Reactive-слой" }
    ]
  },
  {
    id: "compose-mutable-model",
    level: "Senior",
    area: "Compose",
    topicId: "compose",
    sectionId: "recomposition",
    question: "Composable получил mutable-модель, внутри поменяли поле, а UI не обновился предсказуемо. Что нарушено?",
    options: [
      "Compose отслеживает чтения Snapshot-state; обычная мутация поля вне state не создаёт надёжную invalidation.",
      "`remember` кэширует значение между рекомпозициями, но не превращает произвольные поля объекта в observable state.",
      "`key(...)` помогает сохранить идентичность элементов в списках, но не делает модель наблюдаемой.",
      "`@Stable` — это обещание контракта компилятору; оно не должно маскировать скрытую мутабельность."
    ],
    answer: 0,
    gap: "Compose state и invalidation: наблюдается не всё подряд.",
    explain: "Для Compose важна наблюдаемая запись. Либо состояние живёт в `mutableStateOf`/snapshot-коллекциях, либо вы отдаёте новый immutable state через `copy`. Скрытая мутация ломает саму модель рекомпозиции.",
    refs: [
      { topicId: "compose", sectionId: "state", label: "Jetpack Compose → State" },
      { topicId: "compose", sectionId: "recomposition", label: "Jetpack Compose → Рекомпозиция" }
    ]
  },
  {
    id: "compose-launched-effect-key",
    level: "Middle+",
    area: "Compose",
    topicId: "compose",
    sectionId: "effects",
    question: "`LaunchedEffect(userId)` грузит профиль. Что именно произойдёт при изменении `userId`?",
    options: [
      "Старая coroutine эффекта отменится, и блок запустится заново с новым ключом.",
      "`rememberCoroutineScope` подходит для jobs, которые стартуют из callback-а пользователя.",
      "`DisposableEffect` нужен, когда вместе со стартом эффекта требуется симметричная очистка.",
      "`SideEffect` публикует данные во внешний объект после успешной композиции."
    ],
    answer: 0,
    gap: "Ключи effect API в Compose.",
    explain: "Effect API различаются не названием, а lifetime. `LaunchedEffect(key)` живёт до ухода из композиции или смены key; поэтому ключ должен выражать ровно зависимость эффекта.",
    refs: [
      { topicId: "compose", sectionId: "effects", label: "Jetpack Compose → Side-effects" },
      { topicId: "compose", sectionId: "composition-lifecycle", label: "Jetpack Compose → Lifecycle композиции" }
    ]
  },
  {
    id: "compose-derived-state-scroll",
    level: "Middle+",
    area: "Compose",
    topicId: "compose",
    sectionId: "state",
    question: "Кнопка «наверх» зависит от `listState.firstVisibleItemIndex > 0`; индекс меняется постоянно, флаг редко. Что выбрать?",
    options: [
      "`remember { derivedStateOf { listState.firstVisibleItemIndex > 0 } }`: пересчитываем производный флаг по snapshot-state.",
      "`remember { ... }` сам по себе кэширует объект, но не описывает зависимость от меняющегося scroll-state.",
      "`snapshotFlow { listState.firstVisibleItemIndex }` удобен для side-effect pipeline на Flow.",
      "Стабильные параметры помогают skipping, но не заменяют производное состояние с порогом."
    ],
    answer: 0,
    gap: "`derivedStateOf`: частые входы, редкие изменения результата.",
    explain: "При скролле индекс меняется много раз, а булевый ответ меняется только на границе `0 ↔ больше 0`. `derivedStateOf` подписывает UI на результат, а не на каждое промежуточное значение индекса.",
    refs: [
      { topicId: "compose", sectionId: "state", label: "Jetpack Compose → State" },
      { topicId: "compose", sectionId: "perf", label: "Jetpack Compose → Производительность" }
    ]
  },
  {
    id: "architecture-hilt-nav-arg",
    level: "Senior",
    area: "Архитектура",
    topicId: "architecture",
    sectionId: "navigation",
    question: "В `@HiltViewModel` нужен `userId` из navigation argument. Где ему место, если это маленький сериализуемый аргумент экрана?",
    options: [
      "`SavedStateHandle` в конструкторе ViewModel; читать по ключу или через typed route, если он используется в проекте.",
      "`hiltViewModel()` в composable получает ViewModel через Hilt-backed factory и текущий owner.",
      "Assisted injection полезен для runtime-объектов, которые не приходят из nav args и не сериализуются в Bundle.",
      "`@ActivityRetainedScoped` подходит зависимостям, которые должны переживать configuration change вместе с retained scope."
    ],
    answer: 0,
    gap: "Compose + Hilt + `SavedStateHandle`: кто создаёт ViewModel и откуда берутся nav-аргументы.",
    explain: "`hiltViewModel()` отвечает за получение VM, но сам аргумент внутри VM должен прийти через `SavedStateHandle`. Так значение переживает process death как часть saved state, а Hilt не требует биндинг обычной строки.",
    refs: [
      { topicId: "architecture", sectionId: "navigation", label: "Архитектура и DI → Navigation Compose" },
      { topicId: "architecture", sectionId: "state-survival", label: "Архитектура и DI → SavedStateHandle" },
      { topicId: "compose", sectionId: "viewmodel", label: "Jetpack Compose → ViewModel и UDF" }
    ]
  },
  {
    id: "storage-room-migration",
    level: "Middle+",
    area: "Данные",
    topicId: "storage",
    sectionId: "room",
    question: "В Room v2 добавляют `created_at INTEGER NOT NULL` к таблице с данными. Прод должен сохранить строки. Что делать?",
    options: [
      "Написать `Migration(1, 2)` с `ALTER TABLE ... ADD COLUMN ... NOT NULL DEFAULT ...`, добавить индекс и проверить через `MigrationTestHelper`.",
      "Destructive migration допустима, когда потеря локальных данных разрешена продуктом или это debug-сценарий.",
      "AutoMigration удобна для поддержанных простых изменений схемы; сложный backfill может потребовать spec или manual migration.",
      "DataStore лучше подходит для простых настроек, а не для реляционной истории с запросами."
    ],
    answer: 0,
    gap: "Room migration без потери данных.",
    explain: "Ключевое ограничение — production-данные нужно сохранить. Поэтому destructive path не подходит, а not-null колонка требует дефолт или backfill, иначе старые строки не смогут удовлетворить схему.",
    refs: [
      { topicId: "storage", sectionId: "room", label: "Хранение данных → Room" },
      { topicId: "storage", sectionId: "tasks", label: "Хранение данных → Задачи по миграциям" }
    ]
  },
  {
    id: "network-okhttp-interceptor",
    level: "Middle+",
    area: "Сеть",
    topicId: "network",
    sectionId: "okhttp",
    question: "Нужно добавить `Authorization` один раз на логический запрос OkHttp, до возможных redirects/retries. Куда ближе всего эта логика?",
    options: [
      "Application interceptor: он видит логический call до сетевых follow-up попыток.",
      "Network interceptor: он видит каждый реальный network exchange после установления соединения.",
      "`Authenticator`: он строит follow-up request, когда сервер ответил `401` и нужен refresh credentials.",
      "`EventListener`: он полезен для таймингов DNS/connect/request/response и диагностики сети."
    ],
    answer: 0,
    gap: "OkHttp interceptors: logical call vs network attempt.",
    explain: "Network interceptor полезен, когда важна физическая сеть и каждый redirect/retry. Для политики на уровне запроса приложения — заголовки, общая авторизация, логический tracing — обычно берут application interceptor.",
    refs: [
      { topicId: "network", sectionId: "okhttp", label: "Сеть → OkHttp" },
      { topicId: "network", sectionId: "errors", label: "Сеть → Ошибки и retry" }
    ]
  },
  {
    id: "security-hardcoded-key",
    level: "Middle+",
    area: "Безопасность",
    topicId: "security",
    sectionId: "keystore",
    question: "В APK лежит строковый AES-ключ, им шифруют токен в файле. Какой риск главный?",
    options: [
      "Секрет клиента извлекается из APK или памяти; ключ должен быть неэкспортируемым через Keystore либо проверка уходит на сервер.",
      "TLS защищает токен в пути между клиентом и сервером.",
      "R8/обфускация повышает стоимость reverse engineering, но не превращает строку в надёжное хранилище секрета.",
      "Шифрование at rest защищает файл от простого чтения, но не от кода, который уже выполняется в процессе приложения."
    ],
    answer: 0,
    gap: "Модель угроз клиента: hardcoded secret не секрет.",
    explain: "Клиентское приложение находится на устройстве пользователя, а значит атакующий может анализировать APK и runtime. Keystore снижает извлекаемость ключа, но даже он не делает клиент полностью доверенной средой.",
    refs: [
      { topicId: "security", sectionId: "keystore", label: "Безопасность → Keystore" },
      { topicId: "security", sectionId: "reverse", label: "Безопасность → Reverse engineering" }
    ]
  },
  {
    id: "profiling-leak-rotation",
    level: "Middle+",
    area: "Профилирование",
    topicId: "profiling",
    sectionId: "memory",
    question: "После каждого поворота число старых `Activity` в памяти растёт. Какой следующий шаг лучше доказывает утечку?",
    options: [
      "Снять heap dump после forced GC или дождаться LeakCanary: смотреть retained object и цепочку сильных ссылок от GC root.",
      "Memory Profiler полезен для ручного графика аллокаций и общего роста heap.",
      "StrictMode хорошо ловит main-thread I/O и некоторые leaked closable-ресурсы в debug.",
      "OOM/Crash reports показывают симптом на парке устройств, но редко сразу дают конкретную цепочку удержания Activity."
    ],
    answer: 0,
    gap: "Memory leak: нужен retained path, а не просто рост счётчика.",
    explain: "Старая Activity может коротко жить до ближайшего GC. Утечкой она становится, когда после GC её держит сильная цепочка ссылок. Именно эту цепочку и надо увидеть в heap dump/LeakCanary.",
    refs: [
      { topicId: "profiling", sectionId: "memory", label: "Профилирование → Память и утечки" },
      { topicId: "profiling", sectionId: "tools", label: "Профилирование → Инструменты" }
    ]
  },
  {
    id: "rendering-bind-jank",
    level: "Middle+",
    area: "Рендеринг",
    topicId: "rendering",
    sectionId: "jank",
    question: "Список дёргается: в `onBind` синхронно декодируют bitmap и форматируют строки. Что чинить первым?",
    options: [
      "Убрать тяжёлую работу с пути кадра: декодировать/форматировать заранее, кэшировать и мерить FrameTiming.",
      "Baseline Profile помогает старту и JIT/AOT-пути, но не заменяет исправление тяжёлого bind.",
      "Overdraw оптимизируют, когда trace показывает GPU/fill-rate bottleneck.",
      "DiffUtil снижает лишние rebind-ы, но не делает дорогой `onBind` дешёвым."
    ],
    answer: 0,
    gap: "Jank: работа на main thread не укладывается в бюджет кадра.",
    explain: "В условии уже указана горячая точка: каждый bind попадает в скролл и съедает кадр. Сначала убираем CPU/I/O/аллокации из bind, потом проверяем цифрами.",
    refs: [
      { topicId: "rendering", sectionId: "jank", label: "Рендеринг и кадры → Jank" },
      { topicId: "rendering", sectionId: "lists", label: "Рендеринг и кадры → Списки" },
      { topicId: "profiling", sectionId: "ui-jank", label: "Профилирование → UI и jank" }
    ]
  },
  {
    id: "testing-run-test-main",
    level: "Middle+",
    area: "Тесты",
    topicId: "testing",
    sectionId: "coroutines",
    question: "JVM-тест ViewModel падает: `Dispatchers.Main` не инициализирован, а `delay(1000)` ждёт реально. Какой набор закрывает обе проблемы?",
    options: [
      "`runTest`, `TestDispatcher`, JUnit rule с `Dispatchers.setMain(...)` и управление виртуальным временем.",
      "Turbine удобен для проверки последовательности элементов Flow.",
      "Fake-репозиторий часто делает тест поведения ViewModel проще и устойчивее, чем глубокий mock.",
      "Instrumented-тест нужен, когда проверяется настоящий Android framework, device state или UI toolkit."
    ],
    answer: 0,
    gap: "Виртуальное время и подмена Main dispatcher в JVM-тестах.",
    explain: "Turbine и fake решают соседние задачи, но не создают Android Main в JVM и не ускоряют `delay` сами по себе. Нужен тестовый scheduler плюс явная подмена Main.",
    refs: [
      { topicId: "testing", sectionId: "coroutines", label: "Тестирование → Корутины" },
      { topicId: "coroutines", sectionId: "testing", label: "Корутины и Flow → Тестирование" }
    ]
  },
  {
    id: "gradle-r8-reflection",
    level: "Middle+",
    area: "Сборка",
    topicId: "gradle-build",
    sectionId: "r8",
    question: "В debug JSON через Gson работает, в release после R8 поля пустые. Какой фикс бьёт в причину?",
    options: [
      "Точечные keep-правила для reflective members или явные `@SerializedName`, чтобы R8 не сломал имена, по которым читает Gson.",
      "`mapping.txt` нужен, чтобы деобфусцировать stacktrace конкретного release-билда.",
      "Временное отключение minify помогает подтвердить, что проблема связана с R8.",
      "KSP/kapt влияют на annotation processing на сборке, но не являются keep-правилом для runtime reflection."
    ],
    answer: 0,
    gap: "R8 и reflection: release ломается не как debug.",
    explain: "R8 может переименовать или удалить то, к чему библиотека обращается по строковому имени. Для Gson это поля модели; чинят контракт сериализации, а не весь R8 целиком.",
    refs: [
      { topicId: "gradle-build", sectionId: "r8", label: "Gradle и сборка → R8" },
      { topicId: "profiling", sectionId: "apk-size", label: "Профилирование → APK size и R8" }
    ]
  },
  {
    id: "system-design-offline",
    level: "Senior",
    area: "System design",
    topicId: "system-design",
    sectionId: "offline",
    question: "Offline-first лента: сеть упала во время refresh, но кэш есть. Какой инвариант архитектуры важнее всего?",
    options: [
      "UI читает локальную БД как source of truth; refresh обновляет БД, а ошибка/freshness показываются отдельным состоянием.",
      "HTTP cache headers уменьшают трафик и помогают не качать неизменившиеся ответы.",
      "Outbox нужен для пользовательских write-операций, которые надо отправить позже.",
      "Paging keys и remote mediator помогают связать локальные страницы с сетевой пагинацией."
    ],
    answer: 0,
    gap: "Offline-first: source of truth, синхронизация и конфликты.",
    explain: "Остальные пункты часто входят в хороший дизайн, но главный инвариант — экран не зависит от успешности текущего network call. Он наблюдает локальную модель, а синхронизация меняет её и отдельно сообщает о свежести/ошибке.",
    refs: [
      { topicId: "system-design", sectionId: "offline", label: "Системный дизайн → Offline-first" },
      { topicId: "system-design", sectionId: "caching", label: "Системный дизайн → Кэширование" }
    ]
  },
  {
    id: "behavioral-star",
    level: "Middle+",
    area: "Поведенческое",
    topicId: "behavioral",
    sectionId: "star",
    question: "Интервьюер просит за 90 секунд рассказать про конфликт с коллегой. Какой каркас лучше держит ответ?",
    options: [
      "Коротко: ситуация, моя задача, мои действия, результат и вывод для процесса.",
      "Начать с контекста компании полезно, когда вопрос про мотивацию или выбор работодателя.",
      "Разбор root cause конфликта полезен на ретро, если есть время разобрать систему целиком.",
      "Формулировка через «мы» помогает не обвинять команду, но вклад кандидата всё равно нужно назвать."
    ],
    answer: 0,
    gap: "STAR-структура и конкретика в behavioral-ответах.",
    explain: "STAR держит рассказ коротким и проверяемым. В конфликтном вопросе особенно важны личное действие и результат: интервьюер ищет договороспособность, а не длинный пересказ чужих ошибок.",
    refs: [
      { topicId: "behavioral", sectionId: "star", label: "Поведенческое интервью → STAR" },
      { topicId: "behavioral", sectionId: "bank", label: "Поведенческое интервью → Банк историй" }
    ]
  }
];

/*
 * REVIEW_CATALOG — единый реестр учебных карточек повторения по всем главам.
 * Каждая запись соответствует одной .study-card[data-review-id] на странице главы.
 * Это источник правды для домашней поверхности «Сегодня»: главная не грузит все
 * страницы глав, а берёт список карточек отсюда. Тело карточки (вопрос + разбор)
 * живёт в HTML главы; здесь — только метаданные и текст лицевой стороны (front).
 *   id        — совпадает с data-review-id карточки на странице.
 *   topicId   — id главы (TOPICS[].id), sectionId — id параграфа (section.id).
 *   kind      — тип карточки: mechanism | api-choice | edge-case | bug | oral.
 *   front     — вопрос карточки (markdown-инлайн: `код`).
 * Карточки из проваленных вопросов теста добавляются в очередь динамически
 * (allTestMisses), их в каталоге нет.
 */
const REVIEW_KIND = {
  "mechanism": "Механизм",
  "api-choice": "Выбор API",
  "edge-case": "Крайний случай",
  "bug": "Типичный баг",
  "oral": "Устный вопрос"
};
const REVIEW_CATALOG = [
  { id:"coroutines-suspend-continuation", topicId:"coroutines", sectionId:"suspend", kind:"mechanism",
    front:"Если `delay(1000)` не блокирует поток, где корутина хранит место, с которого потом продолжит выполнение?" },
  { id:"coroutines-async-immediate-await", topicId:"coroutines", sectionId:"launch-async", kind:"bug",
    front:"Почему `async { repo.load() }.await()` сразу в следующей строке обычно хуже прямого `repo.load()`?" },
  { id:"coroutines-stateflow-events", topicId:"coroutines", sectionId:"flow", kind:"api-choice",
    front:"Почему `StateFlow` плохо подходит для навигации и snackbar-событий?" },
  { id:"coroutines-statein-while-subscribed", topicId:"coroutines", sectionId:"state-share-in", kind:"api-choice",
    front:"Почему для UI-state часто выбирают `SharingStarted.WhileSubscribed(5_000)`, а не `Eagerly`?" },
  { id:"terminology-coupling-not-zero", topicId:"terminology", sectionId:"design", kind:"oral",
    front:"«Цель — слабая связанность» часто понимают как «связанность к нулю». Почему это неверно, и к какому концу шкалы `data → stamp → control → common → content` на самом деле стремятся?" },
  { id:"terminology-demeter-builder", topicId:"terminology", sectionId:"contract-lsp-coupling", kind:"edge-case",
    front:"Цепочка `a.getB().getC().doThing()` нарушает закон Деметры, а `builder.setX().setY().build()` — нет, хотя обе выглядят как «train wreck». В чём разница?" },
  { id:"terminology-cas-aba", topicId:"terminology", sectionId:"concurrency", kind:"mechanism",
    front:"CAS успешно отрабатывает, потому что текущее значение ячейки совпало с ожидаемым A. Почему это ещё не значит, что ячейку никто не трогал, и как называется этот дефект?" },
  { id:"terminology-ssot-stateflow", topicId:"terminology", sectionId:"perf", kind:"bug",
    front:"В офлайн-first приложении источником истины сделали `StateFlow` в ViewModel, а данные хранятся в Room. Что сломается, когда прилетит пуш или фоновый воркер запишет в БД?" },
  { id:"terminology-spki-pinning", topicId:"terminology", sectionId:"netsec", kind:"api-choice",
    front:"Нужно настроить pinning. Почему обычно пинят хэш публичного ключа (SPKI), а не сам сертификат, и какой главный операционный риск заставляет Android отговаривать от pinning вообще?" },
  { id:"terminology-idempotency-key-race", topicId:"terminology", sectionId:"idempotency", kind:"bug",
    front:"Сервер защищает `POST` от задвоения через `Idempotency-Key`: «нет ключа — выполнить и сохранить». Почему два параллельных ретрая с одним ключом всё равно могут списать дважды, и как это починить?" },
  { id:"oop-solid-final-default", topicId:"oop-solid", sectionId:"pillars", kind:"mechanism",
    front:"Класс в Kotlin по умолчанию `final`. Какую проблему это закрывает и какой баг возникает, если открыть базовый класс, не спроектированный под наследование?" },
  { id:"oop-solid-delegate-self-call", topicId:"oop-solid", sectionId:"composition", kind:"bug",
    front:"Класс-обёртка делает `class A(b: B) : I by b` и переопределяет `m()`. Другой метод делегата внутри зовёт `m()`. Чью реализацию `m()` он вызовет и почему?" },
  { id:"oop-solid-lsp-precondition", topicId:"oop-solid", sectionId:"solid", kind:"edge-case",
    front:"Базовый `normalize(input: String)` принимал любую строку. Наследник в `override` добавил `require(input.isNotEmpty())`. Почему это уже нарушение LSP, хотя сигнатура совпадает?" },
  { id:"oop-solid-object-vs-const", topicId:"oop-solid", sectionId:"patterns", kind:"api-choice",
    front:"Чем Kotlin `object` как Singleton отличается от `const val` / `public static val` и от `@Singleton` в Hilt?" },
  { id:"oop-solid-strategy-vs-state", topicId:"oop-solid", sectionId:"strategy-state-decorator", kind:"oral",
    front:"Strategy и State дают одинаковую диаграмму классов. По какому признаку их различают на практике и где в Android каждый из них живёт?" },
  { id:"oop-solid-when-abstract", topicId:"oop-solid", sectionId:"solid-cost", kind:"oral",
    front:"По какому критерию вводить интерфейс, а не плодить абстракции «ради DIP», когда требований ещё нет?" },
  { id:"kotlin-platform-npe", topicId:"kotlin", sectionId:"null-safety", kind:"bug",
    front:"Java-метод без аннотаций вернул `null`, а вы присвоили результат в `val name: String`. Код компилируется — где и почему прилетит NPE?" },
  { id:"kotlin-data-var-hashset", topicId:"kotlin", sectionId:"classes", kind:"edge-case",
    front:"Вы положили `data class` с полем `var` в первичном конструкторе в `HashSet`, потом изменили это поле. Почему элемент «теряется»?" },
  { id:"kotlin-nothing-smartcast", topicId:"kotlin", sectionId:"type-system", kind:"mechanism",
    front:"Почему после `val addr = company.address ?: fail(\"нет адреса\")` тип `addr` — это `String`, а не `String?`, хотя `fail` ничего не возвращает?" },
  { id:"kotlin-extension-static-dispatch", topicId:"kotlin", sectionId:"extensions-inline", kind:"oral",
    front:"Объявлены `fun A.who()` и `fun B.who()` при `B : A`. Для `val ref: A = B()` вызов `ref.who()` вернёт «A» или «B» и почему?" },
  { id:"kotlin-scope-choose", topicId:"kotlin", sectionId:"scope-fns", kind:"api-choice",
    front:"Нужно вычислить число из объекта. Почему `val n = sb.apply { length }` вернёт не длину, а сам `StringBuilder` — и какую функцию взять вместо `apply`?" },
  { id:"kotlin-list-mutation-leak", topicId:"kotlin", sectionId:"interop", kind:"bug",
    front:"Вы отдали Kotlin `List<String>` (от `listOf`) в Java-метод, который вызывает `list.add(...)`. Почему это компилируется, но падает в рантайме?" },
  { id:"components-service-thread", topicId:"components", sectionId:"service", kind:"bug",
    front:"Коллега говорит: «вынес тяжёлую загрузку в `Service`, теперь она не на main-потоке». В чём он ошибается и где на самом деле начнётся фон?" },
  { id:"components-wm-reboot", topicId:"components", sectionId:"workmanager", kind:"mechanism",
    front:"За счёт чего работа из `WorkManager` переживает перезапуск приложения и перезагрузку устройства?" },
  { id:"components-onreceive-coroutine", topicId:"components", sectionId:"receiver", kind:"edge-case",
    front:"В `onReceive()` запустили обычную корутину и сразу вышли из метода. Почему работа может не доделаться и что меняет `goAsync()`?" },
  { id:"components-provider-init", topicId:"components", sectionId:"provider", kind:"mechanism",
    front:"Библиотека (WorkManager, Firebase) поднимается сама, без вашего кода в `Application`. Через какой механизм и чем это бьёт по холодному старту?" },
  { id:"components-binder-mainthread", topicId:"components", sectionId:"ipc-binder", kind:"oral",
    front:"Зачем клиенту `linkToDeath` и почему синхронный AIDL-вызов с главного потока опасен, если сервер повиснет?" },
  { id:"components-aidl-vs-messenger", topicId:"components", sectionId:"ipc-aidl", kind:"api-choice",
    front:"Нужен IPC к своему сервису. Когда брать AIDL, а когда хватает `Messenger`, и чем это отличается по параллелизму?" },
  { id:"activity-pause-not-invisible", topicId:"activity", sectionId:"lifecycle", kind:"mechanism",
    front:"Экран ещё виден, но уже не в фокусе — какой это lifecycle-state, и почему отсюда нельзя делать вывод, что Activity уходит с экрана?" },
  { id:"activity-flags-not-finalization", topicId:"activity", sectionId:"finishing", kind:"edge-case",
    front:"Можно ли полагаться на `onDestroy()` с проверкой `isFinishing`, чтобы гарантированно зачистить состояние при уходе пользователя?" },
  { id:"activity-viewmodel-vs-process-death", topicId:"activity", sectionId:"saved-state", kind:"oral",
    front:"Поворот и process death оба ведут к новому `onCreate()`. Почему `ViewModel` переживает первое, но не второе?" },
  { id:"activity-result-stable-registration", topicId:"activity", sectionId:"activity-result", kind:"api-choice",
    front:"Почему `registerForActivityResult` нельзя ставить под `if` или менять порядок регистрации между запусками Activity?" },
  { id:"activity-singletop-stale-intent", topicId:"activity", sectionId:"task-back-stack", kind:"bug",
    front:"Экран с `singleTop` открыт, из push приходит новый Intent, но код читает данные только в `onCreate()`. Что увидит пользователь и в чём баг?" },
  { id:"activity-exported-untrusted-input", topicId:"activity", sectionId:"intents", kind:"oral",
    front:"Почему Activity с intent-filter и `exported=true` нужно считать публичным API и валидировать входящие extras и URI?" },
  { id:"fragment-not-mini-activity", topicId:"fragment", sectionId:"why-fragments", kind:"oral",
    front:"Почему Fragment некорректно считать «Activity без manifest», и какое практическое следствие это даёт для кода, трогающего View?" },
  { id:"fragment-this-vs-viewlifecycleowner", topicId:"fragment", sectionId:"fragment-lifecycle", kind:"bug",
    front:"Что произойдёт, если подписаться на `viewModel.state` через `this` вместо `viewLifecycleOwner`, а фрагмент потом уйдёт в back stack и вернётся?" },
  { id:"fragment-parent-vs-child-manager", topicId:"fragment", sectionId:"fragment-manager", kind:"api-choice",
    front:"Когда брать `childFragmentManager`, а когда `parentFragmentManager`, и чем грозит вложенный flow в общем manager Activity?" },
  { id:"fragment-allowing-state-loss", topicId:"fragment", sectionId:"back-stack-state-loss", kind:"edge-case",
    front:"Делает ли `commitAllowingStateLoss()` транзакцию «безопасной», и когда его вообще уместно применять?" },
  { id:"fragment-result-api-vs-viewmodel", topicId:"fragment", sectionId:"communication", kind:"api-choice",
    front:"Почему Fragment Result API не годится, когда важно каждое событие, и что взять вместо него?" },
  { id:"fragment-findfragmentbytag-direct-call", topicId:"fragment", sectionId:"failure-modes", kind:"mechanism",
    front:"Чем плох приём «найду получателя через `findFragmentByTag()` и напрямую дёрну его метод», даже если в демо это работает?" },
  { id:"background-work-bg-service-dead", topicId:"background-work", sectionId:"limits", kind:"bug",
    front:"Почему старый рецепт «фоновый `Service` + `WakeLock` + `Thread` с циклом синхронизации» на современном Android не работает?" },
  { id:"background-work-retry-vs-failure", topicId:"background-work", sectionId:"workmanager", kind:"edge-case",
    front:"Что произойдёт, если в `doWork()` вернуть `Result.retry()` на неустранимой ошибке (битые данные), и наоборот — `Result.failure()` на сетевом таймауте?" },
  { id:"background-work-fgs-start-from-bg", topicId:"background-work", sectionId:"foreground-service", kind:"mechanism",
    front:"Приложение в фоне по таймеру пытается поднять foreground service и ловит `ForegroundServiceStartNotAllowedException`. Почему так и как корректно разбудить сервис?" },
  { id:"background-work-exact-alarm-throttle", topicId:"background-work", sectionId:"alarmmanager", kind:"edge-case",
    front:"`setExactAndAllowWhileIdle()` пробивает Doze. Можно ли через него делать частые точные напоминания, например десять алармов на ближайшую минуту?" },
  { id:"background-work-push-as-signal", topicId:"background-work", sectionId:"fcm", kind:"mechanism",
    front:"FCM — best-effort: пуш может прийти дважды, с задержкой или быть схлопнут. Как проектировать обработчик, чтобы не терять и не дублировать события?" },
  { id:"background-work-tool-choice-axes", topicId:"background-work", sectionId:"choose", kind:"oral",
    front:"По каким двум осям выбирают между WorkManager, foreground service, AlarmManager и FCM, и куда по ним ложится каждый инструмент?" },
  { id:"algorithms-amortized-growth", topicId:"algorithms", sectionId:"bigo", kind:"mechanism",
    front:"Почему амортизированный `O(1)` у `ArrayList.add` держится при росте ёмкости в разы (×1.5, ×2), но ломается до `O(n)`, если растить на фиксированную добавку (+10)?" },
  { id:"algorithms-mutable-key", topicId:"algorithms", sectionId:"hashmap", kind:"bug",
    front:"Что произойдёт, если положить в `HashMap` мутабельный ключ, а потом изменить поле, входящее в его `hashCode`?" },
  { id:"algorithms-map-choice", topicId:"algorithms", sectionId:"linked-tree-map", kind:"api-choice",
    front:"Нужны диапазонные запросы «ближайший ключ ≥ x» и упорядоченный обход. Какую из `HashMap` / `LinkedHashMap` / `TreeMap` взять и какой ценой?" },
  { id:"algorithms-chm-check-then-act", topicId:"algorithms", sectionId:"concurrent", kind:"bug",
    front:"Почему `if (!map.containsKey(k)) map.put(k, v)` на `ConcurrentHashMap` — это всё равно гонка, хотя сама мапа потокобезопасна?" },
  { id:"algorithms-readonly-not-immutable", topicId:"algorithms", sectionId:"kotlin-collections", kind:"edge-case",
    front:"Гарантирует ли тип `List<Int>` в Kotlin, что лежащую за ним коллекцию никто не изменит?" },
  { id:"algorithms-lru-get-write-lock", topicId:"algorithms", sectionId:"lru", kind:"oral",
    front:"В LRU на `LinkedHashMap(accessOrder = true)` почему `get` нельзя защищать read-локом — ведь это «просто чтение»?" },
  { id:"threads-start-vs-run", topicId:"threads", sectionId:"thread-runnable", kind:"bug",
    front:"Чем отличается вызов `run()` от `start()` у `Thread` и что будет при повторном `start()` на том же объекте?" },
  { id:"threads-volatile-increment", topicId:"threads", sectionId:"race", kind:"bug",
    front:"Два потока инкрементируют `@Volatile var count` через `count++`. Почему итог почти всегда меньше ожидаемого, хотя поле volatile?" },
  { id:"threads-happens-before-scope", topicId:"threads", sectionId:"memory-model", kind:"oral",
    front:"Объясните, почему запись в одну `volatile`-переменную делает видимыми и обычные, не-volatile поля, записанные до неё." },
  { id:"threads-coffman-conditions", topicId:"threads", sectionId:"deadlock", kind:"edge-case",
    front:"Deadlock требует всех четырёх условий Коффмана. Сколько из них нужно сломать, чтобы взаимоблокировка стала невозможной, и какой приём ломает circular wait?" },
  { id:"threads-atomiclong-vs-longadder", topicId:"threads", sectionId:"cas", kind:"api-choice",
    front:"Счётчик инкрементируется из многих потоков очень часто, а читается редко. Что выбрать — `AtomicLong` или `LongAdder` — и почему?" },
  { id:"threads-cooperative-cancel", topicId:"threads", sectionId:"lifecycle", kind:"mechanism",
    front:"Что на самом деле делает `interrupt()` и почему нельзя «проглотить» пойманный `InterruptedException`?" },
  { id:"looper-handler-anr-while-looping", topicId:"looper-handler", sectionId:"event-loop", kind:"mechanism",
    front:"Если `Looper.loop()` — бесконечный цикл, который никогда не возвращается, почему сам факт его работы не считается «поток вечно занят» и не вызывает ANR?" },
  { id:"looper-handler-order-delayed", topicId:"looper-handler", sectionId:"message-queue", kind:"edge-case",
    front:"Вызвали `postDelayed(r, 100)`, а сразу за ним `post(r2)`. В каком порядке выполнятся `r` и `r2` и почему?" },
  { id:"looper-handler-dispatch-order", topicId:"looper-handler", sectionId:"dispatch", kind:"oral",
    front:"У `Handler` переопределён `handleMessage()`, задан `Callback` из конструктора, и сообщение отправили через `post()`. Какая из трёх веток сработает?" },
  { id:"looper-handler-nonstatic-weakref", topicId:"looper-handler", sectionId:"handler-leak", kind:"bug",
    front:"Разработчик оставил `Handler` нестатическим внутренним классом, но завернул ссылку на Activity в `WeakReference`. Спасёт ли это от утечки?" },
  { id:"looper-handler-postdelayed-sleep", topicId:"looper-handler", sectionId:"time-base", kind:"api-choice",
    front:"Нужно надёжное напоминание ровно через 10 минут настенного времени, даже если устройство уснёт. Подойдёт ли `postDelayed` и почему?" },
  { id:"executors-submit-vs-execute", topicId:"executors", sectionId:"executor-basics", kind:"bug",
    front:"Задача, отправленная через `submit()`, упала с исключением, но `Future.get()` по ней никто не вызвал. Где окажется это исключение и почему это опасно?" },
  { id:"executors-unbounded-queue-max", topicId:"executors", sectionId:"growth-model", kind:"mechanism",
    front:"Пулу задали `corePoolSize=4`, `maximumPoolSize=50` и неограниченную очередь. Под лавиной задач сколько потоков он реально поднимет и почему?" },
  { id:"executors-callerruns-ui", topicId:"executors", sectionId:"rejection", kind:"edge-case",
    front:"Какой скрытый побочный эффект у `CallerRunsPolicy` и почему её опасно вешать на пул, в который задачи шлёт главный поток?" },
  { id:"executors-await-without-shutdown", topicId:"executors", sectionId:"shutdown", kind:"api-choice",
    front:"Вы зовёте `awaitTermination(60, SECONDS)` без предварительного `shutdown()`. Что вернётся и почему?" },
  { id:"executors-starvation-deadlock", topicId:"executors", sectionId:"starvation-deadlock", kind:"oral",
    front:"Объясните thread starvation deadlock и почему он особенно коварен на пуле размером больше единицы." },
  { id:"executors-happens-before-shared", topicId:"executors", sectionId:"memory-visibility", kind:"edge-case",
    front:"Результат вы забираете через `Future.get()`, но задача параллельно с другими задачами дописывает в общий `ArrayList`. Достаточно ли `get()` для корректности?" },
  { id:"compose-derivedstateof-vs-remember", topicId:"compose", sectionId:"state", kind:"mechanism",
    front:"Кнопку «scroll-to-top» показывают по условию `firstVisibleItemIndex > 0`. Почему чтение этого условия напрямую тормозит скролл, и что меняет обёртка в `derivedStateOf`?" },
  { id:"compose-key-reorder", topicId:"compose", sectionId:"slot-table", kind:"mechanism",
    front:"В `LazyColumn` без `key` при вставке элемента в начало списка «съезжают» состояние и анимации строк. Какой механизм это вызывает и как `key` его чинит?" },
  { id:"compose-unstable-list-skipping", topicId:"compose", sectionId:"recomposition", kind:"bug",
    front:"Composable принимает параметр `List<Post>` и рекомпозируется «за компанию» при любом изменении родителя. В чём причина и какие есть способы починки?" },
  { id:"compose-launchedeffect-vs-scope", topicId:"compose", sectionId:"effects", kind:"api-choice",
    front:"Нужно запустить корутину из `onClick`. Почему здесь не подойдёт `LaunchedEffect` и что берут вместо него?" },
  { id:"compose-deferred-read-phases", topicId:"compose", sectionId:"layout", kind:"edge-case",
    front:"Анимируем смещение: `Modifier.padding(start = offsetX)` вызывает рекомпозицию на каждый кадр, а `Modifier.offset { IntOffset(offsetX.roundToPx(), 0) }` — нет. За счёт чего?" },
  { id:"compose-static-vs-dynamic-local", topicId:"compose", sectionId:"composition-local", kind:"oral",
    front:"Объясните разницу между `compositionLocalOf` и `staticCompositionLocalOf` по механике инвалидации и когда брать каждый." },
  { id:"rendering-dropped-frame", topicId:"rendering", sectionId:"pipeline", kind:"mechanism",
    front:"Кадр не успел подготовиться к следующему VSYNC, опоздав на 1 мс. Покажет ли Choreographer его «с небольшим опозданием»?" },
  { id:"rendering-renderthread-idle", topicId:"rendering", sectionId:"renderthread", kind:"bug",
    front:"Вы синхронно распарсили большой JSON в обработчике клика, и кадр уронен. Виноват ли в этом RenderThread или GPU?" },
  { id:"rendering-jankstats-vs-macro", topicId:"rendering", sectionId:"jank", kind:"api-choice",
    front:"Нужно понять, рвётся ли список в проде у реальных пользователей, и отдельно — стабильно воспроизвести просадку для поиска причины. Какие инструменты под какую задачу?" },
  { id:"rendering-lazycolumn-key", topicId:"rendering", sectionId:"lists", kind:"edge-case",
    front:"В `LazyColumn` вы поставили `key = { it }` по позиции элемента (его индексу). Что не так и что произойдёт при вставке элемента в начало списка?" },
  { id:"rendering-baseline-aot", topicId:"rendering", sectionId:"baseline", kind:"oral",
    front:"Откуда вообще берётся jank на первом запуске после установки, если код вашего приложения не менялся, и за счёт чего baseline profile его убирает?" },
  { id:"architecture-mvi-reducer", topicId:"architecture", sectionId:"presentation", kind:"mechanism",
    front:"Почему в MVI `reducer` делают чистой функцией `(State, Action) -> State`, а навигацию и тост не кладут в тот же `State`?" },
  { id:"architecture-effect-carrier", topicId:"architecture", sectionId:"event-carriers", kind:"api-choice",
    front:"Нужно доставить событие «токен протух, разлогиньтесь» сразу нескольким активным экранам. Что взять — `Channel.receiveAsFlow()` или `SharedFlow` — и почему?" },
  { id:"architecture-repo-interface-location", topicId:"architecture", sectionId:"clean", kind:"oral",
    front:"Интерфейс репозитория объявлен в `data`, рядом с `RepositoryImpl`. Что это ломает в Clean Architecture и почему правильнее держать интерфейс в `domain`?" },
  { id:"architecture-binds-vs-provides", topicId:"architecture", sectionId:"di-hilt", kind:"api-choice",
    front:"Когда в Hilt-модуле берут `@Binds`, а когда `@Provides`, и почему модуль с `@Binds` должен быть `abstract`, а не `object`?" },
  { id:"architecture-whilesubscribed", topicId:"architecture", sectionId:"reactive", kind:"mechanism",
    front:"Почему состояние из ViewModel шарят через `stateIn(scope, SharingStarted.WhileSubscribed(5000), initial)`, а не через `Eagerly`/`Lazily`?" },
  { id:"architecture-process-death", topicId:"architecture", sectionId:"state-survival", kind:"edge-case",
    front:"Состояние лежит только в `MutableStateFlow` внутри ViewModel. Что с ним станет при повороте экрана, а что — при system-initiated process death, и в чём ловушка?" },
  { id:"storage-apply-anr", topicId:"storage", sectionId:"sharedprefs", kind:"bug",
    front:"Почему утверждение «`apply()` не блокирует UI-поток» — только полуправда?" },
  { id:"storage-key-invalidated", topicId:"storage", sectionId:"encrypted", kind:"edge-case",
    front:"Ключ Keystore создан с `setUserAuthenticationRequired(true)`. Что с ним случится, если пользователь добавит новый отпечаток, и как это правильно обработать?" },
  { id:"storage-flow-invalidation", topicId:"storage", sectionId:"room", kind:"mechanism",
    front:"Как Flow-запрос Room узнаёт, что таблицу изменили, и почему он может переэмитить «лишний раз»?" },
  { id:"storage-replace-cascade", topicId:"storage", sectionId:"room-relations", kind:"bug",
    front:"Чем опасен `@Insert(onConflict = REPLACE)` при внешних ключах и почему `@Upsert` часто корректнее?" },
  { id:"storage-wal-concurrency", topicId:"storage", sectionId:"room-concurrency", kind:"oral",
    front:"Объясните, как режим WAL влияет на конкурентность чтения и записи в Room, и что он при этом НЕ меняет." },
  { id:"storage-choose-token", topicId:"storage", sectionId:"choose", kind:"api-choice",
    front:"Где хранить auth-токен и почему обычный `SharedPreferences` здесь не подходит даже как временное решение?" },
  { id:"network-idempotent-retry", topicId:"network", sectionId:"http", kind:"api-choice",
    front:"Почему автоматический retry при разрыве соединения безопасен для `PUT` и `DELETE`, но опасен для `POST`?" },
  { id:"network-tls-asymmetric", topicId:"network", sectionId:"tls", kind:"oral",
    front:"Зачем в TLS вообще нужна асимметричная криптография, если весь трафик потом шифруется симметричным ключом?" },
  { id:"network-app-vs-network-interceptor", topicId:"network", sectionId:"okhttp", kind:"api-choice",
    front:"Куда вешать auth-токен, а куда — логгер «по проводу»: на `addInterceptor` или `addNetworkInterceptor`, и почему?" },
  { id:"network-swallow-cancellation", topicId:"network", sectionId:"errors", kind:"bug",
    front:"Что сломается, если общий `catch` в `safeApiCall` поймает и проглотит `CancellationException`?" },
  { id:"network-gson-npe", topicId:"network", sectionId:"serialization", kind:"edge-case",
    front:"Как Gson умудряется положить `null` в non-null Kotlin-поле и проигнорировать его значение по умолчанию?" },
  { id:"network-ws-half-open", topicId:"network", sectionId:"websockets", kind:"edge-case",
    front:"Сокет «открыт», `onFailure` не сработал, но сообщения не идут уже минуту. Что произошло и чем это ловят заранее?" },
  { id:"security-gcm-iv-reuse", topicId:"security", sectionId:"crypto-basics", kind:"mechanism",
    front:"Почему для AES-GCM повтор одного IV под одним ключом — это катастрофа, а не мелкая небрежность, и кто отвечает за уникальность IV?" },
  { id:"security-strongbox-fallback", topicId:"security", sectionId:"keystore", kind:"api-choice",
    front:"Вы запросили `setIsStrongBoxBacked(true)`, но не каждое устройство поддерживает StrongBox. Что произойдёт и как корректно отработать этот случай?" },
  { id:"security-cryptoobject-vs-flag", topicId:"security", sectionId:"biometric", kind:"mechanism",
    front:"Почему привязка операции к `CryptoObject` сильнее, чем доверие булеву результату «биометрия пройдена»?" },
  { id:"security-client-detection-race", topicId:"security", sectionId:"reverse", kind:"oral",
    front:"Объясните, почему root- и Frida-детект на клиенте — это «гонка, которую защищающийся не выигрывает», и что тогда делает критичное решение надёжным." },
  { id:"security-mapping-leak", topicId:"security", sectionId:"obfuscation", kind:"bug",
    front:"Чем опасна утечка `mapping.txt` для защиты бинаря и как при этом сохранить читаемые стектрейсы?" },
  { id:"security-flag-secure-limits", topicId:"security", sectionId:"screen-leaks", kind:"edge-case",
    front:"Вы повесили `FLAG_SECURE` на экран с балансом. От какого способа «сфотографировать» данные он принципиально не спасает, и что это говорит о границах метода?" },
  { id:"profiling-profiler-vs-benchmark", topicId:"profiling", sectionId:"tools", kind:"api-choice",
    front:"Когда вы возьмёте `Profiler`, а когда `Macrobenchmark`, и почему замер на debug-сборке бессмысленен?" },
  { id:"profiling-gc-pressure", topicId:"profiling", sectionId:"art-gc-lifecycle", kind:"mechanism",
    front:"Почему поток мелких аллокаций в `onBindViewHolder` бьёт по плавности сильнее, чем одна крупная утечка?" },
  { id:"profiling-ttid-ttfd", topicId:"profiling", sectionId:"startup", kind:"oral",
    front:"Чем `TTID` отличается от `TTFD` и зачем вообще нужен ручной вызов `reportFullyDrawn()`?" },
  { id:"profiling-avg-fps-trap", topicId:"profiling", sectionId:"ui-jank", kind:"edge-case",
    front:"Почему высокий средний FPS не противоречит ощутимому jank, и какую метрику измерять вместо среднего?" },
  { id:"profiling-r8-keep", topicId:"profiling", sectionId:"apk-size", kind:"bug",
    front:"Включили `isMinifyEnabled = true` — и приложение падает только в release. Какой класс кода чаще всего ломает R8 и как это лечить?" },
  { id:"profiling-anr-broadcast-thread", topicId:"profiling", sectionId:"anr", kind:"mechanism",
    front:"Почему синхронный I/O в `onReceive` у `BroadcastReceiver` грозит ANR, и как правильно вынести работу?" },
  { id:"testing-fake-vs-mock", topicId:"testing", sectionId:"pyramid", kind:"api-choice",
    front:"Гугл советует для своих репозиториев и data source предпочитать fake, а не mock с `verify`. Какой недостаток mock это убирает?" },
  { id:"testing-setmain-rule", topicId:"testing", sectionId:"coroutines", kind:"bug",
    front:"ViewModel-тест на JVM падает на корутине из `viewModelScope` ещё до ассертов. Почему и что добавить в `@Before`/`@After`?" },
  { id:"testing-stateflow-conflation", topicId:"testing", sectionId:"flow", kind:"edge-case",
    front:"Тест на `StateFlow` через Turbine иногда пропускает `Loading`, хотя код «работает». В чём причина и как сделать тест детерминированным?" },
  { id:"testing-compose-vs-espresso", topicId:"testing", sectionId:"instrumented", kind:"api-choice",
    front:"Тебе нужно надёжно найти кнопку в Compose-тесте, который не должен падать при правке текста или локализации. Что выбрать и почему?" },
  { id:"testing-replay0-subscribe-order", topicId:"testing", sectionId:"events", kind:"bug",
    front:"Тест события на `SharedFlow` с `replay=0` то ловит эмиссию, то нет. Где ловушка и как гарантировать порядок?" },
  { id:"testing-mutation-vs-coverage", topicId:"testing", sectionId:"test-quality", kind:"oral",
    front:"Объясни, почему 100% покрытия не значит «нет багов», и что меряет mutation score, чего не видит покрытие." },
  { id:"gradle-build-config-runs-always", topicId:"gradle-build", sectionId:"model", kind:"mechanism",
    front:"Почему тяжёлый код на верхнем уровне `build.gradle` (чтение файла, сетевой запрос) замедляет даже `./gradlew help`, а не только сборку?" },
  { id:"gradle-build-variants-explode", topicId:"gradle-build", sectionId:"variants", kind:"edge-case",
    front:"Как из build types и product flavors получается число вариантов, и почему добавление одного измерения флейворов бьёт по скорости сборки?" },
  { id:"gradle-build-two-caches", topicId:"gradle-build", sectionId:"speed", kind:"api-choice",
    front:"Configuration cache и build cache — какой из них что ускоряет, и взаимоисключающие ли они?" },
  { id:"gradle-build-ksp-vs-kapt", topicId:"gradle-build", sectionId:"annotation", kind:"oral",
    front:"Почему kapt принципиально медленнее KSP — что лишнего он делает на сборке?" },
  { id:"gradle-build-api-vs-impl", topicId:"gradle-build", sectionId:"modularization", kind:"api-choice",
    front:"Почему дефолт — `implementation`, а не `api`, и как это влияет на перекомпиляцию потребителей?" },
  { id:"gradle-build-keep-class-overkill", topicId:"gradle-build", sectionId:"r8", kind:"bug",
    front:"Gson возвращает объект с пустыми полями после R8. `-keep class Foo { *; }` чинит краш — почему это плохое решение и что точнее?" },
  { id:"system-design-loading-state", topicId:"system-design", sectionId:"architecture", kind:"mechanism",
    front:"UI читает только из Room через `Flow`, а сеть пишет в Room. Откуда тогда экран берёт состояния «идёт загрузка» и «ошибка сети» — их ведь нет в данных БД?" },
  { id:"system-design-tombstones", topicId:"system-design", sectionId:"api-data", kind:"edge-case",
    front:"Дельта-синхронизация по `updatedSince` тянет созданное и изменённое. Как клиент узнает, что запись удалили на сервере, если её просто нет в дельте?" },
  { id:"system-design-idempotency", topicId:"system-design", sectionId:"offline", kind:"bug",
    front:"Воркер дренирует outbox и делает `POST /like` с ретраями. Какой баг гарантированно появится без `Idempotency-Key` и почему?" },
  { id:"system-design-remotemediator", topicId:"system-design", sectionId:"paging", kind:"api-choice",
    front:"Когда брать `RemoteMediator + PagingSource` из Room, а когда хватит одного `PagingSource` напрямую из сети? Что ломается во втором варианте?" },
  { id:"system-design-jitter", topicId:"system-design", sectionId:"realtime", kind:"oral",
    front:"Объясните, зачем в reconnect-backoff нужен jitter, если экспонента и так разносит попытки во времени." },
  { id:"system-design-request-dedup", topicId:"system-design", sectionId:"case-image-loader", kind:"mechanism",
    front:"Десять элементов списка одновременно грузят один и тот же URL. Каким механизмом не сходить в сеть десять раз?" },
  { id:"behavioral-star-action", topicId:"behavioral", sectionId:"star", kind:"mechanism",
    front:"В ответе по STAR на какой из четырёх блоков должна приходиться львиная доля рассказа и почему именно на него?" },
  { id:"behavioral-bank-contexts", topicId:"behavioral", sectionId:"bank", kind:"oral",
    front:"Почему рискованно набирать весь банк из 6–8 историй вокруг одного проекта, даже если каждая отвечает на несколько вопросов?" },
  { id:"behavioral-fake-weakness", topicId:"behavioral", sectionId:"antipatterns", kind:"bug",
    front:"На вопрос про слабые стороны кандидат отвечает «я перфекционист / слишком много работаю». Почему это провальный ответ, хотя формально это про недостаток?" },
  { id:"behavioral-bias-for-action-limit", topicId:"behavioral", sectionId:"ambiguity", kind:"edge-case",
    front:"Bias for action хвалят как достоинство. В каком случае «быстро начал делать в условиях неопределённости» — это минус, и как показать, что вы видите эту границу?" },
  { id:"behavioral-leadership-no-title", topicId:"behavioral", sectionId:"leadership", kind:"api-choice",
    front:"На senior-собесе просят историю про лидерство, а формальной роли лида у вас не было. Какую историю выбрать и почему отсутствие должности здесь не проблема?" },
];

const LS_KEY = "aip-progress-v1";
const REVIEW_KEY = "aip-review-v1";
const THEME_KEY = "aip-theme";
const BOOKMARK_KEY = "aip-text-bookmarks-v1";
const BOOKMARK_LIMIT = 80;
const BOOKMARK_TEXT_LIMIT = 1400;
const THEME_MEDIA = "(prefers-color-scheme: dark)";
let watchingSystemTheme = false;
let selectionDraft = null;
let selectionRange = null;
let suppressSelectionToolsUntil = 0;

/* ---------- progress ---------- */
function getProgress(){ try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch(e){ return {}; } }
function isDone(id){ return !!getProgress()[id]; }
function setDone(id, val){
  const p = getProgress();
  if (val) p[id] = 1; else delete p[id];
  try { localStorage.setItem(LS_KEY, JSON.stringify(p)); } catch(e){}
}
function progressCount(){ return Object.keys(getProgress()).length; }

/* ---------- интервальное повторение ---------- */
function getReviewState(){ try { return JSON.parse(localStorage.getItem(REVIEW_KEY)) || {}; } catch(e){ return {}; } }
function setReviewState(state){ try { localStorage.setItem(REVIEW_KEY, JSON.stringify(state)); } catch(e){} }
function localDateKey(date){
  const d = date || new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function dateKeyAfter(days){
  const d = new Date();
  d.setHours(0,0,0,0);
  d.setDate(d.getDate() + days);
  return localDateKey(d);
}
function parseDateKey(key){
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key || "");
  if (!m) return null;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}
function formatReviewDate(key){
  const due = parseDateKey(key);
  if (!due) return "сегодня";
  const today = parseDateKey(localDateKey());
  const diff = Math.round((due - today) / 86400000);
  if (diff <= 0) return "сегодня";
  if (diff === 1) return "завтра";
  return due.toLocaleDateString("ru-RU", { day:"2-digit", month:"2-digit" });
}
function isReviewDue(entry){ return !entry || !entry.due || entry.due <= localDateKey(); }

// Записать результат повторения для любого reviewId (карточка главы или test:<qid>).
function scheduleReview(reviewId, result){
  const days = REVIEW_DELAYS[result] || REVIEW_DELAYS.again;
  const state = getReviewState();
  state[reviewId] = { due: dateKeyAfter(days), last: localDateKey(), result };
  setReviewState(state);
}

// Все провалы интервью-теста как элементы повторения (только отвеченные неверно).
// Считаем по полному набору вопросов, не завися от режима пересдачи.
function allTestMisses(state){
  const st = state || getInterviewState();
  if (!st.finished) return [];
  return INTERVIEW_TEST_QUESTIONS
    .filter(q => hasInterviewAnswer(st, q.id) && interviewAnswer(st, q.id) !== q.answer)
    .map(q => ({
      id: `test:${q.id}`,
      topicId: q.topicId,
      sectionId: q.sectionId,
      kind: "test",
      source: "test",
      front: q.gap || q.question,
      refs: q.refs || []
    }));
}

// Единый список карточек: авторские из каталога + динамические из провалов теста.
function allReviewItems(){
  const cards = REVIEW_CATALOG.map(c => ({ ...c, source: "card" }));
  return cards.concat(allTestMisses());
}

// Только то, что нужно повторить сегодня (нет записи или срок наступил).
function dueReviewItems(){
  const state = getReviewState();
  return allReviewItems().filter(it => isReviewDue(state[it.id]));
}

// Ссылка с карточки на параграф главы.
function reviewItemHref(item){
  const t = topicById(item.topicId);
  if (!t) return rel("index");
  return rel(t.file) + (item.sectionId ? `#${item.sectionId}` : "");
}

/* ---------- theme ---------- */
function getStoredTheme(){
  try {
    const t = localStorage.getItem(THEME_KEY);
    return t === "dark" || t === "light" ? t : null;
  } catch(e){
    return null;
  }
}
function systemTheme(){
  return window.matchMedia && window.matchMedia(THEME_MEDIA).matches ? "dark" : "light";
}
function preferredTheme(){ return getStoredTheme() || systemTheme(); }
function currentTheme(){ return document.documentElement.getAttribute("data-theme") || preferredTheme(); }
function applyTheme(t){
  document.documentElement.setAttribute("data-theme", t);
  document.querySelectorAll(".theme-ic").forEach(el => el.textContent = t === "dark" ? "🌙" : "☀️");
}
function applyStoredTheme(){
  applyTheme(preferredTheme());
}
function syncSystemTheme(){
  if (!getStoredTheme()) applyTheme(systemTheme());
}
function watchSystemTheme(){
  if (watchingSystemTheme || !window.matchMedia) return;
  const media = window.matchMedia(THEME_MEDIA);
  if (media.addEventListener) media.addEventListener("change", syncSystemTheme);
  else media.addListener(syncSystemTheme);
  watchingSystemTheme = true;
}
function toggleTheme(){
  const next = currentTheme() === "dark" ? "light" : "dark";
  try { localStorage.setItem(THEME_KEY, next); } catch(e){}
  applyTheme(next);
}

/* ---------- helpers ---------- */
function rel(path){
  // на index файлы в pages/, на странице главы — рядом
  const onPage = location.pathname.replace(/\\/g,"/").includes("/pages/");
  if (path === "index") return onPage ? "../index.html" : "index.html";
  if (path === "plan")  return onPage ? "../../ПЛАН_ПОДГОТОВКИ.md" : "../ПЛАН_ПОДГОТОВКИ.md";
  return onPage ? path : ("pages/" + path); // path = file inside pages/
}
function esc(s){ return (s||"").replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c])); }
function cleanText(s){ return (s || "").replace(/\s+/g, " ").trim(); }
function nodeElement(n){ return !n ? null : (n.nodeType === 1 ? n : n.parentElement); }
function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }
function topicById(id){ return TOPICS.find(t => t.id === id); }
function specialPageById(id){ return SPECIAL_PAGES[id] || null; }
function formatDate(ts){
  try { return new Date(ts).toLocaleDateString("ru-RU", { day:"2-digit", month:"short" }); }
  catch(e){ return ""; }
}

/* ---------- text bookmarks ---------- */
function getBookmarks(){
  try {
    const raw = JSON.parse(localStorage.getItem(BOOKMARK_KEY)) || [];
    return Array.isArray(raw) ? raw.filter(b => b && b.id && b.text).slice(0, BOOKMARK_LIMIT) : [];
  } catch(e){
    return [];
  }
}
function setBookmarks(items){
  try { localStorage.setItem(BOOKMARK_KEY, JSON.stringify(items.slice(0, BOOKMARK_LIMIT))); } catch(e){}
  syncBookmarkCount();
}
function syncBookmarkCount(){
  const n = getBookmarks().length;
  document.querySelectorAll(".bookmark-count").forEach(el => {
    el.textContent = n > 99 ? "99+" : String(n);
    el.hidden = n === 0;
  });
}
function currentSelectionDraft(){
  if (Date.now() < suppressSelectionToolsUntil) return null;
  const sel = window.getSelection && window.getSelection();
  if (!sel || sel.isCollapsed || !sel.rangeCount) return null;
  if (!sel.getRangeAt) return null;

  const page = document.querySelector("#content article.page");
  const topic = topicById(document.body.dataset.page);
  if (!page || !topic) return null;

  const range = sel.getRangeAt(0);
  const common = nodeElement(range.commonAncestorContainer);
  if (!common || !page.contains(common)) return null;

  const text = cleanText(sel.toString());
  if (text.length < 12) return null;

  const rect = range.getBoundingClientRect();
  if (!rect || (!rect.width && !rect.height)) return null;

  const anchor = nodeElement(sel.anchorNode);
  const focus = nodeElement(sel.focusNode);
  const section = (anchor && anchor.closest(".section")) || (focus && focus.closest(".section")) || common.closest(".section");
  const sectionTitle = section && section.querySelector(":scope > h2")
    ? cleanText(section.querySelector(":scope > h2").textContent)
    : "Вступление";

  return {
    range,
    rect,
    pageId: topic.id,
    pageTitle: topic.title,
    pageFile: topic.file,
    sectionId: section ? section.id : "",
    sectionTitle,
    text: text.slice(0, BOOKMARK_TEXT_LIMIT),
  };
}
function ensureSelectionTools(){
  if (document.getElementById("selection-tools")) return;
  const tools = document.createElement("div");
  tools.id = "selection-tools";
  tools.className = "selection-tools";
  tools.hidden = true;
  tools.innerHTML = `
    <button type="button" data-selection-action="save"><span aria-hidden="true">＋</span>Закладка</button>
    <button type="button" data-selection-action="question"><span aria-hidden="true">?</span>Вопросы</button>
  `;
  tools.addEventListener("mousedown", e => e.preventDefault());
  tools.addEventListener("click", e => {
    const btn = e.target.closest("[data-selection-action]");
    if (!btn) return;
    saveSelectionBookmark(btn.dataset.selectionAction === "question");
  });
  document.body.appendChild(tools);
}
function updateSelectionTools(){
  const tools = document.getElementById("selection-tools");
  if (!tools) return;
  const draft = currentSelectionDraft();
  if (!draft){
    selectionDraft = null;
    selectionRange = null;
    tools.hidden = true;
    return;
  }

  selectionDraft = draft;
  selectionRange = draft.range.cloneRange();
  tools.hidden = false;
  requestAnimationFrame(() => {
    const gap = 10;
    const w = tools.offsetWidth || 220;
    const h = tools.offsetHeight || 42;
    const rect = draft.rect;
    const left = clamp(rect.left + rect.width / 2, 12 + w / 2, window.innerWidth - 12 - w / 2);
    let top = rect.top - h - gap;
    if (top < 62) top = rect.bottom + gap;
    tools.style.left = left + "px";
    tools.style.top = clamp(top, 62, window.innerHeight - h - 12) + "px";
  });
}
function hideSelectionTools(){
  const tools = document.getElementById("selection-tools");
  if (tools) tools.hidden = true;
}
function saveSelectionBookmark(withQuestions){
  const draft = selectionDraft || currentSelectionDraft();
  if (!draft){
    showToast("Сначала выделите фрагмент текста");
    return;
  }

  const items = getBookmarks();
  const existing = items.find(b => b.pageId === draft.pageId && b.sectionId === draft.sectionId && b.text === draft.text);
  const now = Date.now();
  const bookmark = existing || {
    id: "bm-" + now.toString(36) + "-" + Math.random().toString(36).slice(2, 7),
    createdAt: now,
    pageId: draft.pageId,
    pageTitle: draft.pageTitle,
    pageFile: draft.pageFile,
    sectionId: draft.sectionId,
    sectionTitle: draft.sectionTitle,
    text: draft.text,
    questions: [],
  };
  if (withQuestions && !bookmark.questions.length) bookmark.questions = createBookmarkQuestions(bookmark);

  setBookmarks([bookmark, ...items.filter(b => b.id !== bookmark.id)]);
  hideSelectionTools();
  selectionDraft = null;
  selectionRange = null;
  const sel = window.getSelection && window.getSelection();
  if (sel && sel.removeAllRanges) sel.removeAllRanges();
  if (withQuestions) {
    openBookmarksPanel(bookmark.id);
  } else {
    showToast(existing ? "Фрагмент уже был в закладках" : "Фрагмент сохранён в закладках");
  }
}
function ensureBookmarkPanel(){
  if (document.getElementById("bookmark-panel")) return;
  const backdrop = document.createElement("div");
  backdrop.className = "bookmark-backdrop";
  backdrop.addEventListener("click", closeBookmarksPanel);

  const panel = document.createElement("aside");
  panel.id = "bookmark-panel";
  panel.className = "bookmark-panel";
  panel.setAttribute("aria-label", "Локальные закладки");
  panel.setAttribute("aria-hidden", "true");
  panel.addEventListener("click", handleBookmarkAction);

  document.body.append(backdrop, panel);
}
function toggleBookmarksPanel(){
  const open = !document.body.classList.contains("bookmarks-open");
  if (open) openBookmarksPanel();
  else closeBookmarksPanel();
}
function openBookmarksPanel(focusId){
  ensureBookmarkPanel();
  renderBookmarks(focusId);
  document.body.classList.add("bookmarks-open");
  const panel = document.getElementById("bookmark-panel");
  if (panel) panel.setAttribute("aria-hidden", "false");
  document.querySelector(".bookmark-toggle")?.setAttribute("aria-expanded", "true");
}
function closeBookmarksPanel(){
  document.body.classList.remove("bookmarks-open");
  const panel = document.getElementById("bookmark-panel");
  if (panel) panel.setAttribute("aria-hidden", "true");
  document.querySelector(".bookmark-toggle")?.setAttribute("aria-expanded", "false");
}
function renderBookmarks(focusId){
  const panel = document.getElementById("bookmark-panel");
  if (!panel) return;
  const items = getBookmarks();
  const body = items.length ? items.map(b => renderBookmarkItem(b, focusId)).join("") : `
    <div class="bm-empty">
      <strong>Закладок пока нет</strong>
      <p>Здесь будут сохранённые фрагменты из глав.</p>
    </div>`;
  panel.innerHTML = `
    <div class="bookmark-head">
      <div>
        <h2>Закладки</h2>
        <p>${items.length ? `${items.length} локально сохранено` : "Сохраняются только в этом браузере"}</p>
      </div>
      <button class="icon-btn" type="button" data-bm-action="close" aria-label="Закрыть">×</button>
    </div>
    <div class="bookmark-body">${body}</div>
  `;
}
function renderBookmarkItem(b, focusId){
  const questions = b.questions && b.questions.length ? `
    <details class="bm-questions" open>
      <summary>Вопросы по фрагменту</summary>
      <ol>${b.questions.map(q => `<li>${esc(q)}</li>`).join("")}</ol>
      <button class="mini-btn" type="button" data-bm-action="copy-questions">Копировать вопросы</button>
    </details>` : "";
  return `
    <article class="bm-item${b.id === focusId ? " bm-focus" : ""}" data-bookmark-id="${esc(b.id)}">
      <div class="bm-meta"><span>${esc(b.pageTitle)}</span><time>${formatDate(b.createdAt)}</time></div>
      <div class="bm-section">${esc(b.sectionTitle || "Вступление")}</div>
      <blockquote>${esc(b.text)}</blockquote>
      <div class="bm-actions">
        <button class="mini-btn" type="button" data-bm-action="goto">Перейти</button>
        <button class="mini-btn" type="button" data-bm-action="questions">Создать вопросы</button>
        <button class="mini-btn" type="button" data-bm-action="copy">Копировать</button>
        <button class="mini-btn danger" type="button" data-bm-action="delete">Удалить</button>
      </div>
      ${questions}
    </article>`;
}
function handleBookmarkAction(e){
  const btn = e.target.closest("[data-bm-action]");
  if (!btn) return;
  const action = btn.dataset.bmAction;
  if (action === "close") { closeBookmarksPanel(); return; }

  const item = btn.closest("[data-bookmark-id]");
  const id = item && item.dataset.bookmarkId;
  const items = getBookmarks();
  const bm = items.find(b => b.id === id);
  if (!bm) return;

  if (action === "goto") return goToBookmark(bm);
  if (action === "delete"){
    setBookmarks(items.filter(b => b.id !== id));
    renderBookmarks();
    showToast("Закладка удалена");
    return;
  }
  if (action === "questions"){
    if (!bm.questions || !bm.questions.length) bm.questions = createBookmarkQuestions(bm);
    setBookmarks(items.map(b => b.id === id ? bm : b));
    renderBookmarks(id);
    return;
  }
  if (action === "copy") return copyText(`${bm.pageTitle} / ${bm.sectionTitle}\n\n${bm.text}`, "Фрагмент скопирован");
  if (action === "copy-questions"){
    const questions = (bm.questions && bm.questions.length ? bm.questions : createBookmarkQuestions(bm))
      .map((q, i) => `${i + 1}. ${q}`).join("\n");
    return copyText(questions, "Вопросы скопированы");
  }
}
function createBookmarkQuestions(bm){
  const quote = cleanText(bm.text);
  const short = quote.length > 180 ? quote.slice(0, 177) + "…" : quote;
  const focus = extractFocusTerms(quote);
  const subject = focus.length ? focus.join(", ") : bm.sectionTitle;
  return [
    `Объясните своими словами: «${short}».`,
    `Какой механизм под капотом связан с: ${subject}?`,
    "Какой крайний случай или типичная ошибка здесь может всплыть на собеседовании?",
    "Как это проявится в Android-проекте и как вы бы это проверили?",
  ];
}
function extractFocusTerms(text){
  const stop = new Set(["это","если","как","для","или","при","что","где","когда","может","нужно","через","между","потому","который","которая","которые"]);
  const words = cleanText(text).match(/[A-Za-zА-Яа-яЁё][A-Za-zА-Яа-яЁё0-9_.:-]{3,}/g) || [];
  const counts = new Map();
  words.forEach(w => {
    const key = w.replace(/[.,:;!?()[\]{}]/g, "");
    const low = key.toLowerCase();
    if (stop.has(low)) return;
    counts.set(key, (counts.get(key) || 0) + 1);
  });
  return [...counts.entries()].sort((a,b) => b[1] - a[1]).slice(0, 3).map(x => x[0]);
}
function goToBookmark(bm){
  const samePage = document.body.dataset.page === bm.pageId;
  closeBookmarksPanel();
  if (!samePage){
    const topic = topicById(bm.pageId);
    if (!topic) return;
    const hash = bm.sectionId ? "#" + encodeURIComponent(bm.sectionId) : "";
    location.href = rel(topic.file) + "?bookmark=" + encodeURIComponent(bm.id) + hash;
    return;
  }
  scrollToBookmark(bm);
}
function restoreBookmarkFromUrl(){
  let id = "";
  try { id = new URLSearchParams(location.search).get("bookmark") || ""; } catch(e){}
  if (!id) return;
  const bm = getBookmarks().find(b => b.id === id);
  if (bm) setTimeout(() => scrollToBookmark(bm), 120);
}
function scrollToBookmark(bm){
  const root = (bm.sectionId && document.getElementById(bm.sectionId)) || document.querySelector(".page");
  if (!root) return;
  document.querySelectorAll(".bookmark-target").forEach(el => el.classList.remove("bookmark-target"));
  root.classList.add("bookmark-target");
  setTimeout(() => root.classList.remove("bookmark-target"), 2400);

  const range = findTextRange(root, bm.text);
  suppressSelectionToolsUntil = Date.now() + 900;
  if (range && window.getSelection){
    const sel = window.getSelection();
    if (sel && sel.removeAllRanges && sel.addRange){
      sel.removeAllRanges();
      sel.addRange(range);
      const el = nodeElement(range.startContainer);
      if (el) el.scrollIntoView({ behavior:"smooth", block:"center" });
    } else {
      root.scrollIntoView({ behavior:"smooth", block:"start" });
    }
  } else {
    root.scrollIntoView({ behavior:"smooth", block:"start" });
  }
  showToast("Открыта закладка");
}
function findTextRange(root, text){
  const query = cleanText(text);
  if (!query) return null;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node){
      const el = node.parentElement;
      if (!el || !cleanText(node.nodeValue)) return NodeFilter.FILTER_REJECT;
      if (el.closest("script, style, .selection-tools, .bookmark-panel")) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  let normalized = "";
  let lastSpace = false;
  const map = [];
  while (walker.nextNode()){
    const node = walker.currentNode;
    const value = node.nodeValue || "";
    for (let i = 0; i < value.length; i++){
      const ch = value[i];
      if (/\s/.test(ch)){
        if (!lastSpace && normalized.length){
          normalized += " ";
          map.push({ node, offset:i });
          lastSpace = true;
        }
      } else {
        normalized += ch;
        map.push({ node, offset:i });
        lastSpace = false;
      }
    }
  }
  const idx = normalized.indexOf(query);
  if (idx < 0) return null;
  const start = map[idx];
  const end = map[Math.min(idx + query.length - 1, map.length - 1)];
  if (!start || !end) return null;
  const range = document.createRange();
  range.setStart(start.node, start.offset);
  range.setEnd(end.node, end.offset + 1);
  return range;
}
function copyText(text, message){
  const fallback = () => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); showToast(message); } catch(e){ showToast("Не удалось скопировать"); }
    ta.remove();
  };
  if (navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(() => showToast(message)).catch(fallback);
  } else {
    fallback();
  }
}
function showToast(message){
  let toast = document.getElementById("app-toast");
  if (!toast){
    toast = document.createElement("div");
    toast.id = "app-toast";
    toast.className = "app-toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toast.classList.remove("show"), 1900);
}
function initTextBookmarks(){
  ensureSelectionTools();
  ensureBookmarkPanel();
  syncBookmarkCount();
  document.addEventListener("mouseup", () => setTimeout(updateSelectionTools, 0));
  document.addEventListener("keyup", () => setTimeout(updateSelectionTools, 0));
  document.addEventListener("touchend", () => setTimeout(updateSelectionTools, 80), { passive:true });
  document.addEventListener("scroll", hideSelectionTools, { passive:true });
  document.addEventListener("keydown", e => { if (e.key === "Escape") { hideSelectionTools(); closeBookmarksPanel(); } });
  restoreBookmarkFromUrl();
}

/* ---------- topbar ---------- */
function buildTopbar(){
  const done = progressCount(), total = TOPICS.length;
  const page = document.body.dataset.page || "home";
  const testPage = specialPageById("interview-test");
  const chaptersActive = page !== "interview-test" ? " active" : "";
  const testActive = page === "interview-test" ? " active" : "";
  const bar = document.createElement("header");
  bar.className = "topbar";
  bar.innerHTML = `
    <button class="icon-btn menu-toggle" aria-label="Меню" onclick="document.body.classList.toggle('nav-open')">☰</button>
    <a class="brand" href="${rel('index')}">
      <span class="logo">A</span>
      <span>Android-собес<small>подготовка · Middle+ / Senior</small></span>
    </a>
    <nav class="top-tabs" aria-label="Основные разделы">
      <a class="top-tab${chaptersActive}" href="${rel('index')}">Главы</a>
      <a class="top-tab${testActive}" href="${rel(testPage.file)}">Тестирование</a>
    </nav>
    <div class="search">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
      <input id="search" type="search" placeholder="Поиск по главам…" autocomplete="off">
    </div>
    <div class="spacer"></div>
    <button class="icon-btn bookmark-toggle" aria-label="Закладки" aria-expanded="false" onclick="toggleBookmarksPanel()">
      <span aria-hidden="true">🔖</span><span class="bookmark-count" hidden>0</span>
    </button>
    <button class="icon-btn" aria-label="Тема" onclick="toggleTheme()"><span class="theme-ic">${currentTheme()==='dark'?'🌙':'☀️'}</span></button>
  `;
  document.body.prepend(bar);
  const s = bar.querySelector("#search");
  s.addEventListener("input", () => doSearch(s.value.trim().toLowerCase()));
  syncBookmarkCount();
}

function doSearch(q){
  const grid = document.querySelector(".topic-grid");
  if (grid){
    grid.querySelectorAll(".topic-card").forEach(c => {
      c.style.display = !q || c.textContent.toLowerCase().includes(q) ? "" : "none";
    });
  }
  document.querySelectorAll("#sidebar .nav-link").forEach(l => {
    const hit = !q || l.dataset.search.includes(q);
    l.style.display = hit ? "" : "none";
  });
  document.querySelectorAll("#sidebar .nav-group-title").forEach(t => {
    let n = t.nextElementSibling, any = false;
    while (n && n.classList.contains("nav-link")){ if (n.style.display !== "none") any = true; n = n.nextElementSibling; }
    t.style.display = any ? "" : "none";
  });
}

/* ---------- sidebar ---------- */
function buildSidebar(activeId){
  const aside = document.getElementById("sidebar");
  if (!aside) return;
  const done = progressCount(), total = TOPICS.length;
  const pct = Math.round(done/total*100);
  let html = `
    <div class="nav-progress">
      <div class="bar"><i style="width:${pct}%"></i></div>
      <div class="lbl"><span>Прогресс</span><span>${done}/${total}</span></div>
    </div>`;
  const testPage = specialPageById("interview-test");
  if (testPage){
    const active = activeId === "interview-test" ? " active" : "";
    html += `<a class="nav-link nav-special${active}" data-search="${esc((testPage.title+' '+testPage.short).toLowerCase())}" href="${rel(testPage.file)}">
      <span class="ni"><span>${testPage.icon}</span></span><span>Собеседование-тест</span></a>`;
  }
  let lastGroup = null;
  TOPICS.forEach(t => {
    if (t.group !== lastGroup){
      html += `<div class="nav-group-title">${GROUPS[t.group].title}</div>`;
      lastGroup = t.group;
    }
    const active = t.id === activeId ? " active" : "";
    const doneCls = isDone(t.id) ? " done" : "";
    html += `<a class="nav-link${active}${doneCls}" data-id="${t.id}" data-search="${esc((t.title+' '+t.short+' '+t.subs.join(' ')).toLowerCase())}" href="${rel(t.file)}">
      <span class="ni"><span>${t.icon}</span></span><span>${esc(t.title)}</span></a>`;
  });
  aside.innerHTML = html;
}

/* ---------- TOC + scrollspy ---------- */
function buildTOC(){
  const toc = document.getElementById("toc");
  const content = document.getElementById("content");
  if (!toc || !content) return;
  const heads = [...content.querySelectorAll(".section > h2")];
  if (!heads.length){ toc.style.display = "none"; return; }
  let html = `<div class="toc-title">На странице</div>`;
  heads.forEach((h, i) => {
    if (!h.id) h.id = "h-" + i;
    html += `<a href="#${h.id}">${esc(h.textContent)}</a>`;
  });
  toc.innerHTML = html;
  const links = [...toc.querySelectorAll("a")];
  const map = new Map(heads.map((h,i)=>[h.id, links[i]]));
  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting){
        links.forEach(l=>l.classList.remove("active"));
        const a = map.get(en.target.id); if (a) a.classList.add("active");
      }
    });
  }, { rootMargin: "-80px 0px -70% 0px", threshold: 0 });
  heads.forEach(h => obs.observe(h));
}

/* ---------- prev/next + mark done ---------- */
function buildPageFooter(activeId){
  const page = document.querySelector(".page");
  if (!page) return;
  const idx = TOPICS.findIndex(t => t.id === activeId);
  if (idx < 0) return;
  const t = TOPICS[idx], prev = TOPICS[idx-1], next = TOPICS[idx+1];

  const btn = document.createElement("button");
  const on = isDone(activeId);
  btn.className = "mark-done" + (on ? " on" : "");
  btn.innerHTML = `<span class="box"></span><span>${on ? "Глава пройдена" : "Отметить главу пройденной"}</span>`;
  btn.onclick = () => {
    const now = !btn.classList.contains("on");
    setDone(activeId, now);
    btn.classList.toggle("on", now);
    btn.querySelector("span:last-child").textContent = now ? "Глава пройдена" : "Отметить главу пройденной";
    buildSidebar(activeId);
  };
  page.appendChild(btn);

  const foot = document.createElement("footer");
  foot.className = "page-foot";
  foot.innerHTML =
    (prev ? `<a href="${rel(prev.file)}"><span>← Назад</span><b>${esc(prev.title)}</b></a>` : `<a href="${rel('index')}"><span>←</span><b>На главную</b></a>`) +
    (next ? `<a class="next" href="${rel(next.file)}"><span>Далее →</span><b>${esc(next.title)}</b></a>` : `<a class="next" href="${rel('index')}"><span>→</span><b>К списку глав</b></a>`);
  page.appendChild(foot);
}

/* ---------- breadcrumb ---------- */
function buildBreadcrumb(activeId){
  const el = document.querySelector(".breadcrumb");
  if (!el) return;
  const t = TOPICS.find(x => x.id === activeId);
  if (!t){
    const special = specialPageById(activeId);
    if (!special) return;
    el.innerHTML = `<a href="${rel('index')}">Главная</a> <span>›</span> <span>${esc(special.groupTitle)}</span> <span>›</span> <span style="color:var(--text-dim)">${esc(special.title)}</span>`;
    return;
  }
  el.innerHTML = `<a href="${rel('index')}">Главная</a> <span>›</span> <span>${GROUPS[t.group].title}</span> <span>›</span> <span style="color:var(--text-dim)">${esc(t.title)}</span>`;
}

/* ---------- mind map (index) ---------- */
function buildMindmap(){
  const host = document.getElementById("mindmap");
  if (!host) return;
  const W = 1180, H = 760, cx = W/2, cy = H/2;
  const rx = 452, ry = 286;
  const n = TOPICS.length;
  let nodes = "", links = "";
  TOPICS.forEach((t, i) => {
    const ang = (-90 + i*(360/n)) * Math.PI/180;
    const x = cx + rx*Math.cos(ang);
    const y = cy + ry*Math.sin(ang);
    const color = GROUPS[t.group].color;
    const cw = 168, ch = 50;
    // edge from center toward node
    const ex = cx + 92*Math.cos(ang), ey = cy + 60*Math.sin(ang);
    links += `<path d="M${ex},${ey} Q${(ex+x)/2},${(ey+y)/2} ${x},${y}" stroke="${color}" stroke-opacity=".34" stroke-width="2" fill="none"/>`;
    const rxp = x - cw/2, ryp = y - ch/2;
    nodes += `
      <a href="${rel(t.file)}" class="mm-node">
        <title>${esc(t.title)} — ${esc(t.subs.join(', '))}</title>
        <g class="mm-chip">
          <rect x="${rxp}" y="${ryp}" width="${cw}" height="${ch}" rx="13"
                fill="${color}" fill-opacity=".15" stroke="${color}" stroke-opacity=".7" stroke-width="1.5"/>
          <text x="${rxp+20}" y="${y+5}" text-anchor="middle" font-size="15">${t.icon}</text>
          <text class="mm-label" x="${rxp+38}" y="${y-2}" font-size="13">${esc(clip(t.title,18))}</text>
          <text class="mm-sub" x="${rxp+38}" y="${y+13}" font-size="10.5">${esc(clip(t.subs.join(' · '),26))}</text>
        </g>
      </a>`;
  });
  const centerR = 74;
  const svg = `
  <svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mind-map глав подготовки">
    <defs>
      <radialGradient id="mmCore" cx="50%" cy="40%" r="70%">
        <stop offset="0%" stop-color="#5bf0a0"/><stop offset="100%" stop-color="#27b56a"/>
      </radialGradient>
    </defs>
    ${links}
    ${nodes}
    <circle cx="${cx}" cy="${cy}" r="${centerR}" fill="url(#mmCore)" stroke="#3ddc84" stroke-width="2"/>
    <text class="mm-center" x="${cx}" y="${cy-6}" text-anchor="middle" font-size="17">Android</text>
    <text class="mm-center" x="${cx}" y="${cy+14}" text-anchor="middle" font-size="14">собес</text>
    <text x="${cx}" y="${cy+34}" text-anchor="middle" font-size="11" fill="#04140a" opacity=".75">${TOPICS.length} глав</text>
  </svg>`;
  host.innerHTML = svg;

  // legend
  const legend = document.getElementById("mm-legend");
  if (legend){
    legend.innerHTML = Object.values(GROUPS).map(g =>
      `<span><i style="background:${g.color}"></i>${g.title}</span>`).join("");
  }
}
function clip(s, n){ return s.length > n ? s.slice(0, n-1) + "…" : s; }

/* ---------- index topic grid + restore states ---------- */
function buildTopicGrid(){
  const grid = document.getElementById("topic-grid");
  if (!grid) return;
  grid.innerHTML = TOPICS.map(t => {
    const c = GROUPS[t.group].color;
    const done = isDone(t.id) ? " done" : "";
    const tags = t.subs.map(s => `<span class="tag">${esc(s)}</span>`).join("");
    return `<a class="topic-card${done}" data-id="${t.id}" style="--c:${c}" href="${rel(t.file)}">
      <div class="tc-top">
        <span class="tc-ic">${t.icon}</span>
        <div><div class="tc-n">${esc(GROUPS[t.group].title)}</div><h3>${esc(t.title)}</h3></div>
      </div>
      <p>${esc(t.short)}</p>
      <div class="tc-foot"><div class="tc-tags">${tags}</div><span class="tc-done">✓ пройдено</span></div>
    </a>`;
  }).join("");
}
function decorateIndex(){
  buildTopicGrid();
  const done = progressCount(), total = TOPICS.length;
  const el = document.getElementById("stat-progress");
  if (el) el.textContent = done + "/" + total;
}

/* ---------- syntax + diagrams ---------- */
function upgradeStarred(){
  // Вопрос со звёздочкой (.qa + бейдж ★) рендерим как свёрнутую полоску «★ Дополнительно»:
  // сам вопрос виден только после раскрытия. Разметку страниц не трогаем — апгрейдим DOM.
  document.querySelectorAll("details.qa").forEach(d => {
    const sum = d.querySelector(":scope > summary");
    if (!sum) return;
    const badge = sum.querySelector(".q-badge");
    if (!badge || badge.textContent.indexOf("★") === -1) return;
    const ans = d.querySelector(":scope > .ans");
    if (!ans) return;
    badge.remove();
    const q = document.createElement("p");
    q.className = "extra-q";
    q.innerHTML = sum.innerHTML.trim();
    ans.insertBefore(q, ans.firstChild);
    sum.innerHTML = '<span class="extra-star" aria-hidden="true">★</span>'
      + '<span class="extra-label">Дополнительно</span>'
      + '<span class="extra-hint">вопрос со звёздочкой</span>'
      + '<span class="extra-chevron" aria-hidden="true">›</span>';
    d.classList.remove("qa");
    d.classList.add("extra");
  });
}
function highlightCode(){
  if (window.hljs){
    document.querySelectorAll("pre code").forEach(b => { try { hljs.highlightElement(b); } catch(e){} });
  }
}
function renderMermaid(){
  if (window.mermaid){
    try {
      mermaid.initialize({ startOnLoad:false, securityLevel:"loose",
        theme: currentTheme()==="dark" ? "dark" : "default",
        themeVariables: { fontFamily: "Inter, sans-serif" } });
      const render = mermaid.run({ querySelector: ".mermaid" });
      if (render && typeof render.catch === "function") render.catch(() => {});
    } catch(e){}
  }
}

/* ---------- запускаемые примеры Kotlin (Kotlin Playground, ленивый монтаж) ---------- */
// Скрипт грузим с CDN один раз и только если на странице есть <code class="kt-run">.
// Карточки со звёздочкой свёрнуты, а CodeMirror не умеет монтироваться в скрытый блок —
// поэтому монтируем редактор при первом раскрытии details, а не на загрузке.
let kpLoading = null;
function loadKotlinPlayground(){
  if (window.KotlinPlayground) return Promise.resolve();
  if (!kpLoading){
    kpLoading = new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = "https://unpkg.com/kotlin-playground@1";
      s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
  }
  return kpLoading;
}
function mountRunnable(code){
  if (code.dataset.kpMounted) return;
  code.dataset.kpMounted = "1";
  code.setAttribute("theme", "darcula");   // редактор всегда тёмный — как блоки кода на сайте
  loadKotlinPlayground().then(() => { try { window.KotlinPlayground("#" + code.id); } catch(e){} });
}
function setupRunnable(){
  document.querySelectorAll("code.kt-run").forEach((code, i) => {
    if (!code.id) code.id = "ktrun-" + i;
    const det = code.closest("details");
    if (det && !det.open){
      const onToggle = () => { if (det.open){ mountRunnable(code); det.removeEventListener("toggle", onToggle); } };
      det.addEventListener("toggle", onToggle);
    } else {
      mountRunnable(code);                  // вне свёрнутой карточки — монтируем сразу
    }
  });
}

/* ---------- учебные карточки и кейсы ---------- */
const REVIEW_DELAYS = { again: 1, good: 3, easy: 7 };

function setupStudyCards(){
  const cards = [...document.querySelectorAll("[data-review-id]")];
  if (!cards.length) return;

  cards.forEach((card, i) => {
    if (!card.id) card.id = `study-card-${i}`;
    if (card.dataset.studyReady) return;
    card.dataset.studyReady = "1";
    card.querySelectorAll("[data-review-result]").forEach(btn => {
      btn.addEventListener("click", () => {
        scheduleReview(card.dataset.reviewId, btn.dataset.reviewResult || "again");
        updateStudyCards();
      });
    });
  });

  document.querySelectorAll("[data-study-scroll-due]").forEach(btn => {
    if (btn.dataset.studyReady) return;
    btn.dataset.studyReady = "1";
    btn.addEventListener("click", () => {
      const freshCards = [...document.querySelectorAll("[data-review-id]")];
      const target = freshCards.find(card => card.classList.contains("study-due")) || freshCards[0];
      if (target) target.scrollIntoView({ behavior:"smooth", block:"center" });
    });
  });

  document.querySelectorAll("[data-study-reset]").forEach(btn => {
    if (btn.dataset.studyReady) return;
    btn.dataset.studyReady = "1";
    btn.addEventListener("click", () => {
      const state = getReviewState();
      cards.forEach(card => delete state[card.dataset.reviewId]);
      setReviewState(state);
      updateStudyCards();
    });
  });

  updateStudyCards();
}

function updateStudyCards(){
  const cards = [...document.querySelectorAll("[data-review-id]")];
  if (!cards.length) return;
  const state = getReviewState();
  let dueCount = 0;
  let scheduledCount = 0;

  cards.forEach(card => {
    const entry = state[card.dataset.reviewId];
    const due = isReviewDue(entry);
    if (due) dueCount++;
    else scheduledCount++;
    card.classList.toggle("study-due", due);
    card.classList.toggle("study-scheduled", !!entry && !due);
    const status = card.querySelector("[data-study-state]");
    if (status) status.textContent = due ? "к повторению сегодня" : `следующее: ${formatReviewDate(entry.due)}`;
  });

  document.querySelectorAll("[data-study-total]").forEach(el => el.textContent = String(cards.length));
  document.querySelectorAll("[data-study-due]").forEach(el => el.textContent = String(dueCount));
  document.querySelectorAll("[data-study-scheduled]").forEach(el => el.textContent = String(scheduledCount));
}

/* ---------- домашняя поверхность «Сегодня» (кросс-главная очередь) ---------- */
const TODAY_DUE_LIMIT = 8;

function reviewItemKindLabel(item){
  return item.source === "test" ? "Из теста" : (REVIEW_KIND[item.kind] || "Карточка");
}

function setupTodayReview(){
  const root = document.querySelector("[data-today-review]");
  if (!root || root.dataset.todayReady) return;
  root.dataset.todayReady = "1";
  root.addEventListener("click", e => {
    const sched = e.target.closest("[data-today-result]");
    if (sched){
      scheduleReview(sched.dataset.reviewId, sched.dataset.todayResult || "good");
      renderTodayReview(root);
      return;
    }
    const reset = e.target.closest("[data-today-reset]");
    if (reset){
      const state = getReviewState();
      allReviewItems().forEach(it => delete state[it.id]);
      setReviewState(state);
      renderTodayReview(root);
    }
  });
  renderTodayReview(root);
}

function renderTodayReview(root){
  const all = allReviewItems();
  if (!all.length){ root.hidden = true; return; }
  root.hidden = false;

  const state = getReviewState();
  const due = all.filter(it => isReviewDue(state[it.id]));
  const scheduled = all.length - due.length;

  // следующий срок, если на сегодня всё повторено
  let nextDue = "";
  if (!due.length){
    const dates = all.map(it => state[it.id] && state[it.id].due).filter(Boolean).sort();
    if (dates.length) nextDue = formatReviewDate(dates[0]);
  }

  // слабые главы: больше всего карточек к повторению
  const byTopic = new Map();
  due.forEach(it => byTopic.set(it.topicId, (byTopic.get(it.topicId) || 0) + 1));
  const weak = [...byTopic.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([topicId, n]) => {
      const t = topicById(topicId);
      return `<a class="today-weak-chip" href="${reviewItemHref({ topicId })}">${esc(t ? t.title : topicId)} <b>${n}</b></a>`;
    }).join("");

  const visible = due.slice(0, TODAY_DUE_LIMIT);
  const restCount = due.length - visible.length;

  const cardsHtml = visible.map(it => {
    const t = topicById(it.topicId);
    return `
      <article class="today-card">
        <div class="today-card-top">
          <span class="today-kind ${it.source === "test" ? "from-test" : ""}">${esc(reviewItemKindLabel(it))}</span>
          <span class="today-chapter">${esc(t ? t.title : it.topicId)}</span>
        </div>
        <p class="today-q">${formatInline(it.front)}</p>
        <div class="today-card-foot">
          <a class="study-btn ghost" href="${reviewItemHref(it)}">Открыть и ответить →</a>
          <div class="today-grade" aria-label="Запланировать повторение">
            <button class="study-btn" type="button" data-today-result="again" data-review-id="${esc(it.id)}">Ещё раз</button>
            <button class="study-btn" type="button" data-today-result="good" data-review-id="${esc(it.id)}">3 дня</button>
            <button class="study-btn" type="button" data-today-result="easy" data-review-id="${esc(it.id)}">Неделя</button>
          </div>
        </div>
      </article>`;
  }).join("");

  const dueWord = pluralRu(due.length, "карточка", "карточки", "карточек");
  const body = due.length
    ? `
      <div class="today-list">${cardsHtml}</div>
      ${restCount > 0 ? `<p class="today-more">…и ещё ${restCount} ${pluralRu(restCount, "карточка", "карточки", "карточек")} в очереди — ответьте на эти, остальные подтянутся.</p>` : ""}
      ${weak ? `<div class="today-weak"><span class="study-label">Слабые главы</span><div class="today-weak-row">${weak}</div></div>` : ""}
    `
    : `<div class="today-empty"><strong>На сегодня всё повторено 💚</strong><p>${scheduled ? `Следующее повторение: ${esc(nextDue || "позже")}. Можно пройти интервью-тест или взяться за новую главу.` : "Очередь пуста — отвечайте на карточки в главах, они появятся здесь по расписанию."}</p></div>`;

  root.innerHTML = `
    <div class="today-head">
      <div>
        <span class="study-label">Учебный цикл</span>
        <h2 class="today-title">Что повторить сегодня</h2>
        <p class="today-sub">Интервальные карточки по всем главам и пробелы из интервью-теста — в одной очереди.</p>
      </div>
      <div class="today-meters" aria-label="Статус повторения">
        <div class="study-meter"><b data-today-due-count>${due.length}</b><span>${dueWord} на сегодня</span></div>
        <div class="study-meter"><b>${scheduled}</b><span>отложено</span></div>
        <div class="study-meter"><b>${all.length}</b><span>всего</span></div>
      </div>
    </div>
    ${body}
    ${all.length ? `<div class="today-actions"><a class="study-btn" href="${rel("interview-test.html")}">Интервью-тест →</a><button class="study-btn ghost" type="button" data-today-reset>Сбросить расписание</button></div>` : ""}
  `;
}

function setupCaseCards(){
  document.querySelectorAll("[data-case]").forEach(card => {
    if (card.dataset.caseReady) return;
    card.dataset.caseReady = "1";
    const feedback = card.querySelector("[data-case-feedback]");
    card.querySelectorAll("[data-case-option]").forEach(btn => {
      btn.addEventListener("click", () => {
        const ok = btn.dataset.correct === "true";
        card.querySelectorAll("[data-case-option]").forEach(option => {
          option.classList.toggle("is-correct", option.dataset.correct === "true");
          option.classList.toggle("is-wrong", option === btn && !ok);
        });
        if (feedback){
          feedback.hidden = false;
          feedback.classList.toggle("ok", ok);
          feedback.classList.toggle("bad", !ok);
          feedback.textContent = btn.dataset.feedback || (ok ? "Верно." : "Не совсем.");
        }
      });
    });
  });
}

/* ---------- тестовое собеседование ---------- */
function freshInterviewState(){ return { answers: {}, finished: false, updatedAt: 0, retry: null }; }
function getInterviewState(){
  try {
    const raw = JSON.parse(localStorage.getItem(INTERVIEW_TEST_KEY)) || {};
    return {
      answers: raw.answers && typeof raw.answers === "object" ? raw.answers : {},
      finished: !!raw.finished,
      updatedAt: raw.updatedAt || 0,
      finishedAt: raw.finishedAt || 0,
      retry: Array.isArray(raw.retry) && raw.retry.length ? raw.retry : null,
    };
  } catch(e){
    return freshInterviewState();
  }
}
// В режиме пересдачи тест показывает только ранее проваленные вопросы.
function interviewQuestions(state){
  if (state && Array.isArray(state.retry) && state.retry.length){
    const set = new Set(state.retry);
    return INTERVIEW_TEST_QUESTIONS.filter(q => set.has(q.id));
  }
  return INTERVIEW_TEST_QUESTIONS;
}
function setInterviewState(state){
  try { localStorage.setItem(INTERVIEW_TEST_KEY, JSON.stringify(state)); } catch(e){}
}
function hasInterviewAnswer(state, qid){
  return Object.prototype.hasOwnProperty.call(state.answers || {}, qid);
}
function interviewAnswer(state, qid){
  return hasInterviewAnswer(state, qid) ? Number(state.answers[qid]) : null;
}
function interviewHash(s){
  let h = 2166136261;
  for (let i = 0; i < s.length; i++){
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function shuffledInterviewOptions(q, ordinal){
  const items = q.options.map((text, idx) => ({ text, idx }));
  let seed = interviewHash(q.id || q.question || "");
  for (let i = items.length - 1; i > 0; i--){
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const j = seed % (i + 1);
    const tmp = items[i];
    items[i] = items[j];
    items[j] = tmp;
  }
  if (Number.isInteger(ordinal) && items.length){
    const target = (ordinal + Math.floor(ordinal / items.length)) % items.length;
    const current = items.findIndex(opt => opt.idx === q.answer);
    if (current >= 0 && current !== target){
      const tmp = items[target];
      items[target] = items[current];
      items[current] = tmp;
    }
  }
  return items;
}
function formatInline(s){
  return esc(s).replace(/`([^`]+)`/g, "<code>$1</code>");
}
function pluralRu(n, one, few, many){
  const mod10 = Math.abs(n) % 10;
  const mod100 = Math.abs(n) % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}
function interviewRefHref(ref){
  const t = topicById(ref.topicId);
  if (!t) return "#";
  return rel(t.file) + (ref.sectionId ? `#${ref.sectionId}` : "");
}
function uniqueInterviewRefs(refs){
  const seen = new Set();
  return refs.filter(ref => {
    const key = `${ref.topicId || ""}#${ref.sectionId || ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
function interviewResult(state){
  const questions = interviewQuestions(state);
  const misses = questions.filter(q => !hasInterviewAnswer(state, q.id) || interviewAnswer(state, q.id) !== q.answer);
  const answered = questions.filter(q => hasInterviewAnswer(state, q.id)).length;
  const correct = questions.length - misses.length;
  const unanswered = questions.length - answered;
  return { questions, misses, answered, correct, unanswered, pct: Math.round(correct / questions.length * 100) };
}
function setupInterviewTest(){
  const root = document.querySelector("[data-interview-test]");
  if (!root || root.dataset.quizReady) return;
  root.dataset.quizReady = "1";

  const render = () => {
    root.innerHTML = renderInterviewTest(getInterviewState());
  };

  root.addEventListener("change", e => {
    const input = e.target.closest("[data-quiz-answer]");
    if (!input) return;
    const state = getInterviewState();
    state.answers[input.dataset.qid] = Number(input.value);
    state.finished = false;
    state.updatedAt = Date.now();
    state.finishedAt = 0;
    setInterviewState(state);
    render();
  });

  root.addEventListener("click", e => {
    const btn = e.target.closest("[data-quiz-action]");
    if (!btn) return;
    const action = btn.dataset.quizAction;
    const state = getInterviewState();

    if (action === "finish"){
      const result = interviewResult(state);
      if (!result.answered){
        showToast("Ответьте хотя бы на один вопрос");
        return;
      }
      state.finished = true;
      state.updatedAt = Date.now();
      state.finishedAt = Date.now();
      setInterviewState(state);
      render();
      if (result.unanswered) showToast(`Без ответа: ${result.unanswered}. Они попадут в пробелы.`);
      setTimeout(() => document.getElementById("quiz-results")?.scrollIntoView({ behavior:"smooth", block:"start" }), 0);
      return;
    }

    if (action === "edit"){
      state.finished = false;
      state.updatedAt = Date.now();
      state.finishedAt = 0;
      setInterviewState(state);
      render();
      return;
    }

    if (action === "retry"){
      const ids = interviewResult(state).misses.map(q => q.id);
      if (!ids.length){ showToast("Ошибок нет — пересдавать нечего"); return; }
      state.retry = ids;
      ids.forEach(id => delete state.answers[id]);
      state.finished = false;
      state.finishedAt = 0;
      state.updatedAt = Date.now();
      setInterviewState(state);
      render();
      showToast(`Пересдача: ${ids.length} ${pluralRu(ids.length, "вопрос", "вопроса", "вопросов")}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (action === "retry-exit"){
      state.retry = null;
      state.finished = false;
      state.finishedAt = 0;
      state.updatedAt = Date.now();
      setInterviewState(state);
      render();
      return;
    }

    if (action === "reset"){
      setInterviewState(freshInterviewState());
      render();
      showToast("Ответы сброшены");
    }
  });

  render();
}
function renderInterviewTest(state){
  const result = interviewResult(state);
  const total = result.questions.length;
  const questionWord = pluralRu(total, "вопрос", "вопроса", "вопросов");
  const progress = Math.round(result.answered / total * 100);
  const statusText = state.finished
    ? `${result.correct}/${total} верно`
    : `${result.answered}/${total} отвечено`;
  const finishLabel = state.finished ? "Показать пробелы" : "Завершить и показать пробелы";
  const canFinish = result.answered > 0;
  const retrying = Array.isArray(state.retry) && state.retry.length;

  return `
    ${retrying ? `<div class="quiz-retry-banner"><span>Режим пересдачи: только ${total} ${questionWord}, которые были провалены.</span><button class="study-btn ghost" type="button" data-quiz-action="retry-exit">Вернуться ко всем вопросам</button></div>` : ""}
    <div class="quiz-panel">
      <div class="quiz-intro">
        <div>
          <span class="study-label">Интервью-тест</span>
          <p class="quiz-title">${total} ${questionWord} по ключевым главам</p>
          <p class="quiz-copy">Формат ближе к быстрому скринингу: короткий сценарий, четыре корректных варианта, один лучший ответ. Нормальный темп — 45–90 минут.</p>
        </div>
        <div class="quiz-meters" aria-label="Статус теста">
          <div class="study-meter"><b>${total}</b><span>${questionWord}</span></div>
          <div class="study-meter"><b>${result.answered}</b><span>отвечено</span></div>
          <div class="study-meter"><b>${state.finished ? result.misses.length : "—"}</b><span>пробелов</span></div>
        </div>
      </div>
      <div class="quiz-progress" aria-label="${esc(statusText)}"><i style="width:${state.finished ? result.pct : progress}%"></i></div>
      <div class="quiz-actions">
        <button class="study-btn primary" type="button" data-quiz-action="finish"${canFinish ? "" : " disabled"}>${finishLabel}</button>
        ${state.finished ? `<button class="study-btn" type="button" data-quiz-action="edit">Изменить ответы</button>` : ""}
        <button class="study-btn" type="button" data-quiz-action="reset">Сбросить</button>
      </div>
    </div>
    ${state.finished ? renderInterviewResults(state) : ""}
    <div class="quiz-list">
      ${result.questions.map((q, i) => renderInterviewQuestion(q, i, state)).join("")}
    </div>
  `;
}
function renderInterviewQuestion(q, i, state){
  const selected = interviewAnswer(state, q.id);
  const answered = selected !== null;
  const correct = answered && selected === q.answer;
  const done = state.finished;
  const titleId = `quiz-title-${q.id}`;
  const cls = ["quiz-question"];
  if (done) cls.push(correct ? "is-correct" : "is-wrong");
  const stateText = done ? (correct ? "Верно" : (answered ? "Пробел" : "Без ответа")) : q.level;

  return `
    <div class="${cls.join(" ")}" role="group" aria-labelledby="${esc(titleId)}">
      <div class="quiz-question-title" id="${esc(titleId)}">${i + 1}. ${formatInline(q.question)}</div>
      <div class="quiz-q-meta">
        <span class="tag">${esc(q.area)}</span>
        <span class="quiz-state">${esc(stateText)}</span>
      </div>
      <div class="quiz-options">
        ${shuffledInterviewOptions(q, i).map(opt => renderInterviewOption(q, opt, selected, done)).join("")}
      </div>
      ${done ? renderInterviewFeedback(q, selected) : ""}
    </div>
  `;
}
function renderInterviewOption(q, opt, selected, done){
  const idx = opt.idx;
  const isSelected = selected === idx;
  const isCorrect = idx === q.answer;
  const cls = ["quiz-option"];
  if (isSelected) cls.push("selected");
  if (done && isCorrect) cls.push("correct");
  if (done && isSelected && !isCorrect) cls.push("wrong");
  return `
    <label class="${cls.join(" ")}">
      <input type="radio" name="${esc(q.id)}" value="${idx}" data-qid="${esc(q.id)}" data-quiz-answer${isSelected ? " checked" : ""}${done ? " disabled" : ""}>
      <span class="quiz-radio" aria-hidden="true"></span>
      <span>${formatInline(opt.text)}</span>
    </label>
  `;
}
function renderInterviewFeedback(q, selected){
  const missed = selected !== q.answer;
  const yourAnswer = selected === null ? "без ответа" : q.options[selected];
  return `
    <div class="quiz-feedback ${missed ? "bad" : "ok"}">
      <p><strong>${missed ? "Разобрать." : "Верно."}</strong> ${formatInline(q.explain)}</p>
      ${missed ? `<p class="quiz-answer-line">Ваш ответ: ${formatInline(yourAnswer)}<br>Правильно: ${formatInline(q.options[q.answer])}</p>` : ""}
      <div class="gap-links">
        ${uniqueInterviewRefs(q.refs).map(ref => `<a href="${interviewRefHref(ref)}">${esc(ref.label)}</a>`).join("")}
      </div>
    </div>
  `;
}
function renderInterviewResults(state){
  const result = interviewResult(state);
  const total = result.questions.length;
  const grade = result.pct >= 85
    ? "К собеседованию близко. Ошибки ниже всё равно стоит проговорить вслух."
    : result.pct >= 65
      ? "База есть, но пробелы уже заметны. Закройте главы из отчёта и пройдите тест заново."
      : "Сначала лучше пройти отмеченные главы. Сейчас тест показывает не точечные промахи, а слабые зоны.";
  const missesByTopic = new Map();
  result.misses.forEach(q => {
    const key = q.topicId || "misc";
    if (!missesByTopic.has(key)) missesByTopic.set(key, []);
    missesByTopic.get(key).push(q);
  });

  return `
    <div class="quiz-results" id="quiz-results" tabindex="-1">
      <div class="quiz-score">
        <div><b>${result.correct}/${total}</b><span>${result.pct}% верно</span></div>
        <p>${esc(grade)}</p>
      </div>
      ${result.misses.length
        ? `<div class="quiz-result-actions">
            <button class="study-btn primary" type="button" data-quiz-action="retry">Пересдать ошибочные (${result.misses.length})</button>
            <a class="study-btn" href="${rel("index")}#today">Открыть очередь повторения →</a>
          </div>
          <p class="quiz-queue-note">Эти ${result.misses.length} ${pluralRu(result.misses.length, "пробел", "пробела", "пробелов")} добавлены в очередь «Сегодня» на главной — с карточкой и ссылкой на параграф.</p>
          <p class="subhead">Пробелы по главам</p>
          <div class="gap-list">
            ${[...missesByTopic.entries()].map(([topicId, items]) => renderGapGroup(topicId, items, state)).join("")}
          </div>`
        : `<div class="gap-empty"><strong>Пробелов по этому проходу нет.</strong><p>Чтобы результат не был случайным, вернитесь к тесту через пару дней и попробуйте ответить без подсказок.</p></div>`}
    </div>
  `;
}
function renderGapGroup(topicId, items, state){
  const topic = topicById(topicId);
  const refs = uniqueInterviewRefs(items.flatMap(q => q.refs || []));
  const missWord = pluralRu(items.length, "ошибка", "ошибки", "ошибок");
  return `
    <article class="gap-item">
      <div class="gap-head">
        <strong>${esc(topic ? topic.title : items[0].area)}</strong>
        <span>${items.length} ${missWord}</span>
      </div>
      <div class="gap-questions">
        ${items.map(q => renderGapQuestion(q, state)).join("")}
      </div>
      <div class="gap-links">
        ${refs.map(ref => `<a href="${interviewRefHref(ref)}">${esc(ref.label)}</a>`).join("")}
      </div>
    </article>
  `;
}
function renderGapQuestion(q, state){
  const selected = interviewAnswer(state, q.id);
  const yourAnswer = selected === null ? "без ответа" : q.options[selected];
  return `
    <div class="gap-question">
      <p><strong>${formatInline(q.gap)}</strong></p>
      <p>${formatInline(q.question)}</p>
      <p class="quiz-answer-line">Ваш ответ: ${formatInline(yourAnswer)}<br>Правильно: ${formatInline(q.options[q.answer])}</p>
      <p>${formatInline(q.explain)}</p>
    </div>
  `;
}

/* ---------- подсказки по терминам («как для Незнайки») ---------- */
// Наводишь на термин / сокращение / английское слово — всплывает простое объяснение.
// Словарь — в assets/glossary.js (window.GLOSSARY = [{t:"термин", a:["алиасы"], d:"объяснение"}]).
// Подсвечиваем каждое вхождение известного термина (в тексте и в inline-коде),
// не трогая блоки кода, ссылки, заголовки и диаграммы.
let glossPop = null;
const GLOSS_SKIP = new Set(["PRE","CODE","A","SCRIPT","STYLE","SVG","H1","H2","BUTTON","NOSCRIPT","SUMMARY"]);

function normGloss(s){ return (s||"").toLowerCase().replace(/ё/g,"е").trim(); }

function buildGlossIndex(){
  const ci = new Map();   // ключи без учёта регистра
  const cs = new Map();   // короткие латинские аббревиатуры — с учётом регистра
  (window.GLOSSARY || []).forEach(entry => {
    if (!entry || !entry.t || !entry.d) return;
    const hit = { term: entry.t, def: entry.d };
    [entry.t, ...(entry.a || [])].forEach(k => {
      if (!k) return;
      const key = String(k).trim();
      if (key.length < 2) return;
      const isAbbr = key.length <= 5 && /^[A-Za-z0-9][A-Za-z0-9.+/-]*$/.test(key) && key === key.toUpperCase() && /[A-Z]/.test(key);
      if (isAbbr){ if (!cs.has(key)) cs.set(key, hit); }
      else { const nk = normGloss(key); if (nk && !ci.has(nk)) ci.set(nk, hit); }
    });
  });
  return { ci, cs };
}

function buildGlossRegex(keys, flags){
  if (!keys.length) return null;
  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const alt = keys.slice().sort((a,b) => b.length - a.length).map(esc).join("|");
  try { return new RegExp("(?<![\\p{L}\\p{N}_])(" + alt + ")(?![\\p{L}\\p{N}_])", flags); }
  catch(e){ return null; }   // старый движок без lookbehind / \p{…} — фичу просто отключаем
}

function decorateGloss(el, hit){
  el.classList.add("gloss");
  el.dataset.term = hit.term;
  el.dataset.def = hit.def;
  el.setAttribute("tabindex", "0");
  el.setAttribute("role", "note");
  el.setAttribute("aria-label", hit.term + ": " + hit.def);
}

function addGlossCandidate(list, value){
  const s = String(value || "").trim();
  if (s.length >= 2 && !list.includes(s)) list.push(s);
}

function inlineGlossCandidates(raw){
  const list = [];
  const s = String(raw || "").trim().replace(/\s+/g, " ");
  addGlossCandidate(list, s);

  const noTail = s.replace(/[?!.:;,]+$/g, "");
  addGlossCandidate(list, noTail);
  addGlossCandidate(list, noTail.replace(/[()]+$/g, ""));
  addGlossCandidate(list, noTail.replace(/<[^<>]*>/g, ""));

  const attr = noTail.match(/^([A-Za-z_][\w.-]*:[A-Za-z_][\w.-]*)\s*=/);
  if (attr) addGlossCandidate(list, attr[1]);

  const call = noTail.match(/^(@?[A-Za-z_][\w.$]*(?:\.[A-Za-z_][\w$]*)*)(?:<[^<>]*>)?\s*\(/);
  if (call){
    addGlossCandidate(list, call[1]);
    const parts = call[1].split(".");
    addGlossCandidate(list, parts[parts.length - 1]);
  }

  const generic = noTail.match(/^([A-Za-z_][\w.$]*)(?:<[^<>]+>)$/);
  if (generic) addGlossCandidate(list, generic[1]);

  const dotted = noTail.match(/^(@?[A-Za-z_][\w$]*(?:\.[A-Za-z_][\w$]*)+)$/);
  if (dotted){
    addGlossCandidate(list, dotted[1]);
    const parts = dotted[1].split(".");
    addGlossCandidate(list, parts[parts.length - 1]);
  }

  return list;
}

function lookupInlineGloss(raw, ci, cs){
  for (const key of inlineGlossCandidates(raw)){
    const hit = cs.get(key) || ci.get(normGloss(key));
    if (hit) return hit;
  }
  return null;
}

function annotateGlossary(){
  const root = document.querySelector("#content article.page");
  if (!root || !window.GLOSSARY || !window.GLOSSARY.length) return;
  const { ci, cs } = buildGlossIndex();
  const ciRe = buildGlossRegex([...ci.keys()], "giu");
  const csRe = buildGlossRegex([...cs.keys()], "gu");
  if (!ciRe && !csRe) return;

  const boxes = [...root.querySelectorAll(".section")];
  const lead = root.querySelector(".page-head .lead");
  if (lead) boxes.unshift(lead);

  boxes.forEach(box => {
    const walker = document.createTreeWalker(box, NodeFilter.SHOW_TEXT, { acceptNode(node){
      if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      let p = node.parentElement;
      while (p && p !== box.parentElement){
        if (GLOSS_SKIP.has(p.tagName) || p.classList.contains("mermaid") || p.classList.contains("gloss") || p.classList.contains("quiz-shell"))
          return NodeFilter.FILTER_REJECT;
        p = p.parentElement;
      }
      return NodeFilter.FILTER_ACCEPT;
    }});
    const nodes = []; let nd;
    while ((nd = walker.nextNode())) nodes.push(nd);
    nodes.forEach(node => annotateTextNode(node, ciRe, csRe, ci, cs));

    // inline-код, целиком совпадающий с термином → подсказка на весь <code>
    box.querySelectorAll(":not(pre) > code").forEach(code => {
      if (code.classList.contains("gloss") || code.closest("a") || code.closest(".quiz-shell")) return;
      const raw = code.textContent.trim();
      if (raw.length < 2) return;
      const hit = lookupInlineGloss(raw, ci, cs);
      if (!hit) return;
      decorateGloss(code, hit);
    });
  });

  mountGlossPop();
}

function annotateTextNode(node, ciRe, csRe, ci, cs){
  const text = node.nodeValue;
  const matches = [];
  const collect = (re, lookup) => {
    if (!re) return;
    re.lastIndex = 0; let m;
    while ((m = re.exec(text))){
      const hit = lookup(m[1]);
      if (hit) matches.push({ start: m.index, end: m.index + m[1].length, hit });
      if (m.index === re.lastIndex) re.lastIndex++;
    }
  };
  collect(csRe, k => cs.get(k));
  collect(ciRe, k => ci.get(normGloss(k)));
  if (!matches.length) return;
  matches.sort((a,b) => a.start - b.start || (b.end - b.start) - (a.end - a.start));

  const chosen = []; let lastEnd = -1;
  for (const mt of matches){
    if (mt.start < lastEnd) continue;            // без перекрытий
    chosen.push(mt);
    lastEnd = mt.end;
  }
  if (!chosen.length) return;

  const frag = document.createDocumentFragment();
  let pos = 0;
  for (const mt of chosen){
    if (mt.start > pos) frag.appendChild(document.createTextNode(text.slice(pos, mt.start)));
    const span = document.createElement("span");
    span.textContent = text.slice(mt.start, mt.end);
    decorateGloss(span, mt.hit);
    frag.appendChild(span);
    pos = mt.end;
  }
  if (pos < text.length) frag.appendChild(document.createTextNode(text.slice(pos)));
  node.parentNode.replaceChild(frag, node);
}

function positionGlossPop(el){
  const r = el.getBoundingClientRect();
  glossPop.style.maxWidth = Math.min(460, window.innerWidth - 20) + "px";
  const pw = glossPop.offsetWidth, ph = glossPop.offsetHeight;
  let left = r.left + r.width / 2 - pw / 2;
  left = Math.max(10, Math.min(left, window.innerWidth - pw - 10));
  let top = r.top - ph - 9;
  glossPop.classList.toggle("below", top < 8);
  if (top < 8) top = r.bottom + 9;             // не влезает сверху — показываем снизу
  glossPop.style.left = Math.round(left) + "px";
  glossPop.style.top = Math.round(top) + "px";
}

function mountGlossPop(){
  if (glossPop) return;
  glossPop = document.createElement("div");
  glossPop.id = "gloss-pop";
  glossPop.innerHTML = '<span class="gp-term"></span><span class="gp-def"></span>';
  document.body.appendChild(glossPop);

  const show = el => {
    glossPop.querySelector(".gp-term").textContent = el.dataset.term;
    glossPop.querySelector(".gp-def").textContent = el.dataset.def;
    glossPop._for = el;
    glossPop.classList.add("show");
    positionGlossPop(el);
  };
  const hide = () => { glossPop.classList.remove("show"); glossPop._for = null; };
  const target = e => (e.target && e.target.closest) ? e.target.closest(".gloss") : null;

  document.addEventListener("mouseover", e => { const g = target(e); if (g) show(g); });
  document.addEventListener("mouseout",  e => { const g = target(e); if (g && !(e.relatedTarget && g.contains(e.relatedTarget))) hide(); });
  document.addEventListener("focusin",   e => { const g = target(e); if (g) show(g); });
  document.addEventListener("focusout",  e => { const g = target(e); if (g) hide(); });
  document.addEventListener("click", e => {     // тач: тап показывает/прячет
    const g = target(e);
    if (g) { (glossPop.classList.contains("show") && glossPop._for === g) ? hide() : show(g); }
    else hide();
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") hide(); });
  window.addEventListener("scroll", hide, true);
  window.addEventListener("resize", hide);
}

/* ---------- init ---------- */
function init(){
  applyStoredTheme();
  watchSystemTheme();
  buildTopbar();
  initTextBookmarks();
  const page = document.body.dataset.page;
  if (page && page !== "home"){
    buildSidebar(page);
    buildBreadcrumb(page);
    buildTOC();
    buildPageFooter(page);
  } else {
    buildMindmap();
    decorateIndex();
  }
  upgradeStarred();
  highlightCode();
  renderMermaid();
  setupRunnable();
  setupStudyCards();
  setupCaseCards();
  setupTodayReview();
  setupInterviewTest();
  if (page && page !== "home") annotateGlossary();
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();
