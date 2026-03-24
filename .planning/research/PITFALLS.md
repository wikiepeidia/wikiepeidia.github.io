# Pitfalls Research

**Domain:** Hugo static site + GitHub Pages personal blog
**Theme:** hugo-theme-terminal by panr
**Researched:** 2026-03-24
**Overall confidence:** HIGH (verified against official Hugo docs, theme README, GitHub Actions docs)

---

## Setup Pitfalls

### SP-1: Git Submodule Not Initialized After Clone
**What goes wrong:** Cloning the repo without `--recurse-submodules` leaves `themes/terminal/` as an empty directory. Hugo then fails at build time with:
```
Error: module "terminal" not found; either add it as a Hugo Module or store it in "[...]/themes"
```
**Why it happens:** Git submodules require explicit initialization; they are not cloned by default.
**Prevention:**
```bash
git clone --recurse-submodules https://github.com/wikiepeidia/wikiepeidia.github.io.git
# Or on an already-cloned repo:
git submodule update --init --recursive
```
**Phase:** Phase 1 (initial setup). Add to README as primary onboarding step.

---

### SP-2: Forgetting `.gitmodules` Commit
**What goes wrong:** Running `git submodule add` locally but not committing the resulting `.gitmodules` file and submodule pointer. GitHub Actions clones a repo with no submodule record and the build fails silently or with the same "module not found" error.
**Prevention:** After `git submodule add`, always run:
```bash
git add .gitmodules themes/terminal
git commit -m "add terminal theme as submodule"
```
**Phase:** Phase 1.

---

### SP-3: Wrong Hugo Config Key Names (Deprecated `paginate`)
**What goes wrong:** Using the old `paginate = 5` top-level key in `hugo.toml`/`config.toml`. Hugo ≥ 0.128.0 deprecated this in favour of `pagination.pagerSize`. The theme's own `exampleSite` was updated to reflect this (commit: "Replaced deprecated 'paginate' key with 'pagination.pagerSize'").
**Symptom:** Hugo logs a deprecation warning; pagination silently falls back to defaults in future versions.
**Prevention:** Use:
```toml
[pagination]
  pagerSize = 5
```
**Phase:** Phase 1 (config scaffolding).

---

### SP-4: `theme` Key Conflict With Hugo Modules Install
**What goes wrong:** Using the Hugo Modules installation method (`[module.imports]`) while also keeping `theme = "terminal"` in the config. The theme README warns explicitly:
> Please try to remove `theme = "terminal"` from your config file.

The two installation methods are mutually exclusive. Leaving both in causes:
```
Error: module "terminal" not found
```
**Prevention:** Pick one installation method. For submodule installs, keep `theme = "terminal"` and omit the `[module.imports]` block. For Hugo Modules installs, do the opposite.
**Phase:** Phase 1.

---

### SP-5: Missing `[markup.highlight] noClasses = false`
**What goes wrong:** hugo-theme-terminal ships its own Chroma-based syntax highlighting stylesheet. It requires Hugo's highlighter to **not** emit inline styles, relying instead on CSS classes. If `noClasses = true` (Hugo's default), inline styles override the theme stylesheet and syntax colors break.
**Prevention:** Add to config:
```toml
[markup.highlight]
  noClasses = false
```
The theme README calls this out as required.
**Phase:** Phase 1.

---

## Deployment Pitfalls

### DP-1: `baseURL` Left as `/` in Production
**What goes wrong:** The theme README example uses `baseurl = "/"` for local dev. If deployed to GitHub Pages with this value, all absolute URLs (RSS, canonical tags, Open Graph, sitemaps) are broken. Internal links may work but feed readers and SEO tools break.
**Prevention:** In the GitHub Actions workflow, pass `--baseURL` dynamically:
```yaml
- name: Build the site
  run: |
    hugo build --gc --minify \
      --baseURL "${{ steps.pages.outputs.base_url }}/"
```
The `actions/configure-pages@v5` step provides the correct base URL automatically. Never hardcode `baseurl` in `hugo.toml` for a GitHub Pages deployment.
**Phase:** Phase 2 (CI/CD setup). Critical.

---

### DP-2: Pages Source Not Set to "GitHub Actions"
**What goes wrong:** GitHub Pages defaults to "Deploy from a branch" (usually `gh-pages` or `main`). If not switched to "GitHub Actions" in repo Settings → Pages, pushes that trigger the Actions workflow will build successfully but deploy to the wrong source — or the deployment step fails with a 403/permission error.
**Symptom:** Actions workflow shows green build but the site does not update, or `actions/deploy-pages` step fails.
**Prevention:** Before the first deployment, go to Settings → Pages → Source → select **GitHub Actions**. This is a one-time manual step; it cannot be automated via the workflow file.
**Phase:** Phase 2. Must be done before first workflow push.

