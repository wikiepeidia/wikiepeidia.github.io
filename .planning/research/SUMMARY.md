# Project Research Summary

**Project:** wikiepeidia.github.io — Hugo Personal Blog
**Domain:** Static site / personal developer blog on GitHub Pages
**Researched:** 2026-03-24
**Confidence:** HIGH

## Executive Summary

This is a Hugo-based static site targeting GitHub Pages, styled with the `hugo-theme-terminal` (panr) theme. The research confirms a well-worn, low-maintenance pattern: Hugo Extended generates the site at push time via GitHub Actions; the theme is installed as a git submodule; content lives in `content/posts/` Markdown files. No database, no server, no CMS. The entire stack is free, fast, and requires almost zero ongoing maintenance once the CI pipeline is working.

The recommended approach is to stand up the deployment pipeline first (before writing any content), validate it with a placeholder post, then layer in standalone pages (About, GitHub Stats) and styling overrides. All table-stakes features — RSS, sitemap, SEO meta, mobile layout, reading time, syntax highlighting — come for free from Hugo + the theme with minimal config. The GitHub Stats page is a low-effort differentiator: a single Markdown file with `<img>` tags pointing to hosted SVG APIs.

The primary risks are configuration day-1 errors that silently break things: forgetting `submodules: recursive` in the GitHub Actions checkout, using the regular Hugo binary instead of Extended, leaving `baseURL = "/"`, and having `markup.goldmark.renderer.unsafe = false` (default) which strips all embedded HTML without any error. A secondary risk specific to this project is the non-ASCII path (`bài tập/tin học`) on Windows — always `cd` into the workspace root before running any Hugo or Git command.

---

## Key Findings

### Recommended Stack

Hugo Extended is the only viable choice for this theme; the standard edition lacks SCSS transpilation and hard-fails at build time. The theme must be installed as a git submodule (not Hugo Modules) to avoid requiring Go toolchain. GitHub Actions is the correct deployment mechanism for GitHub Pages in 2026; branch-based deploys are legacy.

**Core technologies:**

| Technology | Purpose | Why Recommended |
|---|---|---|
| Hugo Extended v0.128+ | Static site generator | Required by theme for SCSS; Extended binary mandatory |
| hugo-theme-terminal v3.x (panr) | Theme | Terminal aesthetic; active maintenance; light mode supported |
| Git submodule | Theme installation | No Go toolchain needed; more predictable than Hugo Modules for this theme |
| GitHub Actions | Build + deploy | Official approach for GitHub Pages 2026; zero-maintenance after setup |
| `actions/checkout@v4` + `submodules: recursive` | CI checkout | Required for theme submodule to be present in CI |
| Hugo Chroma | Syntax highlighting | Built-in, zero config, 250+ languages |
| Goldmark with `unsafe = true` | HTML in Markdown | Required for embedding `<img>` widget tags |

> See [STACK.md](.planning/research/STACK.md) for full workflow YAML and widget URL table.

---

### Expected Features

**Must have (table stakes) — all ship free with Hugo + theme:**

| Feature | How it ships |
|---|---|
| Clean nav bar | `[languages.en.menu.main]` entries in `hugo.toml` |
| Blog listing page | `content/posts/` + `contentTypeName = "posts"` |
| Individual post pages | Native Hugo single template |
| Mobile-responsive layout | Theme-provided |
| Post dates | `.Date` front matter field |
| SEO meta / Open Graph | Theme includes; Hugo has built-in SEO template |
| RSS feed at `/index.xml` | Hugo auto-generates — zero work |
| Sitemap at `/sitemap.xml` | Hugo auto-generates — zero work |
| About page | `content/about.md` + menu entry |
| 404 page | Hugo generates `404.html`; GitHub Pages serves it automatically |

**Should have (differentiators) — low effort, high value:**

- **GitHub Stats page** — unique developer identity; single `content/github-stats.md` with `<img>` tags
- **Tags taxonomy** — one line per post (`tags: ["gaming", "dev"]`); Hugo generates all listing pages
- **Reading time** — Hugo built-in `{{ .ReadingTime }}`; one template line
- **Table of contents** — Hugo built-in `{{ .TableOfContents }}`; useful for long dev posts
- **Syntax highlighting** — already on by default via Chroma; configure style in `hugo.toml`
- **Pacman/snake contribution graph** — pre-generated SVG committed via existing GitHub Actions workflow

