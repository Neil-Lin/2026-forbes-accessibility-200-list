# Forbes Accessibility 200 Data

This project organizes the Forbes Accessibility 200 list and enriches the original list information with personal profile links and official website URLs for each selected person or organization.

The goal is to make the list easier to research, browse, filter, and manually review.

## Contents

Main files:

- `forbes_accessibility_200.json`: The structured dataset of 200 entries, including organization name, lead accessibility officer, impact area, headquarters, Forbes profile, official website, and personal profile links.
- `forbes_accessibility_200.md`: A GitHub-readable Markdown table version of the dataset, generated from the JSON file.
- `forbes_accessibility_200.html`: A browsable HTML version generated from the JSON file for easier reading and searching.

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
