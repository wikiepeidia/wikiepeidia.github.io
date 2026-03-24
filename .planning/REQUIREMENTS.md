# Requirements: wikiepeidia.github.io

**Defined:** 2026-03-24
**Core Value:** A clean, terminal-aesthetic personal site that lets visitors read blog posts and see who wikiepeidia is at a glance, with GitHub stats as a first-class feature.

## v1 Requirements

### Foundation & Infrastructure

- [ ] **INFRA-01**: Hugo Extended is installed and a new Hugo site is initialized in the repo root
- [ ] **INFRA-02**: hugo-theme-terminal is installed as a git submodule under `themes/terminal`
- [ ] **INFRA-03**: `hugo.toml` is configured with correct `baseURL`, theme, language, and all day-1 params (goldmark unsafe, syntax highlighting, RSS, sitemap)
- [ ] **INFRA-04**: `.gitignore` excludes `/public/` and `/resources/_gen/`
- [ ] **INFRA-05**: Site builds locally with `hugo server` without errors

### Deployment

- [ ] **DEPLOY-01**: GitHub Actions workflow (`hugo.yml`) builds and deploys the site on every push to `main`
- [ ] **DEPLOY-02**: GitHub Pages source is set to "GitHub Actions" in repository settings
- [ ] **DEPLOY-03**: Site is live and accessible at `https://wikiepeidia.github.io`

### Home Page

- [ ] **HOME-01**: Home page displays a short personal intro (name, tagline, brief bio)
- [ ] **HOME-02**: Home page lists the 5 most recent blog posts with title, date, and short description
- [ ] **HOME-03**: Navigation menu links to Blog, About, and GitHub Stats pages

### Blog

- [ ] **BLOG-01**: Blog section lists all posts ordered by date (newest first) with title, date, and tags
- [ ] **BLOG-02**: Individual blog post pages render with title, date, reading time, tags, and full content
- [ ] **BLOG-03**: Code blocks in posts render with syntax highlighting
- [ ] **BLOG-04**: Posts support tags; tag pages list all posts with that tag
- [ ] **BLOG-05**: RSS feed is auto-generated at `/index.xml`
- [ ] **BLOG-06**: At least one sample blog post exists (e.g., "Hello World / Site launch" post)

### About Page

- [ ] **ABOUT-01**: About page displays personal bio (ICT student, Vietnam, interests)
- [ ] **ABOUT-02**: About page displays skill/tech badges (C, Python, JS, HTML, Git, Node, MySQL, MongoDB, PostgreSQL, Linux, TensorFlow, etc.)
- [ ] **ABOUT-03**: About page displays social links (GitHub, GitLab, Twitter/X, Threads, Twitch, YouTube, Discord, Facebook)
- [ ] **ABOUT-04**: About page includes Buy Me a Coffee button/link

### GitHub Stats Page

- [ ] **STATS-01**: GitHub Stats page embeds GitHub streak stats card (`streak-stats.demolab.com`)
- [ ] **STATS-02**: GitHub Stats page embeds GitHub general stats card (`github-readme-stats.vercel.app`)
- [ ] **STATS-03**: GitHub Stats page embeds top languages card
- [ ] **STATS-04**: GitHub Stats page embeds activity graph
- [ ] **STATS-05**: GitHub Stats page embeds pacman contribution graph (SVG from wikiepeidia/wikiepeidia output branch)
- [ ] **STATS-06**: GitHub Stats page embeds random developer quote widget
- [ ] **STATS-07**: Inline HTML in markdown renders correctly (`goldmark.renderer.unsafe = true`)

### Visual & UX

- [ ] **UX-01**: Site uses a light-mode-first color scheme (terminal theme configured for light/readable palette)
- [ ] **UX-02**: Site is mobile-responsive (hugo-theme-terminal handles this by default)
- [ ] **UX-03**: Favicon is set (custom or theme default)
- [ ] **UX-04**: Site title and description are set correctly in hugo.toml for SEO meta tags

## v2 Requirements

Deferred — not in current roadmap.

### Future Features

- **V2-01**: Dark mode toggle (manual, not just OS preference)
- **V2-02**: Post comments (Giscus or similar GitHub-based)
- **V2-03**: Site search
- **V2-04**: Vietnamese language posts (bilingual support)
- **V2-05**: Projects portfolio page with cards per repo
- **V2-06**: Pre-generated GitHub stats SVGs via GitHub Actions (avoids third-party rate limits)

## Out of Scope

Explicitly excluded from v1.

| Feature | Reason |
|---------|--------|
| Comments system | Adds maintenance overhead; not needed for launch |
| Search | Overkill for a small personal blog |
| CMS / admin panel | Just markdown files; low-maintenance stance |
| Custom dark mode toggle | Browser/OS prefers-color-scheme is sufficient |
| Vietnamese content | English only; low-maintenance stance |
| Projects page | Out of scope for v1; can add later |
| Server-side features | GitHub Pages is static only |

## Traceability

Updated: 2026-03-24 (roadmap created — 4 phases, 32 requirements)

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFRA-01 | Phase 1: Foundation | Pending |
| INFRA-02 | Phase 1: Foundation | Pending |
| INFRA-03 | Phase 1: Foundation | Pending |
| INFRA-04 | Phase 1: Foundation | Pending |
| INFRA-05 | Phase 1: Foundation | Pending |
| DEPLOY-01 | Phase 2: CI/CD & Deployment | Pending |
| DEPLOY-02 | Phase 2: CI/CD & Deployment | Pending |
| DEPLOY-03 | Phase 2: CI/CD & Deployment | Pending |
| HOME-01 | Phase 3: Core Content | Pending |
| HOME-02 | Phase 3: Core Content | Pending |
| HOME-03 | Phase 3: Core Content | Pending |
| BLOG-01 | Phase 3: Core Content | Pending |
| BLOG-02 | Phase 3: Core Content | Pending |
| BLOG-03 | Phase 3: Core Content | Pending |
| BLOG-04 | Phase 3: Core Content | Pending |
| BLOG-05 | Phase 3: Core Content | Pending |
| BLOG-06 | Phase 3: Core Content | Pending |
| ABOUT-01 | Phase 3: Core Content | Pending |
| ABOUT-02 | Phase 3: Core Content | Pending |
| ABOUT-03 | Phase 3: Core Content | Pending |
| ABOUT-04 | Phase 3: Core Content | Pending |
| STATS-01 | Phase 4: GitHub Stats & Polish | Pending |
| STATS-02 | Phase 4: GitHub Stats & Polish | Pending |
| STATS-03 | Phase 4: GitHub Stats & Polish | Pending |
| STATS-04 | Phase 4: GitHub Stats & Polish | Pending |
| STATS-05 | Phase 4: GitHub Stats & Polish | Pending |
| STATS-06 | Phase 4: GitHub Stats & Polish | Pending |
| STATS-07 | Phase 4: GitHub Stats & Polish | Pending |
| UX-01 | Phase 4: GitHub Stats & Polish | Pending |
| UX-02 | Phase 4: GitHub Stats & Polish | Pending |
| UX-03 | Phase 4: GitHub Stats & Polish | Pending |
| UX-04 | Phase 4: GitHub Stats & Polish | Pending |