**Defer to v2+:**

- Comments (Giscus/Disqus) — adds tracking/friction; link to GitHub Discussions instead
- Search (Fuse.js, Algolia) — overkill for small blog; tags + browser Ctrl+F is sufficient
- Newsletter / email subscription — GDPR overhead, no ROI at this scale
- Social share buttons — dated UX; native OS share covers this
- CMS integration — defeats the low-maintenance goal
- Categories AND tags — redundant; use tags only

> See [FEATURES.md](.planning/research/FEATURES.md) for full feature analysis and widget embedding guide.

---

### Architecture Approach

Hugo's standard directory layout applies directly. All content is flat Markdown in `content/`; posts go in `content/posts/` to match `contentTypeName = "posts"` (the homepage auto-lists this directory). Standalone pages (About, GitHub Stats) live at `content/<page>.md` and are added to the nav menu. Theme overrides go in `layouts/partials/` — never edit theme files directly. CSS overrides go in `static/style.css`. The built `public/` directory must never be committed.

**Major components and their roles:**

| Component | Location | Responsibility |
|---|---|---|
| Hugo config | `hugo.toml` | All site settings, theme params, menu, languages |
| Blog content | `content/posts/*.md` | All blog posts |
| Standalone pages | `content/about.md`, `content/github-stats.md` | About + GitHub Stats |
| Theme | `themes/terminal/` (submodule) | All rendering logic + styles |
| Layout overrides | `layouts/partials/extended_head.html` | Custom `<head>` injections |
| CSS overrides | `static/style.css` | Light mode palette, font, layout tweaks |
| CI/CD | `.github/workflows/hugo.yaml` | Build + deploy to GitHub Pages on every push |
| Static assets | `static/img/`, `static/favicon.ico` | Images, favicon, robots.txt |

**Key patterns:**
- Never edit `themes/terminal/` directly — override via `layouts/`
- Never commit `public/` or `resources/` — CI regenerates them
- Menu is flat only — no nested navigation
- `[languages.en.menu.main]` block required for menus (not `[[menu.main]]`)

> See [ARCHITECTURE.md](.planning/research/ARCHITECTURE.md) for complete annotated `hugo.toml` and GitHub Actions workflow YAML.

---

### Critical Pitfalls

**Top pitfalls to avoid — in priority order:**

1. **Hugo Extended not installed in CI (DP-5)** — Using the standard `hugo` binary instead of `hugo_extended` causes a hard build failure. Always download `hugo_extended_*` in the Actions workflow.

2. **`submodules: recursive` missing from checkout (DP-4 / SP-1)** — Both local clones and the CI checkout must include submodule initialization. Without this, the theme directory is empty and Hugo fails with "module not found".

3. **`baseURL = "/"` in production (DP-1)** — Breaks RSS, canonical tags, OG, and sitemaps. Use `--baseURL "${{ steps.pages.outputs.base_url }}/"` in the CI build command; do not hardcode in `hugo.toml`.

4. **`markup.goldmark.renderer.unsafe = false` (GS-2 / CM-1)** — Default Hugo setting silently strips all raw HTML from Markdown. GitHub stats `<img>` tags and any custom HTML disappear without error. Set `unsafe = true` in `hugo.toml` from day 1.

5. **`markup.highlight.noClasses = false` missing (SP-5)** — Theme ships its own Chroma CSS. Without `noClasses = false`, Hugo emits inline styles that override the theme stylesheet, breaking syntax highlighting colors.

6. **`pagination.pagerSize` vs deprecated `paginate` key (SP-3)** — Hugo ≥ 0.128 deprecated the old `paginate = 5` top-level key. Use `[pagination] pagerSize = 5` instead.

7. **Windows path with non-ASCII characters (WD-4)** — This project is at a path containing Vietnamese characters and spaces. Always `cd` into the project root before any Hugo or Git command; never rely on absolute path references in scripts.

8. **GitHub Pages source not set to "GitHub Actions" (DP-2)** — One-time manual step: Settings → Pages → Source → GitHub Actions. Must be done before the first workflow push or the deploy step silently fails.

> See [PITFALLS.md](.planning/research/PITFALLS.md) for full details including Windows Defender exclusions (WD-1) and `.gitattributes` CRLF setup (WD-2).

---

## Implications for Roadmap

