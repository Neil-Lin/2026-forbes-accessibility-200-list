# Forbes Accessibility 200 Data

This project organizes the Forbes Accessibility 200 list and enriches the original list information with personal profile links and official website URLs for each selected person or organization.

The goal is to make the list easier to research, browse, filter, and manually review.

## Contents

Main files:

- `forbes_accessibility_200.json`: The structured dataset of 200 entries, including organization name, lead accessibility officer, impact area, headquarters, Forbes profile, official website, and personal profile links.
- `output/forbes_accessibility_200.md`: A GitHub-readable Markdown table version of the dataset, generated from the JSON file.
- `output/forbes_accessibility_200.html`: A browsable HTML version generated from the JSON file for easier reading and searching.
- `output/index.html`: The GitHub Pages homepage, generated from the JSON file.
- `render_markdown_from_json.mjs`: Generates the Markdown table from the JSON dataset.
- `render_from_json.mjs`: Generates the browsable HTML page from the JSON dataset.

## Generate Outputs

The JSON file is the source of truth. Regenerate the derived Markdown and HTML outputs with:

```sh
node render_markdown_from_json.mjs
node render_from_json.mjs
```

Generated files are written to `output/` so they stay separate from source files.

GitHub Pages is deployed by `.github/workflows/pages.yml`. The workflow regenerates `output/` and publishes it whenever changes are pushed to `main`.

## JSON Schema

Each entry in `forbes_accessibility_200.json` generally follows this structure:

```json
{
  "position": 1,
  "name": "Organization Name",
  "leadAccessibilityOfficer": "Person Name",
  "impactArea": "Software",
  "headquarters": "City, Country",
  "forbesProfile": "https://www.forbes.com/companies/...",
  "personalProfiles": [
    {
      "name": "Person Name",
      "url": "https://www.linkedin.com/in/..."
    }
  ],
  "website": "https://official-website.example",
  "websiteType": "verified",
  "description": ""
}
```

## Notes

This is not an official Forbes dataset and is not endorsed, sponsored, or authorized by Forbes.

The data is intended for research and reference purposes related to accessibility leaders, organizations, and their public links. Please re-check any entry as needed before using it in formal publications, outreach, or decision-making.

## License

MIT License. See `LICENSE`.
