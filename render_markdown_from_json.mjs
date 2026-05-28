import fs from "node:fs";

const inputPath = "forbes_accessibility_200.json";
const outputDir = "output";
const outputPath = `${outputDir}/forbes_accessibility_200.md`;

const rows = JSON.parse(fs.readFileSync(inputPath, "utf8")).sort(
  (a, b) => Number(a.position) - Number(b.position)
);

function clean(value) {
  return value == null ? "" : String(value).replace(/\s+/g, " ").trim();
}

function escapeCell(value) {
  return clean(value).replaceAll("|", "\\|");
}

function escapeLinkText(value) {
  return escapeCell(value).replaceAll("[", "\\[").replaceAll("]", "\\]");
}

function link(label, url) {
  const cleanUrl = clean(url);
  const cleanLabel = escapeLinkText(label);
  return cleanUrl ? `[${cleanLabel}](${cleanUrl})` : cleanLabel;
}

function profileCell(row) {
  const profiles = Array.isArray(row.personalProfiles) ? row.personalProfiles : [];
  if (!profiles.length) return escapeCell(row.leadAccessibilityOfficer || "N/A");

  return profiles
    .map((profile) => link(profile.name || row.leadAccessibilityOfficer || "N/A", profile.url))
    .join("<br>");
}

function websiteCell(row) {
  return clean(row.website) ? link("Website", row.website) : "N/A";
}

function forbesCell(row) {
  return clean(row.forbesProfile) ? link("Forbes", row.forbesProfile) : "N/A";
}

const markdown = [
  "# Forbes Accessibility 200 Data",
  "",
  "This Markdown file is generated from `forbes_accessibility_200.json` and presents the enriched Forbes Accessibility 200 list in a GitHub-readable table.",
  "",
  "> Note: This is not an official Forbes dataset. It is intended for research and reference purposes.",
  "",
  "| # | Organization | Lead Accessibility Officer / Profile | Impact Area | Headquarters | Official Website | Forbes Profile |",
  "|---:|---|---|---|---|---|---|",
  ...rows.map(
    (row) =>
      `|${escapeCell(row.position)} | ${escapeCell(row.name)} | ${profileCell(row)} | ${escapeCell(
        row.impactArea || "N/A"
      )} | ${escapeCell(row.headquarters || "N/A")} | ${websiteCell(row)} | ${forbesCell(row)}|`
  ),
  "",
].join("\n");

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, markdown);
console.log(`Rendered ${outputPath} from ${inputPath}.`);