Based on combined research, a 4-phase structure is recommended. The architecture research provides an explicit ordered build sequence that strongly informs phase groupings.

---

### Phase 1: Foundation — Hugo Project + Theme + Config

**Rationale:** Everything depends on a valid `hugo.toml` and a working theme. All day-1 config values must be set correctly before any content is written, because wrong settings (e.g., `noClasses`, `unsafe`, deprecated keys) silently corrupt later work.

**Delivers:**
- Initialized Hugo project with `hugo.toml` fully configured
- hugo-theme-terminal installed as git submodule
- `.gitignore` with `public/` and `resources/` excluded
- `.gitattributes` with LF enforcement
- `hugo server` working locally

**Key config values to get right here:**
```toml
baseURL      = "https://wikiepeidia.github.io/"
languageCode = "en-us"
theme        = "terminal"

[pagination]
  pagerSize = 5

[markup.highlight]
  noClasses  = false
  style      = "dracula"
  codeFences = true

[markup.goldmark.renderer]
  unsafe = true

[params]
  contentTypeName = "posts"
  showMenuItems   = 2
  autoCover       = true

[languages.en]
  title    = "wikiepeidia"
  subtitle = "ICT student. Vietnam."
  # ... full [languages.en] block from ARCHITECTURE.md
```

**Avoids:** SP-3 (deprecated paginate), SP-5 (noClasses), GS-2/CM-1 (unsafe HTML stripping), TP-2 (contentTypeName mismatch), TP-3 (language/menu block structure), WD-2 (CRLF), WD-4 (path awareness)

**Research flag:** Standard patterns — skip phase research.

---

### Phase 2: CI/CD — GitHub Actions Deploy Pipeline

**Rationale:** Deploy infrastructure should be proven before any content exists. This way every subsequent commit auto-publishes with zero manual steps, and CI failures are isolated from content issues.

**Delivers:**
- `.github/workflows/hugo.yaml` with Hugo Extended, `submodules: recursive`, dynamic `--baseURL`
- GitHub Pages → Source → GitHub Actions configured (one-time manual step)
- First successful deployment of a placeholder site
- `id-token: write` permissions in workflow

**Avoids:** DP-1 (baseURL), DP-2 (Pages source), DP-3 (public/ committed), DP-4 (checkout submodules), DP-5 (Extended edition), DP-6 (id-token permission)

**Research flag:** Standard patterns — the official Hugo docs GitHub Pages workflow YAML from ARCHITECTURE.md is ready to copy verbatim. Skip phase research.

---

### Phase 3: Core Content — About + Blog Posts

**Rationale:** With the theme and deploy pipeline confirmed working, content is next. About page first (simpler, no list logic) then posts (validates homepage list, pagination, tags, reading time).

**Delivers:**
- `content/about.md` with about content and registered in nav menu
- `archetypes/posts.md` post template
- 1–2 initial blog posts in `content/posts/`
- Tags taxonomy working (`/tags/`)
- 404 page
- RSS feed and sitemap confirmed

**Implements:** All table-stakes features from FEATURES.md

**Avoids:** TP-2 (posts in correct directory), TP-3 (menu registration)

**Research flag:** Standard patterns — skip phase research.

---

### Phase 4: GitHub Stats Page + Visual Polish

**Rationale:** The GitHub Stats page is the primary differentiator for this site. It goes last because it depends on `unsafe = true` (set in Phase 1) and benefits from seeing the final typography/layout before embedding widgets.

**Delivers:**
- `content/github-stats.md` with embedded stat widgets (`<img>` tags)
- `static/style.css` light-mode palette and any font/layout overrides
- Favicon (`static/favicon.ico`)
- Pacman/snake SVG embedded (from existing GitHub Actions workflow)
- Open Graph image configuration

**Implements:** GitHub Stats page, trophy card, skill icons badges, light-mode styling

