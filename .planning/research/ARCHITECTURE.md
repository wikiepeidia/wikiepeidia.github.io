# Architecture Research

**Project:** wikiepeidia.github.io — Hugo personal blog  
**Theme:** hugo-theme-terminal (panr)  
**Host:** GitHub Pages  
**Researched:** 2026-03-24  
**Confidence:** HIGH (sourced from official Hugo docs + theme GitHub)

---

## Directory Structure

Hugo's standard project skeleton, with roles relevant to this site:

```
wikiepeidia.github.io/
├── .github/
│   └── workflows/
│       └── hugo.yaml          ← GitHub Actions: builds + deploys to Pages
├── archetypes/
│   └── posts.md               ← Template for new posts (copy from theme; override here)
├── assets/                    ← Preprocessed resources (Sass, CSS, JS via Hugo Pipes)
├── content/
│   ├── posts/                 ← All blog posts live here (controlled by contentTypeName)
│   │   ├── _index.md          ← Optional: section title/description for /posts list
│   │   └── my-first-post.md
│   ├── about.md               ← Standalone About page
│   └── github-stats.md        ← Standalone GitHub Stats/AIO page
├── layouts/                   ← Override theme layouts without modifying theme files
│   └── partials/
│       ├── extended_head.html ← Hook: inject custom <head> content
│       └── extended_footer.html ← Hook: inject footer content
├── static/
│   ├── style.css              ← CSS overrides (loaded automatically when using Hugo Module)
│   ├── favicon.ico
│   └── img/                   ← Images referenced in content
├── themes/                    ← Only needed if installing theme locally (not as Hugo Module)
├── public/                    ← Auto-generated on build; DO NOT commit
├── resources/                 ← Auto-generated cache; can commit to speed up CI
└── hugo.toml                  ← Main site config
```