---

### DP-3: `public/` Folder Committed to the Repo
**What goes wrong:** Running `hugo` locally generates a `public/` directory. If committed to the repo, this creates a conflict with the GitHub Actions workflow (which also generates `public/`), bloats the repo with built artifacts, and can cause stale HTML to be served if the workflow fails to run.
**Prevention:** Ensure `.gitignore` contains:
```
/public/
/resources/
```
Both are generated directories; neither should be tracked.
**Phase:** Phase 1 (initial `.gitignore` setup).

---

### DP-4: GitHub Actions Checkout Without `submodules: recursive`
**What goes wrong:** The default `actions/checkout` step does not initialize submodules. The theme directory is empty during the Actions build, causing the same "module not found" error that occurs locally when cloning without `--recurse-submodules`.
**Prevention:** The checkout step in the workflow must be:
```yaml
- uses: actions/checkout@v4
  with:
    submodules: recursive
    fetch-depth: 0
```
`fetch-depth: 0` is also needed for `.GitInfo` (last modified dates) and RSS dates to be accurate.
**Phase:** Phase 2.

---

### DP-5: Using Regular Hugo Instead of Hugo Extended
**What goes wrong:** hugo-theme-terminal requires **Hugo Extended** (`>= v0.90.x`). The Extended edition includes LibSass/Dart Sass transpilation via Hugo Pipes. Regular Hugo omits this. If the Actions workflow installs the standard edition, the build fails with:
```
this feature is not available in this edition of Hugo
```
**Prevention:** In the GitHub Actions workflow, download the `hugo_extended_*` tarball, not `hugo_*`:
```yaml
- name: Install Hugo
  run: |
    curl -sLJO "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.tar.gz"
```
The official Hugo "Host on GitHub Pages" guide includes this correctly. Verify the tarball name explicitly — it's easy to omit `_extended_`.
**Phase:** Phase 2. Hard failure if missed.

---

### DP-6: `id-token: write` Permission Missing
**What goes wrong:** The `actions/deploy-pages` action requires the `id-token: write` permission to authenticate with GitHub Pages. Without it the deployment step errors with a 401.
**Prevention:** Add to the workflow:
```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```
**Phase:** Phase 2.

---

## Theme-Specific Pitfalls

### TP-1: Submodule Pinned to Old Commit — Silent Style Breakage
**What goes wrong:** A theme installed as a submodule is pinned to a specific commit. If the theme ships a breaking fix (e.g., the `word-break` CSS change in a recent commit), the local copy is unaffected, but a new clone without the exact pinned commit may behave differently. More commonly, the submodule pointer drifts — locally the developer upgrades the theme but forgets to commit the new pointer, so the production Actions build uses the old version.
**Prevention:** After running `git submodule update --remote themes/terminal`, commit the updated pointer:
```bash
git add themes/terminal
git commit -m "bump terminal theme to latest"
```
**Phase:** Ongoing / Phase 3+.

---

### TP-2: `contentTypeName` Not Matching Actual Content Directory
**What goes wrong:** hugo-theme-terminal uses `contentTypeName = "posts"` to locate the blog index. If your content lives in `content/blog/` or any other directory, the home page list shows empty and there are no 404 errors — it silently renders nothing.
**Prevention:** Either keep posts in `content/posts/` (the default) or update `params.contentTypeName` to match the chosen directory name.
**Phase:** Phase 1 (content structure decision).

---

### TP-3: Language/Menu Config Requires `[languages.en]` Block
**What goes wrong:** The theme uses a multilingual config structure for menu items and strings. If menus are added at the top level (`[[menu.main]]`) rather than inside `[languages.en.menu.main]`, they may not appear or may conflict with the theme's internal template lookups.
**Prevention:** Copy the full config block from the theme README (including `[languages.en]` and nested `[languages.en.params.logo]`) exactly. Don't simplify the structure.
**Phase:** Phase 1.

---

## GitHub Stats Widget Pitfalls

