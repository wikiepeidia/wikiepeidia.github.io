// Renders the lists in index.html from SITE (js/data.js). Content is our own, so innerHTML is safe here.
const $ = (id) => document.getElementById(id);

const link = (url, inner) => `<li><a href="${url}" target="_blank" rel="noreferrer">${inner}</a></li>`;

const picture = (src, dark, alt) => `
  <picture>
    ${dark ? `<source media="(prefers-color-scheme: dark)" srcset="${dark}">` : ""}
    <img src="${src}" alt="${alt}" loading="lazy">
  </picture>`;

$("stack-list").innerHTML = SITE.stack
  .map(([name, icon]) => `<li><img src="${ICONS}skills/${icon}-colored.svg" alt="" loading="lazy">${name}</li>`)
  .join("");

$("stats-list").innerHTML = SITE.stats
  .map((s) => `
    <div class="card${s.light ? " light" : ""}${s.wide ? " wide" : ""}">
      <p>${s.label}</p>
      ${picture(s.src, s.dark, s.alt)}
    </div>`)
  .join("");

$("quote").insertAdjacentHTML("beforeend", picture(SITE.quote.light, SITE.quote.dark, "Random quote"));
$("social-list").innerHTML = SITE.socials
  .map(([name, url, icon, mono]) =>
    link(url, `<img src="${ICONS}socials/${icon}.svg" alt=""${mono ? ' class="mono"' : ""}>${name}`))
  .join("");

$("support-list").innerHTML = SITE.support
  .map(([name, url, badge]) => link(url, `<img src="${badge}" alt="${name}">`))
  .join("");
