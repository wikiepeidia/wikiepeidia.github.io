// All editable content lives here. Add a skill/link/card = add one line.
const USER = "wikiepeidia";
const ICONS = "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/";

const ghStats = (path, theme, extra = "") =>
  `https://github-readme-stats.shion.dev${path}?username=${USER}&theme=${theme}&include_all_commits=true&count_private=true${extra}`;
const langs = "&layout=compact&hide=jupyter%20notebook";
const streak = (theme) => `https://streak-stats.demolab.com/?user=${USER}&theme=${theme}`;
const quote = (theme) => `https://quotes-github-readme.vercel.app/api?type=horizontal&theme=${theme}`;

const SITE = {
  // [label, icon file name without "-colored.svg"]; no icon = text-only chip
  // First row is the CV (cv.tex) skills, second row is everything else.
  stack: [
    ["Python", "python"], ["Java", "java"], ["JavaScript", "javascript"], ["PyTorch", "pytorch"],
    ["TensorFlow", "tensorflow"], ["Hugging Face", "huggingface"], ["Spring Boot", "springboot"],
    ["Flask", "flask"], ["FastAPI", "fastapi"], ["Elasticsearch"], ["SQLite"], ["MySQL", "mysql"],
    ["Git", "git"], ["Linux", "linux"],
    ["C", "c"], ["HTML5", "html5"], ["Node.js", "nodejs"], ["MongoDB", "mongodb"],
    ["PostgreSQL", "postgresql"], ["Bash", "gnubash"], ["Ubuntu", "ubuntu"],
    ["VS Code", "visualstudiocode"], ["Vim", "vim"],
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

  // `repo` is the repo name under github.com/USER
  projects: [
    {
      repo: "Internship-project",
      title: "VNPhish",
      desc: "Local-first Vietnamese phishing detection. Self-built 2,097-message dataset, Qwen3-4B (QLoRA) and PhoBERT both above 0.98 macro-F1 on a held-out set, quantized GGUF CLI that runs fully on-device.",
      tags: ["Python", "QLoRA", "PhoBERT", "GGUF"],
    },
    {
      repo: "ANSER",
      title: "ANSER",
      desc: "Automated retail inventory platform. Fine-tuned Qwen2.5-7B behind a hybrid RAG engine (ChromaDB + BM25 + reranking), a semantic-routing manager agent and an async FastAPI task pipeline.",
      tags: ["Python", "FastAPI", "RAG", "QLoRA"],
    },
    {
      repo: "mindguard-project",
      title: "MindGuard",
      desc: "Community-driven threat intelligence platform: Flask backend, SQLite index of localized fraud reports and an AI triage bot behind REST endpoints.",
      tags: ["Python", "Flask", "SQLite"],
    },
    {
      repo: "predict-future-import-for-Retail-store-products",
      title: "Predict future imports",
      desc: "Forecasting pipeline for retail stock: MobileNetV2 CNN for data entry plus an LSTM for demand prediction, served through a Flask REST API.",
      tags: ["Python", "TensorFlow", "LSTM", "Flask"],
    },
    {
      repo: "Mobile-dev-camstudy",
      title: "CamStudy",
      desc: "Android study companion: on-device YOLOv5 (TensorFlow Lite) object detection, Azure Cognitive Services translation and an offline Room (SQLite) layer.",
      tags: ["Java", "Android", "TFLite"],
    },
  ],

  // YouTube id from the URL; `start` (seconds) is optional
  videos: [
    {
      id: "A-yt1UTzRFM",
      title: "Me & my family",
      quote: "Myself and my family.Also my first truly handmade video",
    },
    {
      id: "e4S8x04DYkg",
      title: "Crazy stuff on a 2GB RAM PC",
      quote: "A 12-year-old doing crazy stuff on a PC with 2GB of RAM and an HDD that was already 10 years old in 2017.",
    },
    {
      id: "uGXnbzjt1yE", start: 4,
      title: "Low effort, same views twice",
      quote: "Low effort video: 100K views before the takedown. Reuploaded nearly 2 years later, and it still reached the same amount of views.",
    },
    {
      id: "x83fFtAHtUk",
      title: "12000 mph bus on Roblox",
      quote: "12000 mph bus on Roblox be like.",
    },
  ],

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
  // Childhood Wix sites, shown as click-to-load mini windows. `year` is optional
  oldSites: [
    {
      url: "https://dtichoai.wixsite.com/windowsxp", year: 2017, title: "Windows XP fan site",
      quote: "Useless information about Windows XP, made by a 12-year-old kid in 2017.",
    },
    {
      url: "https://dtichoai.wixsite.com/roblox", year: 2017, title: "Roblox site",
      quote: "Can't even make a proper Roblox site in 2017.",
    },
    {
      url: "https://phamtheminh2409.wixsite.com/mysite", year: 2020, title: "mysite",
      quote: "Get rickrolled in 2020.",
    },
    {
      url: "https://phamtheminh2409.wixsite.com/wikiepeidiashop", title: "wikiepeidia shop",
      quote: "A shop that doesn't sell anything properly.",
    },
  ],

  support: [
    ["Buy me a coffee", "https://www.buymeacoffee.com/wikiepeidia", "https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"],
    ["Patreon", "https://patreon.com/wikiepeidia", "https://img.shields.io/badge/Patreon-F96854?style=for-the-badge&logo=patreon&logoColor=white"],
  ],
};