### GS-1: Third-Party Services Go Down or Hit Rate Limits
**What goes wrong:** Services like `github-readme-stats` (anuradhkumar/anuradhkumar518) and `streak-stats.demolab.com` are free community-hosted instances that proxy GitHub's API. They are subject to:
- **GitHub API rate limiter:** Unauthenticated requests are limited to 60/hour per IP. High traffic on the public instance exhausts this limit and all users get error SVG images instead of stats.
- **Service downtime:** Free hosting tiers (Vercel free plan, Heroku discontinued free tier) can be paused or shut down at any time.
- **URL deprecation:** Service domains change over time (e.g., the original `github-readme-stats.vercel.app` URL changed; any hardcoded URLs in Hugo partials become 404s silently).
**Prevention:**
1. Use `<img>` tags so broken images degrade gracefully (show alt text) rather than crashing the page.
2. Verify widget URLs are still live as part of periodic maintenance.
3. For reliability, self-host the widget service.
**Phase:** Phase 3 (widgets integration). Flag for maintenance.

---

### GS-2: Inline `<img>` Tags Stripped by Goldmark Safety Mode
**What goes wrong:** Hugo's default Goldmark renderer has `renderer.unsafe = false`. This strips all raw HTML embedded inside Markdown files, including `<img>` tags. A widget embedded as:
```markdown
<img src="https://github-readme-stats.vercel.app/api?username=wikiepeidia" />
```
…silently disappears from the rendered page. No error is shown.
**Prevention:** Enable unsafe HTML rendering in `hugo.toml`:
```toml
[markup.goldmark.renderer]
  unsafe = true
```
Name is misleading — "unsafe" just means "allow raw HTML from trusted content authors". Since this is a personal site where all content is authored by the owner, this is appropriate and safe.
**Phase:** Phase 1 (config) or Phase 3 (when adding widgets). Apply in config before writing any widget-containing markdown.

---

### GS-3: Widget URLs With HTTPS Mixed Content
**What goes wrong:** If the site is served over HTTPS (GitHub Pages enforces HTTPS by default) and any widget URL uses `http://`, browsers block the image as mixed content. The widget silently fails to load with a browser console error; no Hugo error is reported.
**Prevention:** Always use `https://` widget URLs. Verify that widget service providers support HTTPS (all major providers do).
**Phase:** Phase 3.

---