**Avoids:** GS-1 (use `<img>` not iframe; alt text for degraded state), GS-2 (unsafe already set), GS-3 (https:// URLs only)

**Research flag:** Verify widget URLs are still live at implementation time (GS-1). The `github-readme-activity-graph` URL has been unstable — double-check. Otherwise standard patterns.

---

### Phase Ordering Rationale

- **Config before content** — Day-1 config errors (noClasses, unsafe, paginate key) silently corrupt content rendering. Get config right first.
- **Deploy before content** — Confirms the pipeline works in isolation; content PRs auto-publish from first commit.
- **Standalone pages before posts** — About page is simpler (no list logic) and validates theme rendering.
- **CSS and widgets last** — Structural and pipeline problems are harder to diagnose when mixed with visual changes.

### Research Flags

| Phase | Flag | Reason |
|---|---|---|
| Phase 1 | ✅ Skip | Standard Hugo config; ARCHITECTURE.md has complete annotated `hugo.toml` |
| Phase 2 | ✅ Skip | Full workflow YAML in ARCHITECTURE.md; copy verbatim |
| Phase 3 | ✅ Skip | Standard Hugo content; front matter archetype in ARCHITECTURE.md |
| Phase 4 | ⚠️ Verify at impl time | Widget URLs may change; confirm `github-readme-activity-graph` URL is live |

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Hugo Extended requirement confirmed; official docs for GitHub Actions workflow |
| Features | HIGH | Hugo native features verified against docs; widget repos confirmed active |
| Architecture | HIGH | Sourced from official Hugo docs + theme README + exampleSite |
| Pitfalls | HIGH | All pitfalls traced to official docs or theme README; WD-4 path issue verified against this project's actual path |

**Overall confidence: HIGH**

### Gaps to Address

- **Light mode config:** `defaultTheme = "light"` and specific `colorTheme` value for the terminal theme need verification against the actual theme's `config.toml` params at implementation time. STACK.md notes MEDIUM confidence on this.
- **Widget rate limiting:** Public `github-readme-stats.vercel.app` can rate-limit. If widgets fail during Phase 4, fall back to the GitHub Actions pre-generation approach described in FEATURES.md.
- **Hugo Module vs submodule decision:** ARCHITECTURE.md shows a Hugo Module config block (`[module.imports]`); STACK.md recommends submodule. Pick one at Phase 1 and stick with it. **Recommendation: submodule** (no Go toolchain required, more portable).

---

## Day-1 Config Cheat Sheet

These values must be correct from the very first commit:

```toml
# hugo.toml
baseURL      = "https://wikiepeidia.github.io/"
theme        = "terminal"                          # for submodule install

[pagination]
  pagerSize = 5                                    # NOT deprecated `paginate = 5`

[markup.highlight]
  noClasses = false                                # REQUIRED by theme CSS

[markup.goldmark.renderer]
  unsafe = true                                    # REQUIRED for <img> stats widgets

[params]
  contentTypeName = "posts"                        # Must match content/posts/ dir name

[languages.en.menu]                                # NOT [[menu.main]] — use this structure
  [[languages.en.menu.main]]
    identifier = "about"
    name       = "About"
    url        = "/about"
```

```yaml
# .github/workflows/hugo.yaml — critical lines
- uses: actions/checkout@v4
  with:
    submodules: recursive      # REQUIRED for theme
    fetch-depth: 0

# Install hugo_extended (NOT hugo)
curl -sLJO ".../hugo_extended_${HUGO_VERSION}_linux-amd64.tar.gz"

# Pass baseURL dynamically (NOT hardcoded)
hugo build --gc --minify --baseURL "${{ steps.pages.outputs.base_url }}/"

permissions:
  contents: read
  pages: write
  id-token: write              # REQUIRED for deploy-pages action
```

---

## Sources

### Primary (HIGH confidence)
- Hugo official docs: https://gohugo.io/getting-started/directory-structure/ (updated March 11, 2026)
- Hugo GitHub Pages deploy: https://gohugo.io/host-and-deploy/host-on-github-pages/ (updated March 16, 2026)
- hugo-theme-terminal README: https://github.com/panr/hugo-theme-terminal
- hugo-theme-terminal archetype: https://github.com/panr/hugo-theme-terminal/blob/master/archetypes/posts.md
- hugo-theme-terminal exampleSite: https://github.com/panr/hugo-theme-terminal/blob/master/exampleSite/config.toml

### Secondary (MEDIUM confidence)
- github-readme-stats: https://github.com/anuradhases/github-readme-stats (~70k stars, active)
- streak-stats.demolab.com — active project, self-hosting via Vercel recommended
- skillicons.dev — static SVG, high reliability

### Tertiary (verify at implementation)
- github-readme-activity-graph: URL changed from Heroku to Vercel/Cyclic — verify at deploy time

---

*Research completed: 2026-03-24*
*Ready for roadmap: yes*
