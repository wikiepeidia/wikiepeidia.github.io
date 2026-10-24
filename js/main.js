// Renders the lists in index.html from SITE (js/data.js). Content is our own, so innerHTML is safe here.
const $ = (id) => document.getElementById(id);

const link = (url, inner) => `<li><a href="${url}" target="_blank" rel="noreferrer">${inner}</a></li>`;

const picture = (src, dark, alt) => `
  <picture>
    ${dark ? `<source media="(prefers-color-scheme: dark)" srcset="${dark}">` : ""}
    <img src="${src}" alt="${alt}" loading="lazy">
  </picture>`;

$("stack-list").innerHTML = SITE.stack
  .map(([name, icon]) =>
    `<li>${icon ? `<img src="${ICONS}skills/${icon}-colored.svg" alt="" loading="lazy">` : ""}${name}</li>`)
  .join("");

$("project-list").innerHTML = SITE.projects
  .map((p) => `
    <a class="project glow" href="https://github.com/${USER}/${p.repo}" target="_blank" rel="noreferrer">
      <h3>${p.title}</h3>
      <p>${p.desc}</p>
      <ul>${p.tags.map((t) => `<li>${t}</li>`).join("")}</ul>
      <span class="repo">${USER}/${p.repo}</span>
    </a>`)
  .join("");

$("stats-list").innerHTML = SITE.stats
  .map((s) => `
    <div class="card glow${s.light ? " light" : ""}${s.wide ? " wide" : ""}">
      <p>${s.label}</p>
      ${picture(s.src, s.dark, s.alt)}
    </div>`)
  .join("");

$("video-list").innerHTML = SITE.videos
  .map((v) => `
    <figure class="video glow">
      <iframe src="https://www.youtube-nocookie.com/embed/${v.id}${v.start ? `?start=${v.start}` : ""}"
        title="${v.title}" loading="lazy" allowfullscreen
        allow="encrypted-media; picture-in-picture; fullscreen"
        referrerpolicy="strict-origin-when-cross-origin"></iframe>
      <figcaption>
        <h3><a href="https://youtu.be/${v.id}${v.start ? `?t=${v.start}` : ""}" target="_blank" rel="noreferrer">${v.title}</a></h3>
        <blockquote>${v.quote}</blockquote>
      </figcaption>
    </figure>`)
  .join("");

$("quote").insertAdjacentHTML("beforeend", picture(SITE.quote.light, SITE.quote.dark, "Random quote"));
$("social-list").innerHTML = SITE.socials
  .map(([name, url, icon, mono]) =>
    link(url, `<img src="${ICONS}socials/${icon}.svg" alt=""${mono ? ' class="mono"' : ""}>${name}`))
  .join("");

$("support-list").innerHTML = SITE.support
  .map(([name, url, badge]) => link(url, `<img src="${badge}" alt="${name}">`))
  .join("");

// --- motion ---
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Scroll reveal, staggered by position among siblings (CSS: [data-reveal])
const revealer = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (!e.isIntersecting) return;
  e.target.classList.add("in");
  revealer.unobserve(e.target);
}), { threshold: 0.12 });
document.querySelectorAll("section h2, dl, #quote picture, .chips li, .project, .card, .video, .links li").forEach((el) => {
  el.dataset.reveal = "";
  el.style.setProperty("--i", Math.min([...el.parentNode.children].indexOf(el), 10));
  revealer.observe(el);
});

// Cursor-following glow on .glow cards
document.addEventListener("pointermove", (e) => {
  const el = e.target.closest?.(".glow");
  if (!el) return;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--x", `${e.clientX - r.left}px`);
  el.style.setProperty("--y", `${e.clientY - r.top}px`);
});

// Scroll progress bar + nav border
const nav = document.querySelector(".nav");
const onScroll = () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  document.documentElement.style.setProperty("--p", max > 0 ? scrollY / max : 0);
  nav.classList.toggle("scrolled", scrollY > 8);
};
addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Highlight the nav link of the section in the middle of the screen
const navLinks = [...document.querySelectorAll(".nav ul a")];
const spy = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (e.isIntersecting) navLinks.forEach((a) => a.classList.toggle("active", a.hash === `#${e.target.id}`));
}), { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("section[id]").forEach((s) => spy.observe(s));

// Type out the hero terminal; it is fully written in the HTML, so no-JS / reduced motion just shows it
if (!reduceMotion) {
  const body = document.querySelector(".term-body");
  const lines = [...body.children];
  const texts = lines.map((p) => p.textContent);
  body.style.minHeight = `${body.offsetHeight}px`; // keep the box from growing while typing
  lines.forEach((p) => { p.textContent = ""; p.hidden = true; });
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  (async () => {
    await wait(900);
    for (const [i, p] of lines.entries()) {
      p.hidden = false;
      if (p.classList.contains("cmd")) {
        p.classList.add("typing");
        for (const ch of texts[i]) { p.textContent += ch; await wait(40 + Math.random() * 60); }
        p.classList.remove("typing");
        await wait(280);
      } else {
        p.textContent = texts[i];
        await wait(380);
      }
    }
  })();
}
