import fs from "node:fs";

const inputPath = "forbes_accessibility_200.json";
const outputDir = "output";
const outputPath = `${outputDir}/forbes_accessibility_200.html`;
const rows = JSON.parse(fs.readFileSync(inputPath, "utf8")).sort(
  (a, b) => Number(a.position) - Number(b.position)
);

function clean(value) {
  return value == null ? "" : String(value).replace(/\s+/g, " ").trim();
}

function escapeHtml(value) {
  return clean(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function slug(value) {
  return clean(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function imageInitial(row) {
  return clean(row.name).slice(0, 1).toUpperCase() || "?";
}

function profileHtml(row) {
  const profiles = Array.isArray(row.personalProfiles) ? row.personalProfiles : [];
  if (!profiles.length) {
    return `${escapeHtml(row.leadAccessibilityOfficer || "N/A")} <span class="profile-missing">Profile pending review</span>`;
  }

  return profiles
    .map((profile) => {
      const name = clean(profile.name || row.leadAccessibilityOfficer || "N/A");
      const url = clean(profile.url);
      if (!url) return `${escapeHtml(name)} <span class="profile-missing">Profile pending review</span>`;
      return `<a href="${escapeHtml(url)}" target="_blank" rel="noreferrer" title="Open New Window">${escapeHtml(name)}</a>`;
    })
    .join(" and ");
}

function websiteHtml(row) {
  const url = clean(row.website);
  if (!url) return `<span class="website-link unknown">Pending review</span>`;

  return `<a class="website-link" href="${escapeHtml(url)}" target="_blank" rel="noreferrer" title="Open New Window" aria-label="Official website for ${escapeHtml(
    row.name
  )}">Official site</a>`;
}

function forbesProfileLink(row) {
  if (!row.forbesProfile) return escapeHtml(row.name);

  return `<a href="${escapeHtml(row.forbesProfile)}" target="_blank" rel="noreferrer" title="Open New Window" aria-label="Forbes profile for ${escapeHtml(
    row.name
  )}">${escapeHtml(row.name)}</a>`;
}

const impactAreas = [...new Set(rows.map((row) => clean(row.impactArea)).filter(Boolean))].sort();
const cards = rows
  .map((row) => {
    const headingId = `entry-${escapeHtml(row.position)}-${escapeHtml(slug(row.name))}`;

    return `
      <article class="card confirmed" aria-labelledby="${headingId}" data-search="${escapeHtml(
        [row.name, row.leadAccessibilityOfficer, row.impactArea, row.headquarters].join(" ")
      ).toLowerCase()}" data-area="${escapeHtml(row.impactArea)}">
        <p class="rank"><span class="visually-hidden">Rank </span>#${escapeHtml(row.position)}</p>
        <div class="logo" aria-hidden="true"><span>${escapeHtml(imageInitial(row))}</span></div>
        <div class="main">
          <div class="heading-row">
            <h2 id="${headingId}">${forbesProfileLink(row)}</h2>
          </div>
          <dl>
            <div><dt>Lead accessibility officer</dt><dd>${profileHtml(row)}</dd></div>
            <div><dt>Impact area</dt><dd>${escapeHtml(row.impactArea || "N/A")}</dd></div>
            <div><dt>Headquarters</dt><dd>${escapeHtml(row.headquarters || "N/A")}</dd></div>
            <div><dt>Website</dt><dd>${websiteHtml(row)}</dd></div>
          </dl>
        </div>
      </article>`;
  })
  .join("\n");

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Forbes Accessibility 200 Dataset</title>
  <style>
    :root {
      color-scheme: light;
      --ink: #16191d;
      --soft-ink: #30363d;
      --muted: #5b6470;
      --hairline: #d5dbe3;
      --paper: #f5f7fa;
      --field: #f8fafc;
      --panel: #ffffff;
      --confirmed: #146c43;
      --confirmed-soft: #edf8f2;
      --seal: #334e68;
      --focus: #0b63ce;
      --shadow: 0 10px 28px rgba(22, 25, 29, .08);
      --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      background: var(--paper);
      color: var(--ink);
      font-family: var(--font-sans);
      font-size: 1rem;
      line-height: 1.55;
    }
    a {
      color: var(--ink);
      text-decoration-color: rgba(39, 95, 61, .78);
      text-decoration-thickness: 1px;
      text-underline-offset: 4px;
    }
    a:hover { color: var(--seal); }
    a[target="_blank"]::after {
      content: "↗";
      display: inline-block;
      margin-left: .25em;
      font-size: .85em;
      font-weight: 700;
      line-height: 1;
      text-decoration: none;
    }
    a:focus-visible,
    input:focus-visible,
    select:focus-visible {
      outline: 3px solid var(--focus);
      outline-offset: 3px;
    }
    .skip-link {
      position: absolute;
      inset-block-start: 12px;
      inset-inline-start: 12px;
      z-index: 10;
      transform: translateY(-160%);
      border: 2px solid var(--ink);
      background: var(--panel);
      color: var(--ink);
      padding: 10px 14px;
      font: 700 .9375rem/1 var(--font-sans);
    }
    .skip-link:focus { transform: translateY(0); }
    .visually-hidden {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
      white-space: nowrap;
      clip-path: inset(50%);
    }
    header {
      padding: 56px clamp(20px, 6vw, 72px) 34px;
      border-bottom: 1px solid var(--hairline);
      background: linear-gradient(180deg, #ffffff, #f7f9fc);
    }
    .kicker {
      margin: 0 0 12px;
      color: var(--seal);
      font: 700 .75rem/1.3 var(--font-sans);
      letter-spacing: .16em;
      text-transform: uppercase;
    }
    h1 {
      margin: 0;
      max-width: 980px;
      font-size: clamp(2.125rem, 6vw, 4.25rem);
      font-weight: 750;
      letter-spacing: 0;
      line-height: 1.04;
    }
    header p {
      margin: 18px 0 0;
      max-width: 820px;
      color: var(--soft-ink);
      font-size: 1.0625rem;
      line-height: 1.65;
    }
    .toolbar {
      position: sticky;
      top: 0;
      z-index: 2;
      display: grid;
      grid-template-columns: minmax(240px, 1fr) minmax(200px, 320px);
      gap: 14px;
      padding: 16px clamp(20px, 6vw, 72px);
      background: rgba(245, 247, 250, .96);
      border-bottom: 1px solid var(--hairline);
      backdrop-filter: blur(14px);
    }
    .field label {
      display: block;
      margin: 0 0 6px;
      color: var(--soft-ink);
      font: 700 .875rem/1.3 var(--font-sans);
    }
    input,
    select {
      width: 100%;
      min-height: 46px;
      border: 1px solid var(--muted);
      border-radius: 6px;
      background: var(--panel);
      color: var(--ink);
      font: 1rem var(--font-sans);
      padding: 10px 13px;
    }
    main {
      padding: 28px clamp(20px, 6vw, 72px) 54px;
    }
    .count {
      margin: 0 0 18px;
      color: var(--soft-ink);
      font: 700 .875rem var(--font-sans);
      letter-spacing: 0;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
    }
    .card {
      display: grid;
      grid-template-columns: 56px minmax(0, 1fr);
      gap: 16px;
      align-items: start;
      min-width: 0;
      background: var(--panel);
      border: 1px solid var(--hairline);
      border-radius: 8px;
      padding: 20px;
      box-shadow: var(--shadow);
      position: relative;
      will-change: opacity;
    }
    .card::before {
      content: "";
      position: absolute;
      inset: 0 auto 0 0;
      width: 4px;
      border-radius: 8px 0 0 8px;
      background: var(--confirmed);
    }
    .rank {
      color: var(--seal);
      font: 800 1.125rem/1.1 var(--font-sans);
      font-variant-numeric: tabular-nums;
      margin: 0;
      padding-top: .1875rem;
    }
    .logo {
      display: none;
    }
    .main { min-width: 0; }
    .heading-row {
      display: flex;
      gap: 10px;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--hairline);
    }
    h2 {
      margin: 0;
      overflow-wrap: anywhere;
      font-size: clamp(1.1875rem, 1.6vw, 1.5rem);
      font-weight: 750;
      letter-spacing: 0;
      line-height: 1.25;
    }
    dl {
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
      margin: 0;
      font-family: var(--font-sans);
    }
    dl > div {
      min-width: 0;
      border: 1px solid #e4e9f0;
      border-radius: 6px;
      background: var(--field);
      padding: 10px 12px;
    }
    dt {
      color: var(--muted);
      font-size: .75rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: .04em;
    }
    dd {
      margin: 5px 0 0;
      color: var(--soft-ink);
      font-size: .96875rem;
      line-height: 1.5;
      overflow-wrap: anywhere;
    }
    .profile-missing,
    .website-link.unknown {
      color: var(--muted);
      font-size: .8125rem;
      margin-left: 4px;
    }
    .hidden,
    [hidden] {
      display: none !important;
    }
    .filter-reveal {
      animation: filterReveal 120ms ease-out both;
    }
    @keyframes filterReveal {
      from { opacity: .72; }
      to { opacity: 1; }
    }
    footer {
      border-top: 1px solid var(--hairline);
      padding: 22px clamp(20px, 6vw, 72px);
      background: rgba(255,253,248,.74);
      color: var(--soft-ink);
      font: .875rem/1.5 var(--font-sans);
    }
    @media (min-width: 760px) {
      .grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .card {
        grid-template-columns: 54px minmax(0, 1fr);
      }
    }
    @media (min-width: 1180px) {
      .grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    }
    @media (min-width: 1680px) {
      .grid {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }
    }
    @media (max-width: 700px) {
      .toolbar {
        grid-template-columns: 1fr;
      }
      .heading-row {
        display: block;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      html { scroll-behavior: auto; }
      .card {
        animation: none !important;
        will-change: auto;
      }
    }
  </style>
</head>
<body>
  <a class="skip-link" href="#main-content">Skip to main content</a>
  <header>
    <p class="kicker">Forbes Accessibility List 2026</p>
    <h1>Accessibility 200</h1>
    <p id="page-summary">A research dataset of ${rows.length} accessibility-focused organizations, leaders, impact areas, headquarters, Forbes profile links, official websites, and public personal profiles. The ↗ symbol indicates an external link; that destination may not follow this website's accessibility policy.</p>
  </header>
  <form class="toolbar" role="search" aria-label="Filter the Accessibility 200 list">
    <div class="field">
      <label for="search">Search the list</label>
      <input id="search" type="search" placeholder="Search by name, leader, area, or location" autocomplete="off" aria-describedby="page-summary results-count">
    </div>
    <div class="field">
      <label for="area">Impact area</label>
      <select id="area" aria-describedby="results-count">
        <option value="">All impact areas</option>
        ${impactAreas.map((area) => `<option value="${escapeHtml(area)}">${escapeHtml(area)}</option>`).join("")}
      </select>
    </div>
  </form>
  <main id="main-content" tabindex="-1">
    <p class="count" id="results-count" aria-live="polite"><span id="visible-count">${rows.length}</span> of ${rows.length} entries shown</p>
    <p class="count" id="no-results" hidden>No entries match the current filters.</p>
    <section class="grid" id="cards" aria-label="Accessibility 200 entries">${cards}</section>
  </main>
  <footer>
    <p>This is not an official Forbes dataset and is intended for research and reference purposes. Please verify entries before formal use.</p>
  </footer>
  <script>
    const search = document.querySelector("#search");
    const area = document.querySelector("#area");
    const cards = [...document.querySelectorAll(".card")];
    const count = document.querySelector("#visible-count");
    const noResults = document.querySelector("#no-results");
    const filterForm = document.querySelector(".toolbar");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function applyFilters() {
      const term = search.value.trim().toLowerCase();
      const selected = area.value;
      let visible = 0;

      for (const card of cards) {
        const wasHidden = card.hidden;
        const matchedSearch = !term || card.dataset.search.includes(term);
        const matchedArea = !selected || card.dataset.area === selected;
        const show = matchedSearch && matchedArea;
        card.classList.remove("filter-reveal");
        card.hidden = !show;

        if (show && wasHidden && !reduceMotion.matches) {
          requestAnimationFrame(() => card.classList.add("filter-reveal"));
        }

        if (show) visible += 1;
      }

      count.textContent = visible;
      noResults.hidden = visible !== 0;
    }

    filterForm.addEventListener("submit", (event) => event.preventDefault());
    search.addEventListener("input", applyFilters);
    area.addEventListener("change", applyFilters);
  </script>
</body>
</html>
`;

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, html);
console.log(`Rendered ${outputPath} from ${inputPath}.`);
