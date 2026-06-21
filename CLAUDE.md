# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## AUTO-LOAD: skill contracts (auto-imported into context)

The skill contracts below are pulled into context **automatically** at session start via Claude Code's `@`-import — their full text is already loaded, so you do **not** need to open them with Read. They are always on for **every request** involving content (new pages, section edits, study material, конспекты, методички), even when the user doesn't say "use the skill".

@.claude/skills/interview-prep-author/SKILL.md
@.claude/skills/interview-prep-author/references/components.md
@.claude/skills/tech-author/SKILL.md
@.claude/skills/infographic-author/SKILL.md
@.claude/skills/ru-humanizer/SKILL.md

What each governs — the four skills compose: `interview-prep-author` (the first two imports) governs the markup (HTML skeleton, components, nav wiring — *where* a diagram goes), `tech-author` governs the writing (factual accuracy + no AI markers in prose and captions), `infographic-author` governs the visualization itself (*is* the diagram good), and `ru-humanizer` governs the Russian prose style (human-sounding, no AI markers).

Only the contracts above are auto-imported. Their deeper `references/` (fact-discipline, ai-markers, completeness, diagram-types, design-system, anti-slop, the review-checklists) are **not** — pull those with Read when a task actually needs them.

> Note: `@`-import is a Claude Code feature. The `AGENTS.md` mirror (for Codex) keeps the plain "read these files" instruction instead — don't copy these `@` lines there.

## What this is

A self-contained project for preparing for an **Android developer interview** (Middle+/Senior, in Russian). It has these parts that work together:

| Path | What it is |
| --- | --- |
| `site/` | A build-less static website — the interactive study guide (HTML + one CSS + one JS file). The main deliverable. |
| `.claude/skills/interview-prep-author/` | A Claude Code **skill** (`SKILL.md` + `references/`) — the markup contract for authoring pages (HTML skeleton, styled components, nav wiring). |
| `interview-prep-author.skill` | A zip-packaged copy of that skill (the distributable bundle). Keep it in sync with the `.claude/skills/interview-prep-author/` source if you edit the skill. |
| `.claude/skills/tech-author/` | A Claude Code **skill** (`SKILL.md` + `references/`) — the text-quality contract: factual accuracy (no hallucinated APIs/versions/numbers) and prose free of AI markers. Governs *what the writing says and how it reads*, independent of markup. |
| `.claude/skills/infographic-author/` | A Claude Code **skill** (`SKILL.md` + `references/`) — the visual-quality contract for diagrams/infographics: right diagram type, restraint, semantic color, hierarchy, dark/light theming, accessibility, and no AI "slop". Governs *whether the visualization is good*, independent of markup and prose. |
| `infographic-author.skill` | A zip-packaged copy of that skill (the distributable bundle). Keep it in sync with the `.claude/skills/infographic-author/` source if you edit the skill. |
| `.claude/skills/ru-humanizer/` | A Claude Code **skill** (`SKILL.md` only) — the Russian-prose style contract: strip AI-style and канцелярит so text reads as human-written. Applies to any RU prose you write or edit. Not bundled into a `.skill` zip (neither is `.claude/skills/tech-author/`). |
| `ПЛАН_ПОДГОТОВКИ.md` | The long-form source prep plan (~30 KB). The site is the interactive rendering of this material; the homepage links to it. |
| `books/` | Specialist books converted to `.md` for grep-based research (see below). The orignal PDFs live alongside. |
| `AGENTS.md` | A near-identical mirror of this file for Codex. If you change a structural fact here (counts, cache version, wiring contract), update `AGENTS.md` too so the two don't drift. |

There is **no build, lint, test, or package manager** anywhere in this repo. Third-party libs (highlight.js, Mermaid, Google Fonts) load from CDNs at runtime.

## Терминология (группа / глава / параграф)

The study material has exactly **three** structural levels. Use these names everywhere — in code comments, UI strings, the skills, and when talking to the user — and drop the legacy synonyms ("тема", "раздел", "блок", "секция", "подтема", "подзаголовок").

