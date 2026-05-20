# Sitemap Generation Prompt

You are a UX architect. Generate a sitemap for a website based on the project description and selected UX improvements.

## Input

**Project description:**
{{form_input}}

**Reference navigation (if available):**
{{nav_structure}}

**UX improvements to apply:**
{{improvements}}

## Task

Generate a complete sitemap as a nested JSON tree. Each node must have:
- id: unique string (use slugified page name, e.g. "home", "about", "contact")
- name: page display name (e.g. "Home", "About Us")
- description: 1 sentence describing the page's purpose
- children: array of child nodes (empty array for leaf pages)
- parentId: parent node's id, or null for the root
- improved: true if this node was added/modified because of one of the UX improvements above, false otherwise

Root node is always "Home" with parentId: null.

## Output format

Return ONLY valid JSON, no markdown fences, no extra text. Single root node:

{
  "id": "home",
  "name": "Home",
  "description": "Main landing page",
  "children": [...],
  "parentId": null,
  "improved": false
}
