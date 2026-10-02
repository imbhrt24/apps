# Apps &amp; Games

Live, self-contained browser builds by [Bharat](https://github.com/imbhrt24), made with Claude. Hosted on GitHub Pages.

| App | What it is | Stack |
|-----|-----------|-------|
| [`gully-run/`](gully-run/) | Indian-street endless-runner game (गली रन) | Three.js, GLTF/FBX, HDRI |
| [`uttarakhand/`](uttarakhand/) | Himalayan hill-driving game MVP | Three.js (Vite build), Draco |
| [`piano/`](piano/) | AURA — playable piano + visualiser + take gallery | Web Audio, Tone.js, IndexedDB |
| [`dashboard/`](dashboard/) | Life Dashboard — notes, tasks, goals, journal, calculators | Vanilla JS, Chart.js, localStorage |
| [`illustro/`](illustro/) | Text → on-brand illustration | Google Gemini image API (your own key), IndexedDB |
| [`a11y/`](a11y/) | Accessibility, by Example — learn accessibility one component at a time (buttons, toggles, modals, tables) | Vanilla HTML/CSS/JS |

## Notes
- Everything runs client-side. `piano`, `dashboard` and `illustro` ask for **your own** API key where needed — no keys are stored in this repo, only in your browser.
- `gully-run` asset credits are in [`gully-run/CREDITS.md`](gully-run/CREDITS.md) (Sketchfab CC-BY, Poly Haven CC0, Mixamo).
- Served with GitHub Pages from the repo root (`.nojekyll` is present so all folders publish as-is).