| Term | EN | What it is | In code / markup |
| --- | --- | --- | --- |
| **Группа** | group | An umbrella category that unites thematically-close **главы** (e.g. «Язык и проектирование», «Данные и сеть»). | An entry in the `GROUPS` map in `app.js`. Rendered as the sidebar group headers, the mind-map legend, the topic-card eyebrow, and the breadcrumb. **9** groups. |
| **Глава** | chapter | A self-contained area of study — one interview topic (e.g. «ООП и SOLID», «Язык Kotlin»). | An entry in the `TOPICS` array = one page `site/pages/*.html` carrying `<body data-page="ID">`. **21** chapters. |
| **Параграф** | paragraph | A specific topic *inside* a глава (e.g. «Null-safety», «Scope-функции»). One entry in the on-page table of contents. | A `<section class="section" id="…">` whose first child is an `<h2>`. `buildTOC` emits one TOC link per параграф. |

**Подпараграфов нет (no sub-paragraphs).** The hierarchy stops at the параграф — `группа → глава → параграф` — and nothing below it is a navigational level. Inside a параграф a minor sub-point may be set off with a run-in lead-in `<p class="subhead">…</p>`, but that is **plain text: not a heading, not a TOC entry**. Never reintroduce `<h3>`/`<h4>` as a structural sub-level. The on-page TOC is therefore single-level (параграфы only).

## «Вопрос со звёздочкой» (starred question)

A **вопрос со звёздочкой** is a deliberately advanced, often counter-intuitive question that goes at the **end of each content параграф** — one per параграф, right after its body. It targets what you rarely need in day-to-day application development but interviewers prize: the mechanism «под капотом», the non-obvious edge case, the «почему именно так» behind an API — a level *above* the baseline Middle+/Senior material in the параграф itself («то, что не требуется знать в проде, но ценят на собесе»).

- **Placement:** one per content параграф, at its end (skip the meta параграфы — `#faq`, video, tasks, sources). It lives inside the параграф's `<section>`, so it never creates a TOC entry (the TOC is built only from `.section > h2`).
- **Markup:** render it as a Q&A `.qa` card (the same component as «Частые вопросы») flagged with a `★` badge — `<span class="q-badge">★</span>` — so it reads as distinct from the collected FAQ block. No new CSS needed.
- **Bar:** it must be genuinely beyond-baseline. If a параграф has nothing worth asking above its own body, leave it out rather than padding with a filler question.

## Running the site

Open `site/index.html` directly in a browser, or serve the `site/` folder statically so relative paths behave normally:

```bash
cd site && python -m http.server 8000   # then open http://localhost:8000/
```

Edits to `.html`/`.css`/`.js` show up on reload (mind the cache-busting note below).

## Site architecture — the big picture

**`site/assets/app.js` is the single source of truth.** Two structures at the top — the `TOPICS` array (ordered list of **главы** — chapter pages) and the `GROUPS` map (the **группы** — categories/colors) — drive *everything* the user sees as navigation: the homepage chapter grid, the SVG mind-map, the left sidebar, breadcrumbs, prev/next links, the search index, and progress counts. There is no server and no templating; all of this chrome is generated in the browser by `init()`.

**Each глава page is a thin content shell; app.js injects the chrome.** A page in `site/pages/` contains only the article body inside `#content > article.page`, plus *empty* mount points (`#sidebar`, `#toc`, `.breadcrumb`). At load, `app.js` reads `<body data-page="ID">` to know which глава is active, then builds the topbar, sidebar, breadcrumb, table-of-contents, prev/next footer, and the "mark done" button. `data-page="home"` is special-cased for `index.html`.

**The wiring contract you must keep consistent:**
- `<body data-page="X">` **must equal** the `id` of the matching `TOPICS` entry, and that entry's `file` field **must equal** the page's actual filename in `site/pages/`. The filename need *not* match the `id` and carries no number prefix — e.g. id `architecture` → `architecture-di.html`, id `components` → `android-components.html`, id `storage` → `data-storage.html`. A mismatch leaves the page with no sidebar highlight, breadcrumb, or prev/next.
- `TOPICS` **order matters**: it sets the mind-map node angles and the prev/next chain. `buildSidebar` groups entries by their `group` field assuming **same-group entries are contiguous** — don't interleave groups.
- The homepage hero hard-codes counts ("21 глава", "9 групп") in `index.html`. These are *not* derived from the data — update them by hand when adding/removing a глава or группа. (The `0/21` progress stat *is* dynamic.)

