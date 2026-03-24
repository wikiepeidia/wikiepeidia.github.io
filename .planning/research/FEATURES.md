# Features Research

**Project:** wikiepeidia.github.io — Personal Dev/Student Blog
**Owner:** wikiepeidia (ICT student, Vietnam)
**Stack:** Hugo + GitHub Pages
**Researched:** March 2026
**Overall confidence:** HIGH (Hugo official docs + verified widget repos)

---

## Table Stakes (must have)

Features users expect the moment they land. Missing any of these causes immediate bounces.

| Feature | Why Expected | Complexity | Hugo Support |
|---------|--------------|------------|--------------|
| Clean navigation bar | Users need to find Home / Blog / About / GitHub Stats instantly | Low | Built-in menus |
| Blog listing page | Chronological list of posts with titles and dates — the core of any blog | Low | Native list templates |
| Individual post pages | Readable single-post layout, good typography | Low | Native single templates |
| Mobile-responsive layout | >60% traffic is mobile; unresponsive = unusable | Low | Theme-provided |
| Visible post dates | Readers evaluate freshness before reading | Low | `.Date` in front matter |
| Basic SEO meta tags | `<title>`, `<meta description>`, `<og:*>` for link previews on Discord/social | Low | Most themes include; Hugo has built-in SEO template |
| Working RSS feed | Developers expect `/index.xml`; feed readers, Feedly, and social aggregators use it | Low | **Hugo auto-generates RSS** — zero build work |
| Auto-generated sitemap | Google/Bing indexing; `sitemap.xml` needed for discoverability | Low | **Hugo auto-generates** — zero work |
| About page | Personal credibility; who is behind this blog? | Low | Static markdown page |
| 404 page | GitHub Pages serves `404.html` automatically if present | Low | Hugo can generate it |

**Verdict:** All of the above ship essentially for free with any decent Hugo theme. The only active choice is picking a theme that covers them.

---

## Differentiators (nice to have)

These are not expected, but elevate the site above generic GitHub Pages blogs.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| GitHub Stats page | Unique to developer/student profiles; shows proof of work | Low | Static page with `<img>` embeds |
| Reading time estimate | Sets reader expectations; signals post depth | Very Low | Hugo built-in: `{{ .ReadingTime }} min read` — one template line |
| Tags/taxonomy | Lets readers find related posts (gaming vs dev vs life) | Low | Hugo native taxonomy; just add `tags:` to front matter |
| Dark/light mode toggle | Expected in 2025+; many themes provide this | Low–Med | Theme-dependent; CSS `prefers-color-scheme` |
| Table of contents | Useful for long technical posts | Very Low | Hugo built-in: `{{ .TableOfContents }}` — auto-generated from headings |
| Code copy button | Developer-friendly UX for code-heavy posts | Low | Small JS snippet; worth it for a dev blog |
| Syntax highlighting | Code posts look professional; readers can scan snippets | Zero | **Built-in Chroma** — just use fenced code blocks. No config needed |
| Open Graph / social cards | Posts look rich when shared on Discord, Twitter, LINE | Low | Most themes include; `og:image` can be auto-generated |
| GitHub profile trophy card | Visual personality on the stats page | Very Low | Single `<img>` tag to `github-profile-trophy.vercel.app` |
| Pacman/snake contribution graph | Visually striking; uniquely "gamer dev" identity | Low | GitHub Actions workflow commits animation SVG |

---

## Anti-Features (deliberately skip)

Things that sound good but add complexity, maintenance cost, or privacy risk for zero meaningful benefit at this blog's scale.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Comments (Disqus, Giscus, etc.) | Disqus injects ads and tracking; Giscus requires GitHub login friction. A solo low-activity blog gets near-zero comments. | Link to a GitHub Discussions thread or Discord in the footer if you want feedback |
| Newsletter / email subscription | Requires Mailchimp/ConvertKit account, GDPR concern, ongoing maintenance. No meaningful ROI for a personal blog. | RSS feed covers the use case for dev audiences |
| Search functionality | Complex to implement correctly in static Hugo (Fuse.js or Algolia needed). Tiny blog = use browser Ctrl+F or tags | Tags/categories provide enough navigation |
| View counters / hit badges | Third-party services go offline; numbers feel vanity when small. Adds external dependencies. | Google Search Console (free) gives you real analytics without page clutter |
| Social share buttons (Tweet, Facebook, etc.) | Modern users use native OS share on mobile; buttons look dated and add JS overhead | Put the URL in the post; that's enough |
| Multiple language versions | English-only site; multilingual Hugo is significant config overhead | Single language config only |
| Categories AND tags | Redundant taxonomy for a small blog. Pick one. | Use **tags only** — simpler, more flexible |
| CMS integration (Forestry, Netlify CMS) | Adds authentication layer, sync complexity. Low-maintenance priority means infrequent writes. | Just edit Markdown in VS Code and push |
| Complex pagination | Unnecessary until you have 50+ posts | Hugo default pagination is fine as-is |
| WebP image processing pipeline | Overkill for a blog that won't post many images | Paste images manually; Hugo can resize if needed later |