### GS-4: SVG Widgets Blocked by Content Security Policy
**What goes wrong:** If a custom `<meta http-equiv="Content-Security-Policy">` tag or HTTP header is added (e.g., via Hugo's headers config or a `_headers` file for Netlify/Cloudflare), an overly restrictive `img-src` directive will block images from widget domains. GitHub Pages itself does not inject CSP headers by default, but this becomes relevant if the site is ever moved.
**Note:** Low priority for current setup, but worth flagging for future phases.
**Phase:** Future / if CSP is ever configured.

---

## Windows Dev Environment Pitfalls

### WD-1: Windows Defender Slows Hugo Builds Dramatically
**What goes wrong:** Real-time antivirus scanning intercepts every file Hugo reads and writes during a build. According to Hugo's official documentation, this can increase build times by **400% or more** with Microsoft Defender Antivirus.
**Prevention:** Add `hugo.exe` to Windows Defender's process exclusion list:
> Start → Settings → Privacy & security → Windows Security → Virus & threat protection → Manage settings → Add or remove exclusions → Add an exclusion → Process → `hugo.exe`
**Phase:** Phase 0 (local dev environment setup).

---

### WD-2: CRLF Line Endings Corrupting Template Files
**What goes wrong:** Windows uses CRLF (`\r\n`) line endings. If Hugo template or config files are written or edited with Windows line endings and then pushed to GitHub, the Linux-based GitHub Actions runner may misparse certain files (especially shell scripts in `.github/workflows/`). Less commonly, Go templates in themes that contain inline shell-like expressions can produce subtle errors.
**Prevention:** Add a `.gitattributes` file at the repo root:
```
* text=auto eol=lf
*.bat text eol=crlf
```
Also configure Git globally: `git config --global core.autocrlf input`
**Phase:** Phase 1 (repo initialization).

---

### WD-3: Hugo File Watcher Broken in WSL With Windows-Side Files
**What goes wrong:** If running Hugo inside WSL (Windows Subsystem for Linux) but the project files are on a Windows drive (e.g., `/mnt/c/...`), `hugo server` will not detect file changes for live reload. The FAQs section of Hugo docs explicitly documents this.
**Symptom:** `hugo server` runs but changes to files don't trigger a reload.
**Prevention:** Use `hugo server --poll 700ms` to force polling instead of filesystem event watching. Or keep the project in the WSL filesystem (`~/`) rather than on the Windows partition.
**Relevance:** This project's path is on a Windows OneDrive path. If developing via WSL, use `--poll`.
**Phase:** Phase 0.

---

### WD-4: Path With Non-ASCII Characters (Vietnamese / Spaces)
**What goes wrong:** This workspace is located at a path containing Vietnamese characters and spaces:
```
C:\Users\wikiepeidia\OneDrive - caugiay.edu.vn\bài tập\tin học\HTML\...
```
Some tools (older Hugo versions, some Git GUIs, certain CLI tools invoked in scripts) mishandle non-ASCII paths or paths with spaces. Symptoms include:
- Hugo failing to resolve relative paths for static assets
- Git commands needing quoted paths
- `go mod` commands inside themes failing to resolve module paths
**Prevention:**
1. Prefer running all CLI commands from inside the project directory (`cd` first).
2. Keep the Hugo project path as short and ASCII-friendly as possible for new projects. For this repo, test all tooling from the workspace root rather than relying on absolute path references in scripts.
3. Verify the `git config core.quotepath false` setting (the official Hugo GitHub Pages workflow includes this step) so Git does not mangle non-ASCII filenames.
**Phase:** Phase 0. Ongoing awareness.

---

### WD-5: Hugo Not on PATH After Installation
**What goes wrong:** Installing Hugo on Windows via a downloaded `.zip` and extracting to a directory not on `%PATH%` means `hugo` works through a GUI launcher but not in PowerShell/CMD/Git Bash terminals. GitHub Actions is unaffected (it installs Hugo explicitly), but local development breaks.
**Prevention:** Add Hugo's directory to the PATH environment variable, or install via a package manager that handles PATH automatically:
```powershell
winget install Hugo.Hugo.Extended
# or
scoop install hugo-extended
# or
choco install hugo-extended
```
The `hugo-extended` variant is required for hugo-theme-terminal.
**Phase:** Phase 0.

---

## Content / Markdown Pitfalls

### CM-1: Inline HTML Silently Stripped (Goldmark `unsafe = false`)
**What goes wrong:** Hugo's Goldmark renderer defaults to `renderer.unsafe = false`. All raw HTML tags embedded in `.md` files are silently removed from the output. Common casualties:
- `<img>` tags for GitHub stats widgets
- Custom `<div>` wrappers for layout
- `<details>` / `<summary>` collapsible sections
- Any HTML comment `<!-- -->`
**Symptom:** No error; the HTML simply does not appear in the rendered page. Inspecting the built HTML shows the tags absent.
**Fix:**
```toml
[markup.goldmark.renderer]
  unsafe = true
```
**Phase:** Phase 1. This must be in place before any markdown file using raw HTML is written.

---

### CM-2: Draft Posts Not Published
**What goes wrong:** Hugo archetypes for hugo-theme-terminal set `draft: true` by default in new posts. Running `hugo` without `--buildDrafts` skips all draft posts. The site deploys with no content.
**Symptom:** Empty blog index on the live site, posts visible locally with `hugo server -D` but not on GitHub Pages.
**Prevention:** After writing a post, set `draft: false` in front matter before committing. The GitHub Actions `hugo build` command should never include `--buildDrafts`.
**Phase:** Phase 3+ (content creation). Ongoing.

---

### CM-3: Post Not Listed Because of Wrong Content Directory
**What goes wrong:** hugo-theme-terminal only lists posts from the directory specified by `params.contentTypeName` (default: `posts`). Posts created in `content/` root, `content/blog/`, etc. are not displayed on the index, even though they are accessible by direct URL.
**Prevention:** Always create new posts under `content/posts/`. Or change `contentTypeName` globally in the config to match the chosen directory.
**Phase:** Phase 3 (content creation).

---

### CM-4: Shortcode Notation Mismatch
**What goes wrong:** Hugo has two shortcode notations:
- `{{< shortcode >}}` — passes content as raw text, does not process inner Markdown
- `{{% shortcode %}}` — processes inner content as Markdown

Using the wrong notation with hugo-theme-terminal's built-in `code` shortcode causes either unrendered Markdown or malformed HTML.
**Prevention:** Use `{{< code >}}` (angled brackets) for the terminal theme's code shortcode, as shown in the theme README.
**Phase:** Phase 3 (content creation).

---

### CM-5: `index.md` vs `_index.md` — Invisible Section Content
**What goes wrong:** A directory containing `index.md` is a "leaf bundle" (single page resource). A directory containing `_index.md` is a "branch bundle" (section with sub-pages). Using `index.md` for a section root means its children are invisible to Hugo's list templates.
**Symptom:** Posts exist but the section page shows no list; or content is accessible by URL but never appears in navigation.
**Prevention:** Use `_index.md` (with underscore) for section root files.
**Phase:** Phase 3 (content structure).

---

## Prevention Checklist

Use this list at the start of each phase to avoid the most common issues:

### Phase 0 — Local Dev Environment
- [ ] Install **Hugo Extended** (not regular Hugo): `winget install Hugo.Hugo.Extended`
- [ ] Verify: `hugo version` shows `extended` in the output
- [ ] Add `hugo.exe` to Windows Defender exclusion list
- [ ] Configure Git: `git config --global core.autocrlf input`
- [ ] Add `.gitattributes` with `* text=auto eol=lf` to repo root

### Phase 1 — Repository & Config Setup
- [ ] Clone with `--recurse-submodules` (or run `git submodule update --init --recursive` after clone)
- [ ] Commit `.gitmodules` and the submodule pointer after `git submodule add`
- [ ] Add `/public/` and `/resources/` to `.gitignore`
- [ ] Set `theme = "terminal"` OR use `[module.imports]` — never both
- [ ] Use `pagination.pagerSize` (not deprecated `paginate`)
- [ ] Include `[markup.highlight] noClasses = false`
- [ ] Include `[markup.goldmark.renderer] unsafe = true`
- [ ] Set `baseurl` to `"/"` in local config; override dynamically in CI via `--baseURL`

### Phase 2 — GitHub Actions / Deployment
- [ ] Go to repo Settings → Pages → Source → **GitHub Actions** (manual step)
- [ ] Workflow uses `hugo_extended_*` tarball, not `hugo_*`
- [ ] `actions/checkout` has `submodules: recursive` and `fetch-depth: 0`
- [ ] Workflow has `permissions: id-token: write, pages: write, contents: read`
- [ ] Build step passes `--baseURL "${{ steps.pages.outputs.base_url }}/"` dynamically

### Phase 3 — Content & Widgets
- [ ] Widget URLs use `https://`
- [ ] Raw HTML (`<img>` tags) in markdown requires `renderer.unsafe = true` in config
- [ ] Posts have `draft: false` before committing
- [ ] Posts are created under `content/posts/` (matching `contentTypeName`)
- [ ] Section root files use `_index.md` not `index.md`

---

## Phase-Specific Warning Matrix

| Phase Topic | Most Likely Pitfall | Blocking? | Mitigation |
|------------|--------------------|-----------|-|
| Repo init | No submodule init | YES — breaks build | Document in README, use `--recurse-submodules` |
| Config setup | `renderer.unsafe = false` | NO — silent | Add to config immediately |
| Config setup | `paginate` deprecated | NO — warning | Use `pagination.pagerSize` |
| Config setup | Missing `noClasses = false` | NO — visual breakage | Always include in base config |
| CI setup | Regular Hugo (not Extended) | YES — hard fail | Verify tarball name explicitly |
| CI setup | Pages source not set | YES — deploy fails | One-time manual step before first push |
| CI setup | Missing submodules in checkout | YES — breaks build | Always include in workflow template |
| Content | `draft: true` on posts | NO — empty site | Audit frontmatter before commit |
| Widget embed | Inline HTML stripped | NO — silent | Enable `unsafe = true` first |
| Widget embed | Service rate limit | NO — broken image | Use `<img>` with meaningful `alt` text |
| Windows dev | Defender slowing builds | NO — performance only | Add exclusion |
| Windows dev | WSL file watcher | NO — annoying | Use `--poll 700ms` |

---

## Sources

- Hugo official docs — Configure Markup (Goldmark): https://gohugo.io/configuration/markup/
- Hugo official docs — Host on GitHub Pages: https://gohugo.io/hosting-and-deployment/hosting-on-github/
- Hugo official docs — Frequently Asked Questions: https://gohugo.io/troubleshooting/faq/
- Hugo official docs — Performance / Virus Scanning: https://gohugo.io/troubleshooting/build-performance/
- hugo-theme-terminal README: https://github.com/panr/hugo-theme-terminal
- github-readme-streak-stats: https://github.com/DenverCoder1/github-readme-streak-stats
- Hugo GitHub Pages workflow example (official): includes `hugo_extended`, `submodules: recursive`, dynamic `--baseURL` — all verified HIGH confidence