**State lives in `localStorage`**, no backend:
- `aip-progress-v1` — set of completed глава ids (the "mark done" checkmarks).
- `aip-theme` — `"dark"` / `"light"`. Each page's `<head>` has a tiny inline script that applies the stored/system theme *before* first paint to avoid a flash; don't remove it.

**Other cross-file mechanics:**
- **Path resolution**: the `rel()` helper in `app.js` bridges `index.html` (at `site/` root) and глава pages (in `site/pages/`). Use it for cross-page links instead of hard-coding `../`.
- **TOC + scrollspy**: `buildTOC` auto-generates the right-hand TOC from `.section > h2` headings — one link per **параграф** (single-level; no `<h3>` sub-level) — and tracks the active one via `IntersectionObserver`. Content only appears in the TOC if wrapped in `<section class="section">` with a real `<h2>`.
- **Theming**: all colors are CSS custom properties on `:root` (dark) overridden by `[data-theme="light"]` in `site/assets/style.css`. Use the variables (`--accent`, `--panel`, `--text`, `--border`, …), never literal colors, so both themes stay correct.

## Authoring / extending content — use the skill

When the task is to **add a глава, expand a параграф, or write study content**, four skills are the authoritative spec — read them first rather than reinventing markup, prose, or diagrams. `interview-prep-author` governs the *markup*, `tech-author` governs the *writing*, `infographic-author` governs the *diagrams/infographics*, and `ru-humanizer` governs *Russian prose style*.

Markup (`interview-prep-author`):
- `.claude/skills/interview-prep-author/SKILL.md` — the mandatory page skeleton, workflow (research facts first → build from templates → run the checklist), and the navigation-wiring steps.
- `.claude/skills/interview-prep-author/references/components.md` — copy-paste snippets for every styled component (callout, code block, comparison table, Q&A `.qa`, `.ytcard` video card, Mermaid diagram, sources list).
- `.claude/skills/interview-prep-author/references/review-checklist.md` — pre-submit checklist that catches the common breakages.

Writing (`tech-author`) — apply to the prose that goes *inside* that markup, and when editing/de-slopping any draft:
- `.claude/skills/tech-author/SKILL.md` — two modes (author / vacuum out AI markers), the non-negotiable accuracy + anti-marker rules inline, and a pre-submit checklist.
- `.claude/skills/tech-author/references/fact-discipline.md` — anti-hallucination protocol; the hot zones (signatures, API levels, versions, defaults, numbers) where you must quote the source, not memory.
- `.claude/skills/tech-author/references/ai-markers.md` — full catalog of AI tells (RU lexis/syntax, structure, EN) with concrete bad→good rewrites.
- `.claude/skills/tech-author/references/completeness.md` — what makes a chapter technically complete at Middle+/Senior depth (mechanism, edge cases, trade-offs, failure modes).

Visuals (`infographic-author`) — apply when designing, adding, or fixing any diagram/infographic on a page:
- `.claude/skills/infographic-author/SKILL.md` — workflow (pick diagram type → pick engine → build to the design system → de-slop → checklist) and the non-negotiable visual minimum.
- `.claude/skills/infographic-author/references/diagram-types.md` — choosing the visualization: route on the verb, the "request → type" table, Mermaid vs hand-written SVG vs table vs chart, and when NOT to draw a diagram.
- `.claude/skills/infographic-author/references/design-system.md` — the visual contract bound to this project's tokens (semantic color from `--accent`/`--accent-2`/…, hierarchy, complexity budget, dark/light theming, accessibility, "text fits the box" math, Mermaid theming).
- `.claude/skills/infographic-author/references/anti-slop.md` — catalog of visual AI markers (rainbow color, shadows/gradients/glow, all-bold, rings for cycles, labels on arrows, decoration) with bad→good fixes.
- `.claude/skills/infographic-author/references/review-checklist.md` — pre-submit checklist: render integrity + diagram strength + theming/accessibility.

