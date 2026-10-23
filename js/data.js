// All editable content lives here. Add a skill/link/card = add one line.
const USER = "wikiepeidia";
const ICONS = "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/";

const ghStats = (path, theme, extra = "") =>
  `https://github-readme-stats.shion.dev${path}?username=${USER}&theme=${theme}&include_all_commits=true&count_private=true${extra}`;
const langs = "&layout=compact&hide=jupyter%20notebook";
const streak = (theme) => `https://streak-stats.demolab.com/?user=${USER}&theme=${theme}`;
const quote = (theme) => `https://quotes-github-readme.vercel.app/api?type=horizontal&theme=${theme}`;

const SITE = {
  // [label, icon file name without "-colored.svg"]
  stack: [
    ["C", "c"], ["Python", "python"], ["JavaScript", "javascript"], ["HTML5", "html5"],
    ["Node.js", "nodejs"], ["MySQL", "mysql"], ["MongoDB", "mongodb"], ["PostgreSQL", "postgresql"],
    ["TensorFlow", "tensorflow"], ["Git", "git"], ["Bash", "gnubash"], ["Linux", "linux"],
    ["Ubuntu", "ubuntu"], ["VS Code", "visualstudiocode"], ["Vim", "vim"],
  ],

  // `dark` is optional; `light: true` forces a white card (for SVGs drawn on light backgrounds)
  stats: [
    {
      label: "commits", alt: "GitHub contribution graph", wide: true, light: true,
      src: `https://raw.githubusercontent.com/${USER}/${USER}/output/pacman-contribution-graph.svg`,
    },
    {
      label: "general stats", alt: "GitHub stats",
      src: ghStats("/api", "solarized-light"), dark: ghStats("/api", "dark"),
    },
    {
      label: "streak", alt: "GitHub streak",
      src: streak("solarized-light"), dark: streak("dark"),
    },
    {
      label: "top languages", alt: "Top languages", wide: true,
      src: ghStats("/api/top-langs/", "solarized-light", langs), dark: ghStats("/api/top-langs/", "dark", langs),
    },
  ],

  quote: { light: quote("light"), dark: quote("dark") },

  // [label, url, icon file name without ".svg", mono?]. mono = black icon, inverted in dark mode
  socials: [
    ["GitHub", "https://www.github.com/wikiepeidia", "github", true],
    ["GitLab", "https://www.gitlab.com/wikiepeidia", "gitlab"],
    ["X / Twitter", "https://www.x.com/wikiepeidia", "twitter", true],
    ["Threads", "https://www.threads.net/@pham.theminh", "threads", true],
    ["Twitch", "https://www.twitch.tv/wikiepeidia", "twitch"],
    ["YouTube", "https://www.youtube.com/@wikiepeidia", "youtube"],
    ["Discord", "https://discord.com/users/wikiepeidia", "discord"],
    ["Facebook", "https://www.facebook.com/phamtheminh.intelcorei9", "facebook"],
  ],

  // [label, url, badge image] (same badges as the README)
  support: [
    ["Buy me a coffee", "https://www.buymeacoffee.com/wikiepeidia", "https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"],
    ["Patreon", "https://patreon.com/wikiepeidia", "https://img.shields.io/badge/Patreon-F96854?style=for-the-badge&logo=patreon&logoColor=white"],
  ],
};
