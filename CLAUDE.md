# apps — Bharat's public apps and games

Static, client-side projects, one folder each. No build step at the repo root.
Served by GitHub Pages from `main` at https://imbhrt24.github.io/apps/ — **every push to `main` is live within about a minute.**

## Working rules
- Work on a branch and open a pull request. Do not push to `main` unless asked.
- This repo is public. Never commit API keys; apps that need a key ask the user for it in the browser.
- Keep each project self-contained in its folder. No shared code between folders.
- Plain HTML, CSS and JavaScript unless the folder already uses something else. No new dependencies or build tools without asking.
- When adding a project, add a card to `index.html` and a row to `README.md`.
- Large binaries (models, HDRIs, audio) already make the repo over 100 MB. Do not add more without asking.

## Preview
```bash
python3 -m http.server 4173
```
Then open `http://localhost:4173/<folder>/`.

## Projects
| Folder | What it is |
|---|---|
| `a11y/` | "Accessibility, by Example" — accessibility learning site for junior UX designers (see below) |
| `gully-run/` | Indian-street endless runner (Three.js) |
| `uttarakhand/` | Hill-driving game, checked in as a built Vite bundle |
| `piano/` | Playable piano and visualiser |
| `dashboard/` | Life dashboard (notes, tasks, goals) |
| `illustro/` | Text to illustration, using the visitor's own Gemini key |

## `a11y/` — Accessibility, by Example
Audience: a junior UX designer who knows contrast and touch targets and wants to know what else each component needs. Plain language, British spelling, no developer jargon in the teaching text (code belongs only in the collapsed "rule, for handoff" note).

Files: `index.html` (home), `foundations.html`, `buttons.html`, `toggles.html`, `modals.html`, `tables.html`, shared `assets/site.css` and `assets/site.js`. No dependencies.

How a component page is built (copy `toggles.html` for a new one):
- `<body data-page="…">`; the sidebar, icons and progress are injected by `site.js`.
- An anatomy panel with `<a class="pin" href="#topic-id">` and an empty `#anatomy-list`.
- Three `<section class="tier" data-tier="1|2|3">`: basics, often missed, senior traps.
- Each `<article class="topic" id="…" data-who="…" data-check="…">` holds an `h3`, `.lead`, a `.pair` of `.demo.bad` / `.demo.good`, optional `.try`, `.figma`, and `details.rule`. `data-check` is the line shown in the printable checklist.
- Live demos use data attributes handled in `site.js`: `data-sr` (simulated screen reader text, `{state}` is filled in), `.sr` strips, `data-open` / `data-close` modals with `.tracker` lists, `data-stepper` tables, `data-sort`, `data-loading`, `data-sim`, `data-contrast`.
- A quiz as JSON inside `[data-quiz]`, and a `#checklist-body`.
- Register the page in the `PAGES` array at the top of `site.js` (id, href, label, id prefix, topic count).

Quality bar: the site must itself be accessible (keyboard, visible focus, light and dark, no sideways scroll at 375 px). Every WCAG reference must be checked against WCAG 2.2. "Avoid" demos are broken on purpose; do not "fix" them.

Planned next: Forms, Tabs and Toasts pages (shown as "coming soon" in the sidebar).
