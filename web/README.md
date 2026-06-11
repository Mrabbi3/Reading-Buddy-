# Reading Buddy — Web (standalone)

A faithful reconstruction of the Reading Buddy web app design, unpacked from the
standalone HTML export into editable files.

## Run it

Babel transpiles the JSX in the browser, which requires the files to be served
over HTTP (opening `index.html` via `file://` is blocked by the browser's
same-origin policy for `text/babel` `src` scripts).

```bash
cd web
python3 -m http.server 8080
# then open http://localhost:8080
```

Any static server works (e.g. `npx serve`, VS Code Live Server).

## Structure

- `index.html` — entry; loads fonts, styles, vendor libs, then the app sources
- `fonts.css` + `fonts/` — Fraunces (serif) & Hanken Grotesk (sans), self-hosted
- `styles.css` — all component styles (paper/ink palette, amber accent)
- `vendor/` — React 18, ReactDOM 18, Babel standalone (transpiler)
- `src/`
  - `icons.jsx` — stroked icon set + sample book data
  - `reader2.jsx` — Kindle-class reader data/components
  - `tweaks-panel.jsx` — design tweaks panel (dev tool)
  - `web-landing.jsx` — marketing landing page
  - `web-reader.jsx` — logged-in library + two-pane reader with margin rail
  - `web-app.jsx` — root: landing ⇄ logged-in, quota, toast
- `images/` — hero + iOS promo artwork
