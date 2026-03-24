# Phase 1 Research: Foundation

**Phase:** 1 — Foundation
**Requirements:** INFRA-01, INFRA-02, INFRA-03, INFRA-04, INFRA-05
**Researched:** 2026-03-24
**Confidence:** HIGH

---

## Hugo Installation (INFRA-01)

**Windows install (recommended):**
```powershell
winget install Hugo.Hugo.Extended
```
Or download the extended binary from: https://github.com/gohugoio/hugo/releases

**Verify install:**
```bash
hugo version
# Must show "extended" in output, e.g.:
# hugo v0.143.0+extended windows/amd64
```

**hugo new site in existing git repo:**
Because the repo already has files (LICENSE, README.md, MAINREADME.md), use `--force`:
```bash
hugo new site . --force
```
This creates Hugo dirs (`archetypes/`, `assets/`, `content/`, `layouts/`, `static/`, `themes/`) without overwriting existing files.

---

## Theme Submodule (INFRA-02)

**Install as git submodule (no Go toolchain required):**
```bash
git submodule add https://github.com/panr/hugo-theme-terminal themes/terminal
git submodule update --init --recursive
```

This creates `.gitmodules` file with the submodule reference. Executor must verify `.gitmodules` exists after this step.

**Archetype file:** Copy the theme's posts archetype to the project:
```bash
cp themes/terminal/archetypes/posts.md archetypes/posts.md
```

---

## hugo.toml Configuration (INFRA-03)

Full working configuration for hugo-theme-terminal, light-mode-first:

```toml
baseURL = "https://wikiepeidia.github.io/"
languageCode = "en-us"
defaultContentLanguage = "en"
theme = "terminal"
paginate = 5
title = "wikiepeidia"

[params]
  # Terminal theme params
  themeColor = "orange"        # "orange" is the light-mode-friendly palette
  fullWidthTheme = false       # false = fixed-width centered layout
  centerTheme = true
  contentTypeName = "posts"    # directory name under content/ for blog posts
  autoCover = true             # auto-generate cover from first image in post
  readingTime = true           # show reading time on posts
  showFullContent = false      # show summary (not full content) on list pages

[params.twitter]
  creator = "@wikiepeidia"

[menu]
  [[menu.main]]
    identifier = "blog"
    name = "Blog"
    url = "/posts"
    weight = 1
  [[menu.main]]
    identifier = "about"
    name = "About"
    url = "/about"
    weight = 2
  [[menu.main]]
    identifier = "github-stats"
    name = "GitHub Stats"
    url = "/github-stats"
    weight = 3

[markup]
  [markup.goldmark]
    [markup.goldmark.renderer]
      unsafe = true          # REQUIRED: allows raw HTML in .md files (GitHub stats img tags)
  [markup.highlight]
    noClasses = false        # REQUIRED: use theme's own Chroma CSS (not inline styles)
    codeFences = true
    guessSyntax = true
    lineNos = false
    style = "monokai"        # Fallback; theme overrides with its own syntax.css

[outputs]
  home = ["HTML", "RSS"]
  section = ["HTML", "RSS"]
  term = ["HTML", "RSS"]

[outputFormats]
  [outputFormats.RSS]
    mediatype = "application/rss+xml"
    baseName = "index"
```

**Critical params (must be in config):**
- `markup.goldmark.renderer.unsafe = true` — without this, `<img>` tags in Markdown are stripped
- `markup.highlight.noClasses = false` — without this, syntax highlighting ignores the theme's CSS
- `theme = "terminal"` — matches `themes/terminal/` directory name exactly

---

## .gitignore (INFRA-04)

```gitignore
# Hugo build output — never commit, CI generates this
/public/

# Hugo resource cache — can optionally commit to speed up CI, but excluded here for cleanliness
/resources/_gen/

# OS files
.DS_Store
Thumbs.db
```

---

## Conflict: Existing Files

The repo root currently has only: `LICENSE`, `README.md`, `MAINREADME.md`. None of these conflict with Hugo's directory structure. `hugo new site . --force` is safe.

`README.md` will remain untouched (Hugo doesn't use it). `MAINREADME.md` is not a Hugo-recognized file — also untouched.

---

## Light Mode Configuration

hugo-theme-terminal supports these `themeColor` values:
- `"orange"` — warm light palette (recommended for light-mode-first)
- `"pink"` — pink-tinted light palette
- `"green"` — green terminal (still readable in light)
- `"blue"` — blue-tinted

`"orange"` is the best light-mode choice — it has sufficient contrast and the cleanest look.

The theme also reads the OS `prefers-color-scheme` media query — users in dark mode will see the dark variant automatically. No manual toggle needed.

---

## Validation Architecture

**Automated checks for this phase:**
- `hugo version` output contains "extended"
- `.gitmodules` file exists and contains `url = https://github.com/panr/hugo-theme-terminal`
- `hugo.toml` contains `unsafe = true` and `noClasses = false`
- `.gitignore` contains `/public/`
- `hugo build` (or `hugo server`) exits with code 0

---

## Key Pitfalls to Avoid

| Pitfall | Prevention |
|---------|------------|
| Using regular Hugo (not Extended) | Always install Hugo Extended; verify with `hugo version` |
| Forgetting `--force` on `hugo new site` | Existing files (README.md) cause error without it |
| Submodule not initialized | Run `git submodule update --init --recursive` after add |
| `noClasses = false` missing | Syntax highlighting CSS won't load from theme |
| `unsafe = true` missing | All `<img>` tags in markdown are stripped silently |
| Committing `/public/` | Add to .gitignore before first build |
| Wrong `theme` name | Must match directory name exactly: `"terminal"` |
