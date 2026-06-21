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

const INTERVIEW_TEST_KEY = "aip-interview-test-v1";
const INTERVIEW_TEST_QUESTIONS = [
  {
    id: "oop-solid-dependency",
    level: "Middle+",
    area: "Проектирование",
    topicId: "oop-solid",
    sectionId: "solid",
    question: "Во ViewModel внутри конструктора создаётся `RetrofitClient.create()` и конкретный `UserRepositoryImpl`. Какая проблема здесь важнее всего для собеса?",
    options: [
      "Проблема только в том, что Retrofit создаётся заново на каждый экран; если сделать его singleton, архитектура станет нормальной.",
      "ViewModel жёстко зависит от детали реализации: зависимость нельзя заменить fake-ом, а тест полезет в сеть.",
      "Достаточно вынести `RetrofitClient.create()` в `UserRepositoryImpl`, даже если сама ViewModel продолжит создавать `UserRepositoryImpl` руками.",
      "Это допустимо, если ViewModel не хранит `Context`: зависимость от конкретного репозитория не влияет на тесты."
    ],
    answer: 1,
    gap: "DIP, DI и тестируемость зависимостей.",
    explain: "ViewModel должна зависеть от абстракции, полученной снаружи. Тогда в проде придёт реальный репозиторий, а в тесте — fake или mock; сетевой клиент не размазывается по UI-слою.",
    refs: [
      { topicId: "oop-solid", sectionId: "solid", label: "ООП и SOLID → SOLID" },
      { topicId: "architecture", sectionId: "testing", label: "Архитектура и DI → Тестируемость" }
    ]
  },
  {
    id: "kotlin-platform-type",
    level: "Middle+",
    area: "Kotlin",
    topicId: "kotlin",
    sectionId: "interop",
    question: "Java-метод без nullability-аннотаций возвращает `String`, а Kotlin видит результат как platform type `String!`. Какой ответ безопаснее?",
    options: [
      "Присвоить в `String` можно, значит Kotlin уже гарантирует non-null и дополнительная проверка не нужна.",
      "Это тип с неизвестной nullability: на границе с Java значение нужно проверить или явно принять риск.",
      "Лучше сразу привести к `String?` через `as String?`: так компилятор сам найдёт все места, где Java может вернуть null.",
      "Достаточно поставить `!!` в одном месте после Java-вызова: дальше значение считается проверенным для всех будущих вызовов этого API."
    ],
    answer: 1,
    gap: "Null-safety на Java/Kotlin-границе.",
    explain: "Platform type означает, что Kotlin не знает контракт nullability. Вы можете трактовать его как nullable или non-null, но ответственность за проверку лежит на вашем коде.",
    refs: [
      { topicId: "kotlin", sectionId: "null-safety", label: "Kotlin → Null-safety" },
      { topicId: "kotlin", sectionId: "interop", label: "Kotlin → Java interop" }
    ]
  },
  {
    id: "kotlin-lateinit-check",
    level: "Middle+",
    area: "Kotlin",
    topicId: "kotlin",
    sectionId: "null-safety",
    question: "В классе есть `lateinit var presenter: Presenter`. Как корректно проверить, что свойство уже инициализировано?",
    options: [
      "`if (::presenter.isInitialized) presenter.attach()` — через property reference, без вызова функции.",
      "`if (presenter != null) presenter.attach()` — `lateinit` всё равно nullable под капотом.",
      "`if (presenter.isInitialized()) presenter.attach()` — у объекта появляется метод проверки.",
      "`if (::presenter.get() != null) presenter.attach()` — getter безопасно вернёт null до первой инициализации."
    ],
    answer: 0,
    gap: "Точный синтаксис проверки `lateinit`.",
    explain: "`lateinit`-свойство non-nullable, поэтому проверка через `!= null` не выражает контракт. Kotlin даёт property reference: `::presenter.isInitialized`. Если прочитать свойство раньше присваивания, будет `UninitializedPropertyAccessException`.",
    refs: [
      { topicId: "kotlin", sectionId: "null-safety", label: "Kotlin → Null-safety" }
    ]
  },
  {
    id: "kotlin-variance",
    level: "Senior",
    area: "Kotlin",
    topicId: "kotlin",
    sectionId: "generics",
    question: "Почему `List<Cat>` можно передать туда, где ожидается `List<Animal>`, а с `MutableList<Cat>` и `MutableList<Animal>` так делать нельзя?",
    options: [
      "`List` в Kotlin ковариантен (`out T`) и только отдаёт элементы, а `MutableList` ещё принимает `T`, поэтому инвариантен.",
      "`MutableList` запрещён только из-за JVM type erasure; на Kotlin/Native это бы работало.",
      "`List` и `MutableList` оба ковариантны, но компилятор запрещает mutable-коллекции ради производительности.",
      "Это ограничение появляется только при nullable-типах: `MutableList<Cat?>` был бы совместим."
    ],
    answer: 0,
    gap: "Variance: `out`, `in` и mutable-коллекции.",
    explain: "Ковариантный producer безопасен: из `List<Cat>` можно читать `Animal`. Mutable-коллекция ещё принимает элементы; если бы её отдали как `MutableList<Animal>`, туда можно было бы положить Dog и сломать список Cat.",
    refs: [
      { topicId: "kotlin", sectionId: "generics", label: "Kotlin → Дженерики и variance" }
    ]
  },
  {
    id: "kotlin-scope-apply-let",
    level: "Middle+",
    area: "Kotlin",
    topicId: "kotlin",
    sectionId: "scope-fns",
    question: "Нужно создать объект, настроить его свойства в блоке и вернуть сам объект: `User().___ { name = value }`. Какая scope-функция подходит и почему?",
    options: [
      "`apply`: внутри блок получает receiver `this`, а наружу возвращается исходный объект.",
      "`let`: внутри объект доступен как `it`, а наружу всегда возвращается исходный объект.",
      "`also`: внутри блок получает receiver `this`, а наружу возвращается результат последней строки.",
      "`run`: внутри объект доступен как `it`, а наружу возвращается исходный объект."
    ],
    answer: 0,
    gap: "Scope-функции: receiver/аргумент и возвращаемое значение.",
    explain: "`apply` читается как настройка объекта: блок работает с receiver `this`, а результатом всей цепочки остаётся сам receiver. `let`/`run` возвращают результат блока, `also` возвращает receiver, но передаёт его как `it`, поэтому чаще подходит для логирования и побочных действий.",
    refs: [
      { topicId: "kotlin", sectionId: "scope-fns", label: "Kotlin → Scope-функции" }
    ]
  },
  {
    id: "activity-process-death",
    level: "Middle+",
    area: "Платформа Android",
    topicId: "activity",
    sectionId: "saved-state",
    question: "После поворота экран сохраняет фильтр поиска, но после возврата из фона фильтр исчезает. Какой вывод правильный?",
    options: [
      "ViewModel переживает и поворот, и process death; ошибка точно в `onResume()`.",
      "Поворот проверяет только configuration change. Для process death нужен `SavedStateHandle`, `onSaveInstanceState` или постоянное хранилище.",
      "`onDestroy()` гарантированно вызывается перед убийством процесса, значит фильтр нужно сохранять там.",
      "Достаточно писать фильтр в поле ViewModel из `onStop()`: при восстановлении процесса Android вернёт тот же экземпляр ViewModel."
    ],
    answer: 1,
    gap: "Разница между configuration change и process death.",
    explain: "ViewModel живёт, пока жив ViewModelStore в процессе. При убийстве процесса он пропадает; восстановить можно только сериализованное или сохранённое состояние.",
    refs: [
      { topicId: "activity", sectionId: "saved-state", label: "Activity → Saved state и process death" },
      { topicId: "activity", sectionId: "failure-modes", label: "Activity → Failure modes" }
    ]
  },
  {
    id: "fragment-view-lifecycle",
    level: "Middle+",
    area: "Платформа Android",
    topicId: "fragment",
    sectionId: "fragment-lifecycle",
    question: "Во Fragment Flow собирают с lifecycle самого Fragment. Экран ушёл в back stack: `onDestroyView()` уже вызван, но новый emit пытается обновить старый binding и падает. Какая правка исправляет причину?",
    options: [
      "Оставить подписку на `this`: Fragment живёт дольше View, поэтому binding тоже будет доступен.",
      "Собирать Flow в `viewLifecycleOwner.lifecycleScope` через `repeatOnLifecycle(...)`, а binding очищать в `onDestroyView()`.",
      "Перенести сбор в `fragment.lifecycleScope` и добавить `repeatOnLifecycle(STARTED)`: lifecycle Fragment сам совпадёт со сроком жизни binding.",
      "Очищать binding в `onStop()`, а подписку оставить прежней: после `onStop()` новых emit уже не будет."
    ],
    answer: 1,
    gap: "Fragment lifecycle vs view lifecycle: `viewLifecycleOwner`.",
    explain: "Проблема не в Flow, а во владельце lifecycle. Fragment может жить без View в back stack, поэтому подписка на lifecycle Fragment переживает `onDestroyView()` и трогает мёртвый binding. UI-сбор привязывают к `viewLifecycleOwner` в `onViewCreated()`, а binding чистят в `onDestroyView()`.",
    refs: [
      { topicId: "fragment", sectionId: "fragment-lifecycle", label: "Fragment → Два lifecycle" },
      { topicId: "fragment", sectionId: "failure-modes", label: "Fragment → Failure modes" }
    ]
  },
  {
    id: "background-work-choice",
    level: "Middle+",
    area: "Платформа Android",
    topicId: "background-work",
    sectionId: "choose",
    question: "Нужно гарантированно выгрузить накопленные логи, можно подождать сеть и зарядку, точное время не важно. Что выбрать?",
    options: [
      "Foreground service: если работа важная, можно показать техническую нотификацию и держать процесс до конца выгрузки.",
      "WorkManager с constraints: работа отложенная, гарантированная и переживает перезапуск.",
      "AlarmManager exact alarm: поставить будильник на ближайшее окно, а сеть и зарядку проверить внутри callback.",
      "JobScheduler напрямую: он тоже умеет constraints, поэтому WorkManager здесь лишний слой и ничего не добавляет."
    ],
    answer: 1,
    gap: "Выбор WorkManager / FGS / AlarmManager.",
    explain: "WorkManager закрывает отложенную гарантированную работу с constraints и ретраями. FGS нужен для видимой пользователю работы прямо сейчас, AlarmManager — для точного времени.",
    refs: [
      { topicId: "background-work", sectionId: "choose", label: "Фоновая работа → Что выбирать" },
      { topicId: "components", sectionId: "workmanager", label: "Android-компоненты → WorkManager" }
    ]
  },
  {
    id: "looper-main-block",
    level: "Middle+",
    area: "Многопоточность",
    topicId: "looper-handler",
    sectionId: "anr",
    question: "В `onClick` синхронно читается большой файл, экран зависает, иногда прилетает ANR. Что здесь происходит?",
    options: [
      "`Handler.post { readFile() }` решит проблему, потому что работа станет асинхронной относительно клика.",
      "Main thread занят блокирующим I/O, очередь сообщений не обрабатывается, кадры и input ждут.",
      "Проблема в StrictMode: в release он выключен, поэтому реального ANR от файлового I/O не будет.",
      "Проблема решается заменой `Handler` на `HandlerThread`, даже если чтение всё ещё запускается из `onClick` на Main."
    ],
    answer: 1,
    gap: "Main Looper, очередь сообщений и ANR.",
    explain: "Главный поток должен быстро отдавать управление Looper. Долгий I/O на Main блокирует input, lifecycle-callbacks и кадры; тяжёлое уводят в фон и возвращают на Main только результат.",
    refs: [
      { topicId: "looper-handler", sectionId: "event-loop", label: "Looper и Handler → Event loop" },
      { topicId: "looper-handler", sectionId: "anr", label: "Looper и Handler → ANR" }
    ]
  },
  {
    id: "threads-volatile",
    level: "Senior",
    area: "Многопоточность",
    topicId: "threads",
    sectionId: "memory-model",
    question: "Поле `@Volatile var counter = 0` инкрементируют из нескольких потоков через `counter++`. Почему результат всё равно может быть неверным?",
    options: [
      "`@Volatile` даёт видимость, но `counter++` остаётся read-modify-write из нескольких операций без атомарности.",
      "`@Volatile` делает атомарными только чтение и запись поля, поэтому надо заменить `counter++` на `counter = counter + 1`.",
      "Проблема исчезнет, если читать `counter` в локальную переменную перед инкрементом: volatile-гарантия уже сработала.",
      "Нужно добавить `@Synchronized` только на getter: инкремент начнёт выполняться под монитором."
    ],
    answer: 0,
    gap: "Visibility vs atomicity в Java/Kotlin memory model.",
    explain: "Volatile гарантирует видимость и порядок чтения/записи, но не делает составную операцию атомарной. Для счётчика нужен `AtomicInteger`, lock или другая синхронизация.",
    refs: [
      { topicId: "threads", sectionId: "memory-model", label: "Потоки и память JVM → Memory model" },
      { topicId: "threads", sectionId: "cas", label: "Потоки и память JVM → CAS" }
    ]
  },
  {
    id: "executors-queue-growth",
    level: "Senior",
    area: "Многопоточность",
    topicId: "executors",
    sectionId: "growth-model",
    question: "`ThreadPoolExecutor` создан с `corePoolSize = 4`, `maximumPoolSize = 20` и неограниченной очередью. Почему под нагрузкой потоков всё равно может остаться 4?",
    options: [
      "При неограниченной очереди новые задачи встают в queue после заполнения core, поэтому пулу не нужно расти до maximum.",
      "`maximumPoolSize` сработает первым: executor всегда добирает потоки до maximum, а очередь использует только после этого.",
      "Пул не растёт, потому что `keepAliveTime` по умолчанию равен нулю и запрещает создавать non-core потоки.",
      "Чтобы пул рос до 20, достаточно вызвать `prestartAllCoreThreads()`: это запускает и core, и maximum workers."
    ],
    answer: 0,
    gap: "Модель роста ThreadPoolExecutor и роль очереди.",
    explain: "ThreadPoolExecutor сначала заполняет core, затем кладёт задачи в очередь. До maximum он растёт, когда очередь не принимает задачу; с unbounded queue этот момент может не наступить.",
    refs: [
      { topicId: "executors", sectionId: "growth-model", label: "Executor и пулы → Модель роста" },
      { topicId: "executors", sectionId: "queues", label: "Executor и пулы → Очереди" }
    ]
  },
  {
    id: "coroutines-async-await",
    level: "Middle+",
    area: "Корутины",
    topicId: "coroutines",
    sectionId: "launch-async",
    question: "В коде два сетевых запроса запускают так: `val a = async { loadA() }.await(); val b = async { loadB() }.await()`. Почему параллелизма почти нет?",
    options: [
      "`async` параллелит только CPU-задачи; сетевые suspend-функции внутри него всё равно выполняются последовательно.",
      "Первый `await()` сразу ждёт завершения первой корутины, и только потом создаётся вторая.",
      "Нужно добавить `CoroutineStart.LAZY`: ленивый старт гарантирует, что оба запроса начнутся одновременно на первом `await()`.",
      "Нужно обернуть оба вызова в `withContext(Dispatchers.IO)`: тогда порядок `await()` уже не влияет на параллелизм."
    ],
    answer: 1,
    gap: "`async/await` и реальный параллелизм.",
    explain: "Параллелизм появляется, когда обе корутины стартовали до ожидания результата: `val a = async { ... }; val b = async { ... }; a.await(); b.await()`. Немедленный await превращает код почти в последовательный.",
    refs: [
      { topicId: "coroutines", sectionId: "launch-async", label: "Корутины и Flow → launch / async" }
    ]
  },
  {
    id: "coroutines-cancellation",
    level: "Middle+",
    area: "Корутины",
    topicId: "coroutines",
    sectionId: "cancellation",
    question: "Корутина крутит тяжёлый CPU-цикл без suspend-вызовов. Scope отменили, а цикл досчитался до конца. Что забыли?",
    options: [
      "Отмена у корутин кооперативная: в CPU-цикле нужны `isActive`, `ensureActive()` или `yield()`.",
      "Нужно завернуть цикл в `NonCancellable`, чтобы отмена стала жёсткой.",
      "Нужно ловить `CancellationException` внутри цикла и продолжать: после catch корутина узнает об отмене.",
      "Нужно переключить цикл на `Dispatchers.Default`: этот dispatcher сам прерывает CPU-задачу при отмене scope."
    ],
    answer: 0,
    gap: "Кооперативная отмена и suspension points.",
    explain: "Отмена проверяется в точках приостановки или вручную. Долгий вычислительный цикл без проверок не увидит `cancel()` и продолжит работу.",
    refs: [
      { topicId: "coroutines", sectionId: "cancellation", label: "Корутины и Flow → Отмена" }
    ]
  },
  {
    id: "flow-stateflow-events",
    level: "Middle+",
    area: "Flow",
    topicId: "coroutines",
    sectionId: "flow",
    question: "ViewModel отправляет навигацию через `MutableStateFlow<NavEvent?>`. Иногда повторная навигация не приходит. Что здесь концептуально не так?",
    options: [
      "Проблема только в nullable-типе: если заменить `NavEvent?` на non-null sealed class с `Idle`, StateFlow станет событийным потоком.",
      "StateFlow представляет состояние и конфлейтит значения; одноразовые события лучше отдавать через SharedFlow/Channel.",
      "Нужно после каждого события писать `null`: это полностью гарантирует доставку двух одинаковых навигаций подряд.",
      "Нужно хранить в StateFlow список уже отправленных событий и чистить его после обработки в UI."
    ],
    answer: 1,
    gap: "StateFlow vs SharedFlow для состояния и событий.",
    explain: "StateFlow хранит текущее состояние и пропускает равные значения. Для навигации, snackbar и других one-shot событий нужен поток событий без модели «последнее состояние».",
    refs: [
      { topicId: "coroutines", sectionId: "flow", label: "Корутины и Flow → Flow" },
      { topicId: "coroutines", sectionId: "state-share-in", label: "Корутины и Flow → StateFlow / SharedFlow" }
    ]
  },
  {
    id: "stateflow-update-atomic",
    level: "Senior",
    area: "Flow",
    topicId: "coroutines",
    sectionId: "state-share-in",
    question: "Во ViewModel несколько корутин могут увеличить счётчик внутри `_uiState: MutableStateFlow<UiState>`. Какая запись безопаснее для read-modify-write?",
    options: [
      "`_uiState.update { it.copy(count = it.count + 1) }` — обновление делается атомарно через текущий value.",
      "`val current = _uiState.value; _uiState.value = current.copy(count = current.count + 1)` — одно чтение value убирает гонку.",
      "`_uiState.emit(_uiState.value.copy(count = _uiState.value.count + 1))` — suspend-вызов делает read-modify-write последовательным.",
      "`withContext(Dispatchers.Main) { _uiState.value = _uiState.value.copy(...) }` — Main dispatcher сам превращает обновление в CAS."
    ],
    answer: 0,
    gap: "Атомарное обновление `MutableStateFlow` через `update`.",
    explain: "`value = value.copy(...)` распадается на чтение и запись; две корутины могут прочитать один и тот же старый state и потерять инкремент. `update { ... }` повторяет функцию поверх актуального значения и закрывает этот read-modify-write сценарий.",
    refs: [
      { topicId: "coroutines", sectionId: "state-share-in", label: "Корутины и Flow → StateFlow / SharedFlow" }
    ]
  },
  {
    id: "flow-state-in-signature",
    level: "Middle+",
    area: "Flow",
    topicId: "coroutines",
    sectionId: "state-share-in",
    question: "Репозиторий отдаёт `Flow<List<Item>>`, а UI нужен `StateFlow<List<Item>>` во ViewModel. Какая запись ближе к канону для UI-state?",
    options: [
      "`repo.items().stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())`.",
      "`MutableStateFlow(emptyList()).also { repo.items().onEach(it::emit) }`, потому что StateFlow лучше создавать руками.",
      "`repo.items().shareIn(viewModelScope, emptyList(), SharingStarted.Eagerly)`.",
      "`repo.items().stateIn(GlobalScope, SharingStarted.Eagerly, emptyList())`, чтобы поток жил независимо от экрана."
    ],
    answer: 0,
    gap: "Синтаксис `stateIn` и параметры `scope / started / initialValue`.",
    explain: "`stateIn` превращает cold Flow в StateFlow: нужен scope жизни, стратегия старта и initial value. Для UI-state часто берут `viewModelScope + WhileSubscribed(5_000)`, чтобы пережить короткий разрыв подписки на повороте и остановить upstream при реальном уходе с экрана.",
    refs: [
      { topicId: "coroutines", sectionId: "state-share-in", label: "Корутины и Flow → StateFlow / SharedFlow" },
      { topicId: "architecture", sectionId: "reactive", label: "Архитектура и DI → Реактивный UI-state" }
    ]
  },
  {
    id: "compose-recomposition",
    level: "Senior",
    area: "Compose",
    topicId: "compose",
    sectionId: "recomposition",
    question: "Composable получает большой mutable-объект параметром, внутри меняется поле, но UI не обновляется предсказуемо. Какая мысль ближе к правде?",
    options: [
      "Если объект передан параметром, Compose увидит любую мутацию его полей при следующем кадре через snapshot-систему.",
      "Рекомпозиция опирается на чтение Compose State и стабильность параметров; обычная мутация поля может остаться невидимой.",
      "Нужно завернуть объект в `remember { mutableStateOf(obj) }`, а затем менять поля внутри него: wrapper отследит внутренние мутации.",
      "Достаточно сделать класс `data class`: Compose начнёт наблюдать за изменениями его `MutableList`-полей."
    ],
    answer: 1,
    gap: "Compose state, стабильность и границы рекомпозиции.",
    explain: "Compose инвалидирует области, которые прочитали observable state. Обычная мутация поля не становится событием для runtime; состояние надо хранить в snapshot state/Flow и передавать стабильные данные.",
    refs: [
      { topicId: "compose", sectionId: "state", label: "Jetpack Compose → State" },
      { topicId: "compose", sectionId: "recomposition", label: "Jetpack Compose → Рекомпозиция" }
    ]
  },
  {
    id: "compose-effect-key",
    level: "Middle+",
    area: "Compose",
    topicId: "compose",
    sectionId: "effects",
    question: "`LaunchedEffect(userId)` грузит профиль. Что произойдёт, когда `userId` изменится?",
    options: [
      "Старый effect продолжит работу, а новый запустится параллельно: ключ нужен только для `remember`.",
      "Старая корутина будет отменена, и effect перезапустится с новым ключом.",
      "Effect не перезапустится, но внутри него автоматически обновится захваченный `userId` через `rememberUpdatedState`.",
      "Смена ключа пересоздаст весь composable и все его родительские state, поэтому загрузка начнётся с чистого экрана."
    ],
    answer: 1,
    gap: "Ключи side-effect API в Compose.",
    explain: "Ключи задают срок жизни effect. Когда ключ меняется, Compose отменяет старую корутину и запускает новую, связанную с актуальной композицией.",
    refs: [
      { topicId: "compose", sectionId: "effects", label: "Jetpack Compose → Side effects" }
    ]
  },
  {
    id: "compose-collect-lifecycle",
    level: "Middle+",
    area: "Compose",
    topicId: "compose",
    sectionId: "viewmodel",
    question: "Composable получает `StateFlow<UiState>` из ViewModel. Какой вызов обычно выбирают на Android, чтобы сбор учитывал lifecycle экрана?",
    options: [
      "`val state by vm.state.collectAsStateWithLifecycle()`.",
      "`val state = vm.state.collect()` прямо в теле composable.",
      "`val state by vm.state.collectAsState()` — lifecycle здесь не нужен, композиции достаточно.",
      "`val state by remember { mutableStateOf(vm.state.value) }` — текущее значение уже есть, подписка не нужна."
    ],
    answer: 0,
    gap: "Lifecycle-aware сбор Flow в Compose.",
    explain: "`collectAsStateWithLifecycle()` конвертирует Flow в Compose State и останавливает сбор, когда lifecycle ниже активного состояния. Прямой `collect` в теле composable нельзя вызвать, а обычный `collectAsState()` не учитывает Android lifecycle.",
    refs: [
      { topicId: "compose", sectionId: "viewmodel", label: "Jetpack Compose → ViewModel и UDF" },
      { topicId: "coroutines", sectionId: "flow-compose", label: "Корутины и Flow → Flow + Compose" }
    ]
  },
  {
    id: "compose-derived-state-syntax",
    level: "Middle+",
    area: "Compose",
    topicId: "compose",
    sectionId: "state",
    question: "Кнопку «наверх» нужно показывать только когда `listState.firstVisibleItemIndex > 0`. Какая запись уменьшает лишние рекомпозиции при скролле?",
    options: [
      "`val showButton by remember { derivedStateOf { listState.firstVisibleItemIndex > 0 } }`.",
      "`val showButton = remember { listState.firstVisibleItemIndex > 0 }`.",
      "`val showButton = mutableStateOf(listState.firstVisibleItemIndex > 0)` без чтения `listState` дальше.",
      "`val showButton = listState.firstVisibleItemIndex > 0` в верхнем composable, чтобы Compose сам всё закешировал."
    ],
    answer: 0,
    gap: "Синтаксис `derivedStateOf` для производного Compose-state.",
    explain: "`derivedStateOf` полезен, когда исходный state меняется часто, а результат нужен реже. При скролле индекс может обновляться много раз, но булевый флаг меняется только на переходе `0 ↔ больше 0`; именно это и стоит подписать на рекомпозицию.",
    refs: [
      { topicId: "compose", sectionId: "state", label: "Jetpack Compose → State" },
      { topicId: "compose", sectionId: "perf", label: "Jetpack Compose → Производительность" }
    ]
  },
  {
    id: "compose-hilt-savedstate",
    level: "Senior",
    area: "Architecture + Compose",
    topicId: "architecture",
    sectionId: "navigation",
    question: "В Navigation Compose есть destination `composable<ProfileRoute>`. Как получить Hilt ViewModel и аргумент `userId` через `SavedStateHandle`?",
    options: [
      "В composable: `val vm: ProfileViewModel = hiltViewModel()`. Во ViewModel: `@HiltViewModel` + `@Inject constructor(savedStateHandle: SavedStateHandle, ...)`, аргумент читать через `savedStateHandle.toRoute<ProfileRoute>()` или `get`.",
      "В composable создать `SavedStateHandle()` руками и передать его в `ProfileViewModel(...)` через `remember`.",
      "Передать `userId` обычным `String` в конструктор `@HiltViewModel`; Hilt сам поймёт, что это navigation argument.",
      "Получить `backStackEntry.toRoute<ProfileRoute>()` в composable и передать `userId` в метод `vm.init(userId)` при каждой композиции."
    ],
    answer: 0,
    gap: "Compose + Hilt + `SavedStateHandle`: кто создаёт ViewModel и откуда берутся nav-аргументы.",
    explain: "В Compose с Hilt ViewModel не создают руками: `hiltViewModel()` берёт Hilt-backed factory и текущий `ViewModelStoreOwner` навигационной записи. `SavedStateHandle` Hilt/Navigation передают в конструктор, а аргументы destination читаются из него по ключу или через type-safe `toRoute<T>()`.",
    refs: [
      { topicId: "architecture", sectionId: "navigation", label: "Архитектура и DI → Navigation Compose" },
      { topicId: "architecture", sectionId: "state-survival", label: "Архитектура и DI → SavedStateHandle" },
      { topicId: "compose", sectionId: "viewmodel", label: "Jetpack Compose → ViewModel и UDF" }
    ]
  },
  {
    id: "rendering-jank",
    level: "Middle+",
    area: "UI performance",
    topicId: "rendering",
    sectionId: "jank",
    question: "Список скроллится рывками. В `onBind` синхронно декодируют bitmap и форматируют большие строки. Что это за класс проблемы?",
    options: [
      "Jank: работа на пути кадра не укладывается в бюджет, поэтому кадры пропускаются.",
      "Memory leak: старые bitmap удерживаются адаптером, поэтому каждый bind обязан запускать GC и кадр пропадает.",
      "StrictMode: он ловит тяжёлый bind и в production завершает приложение, поэтому пользователь видит рывки.",
      "GPU bottleneck: раз кадр рисуется на RenderThread, CPU-код в `onBind` не может быть основной причиной."
    ],
    answer: 0,
    gap: "Путь кадра, jank и работа на Main.",
    explain: "Кадр должен пройти input, layout/draw и отправку команд быстро. Тяжёлая работа в bind/композиции забивает Main и даёт пропущенные кадры; её выносят, кэшируют и измеряют профилировщиком.",
    refs: [
      { topicId: "rendering", sectionId: "jank", label: "Рендеринг и кадры → Jank" },
      { topicId: "rendering", sectionId: "lists", label: "Рендеринг и кадры → Списки" }
    ]
  },
  {
    id: "storage-datastore",
    level: "Middle+",
    area: "Данные",
    topicId: "storage",
    sectionId: "datastore",
    question: "Для пользовательских настроек команда выбирает между SharedPreferences и DataStore. Что обычно сильнее всего говорит в пользу DataStore?",
    options: [
      "DataStore хранит данные только в памяти, поэтому он быстрее любого файла.",
      "DataStore даёт асинхронный транзакционный API на Flow и не заставляет блокировать Main.",
      "DataStore автоматически шифрует все значения через Keystore.",
      "DataStore заменяет Room для сложных relational-запросов."
    ],
    answer: 1,
    gap: "DataStore vs SharedPreferences.",
    explain: "DataStore хорош для настроек и небольших typed/proto-данных: асинхронная запись, Flow-наблюдение и транзакционная модель. Шифрование и relational-модель — отдельные задачи.",
    refs: [
      { topicId: "storage", sectionId: "datastore", label: "Хранение данных → DataStore" },
      { topicId: "storage", sectionId: "choose", label: "Хранение данных → Что выбирать" }
    ]
  },
  {
    id: "network-retry-idempotency",
    level: "Middle+",
    area: "Сеть",
    topicId: "network",
    sectionId: "http",
    question: "Клиент не получил ответ на запрос создания платежа и хочет автоматически повторить HTTP-запрос. Какой вопрос нужно задать первым?",
    options: [
      "Есть ли у операции идемпотентный ключ или другой контракт, который защитит от двойного создания?",
      "Можно ли повторять запрос только при timeout, но не при HTTP 500: так мы точно не создадим дубль.",
      "Можно ли сделать локальный retry только один раз: одиночный повтор безопасен даже без серверной дедупликации.",
      "Можно ли заменить POST на PUT без изменения серверного контракта: сам HTTP-метод сделает операцию идемпотентной."
    ],
    answer: 0,
    gap: "Идемпотентность, retries и контракт API.",
    explain: "При сетевой ошибке клиент может не знать, дошёл ли запрос до сервера. Для небезопасных операций нужен идемпотентный ключ или серверный контракт дедупликации, иначе retry создаст дубль.",
    refs: [
      { topicId: "network", sectionId: "http", label: "Сеть → HTTP" },
      { topicId: "terminology", sectionId: "idempotency", label: "Терминология → Идемпотентность" }
    ]
  },
  {
    id: "security-keystore",
    level: "Middle+",
    area: "Безопасность",
    topicId: "security",
    sectionId: "keystore",
    question: "В приложении лежит AES-ключ строкой в коде, им шифруют токены. Почему это плохая защита?",
    options: [
      "Строковый ключ можно извлечь из APK/памяти; ключи нужно хранить через Android Keystore или не держать секрет на клиенте.",
      "Проблема только в режиме AES: если перейти на GCM, строковый ключ в APK уже не будет секретом.",
      "Достаточно включить minify и resource shrinking: после обфускации строку нельзя надёжно восстановить.",
      "Если токен дополнительно хранить в SharedPreferences, hardcoded AES-ключ становится приемлемым компромиссом."
    ],
    answer: 0,
    gap: "Модель угроз клиента и Android Keystore.",
    explain: "Клиентское приложение контролирует пользователь и атакующий с устройством. Хардкод-секреты достаются из APK или рантайма; Keystore уменьшает поверхность атаки, но не превращает клиент в доверенную среду.",
    refs: [
      { topicId: "security", sectionId: "keystore", label: "Безопасность → Keystore" },
      { topicId: "security", sectionId: "reverse", label: "Безопасность → Reverse engineering" }
    ]
  },
  {
    id: "testing-run-test",
    level: "Middle+",
    area: "Тесты",
    topicId: "testing",
    sectionId: "coroutines",
    question: "JVM-тест ViewModel падает: `Dispatchers.Main` не инициализирован, а `delay(1000)` реально ждёт секунду. Какой набор ближе к нормальному решению?",
    options: [
      "`runBlocking`, реальный `Dispatchers.IO` и `Thread.sleep(1000)`: так тест ближе к production.",
      "`runTest`, `TestDispatcher`, подмена Main через `Dispatchers.setMain()`/JUnit rule и виртуальное время.",
      "`runTest` без подмены Main: виртуальное время само создаст Android Main dispatcher в JVM.",
      "`StandardTestDispatcher` только для репозитория, а ViewModel оставить на реальном Main: так меньше тестового кода."
    ],
    answer: 1,
    gap: "Тестирование корутин и виртуальное время.",
    explain: "`runTest` даёт TestScope и виртуальное время, а MainDispatcherRule подменяет Android Main в JVM-тесте. Это делает тест быстрым и детерминированным.",
    refs: [
      { topicId: "testing", sectionId: "coroutines", label: "Тестирование → Корутины" },
      { topicId: "coroutines", sectionId: "testing", label: "Корутины и Flow → Тестирование" }
    ]
  },
  {
    id: "testing-debounce-virtual-time",
    level: "Middle+",
    area: "Тесты",
    topicId: "testing",
    sectionId: "coroutines",
    question: "В `runTest` нужно проверить `debounce(300)`: первый ввод отменяется, второй проходит. Чем промотать ожидание без реального sleep?",
    options: [
      "`advanceTimeBy(301)` и затем при необходимости `advanceUntilIdle()`.",
      "`delay(301)` внутри production ViewModel: тестовый scheduler увидит только задержки, которые запущены в самом тесте.",
      "`Thread.sleep(301)` после второго ввода: debounce использует реальный clock, даже если тест в `runTest`.",
      "`advanceUntilIdle()` сразу после первого ввода: он промотает debounce и всё равно оставит шанс отменить первый запрос вторым вводом."
    ],
    answer: 0,
    gap: "Виртуальное время в тестах корутин: `advanceTimeBy` / `advanceUntilIdle`.",
    explain: "`runTest` даёт тестовый scheduler: `advanceTimeBy` двигает виртуальные часы, а не ждёт стеночное время. Для debounce обычно перешагивают окно и затем дают очереди выполниться через `advanceUntilIdle()` или `runCurrent()`.",
    refs: [
      { topicId: "testing", sectionId: "coroutines", label: "Тестирование → Корутины" },
      { topicId: "testing", sectionId: "flow", label: "Тестирование → Flow" },
      { topicId: "coroutines", sectionId: "testing", label: "Корутины и Flow → Тестирование" }
    ]
  },
  {
    id: "gradle-ksp-kapt",
    level: "Middle+",
    area: "Сборка",
    topicId: "gradle-build",
    sectionId: "annotation",
    question: "Почему Kotlin-проект часто мигрирует annotation processing с kapt на KSP, если библиотека это поддерживает?",
    options: [
      "KSP работает с Kotlin symbols напрямую, обычно уменьшает слой Java-stub и лучше ложится на Kotlin-код.",
      "KSP полностью убирает кодогенерацию: процессоры начинают работать в runtime через reflection.",
      "KSP ускорит любой processor автоматически, даже если библиотека официально поддерживает только kapt.",
      "KSP нужен в основном для Java-only проектов; Kotlin-коду он даёт те же Java-stubs, что и kapt."
    ],
    answer: 0,
    gap: "kapt vs KSP и стоимость кодогенерации.",
    explain: "kapt строит Java-stub-слой для Java-oriented processors. KSP работает ближе к Kotlin-модели символов; миграция снижает лишнюю работу, но возможна только если конкретный processor поддерживает KSP.",
    refs: [
      { topicId: "gradle-build", sectionId: "annotation", label: "Gradle и сборка → Annotation processing" },
      { topicId: "gradle-build", sectionId: "speed", label: "Gradle и сборка → Ускорение сборки" }
    ]
  },
  {
    id: "system-design-offline",
    level: "Senior",
    area: "System design",
    topicId: "system-design",
    sectionId: "offline",
    question: "Просят спроектировать offline-first ленту. Какой каркас ответа звучит наиболее зрело?",
    options: [
      "UI всегда читает локальную БД как single source of truth, сеть синхронизирует БД, ошибки/конфликты и freshness показываются явно.",
      "UI сначала ждёт сеть, а если запрос упал — читает Room. Так данные свежее, а offline всё равно есть.",
      "UI читает Room, но синхронизация идёт только вручную по pull-to-refresh: фоновый outbox не нужен.",
      "UI читает локальный cache как SSOT, но stale/error/conflict состояния скрываем, чтобы не усложнять экран."
    ],
    answer: 0,
    gap: "Offline-first: source of truth, синхронизация и конфликты.",
    explain: "Зрелый ответ разделяет чтение и синхронизацию: экран наблюдает локальное состояние, фоновые процессы обновляют его из сети, а продуктовые состояния stale/error/conflict не прячутся.",
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
    question: "Интервьюер просит рассказать про конфликт с коллегой. Какой ответ ближе к STAR?",
    options: [
      "Я объясню, почему коллега был неправ, и сразу перейду к выводу: теперь я заранее фиксирую договорённости.",
      "Кратко: контекст и задача, что именно сделал я, чем закончилось и какой вывод забрал в процесс.",
      "Расскажу всю историю команды: кто с кем спорил, как менялись требования и почему конфликт вообще возник.",
      "Скажу, что конфликтов не было, но были сложные обсуждения: так ответ звучит позитивнее и безопаснее."
    ],
    answer: 1,
    gap: "STAR-структура и конкретика в behavioral-ответах.",
    explain: "STAR держит ответ проверяемым: ситуация, задача, действие кандидата, результат. Интервьюеру важны вклад, trade-off и вывод, а не героический пересказ без фактов.",
    refs: [
      { topicId: "behavioral", sectionId: "star", label: "Поведенческое интервью → STAR" },
      { topicId: "behavioral", sectionId: "bank", label: "Поведенческое интервью → Банк историй" }
    ]
  }
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
        const result = btn.dataset.reviewResult || "again";
        const days = REVIEW_DELAYS[result] || REVIEW_DELAYS.again;
        const state = getReviewState();
        state[card.dataset.reviewId] = {
          due: dateKeyAfter(days),
          last: localDateKey(),
          result
        };
        setReviewState(state);
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
function freshInterviewState(){ return { answers: {}, finished: false, updatedAt: 0 }; }
function getInterviewState(){
  try {
    const raw = JSON.parse(localStorage.getItem(INTERVIEW_TEST_KEY)) || {};
    return {
      answers: raw.answers && typeof raw.answers === "object" ? raw.answers : {},
      finished: !!raw.finished,
      updatedAt: raw.updatedAt || 0,
      finishedAt: raw.finishedAt || 0,
    };
  } catch(e){
    return freshInterviewState();
  }
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
  const questions = INTERVIEW_TEST_QUESTIONS;
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

  return `
    <div class="quiz-panel">
      <div class="quiz-intro">
        <div>
          <span class="study-label">Интервью-тест</span>
          <p class="quiz-title">${total} ${questionWord} по ключевым главам</p>
          <p class="quiz-copy">Формат специально похож на быстрый скрининг: короткий вопрос, четыре варианта, один лучший ответ.</p>
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
        ? `<p class="subhead">Пробелы по главам</p>
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
  setupInterviewTest();
  if (page && page !== "home") annotateGlossary();
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();
