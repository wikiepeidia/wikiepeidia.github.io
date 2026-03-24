# wikiepeidia.github.io

## What This Is

A personal Hugo-powered GitHub Pages site for wikiepeidia (Phạm Thế Minh), an ICT student from Vietnam. It serves as a personal blog covering gaming, dev topics, and anything else worth writing about — plus an "about me" showcase with GitHub stats, contribution graphs, and social links mirroring the GitHub profile README vibe.

## Core Value

A clean, terminal-aesthetic personal site that lets visitors read blog posts and see who wikiepeidia is at a glance, with GitHub stats as a first-class feature.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Hugo site scaffolded with hugo-theme-terminal, configured for GitHub Pages deployment
- [ ] Home page with intro blurb, recent posts preview, and GitHub stats widgets
- [ ] Blog section with posts list and individual post pages
- [ ] About page with bio, skills badges, and social links
- [ ] GitHub Stats page (or integrated AIO section) with streak, general stats, top languages, activity graph, pacman graph, and random quote
- [ ] Light-mode-first design (browser/OS handles dark mode via prefers-color-scheme)
- [ ] Social links: GitHub, GitLab, Twitter/X, Threads, Twitch, YouTube, Discord, Facebook
- [ ] Site deploys automatically to wikiepeidia.github.io via GitHub Actions on push to main

### Out of Scope

- Dark mode custom toggle — browser/OS handles it automatically
- Vietnamese language support — English only, low-maintenance stance
- Comments system — out of scope for v1
- Search functionality — out of scope for v1
- Custom CMS / admin panel — just markdown files

## Context

- **Owner**: wikiepeidia (Phạm Thế Minh) — ICT student year 3, Vietnam
- **Target URL**: wikiepeidia.github.io (GitHub Pages)
- **Stack**: Hugo static site generator + hugo-theme-terminal (panr) + GitHub Actions for CI/CD
- **Blog topics**: Gaming, dev notes, project write-ups, general life stuff
- **GitHub profile already exists** at github.com/wikiepeidia with stats, badges, pacman graph — site mirrors and extends that vibe
- **Low maintenance intent**: Owner won't spend much time maintaining; keep config and theme customization minimal

## Constraints

- **Platform**: GitHub Pages — static files only, no server-side execution
- **Generator**: Hugo — pre-selected by owner
- **Theme**: hugo-theme-terminal by panr — terminal aesthetic, monospace, light-mode-first
- **Maintenance**: Keep it low — minimal external dependencies, no complex build pipelines
- **Language**: English only
- **Deployment**: Must auto-deploy on git push (GitHub Actions)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Hugo over Jekyll/Gatsby | Owner chose Hugo; fast builds, no Node dependencies | — Pending |
| hugo-theme-terminal over PaperMod/Coder | Best match for "terminal-ish" vibe described by owner; monospace aesthetic, actively maintained | — Pending |
| Light-mode-first | Owner explicitly doesn't want to maintain dark mode; rely on prefers-color-scheme | — Pending |
| English only | Owner doesn't want to maintain bilingual content | — Pending |
| GitHub Actions for deploy | Standard for GitHub Pages + Hugo; zero extra cost | — Pending |

---
*Last updated: 2026-03-24 after initialization*
