# Badr Albdulmajeed — Portfolio (bader915.github.io)

Single-page portfolio for Badr Albdulmajeed (Electrical & Electronic Engineering), built on the
**DarkCV** Bootstrap template layout: a sticky left sidebar (photo, name, social links, Download CV)
and a scrollable right column (About, Skills, Experience, Education, Services, Portfolio, Certificates, Contact).

- **Responsive:** Bootstrap 5 grid — the sidebar collapses into a stacked layout below `992px`, with extra refinements at `720px` and `480px`.
- **Data-driven:** content (roles, skills, experience, education, languages, all 29 projects, courses) lives in `data.json` and is rendered client-side by `js/main.js` via `fetch`. If the data fails to load, the page shows a visible error banner (`body.data-load-error`).
- **Contact email:** bbhg.work@gmail.com
- **CV:** `assets/Badr Albdulmajeed CV.pdf` (keep in sync with the latest CV package).

## Structure

```
index.html              # page shell: landmarks, mounts, static sections
data.json               # ALL content: roles, skills, experience, education,
                        # languages, selectedProjects (10), otherProjects (19),
                        # courses (7 MathWorks certificates)
css/bootstrap.min.css   # customized Bootstrap 5 (green #00B87B theme)
css/style.css           # template overrides, a11y helpers, responsive rules
js/main.js              # data fetch + renderers, typed effect, skill bars,
                        # portfolio filter, back-to-top (no dependencies)
assets/                 # CV PDF, certificates, Credly badge, photo, screenshots
```

## Editing content

Almost all content edits belong in `data.json` — projects, skills, experience,
education, languages and certificate links. To edit a project, change it there;
the site renders it on next load. Certificates' `href` values must match the
filenames in `assets/` exactly (GitHub Pages is case-sensitive).

## Preview locally

The page loads its content through `fetch("data.json")`, which browsers block on
the `file://` protocol — serve the folder over HTTP instead:

```
python -m http.server 8000
```

Then open http://localhost:8000.