**Key rules:**
- Files in `static/` are copied verbatim to `public/` at build time — no processing.
- Files in `assets/` go through Hugo Pipes (minification, fingerprinting, Sass).
- `layouts/` overrides take precedence over theme layouts — use this instead of editing `themes/`.
- `public/` must NOT be committed when using GitHub Actions deployment (it's the build output).

---

## Content Organization

hugo-theme-terminal uses the `contentTypeName` config param to decide what shows on the homepage list. The default value is `"posts"`.

```
content/
├── posts/                     ← Appears on homepage (index) as the post list
│   ├── _index.md              ← Optional section page (title, description metadata)
│   ├── hello-world.md
│   └── my-second-post.md
├── about.md                   ← Standalone page at /about
└── github-stats.md            ← Standalone page at /github-stats
```

**How it works:**
- Posts in `content/posts/` are listed on the homepage automatically when `contentTypeName = "posts"` is set.
- Pagination is controlled by `pagination.pagerSize` (default in theme: 5 posts per page).
- Standalone pages (`about.md`, `github-stats.md`) live at root of `content/` and are NOT listed on the homepage — they only appear if added to the nav menu.
- The theme does NOT support nested navigation menus. Menu entries are flat.

**For the GitHub Stats/AIO page:**  
Use a standalone Markdown page (`content/github-stats.md`) with embedded HTML or iframe to render stats. This fits the low-maintenance goal — just update the Markdown when needed.

---

## Post Frontmatter

The theme's official archetype (`archetypes/posts.md`) — copy this to your project's `archetypes/posts.md`:

```toml
+++
title = "{{ replace .TranslationBaseName \"-\" \" \" | title }}"
date  = "{{ .Date }}"
# dateFormat = "2006-01-02"       # Optional: per-post date format override

author        = ""
authorTwitter = ""                 # Do NOT include @
cover         = ""                 # Path to cover image, e.g. "/img/cover.jpg"
tags          = ["", ""]
keywords      = ["", ""]
description   = ""
showFullContent = false            # true = show full post on list page instead of summary
readingTime   = false              # true = show estimated reading time
hideComments  = false
+++
```

**Notes:**
- `cover` can be auto-detected: if a `cover.(jpg|png|webp)` exists in the post's page bundle (folder), it's used automatically when `autoCover = true` in config.
- `showFullContent = true` removes the "Read more" truncation on the list page.
- `tags` drive the tag taxonomy pages (e.g., `/tags/ict/`).
- `description` appears as the meta description and post excerpt.
- For a blog with infrequent posts, `readingTime = false` and `hideComments = false` are sensible defaults.

**Creating a new post:**
```bash
hugo new posts/my-post-title.md
```

---

## Standalone Pages

Standalone pages (About, GitHub Stats) are plain Markdown files at `content/<page-name>.md`.

**Minimal frontmatter for a standalone page:**
```toml
+++
title  = "About"
date   = "2024-01-01"
author = "wikiepeidia"
+++
```

Standalone pages use Hugo's built-in `single` template, which the theme styles consistently with posts.

**Registering in the nav menu** (in `hugo.toml`):
```toml
[languages.en.menu]
  [[languages.en.menu.main]]
    identifier = "about"
    name       = "About"
    url        = "/about"
  [[languages.en.menu.main]]
    identifier = "github-stats"
    name       = "GitHub Stats"
    url        = "/github-stats"
  [[languages.en.menu.main]]
    identifier = "blog"
    name       = "Blog"
    url        = "/posts"
```

**Key constraint:** the menu does NOT support nesting — all entries are top-level. If more than `showMenuItems` entries exist, a "Show more" dropdown handles the overflow.

---

## Static Assets

| Asset type | Location | Notes |
|---|---|---|
| Images for posts | `static/img/` | Referenced in Markdown as `/img/photo.jpg` |
| Cover images | `static/img/` | Or use page bundles (folder + `cover.jpg`) |
| CSS overrides | `static/style.css` | Auto-loaded by theme when using as Hugo Module |
| Favicon | `static/favicon.ico` | Placed at root of `static/` |
| robots.txt | `static/robots.txt` | Copied verbatim |
| Custom fonts | `static/fonts/` | Reference in `static/style.css` |

**CSS override pattern** (Hugo Module installation):  
Create `static/style.css` in the project root and write only the overrides needed. The theme loads this file after its own styles, so specificity rules apply. No build step needed.

```css
/* static/style.css */
:root {
  --background: #1a1a2e;   /* Example: dark navy background */
  --color: #e0e0e0;
}
```

For deeper customization (modifying theme CSS directly), clone the theme locally to `themes/terminal/` and set `theme = "terminal"` in config instead of using the Hugo Module path.

---

## Config Structure (hugo.toml)

Complete annotated `hugo.toml` for this site:

```toml
baseURL      = "https://wikiepeidia.github.io/"
languageCode = "en-us"
# theme = "terminal"  # Only needed if using local/submodule install; NOT needed for Hugo Module

pagination.pagerSize = 5  # Posts per page on the index

# Required for Hugo Chroma syntax highlighting
[markup.highlight]
  noClasses = false

# Allows raw HTML in Markdown (useful for embedding GitHub stats widgets/iframes)
[markup.goldmark.renderer]
  unsafe = true

# Image cache location — required for GitHub Actions caching to work correctly
[caches]
  [caches.images]
    dir = ":cacheDir/images"

[params]
  contentTypeName   = "posts"   # Directory name under content/ that lists on homepage
  showMenuItems     = 2         # Nav bar visible items before "Show more" overflow
  fullWidthTheme    = false     # false = centered; true = full-width terminal look
  centerTheme       = false
  autoCover         = true      # Auto-detect cover.(jpg|png|webp) in page bundles
  showLastUpdated   = false
  # readingTime     = false     # Global default; overridable per-post
  # Toc             = false     # Table of contents; overridable per-post
  # dateFormat      = "2006-01-02"

[languages]
  [languages.en]
    title    = "wikiepeidia"
    subtitle = "ICT student. Vietnam."
    keywords = "blog, ict, programming, student, vietnam"
    copyright = ""
    menuMore              = "Show more"
    readMore              = "Read more"
    readOtherPosts        = "Read other posts"
    newerPosts            = "Newer posts"
    olderPosts            = "Older posts"
    missingContentMessage = "Page not found..."
    missingBackButtonLabel = "Back to home page"
    minuteReadingTime     = "min read"
    words                 = "words"

    [languages.en.params.logo]
      logoText     = "wikiepeidia"
      logoHomeLink = "/"

    [languages.en.menu]
      [[languages.en.menu.main]]
        identifier = "about"
        name       = "About"
        url        = "/about"
      [[languages.en.menu.main]]
        identifier = "github-stats"
        name       = "GitHub"
        url        = "/github-stats"

# Theme installed as Hugo Module (recommended; avoids committing theme files)
[module]
[[module.imports]]
  path = "github.com/panr/hugo-theme-terminal/v4"
```

---

## GitHub Actions Deployment

The canonical build workflow for Hugo + GitHub Pages (from official Hugo docs, updated March 2026):

**File:** `.github/workflows/hugo.yaml`

```yaml
name: Build and deploy
on:
  push:
    branches:
      - main
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: false
defaults:
  run:
    shell: bash
jobs:
  build:
    runs-on: ubuntu-latest
    env:
      HUGO_VERSION: 0.158.0
      GO_VERSION: 1.26.1
    steps:
      - name: Checkout
        uses: actions/checkout@v6
        with:
          submodules: recursive
          fetch-depth: 0
      - name: Setup Go
        uses: actions/setup-go@v6
        with:
          go-version: ${{ env.GO_VERSION }}
          cache: false
      - name: Setup Pages
        id: pages
        uses: actions/configure-pages@v5
      - name: Install Hugo (Extended)
        run: |
          curl -sLJO "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.tar.gz"
          mkdir "${HOME}/.local/hugo"
          tar -C "${HOME}/.local/hugo" -xf "hugo_extended_${HUGO_VERSION}_linux-amd64.tar.gz"
          rm "hugo_extended_${HUGO_VERSION}_linux-amd64.tar.gz"
          echo "${HOME}/.local/hugo" >> "${GITHUB_PATH}"
      - name: Cache restore
        id: cache-restore
        uses: actions/cache/restore@v5
        with:
          path: ${{ runner.temp }}/hugo_cache
          key: hugo-${{ github.run_id }}
          restore-keys: hugo-
      - name: Build
        run: |
          hugo build \
            --gc \
            --minify \
            --baseURL "${{ steps.pages.outputs.base_url }}/" \
            --cacheDir "${{ runner.temp }}/hugo_cache"
      - name: Cache save
        uses: actions/cache/save@v5
        with:
          path: ${{ runner.temp }}/hugo_cache
          key: ${{ steps.cache-restore.outputs.cache-primary-key }}
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./public
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**One-time GitHub setup:** Repository Settings → Pages → Source → **GitHub Actions**.

> **Note:** Hugo Extended v0.90+ is required by hugo-theme-terminal. Always install the `hugo_extended` binary in CI, not `hugo`.

---

## Suggested Build Order

Build in this sequence to validate each layer before adding the next:

| Step | Task | Why first |
|---|---|---|
| **1** | Init Hugo project + `hugo.toml` | Everything depends on a valid config |
| **2** | Install theme as Hugo Module (`go.mod` + `hugo mod get`) | Theme must resolve before `hugo server` works |
| **3** | Set up GitHub Actions workflow + push to GitHub | Verify CI pipeline before any content exists; catch config errors early |
| **4** | Create `content/about.md` + add to menu | Validates theme renders standalone pages correctly |
| **5** | Create first post in `content/posts/` | Validates homepage list, pagination, post template |
| **6** | Add `static/style.css` overrides (colors, fonts) | Style after confirming structure works |
| **7** | Create `content/github-stats.md` with embedded stats | Depends on `[markup.goldmark.renderer] unsafe = true` being set in step 1 |
| **8** | Add cover images, favicons, robots.txt to `static/` | Polish; non-blocking |

**Rationale for this order:**
- Deploy infra first (steps 1–3) so every subsequent commit is automatically published. No manual deploy steps once this is set up.
- Standalone pages (step 4) before posts because they're simpler — they confirm the theme loads without content complexity.
- CSS last because structural problems are harder to spot when mixed with styling changes.
- GitHub Stats page last because it requires `unsafe = true` in Goldmark (which must already be in `hugo.toml` from step 1 to be safe).

---

## Sources

- Hugo official directory structure docs: https://gohugo.io/getting-started/directory-structure/ (updated March 11, 2026) — **HIGH confidence**
- Hugo GitHub Pages deployment: https://gohugo.io/host-and-deploy/host-on-github-pages/ (updated March 16, 2026) — **HIGH confidence**
- hugo-theme-terminal README: https://github.com/panr/hugo-theme-terminal — **HIGH confidence**
- hugo-theme-terminal archetype: https://github.com/panr/hugo-theme-terminal/blob/master/archetypes/posts.md — **HIGH confidence**
- hugo-theme-terminal exampleSite config.toml: https://github.com/panr/hugo-theme-terminal/blob/master/exampleSite/config.toml — **HIGH confidence**
- hugo-theme-terminal exampleSite about.md: https://github.com/panr/hugo-theme-terminal/blob/master/exampleSite/content/about.md — **HIGH confidence**