Russian style (`ru-humanizer`) — apply as the last pass over any Russian prose you wrote or edited, on top of `tech-author`:
- `.claude/skills/ru-humanizer/SKILL.md` — how to strip AI-style and канцелярит so the text reads as human-written (this is the whole skill — no `references/`).

The hard rules from that skill that, if violated, break rendering:
- **Escape `<`, `>`, `&`** inside `<code>`/`<pre>` as `&lt; &gt; &amp;` — otherwise Kotlin generics (`List&lt;T&gt;`) are parsed as HTML tags.
- **Mermaid blocks have no leading indentation** (directive starts at column 0); quote node labels containing `(){}:,<`.
- **Videos use the `.ytcard` link card, never `<iframe>`** — some videos block embedding (error 153); the card always works and opens YouTube at a timestamp.
- **Files must end at `</html>`** with no trailing junk/NUL bytes.

After changing `app.js` or `style.css`, **bump the cache-busting version** `assets/app.js?v=YYYYMMDD-N` (currently `?v=20260621-1`) in **all** HTML files (root + every page in `site/pages/`) so browsers don't serve a stale copy.

If you edit a packaged skill (`.claude/skills/interview-prep-author/` or `.claude/skills/infographic-author/`), repackage its `.skill` bundle (a zip whose top-level folder is the skill name, containing `SKILL.md` + `references/`) so the bundled copy stays current.

## Research workflow — use the books first

Three specialist books live in `books/` as full-text `.md` files (extracted from PDF, page markers preserved as `<!-- page N -->`). **Before writing any technical claim from memory, grep these files.** They are primary sources — prefer them over recall, especially for API signatures, version details, and internal mechanics.

| File | Book | What it covers |
| --- | --- | --- |
| `books/kotlin-in-action-2ed.md` | *Kotlin in Action* 2nd ed (Aigner, Elizarov et al., 2024) | Kotlin language in full — types, lambdas, coroutines basics, generics, DSLs, reflection |
| `books/kotlin-coroutines-deep-dive-2ed.md` | *Kotlin Coroutines: Deep Dive* 2nd ed (Marcin Moskała) | Coroutines internals, structured concurrency, Flow, channels, testing |
| `books/compose-internals.md` | *Jetpack Compose Internals* (Jorge Castillo) | Compose compiler, runtime, slot table, recomposition, side-effects, Snapshot system |

### How to search

```bash
# Find every mention of StateFlow with a page reference
grep -n "StateFlow" books/kotlin-coroutines-deep-dive-2ed.md | head -30

# Case-insensitive search across all books at once
grep -rni "recomposition" books/*.md | head -40

# Get surrounding context (10 lines before/after) for a match
grep -n "slot table" books/compose-internals.md | head -5
# → note the line number, then: Read books/compose-internals.md offset=<N-5> limit=30
```

### Coverage map — which book for which topic

| Topic | Primary book |
| --- | --- |
| Null-safety, type system, generics | `kotlin-in-action-2ed.md` |
| Scope functions, extension fns, DSLs | `kotlin-in-action-2ed.md` |
| Data classes, sealed classes, enums | `kotlin-in-action-2ed.md` |
| Delegation, by keyword | `kotlin-in-action-2ed.md` |
| Coroutine builders, scope, context | both coroutines books |
| Structured concurrency, cancellation | `kotlin-coroutines-deep-dive-2ed.md` |
| Flow (cold/hot), SharedFlow, StateFlow | `kotlin-coroutines-deep-dive-2ed.md` |
| Channels, select, actors | `kotlin-coroutines-deep-dive-2ed.md` |
| Coroutine testing (runTest, advanceTimeBy) | `kotlin-coroutines-deep-dive-2ed.md` |
| Compose compiler, IR plugin | `compose-internals.md` |
| Slot table, gap buffer, recompose scope | `compose-internals.md` |
| Snapshot state system, derivedStateOf | `compose-internals.md` |
| Side-effects (LaunchedEffect, rememberCoroutineScope) | `compose-internals.md` |

**Rule:** if the topic appears in this table, grep the listed book before writing. If unsure which book covers it, run `grep -rni "<keyword>" books/*.md | head -20` to find out.