---

## GitHub Stats Embedding

### Recommended approach: `<img>` tags (direct embed)

**Why not iframes:** GitHub Pages CSP headers block many iframe sources. iframes are heavier, cause layout shift, and often don't render in feed readers.

**Why not shortcodes for the stats themselves:** A Hugo shortcode wrapping an `<img>` adds a layer of abstraction for no benefit. Raw `<img>` tags in Markdown work fine in Hugo.

**Best practice for Hugo + GitHub Pages:** Use `<img>` tags pointing to hosted SVG API endpoints. These are cached SVGs served over HTTPS — they render as regular images in any browser.

### Recommended widget sources

| Widget | Source URL pattern | Reliability notes |
|--------|-------------------|-------------------|
| General stats card | `https://github-readme-stats.vercel.app/api?username=wikiepeidia` | Public Vercel instance can rate-limit; self-host via GitHub Actions for reliability |
| Top languages card | `https://github-readme-stats.vercel.app/api/top-langs/?username=wikiepeidia` | Same as above |
| Streak stats | `https://streak-stats.demolab.com/?user=wikiepeidia` | Active project, self-hosting via Vercel recommended |
| Activity graph | `https://github-readme-activity-graph.vercel.app/graph?username=wikiepeidia` | Note: deployment moved from Heroku to Vercel/Cyclic; verify URL at time of use |
| Pacman/snake graph | Generated SVG committed to repo via GitHub Actions | Most reliable — no external dependency at render time |
| Profile trophies | `https://github-profile-trophy.vercel.app/?username=wikiepeidia` | |
| Random dev quote | `https://quotes-github-readme.vercel.app/api?type=horizontal` | |
| Skill badges | `https://skillicons.dev/icons?i=html,css,js,python` | Static SVG, very reliable |

### Rate limit warning
The public `github-readme-stats.vercel.app` instance hits GitHub API rate limits under high traffic. For a personal blog, this means stats cards may fail to load for visitors occasionally.

**Recommended mitigation:** Use the GitHub Actions workflow approach (from the `readme-tools/github-readme-stats-action` action) to pre-generate and commit stat SVGs to the repo. Then reference them as local images. This is zero-runtime-dependency and always reliable.

```yaml
# .github/workflows/stats.yml — runs daily, commits SVGs
on:
  schedule:
    - cron: "0 3 * * *"
  workflow_dispatch:
```

### Hugo shortcode option (for reuse)
If stats are embedded on multiple pages, a shortcode is worth it:

```html
{{/* layouts/shortcodes/github-stats.html */}}
<img src="https://github-readme-stats.vercel.app/api?username={{ .Get "user" }}&show_icons=true&theme=dark" alt="GitHub Stats" loading="lazy" />
```

Usage in Markdown: `{{</* github-stats user="wikiepeidia" */>}}`

---

## Blog Post Features

### Syntax Highlighting — DO IT (zero cost)
Hugo uses the **Chroma** highlighter (built-in, ~250 languages). No installation, no config needed.

```markdown
```python
def hello():
    print("hello world")
```
```

Hugo automatically renders this with color. To customize the theme:
```toml
# hugo.toml
[markup.highlight]
  style = "dracula"        # or monokai, github, github-dark
  lineNos = false          # set true for code with many lines
  codeFences = true        # default, enables fenced code block highlighting
```

**Verdict:** Costs nothing to enable, turns on by default in Hugo. Do it.

### Tags — DO IT (use only tags, not categories)
Hugo's taxonomy system is native and trivial to use:

```yaml
# Post front matter
tags: ["gaming", "dev", "life", "tutorial"]
```

Hugo automatically generates `/tags/` listing pages and per-tag pages. No template work needed for basic tags with most themes.

**Verdict:** One line per post in front matter. Always worth it.

### Reading Time — DO IT (one template change)
Hugo exposes `{{ .ReadingTime }}` (estimated minutes) on every page. Just add to your post template or theme partial:

```html
<span>{{ .ReadingTime }} min read</span>
```

**Verdict:** Extremely low effort, good UX signal. Include it.

### Table of Contents — YES for dev posts
Hugo auto-generates a ToC from headings:

```html
{{ if .TableOfContents }}
  {{ .TableOfContents }}
{{ end }}
```

**Verdict:** Worth having for any post over 800 words. Built-in, no extra packages.

### Draft/future post support
Hugo supports `draft: true` and `date` in the future for scheduling. Useful for prepping posts.

### Summary / description
Hugo can auto-truncate summaries for the blog listing page. Set `<!--more-->` in your Markdown to control the break point, or use `description:` in front matter.

---

## RSS & Discoverability

### RSS — Already built into Hugo
Hugo generates RSS feeds automatically at build time. No plugin, no setup.

- Home feed: `/index.xml`
- Section feed: `/blog/index.xml`
- Tag feed: `/tags/gaming/index.xml`

To configure:
```toml
# hugo.toml
[outputs]
  home = ["html", "rss"]
  section = ["html", "rss"]

[services.rss]
  limit = 20   # items per feed; -1 = unlimited
```

To include the feed reference in `<head>` (for browser auto-discovery):
```html
{{ with .OutputFormats.Get "rss" }}
  {{ printf `<link rel=%q type=%q href=%q title=%q>` .Rel .MediaType.Type .Permalink site.Title | safeHTML }}
{{ end }}
```

**Importance for a personal blog:** Medium. Pure developer audience (ICT students, devs) uses RSS readers (Feedly, Inoreader) more than average. It's zero maintenance once configured. Leave it on.

### Sitemap — Auto-generated
Hugo generates `sitemap.xml` by default. Submit it to Google Search Console once.

### OG tags — Important for social sharing
When you post a blog link in Discord or LINE, OG tags control the preview card. Most Hugo themes include these. Verify your chosen theme has:
- `og:title`
- `og:description`
- `og:url`
- `og:image` (even a default site logo counts)

### Canonical URLs
Hugo handles these automatically. No action needed.

### What NOT to do for discoverability
- Don't manually add JSON-LD schema markup — overkill for a personal blog
- Don't add Google Analytics unless you actually look at the data. GoatCounter (privacy-friendly, free) is lighter if you want any analytics at all
- Don't submit to blog directories or aggregators — organic search is enough

---

## Feature Priority Summary

**Implement immediately (zero/minimal effort):**
- Tags in front matter
- Reading time in templates
- RSS (just configure outputs in hugo.toml)
- Syntax highlighting (already on in Hugo)
- GitHub stats page with `<img>` embeds

**Implement during theme setup:**
- Dark mode (pick a theme that supports it)
- Table of contents partial
- 404 page
- OG meta tags (verify theme has them)

**Add if motivated later:**
- Code copy button (small JS addition)
- GitHub Actions stat SVG generation (reliability upgrade)
- Pacman/snake contribution animation (visual flair)

**Deliberately skip:**
- Comments
- Newsletter
- Search
- Categories (tags are enough)
- Social share buttons

---

## Sources

- Hugo RSS templates: https://gohugo.io/templates/rss/ (official docs, Feb 2026)
- Hugo syntax highlighting: https://gohugo.io/content-management/syntax-highlighting/ (official docs, Feb 2026) — HIGH confidence
- github-readme-stats: https://github.com/anuraghazra/github-readme-stats (78.9k stars, actively maintained) — HIGH confidence
- github-readme-streak-stats: https://github.com/DenverCoder1/github-readme-streak-stats (6.7k stars) — HIGH confidence
- github-readme-activity-graph: https://github.com/Ashutosh00710/github-readme-activity-graph (2.2k stars) — MEDIUM confidence (deployment domain instability noted)
- Hugo taxonomies: https://gohugo.io/content-management/taxonomies/ — HIGH confidence
