# Roadmap: wikiepeidia.github.io

**Project:** Hugo personal blog — terminal aesthetic, GitHub Pages, GitHub stats
**Granularity:** Coarse (4 phases)
**Requirements:** 32 v1 requirements, 100% mapped
**Created:** 2026-03-24

---

## Phases

- [ ] **Phase 1: Foundation** — Hugo project scaffolded, terminal theme installed, hugo.toml configured, local build working
- [ ] **Phase 2: CI/CD & Deployment** — GitHub Actions pipeline live, site accessible at wikiepeidia.github.io
- [ ] **Phase 3: Core Content** — Home page, Blog section, About page, sample post, RSS feed
- [ ] **Phase 4: GitHub Stats & Polish** — Stats page with all 6 widgets, favicon, SEO meta, light-mode finish

---

## Phase Details

### Phase 1: Foundation

**Goal**: Hugo site is scaffolded locally with the terminal theme installed and all day-1 configuration correct — the build works before any content or CI is added
**Depends on**: Nothing (first phase)
**Requirements**: INFRA-01, INFRA-02, INFRA-03, INFRA-04, INFRA-05
**Success Criteria** (what must be TRUE):

  1. Running `hugo server` starts a local dev server with zero errors or warnings
  2. The site renders at `localhost:1313` using the hugo-theme-terminal layout
  3. `themes/terminal/` is a tracked git submodule (visible in `.gitmodules`)
  4. `public/` and `resources/_gen/` are excluded by `.gitignore` and do not appear in `git status`
  5. `hugo.toml` includes correct `baseURL`, theme name, goldmark `unsafe = true`, and syntax highlight config
**Plans**: 1 plan
- [ ] 01-01-PLAN.md — Initialize Hugo site, install terminal theme, write hugo.toml, verify local build

### Phase 2: CI/CD & Deployment

**Goal**: Every push to `main` triggers an automated build and deploys the site to GitHub Pages — the site is publicly live
**Depends on**: Phase 1
**Requirements**: DEPLOY-01, DEPLOY-02, DEPLOY-03
**Success Criteria** (what must be TRUE):

  1. A push to `main` triggers the `hugo.yml` GitHub Actions workflow without failure
  2. The workflow uses Hugo Extended and `submodules: recursive` checkout
  3. `https://wikiepeidia.github.io` returns the site (not a 404)
**Plans**: TBD

### Phase 3: Core Content

**Goal**: Visitors can read blog posts and learn about wikiepeidia — all primary content pages are live with correct navigation
**Depends on**: Phase 2
**Requirements**: HOME-01, HOME-02, HOME-03, BLOG-01, BLOG-02, BLOG-03, BLOG-04, BLOG-05, BLOG-06, ABOUT-01, ABOUT-02, ABOUT-03, ABOUT-04
**Success Criteria** (what must be TRUE):

  1. The home page displays a personal intro/tagline and lists the 5 most recent posts with title, date, and description
  2. The navigation menu links to Blog, About, and GitHub Stats pages
  3. `/posts/` lists all posts newest-first with title, date, and tags
  4. Opening a post shows title, date, reading time, tags, full content, and syntax-highlighted code blocks
  5. The About page shows bio, skill/tech badges, all social links, and a Buy Me a Coffee link
**Plans**: TBD
**UI hint**: yes

### Phase 4: GitHub Stats & Polish

**Goal**: The site presents a complete developer identity with all GitHub stats widgets and a polished, production-ready experience
**Depends on**: Phase 3
**Requirements**: STATS-01, STATS-02, STATS-03, STATS-04, STATS-05, STATS-06, STATS-07, UX-01, UX-02, UX-03, UX-04
**Success Criteria** (what must be TRUE):

  1. The GitHub Stats page renders all 6 widgets: streak stats, general stats, top languages, activity graph, pacman contribution graph, and random developer quote
  2. Embedded `<img>` tags in markdown render as actual images (goldmark `unsafe = true` is active end-to-end)
  3. A favicon appears in the browser tab on every page
  4. The site renders cleanly on a mobile screen (320px–768px) with no overflow or broken layout
  5. Browser tab and search-result preview show the correct site title and description
**Plans**: TBD
**UI hint**: yes

---

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 0/1 | Not started | 01-01-PLAN.md |
| 2. CI/CD & Deployment | 0/? | Not started | - |
| 3. Core Content | 0/? | Not started | - |
| 4. GitHub Stats & Polish | 0/? | Not started | - |

---

## Coverage

| Requirement Group | Phase | Count |
|-------------------|-------|-------|
| INFRA-01 – INFRA-05 | Phase 1 | 5 |
| DEPLOY-01 – DEPLOY-03 | Phase 2 | 3 |
| HOME-01 – HOME-03 | Phase 3 | 3 |
| BLOG-01 – BLOG-06 | Phase 3 | 6 |
| ABOUT-01 – ABOUT-04 | Phase 3 | 4 |
| STATS-01 – STATS-07 | Phase 4 | 7 |
| UX-01 – UX-04 | Phase 4 | 4 |
| **Total** | | **32 / 32 ✓** |
