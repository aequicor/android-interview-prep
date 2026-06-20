# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A self-contained project for preparing for an **Android developer interview** (Middle+/Senior, in Russian). It has three parts that work together:

| Path | What it is |
| --- | --- |
| `site/` | A build-less static website — the interactive study guide (HTML + one CSS + one JS file). The main deliverable. |
| `interview-prep-author/` | A Claude Code **skill** (`SKILL.md` + `references/`) that defines the authoritative contract for authoring and extending the site's content. |
| `interview-prep-author.skill` | A zip-packaged copy of that skill (the distributable bundle). Keep it in sync with the `interview-prep-author/` source if you edit the skill. |
| `ПЛАН_ПОДГОТОВКИ.md` | The long-form source prep plan (~30 KB). The site is the interactive rendering of this material; the homepage links to it. |

There is **no build, lint, test, or package manager** anywhere in this repo. Third-party libs (highlight.js, Mermaid, Google Fonts) load from CDNs at runtime.

## Running the site

Open `site/index.html` directly in a browser, or serve the `site/` folder statically so relative paths behave normally:

```bash
cd site && python -m http.server 8000   # then open http://localhost:8000/
```

Edits to `.html`/`.css`/`.js` show up on reload (mind the cache-busting note below).

## Site architecture — the big picture

**`site/assets/app.js` is the single source of truth.** Two structures at the top — the `TOPICS` array (ordered list of topic pages) and the `GROUPS` map (their categories/colors) — drive *everything* the user sees as navigation: the homepage topic grid, the SVG mind-map, the left sidebar, breadcrumbs, prev/next links, the search index, and progress counts. There is no server and no templating; all of this chrome is generated in the browser by `init()`.

**Each topic page is a thin content shell; app.js injects the chrome.** A page in `site/pages/` contains only the article body inside `#content > article.page`, plus *empty* mount points (`#sidebar`, `#toc`, `.breadcrumb`). At load, `app.js` reads `<body data-page="ID">` to know which topic is active, then builds the topbar, sidebar, breadcrumb, table-of-contents, prev/next footer, and the "mark done" button. `data-page="home"` is special-cased for `index.html`.

**The wiring contract you must keep consistent:**
- `<body data-page="X">` **must equal** the `id` of the matching `TOPICS` entry **and** the page's filename base (`NN-X.html`). A mismatch leaves the page with no sidebar highlight, breadcrumb, or prev/next.
- `TOPICS` **order matters**: it sets the mind-map node angles and the prev/next chain. `buildSidebar` groups entries by their `group` field assuming **same-group entries are contiguous** — don't interleave groups.
- The homepage hero hard-codes counts ("15 разделов", "8 блоков") in `index.html`. These are *not* derived from the data — update them by hand when adding/removing a topic or group. (The `0/15` progress stat *is* dynamic.)

**State lives in `localStorage`**, no backend:
- `aip-progress-v1` — set of completed topic ids (the "mark done" checkmarks).
- `aip-theme` — `"dark"` / `"light"`. Each page's `<head>` has a tiny inline script that applies the stored/system theme *before* first paint to avoid a flash; don't remove it.

**Other cross-file mechanics:**
- **Path resolution**: the `rel()` helper in `app.js` bridges `index.html` (at `site/` root) and topic pages (in `site/pages/`). Use it for cross-page links instead of hard-coding `../`.
- **TOC + scrollspy**: `buildTOC` auto-generates the right-hand TOC from `.section > h2` / `.section > h3` headings and tracks the active one via `IntersectionObserver`. Content only appears in the TOC if wrapped in `<section class="section">` with real headings.
- **Theming**: all colors are CSS custom properties on `:root` (dark) overridden by `[data-theme="light"]` in `site/assets/style.css`. Use the variables (`--accent`, `--panel`, `--text`, `--border`, …), never literal colors, so both themes stay correct.

## Authoring / extending content — use the skill

When the task is to **add a topic page, expand a section, or write study content**, the `interview-prep-author` skill is the authoritative spec — read it first rather than reinventing the markup:
- `interview-prep-author/SKILL.md` — the mandatory page skeleton, workflow (research facts first → build from templates → run the checklist), and the navigation-wiring steps.
- `interview-prep-author/references/components.md` — copy-paste snippets for every styled component (callout, code block, comparison table, Q&A `.qa`, `.ytcard` video card, Mermaid diagram, sources list).
- `interview-prep-author/references/review-checklist.md` — pre-submit checklist that catches the common breakages.

The hard rules from that skill that, if violated, break rendering:
- **Escape `<`, `>`, `&`** inside `<code>`/`<pre>` as `&lt; &gt; &amp;` — otherwise Kotlin generics (`List&lt;T&gt;`) are parsed as HTML tags.
- **Mermaid blocks have no leading indentation** (directive starts at column 0); quote node labels containing `(){}:,<`.
- **Videos use the `.ytcard` link card, never `<iframe>`** — some videos block embedding (error 153); the card always works and opens YouTube at a timestamp.
- **Files must end at `</html>`** with no trailing junk/NUL bytes.

After changing `app.js` or `style.css`, **bump the cache-busting version** `assets/app.js?v=YYYYMMDD-N` (currently `?v=20260620-2`) in **all** HTML files (root + every page in `site/pages/`) so browsers don't serve a stale copy.

If you edit the skill in `interview-prep-author/`, repackage `interview-prep-author.skill` (a zip of `SKILL.md` + `references/`) so the bundled copy stays current.
