# Ngo Thien An · Portfolio

[**Visit the live portfolio →**](https://annt206.github.io/Portfolio/) · [GitHub profile](https://github.com/AnNT206) · [Download CV (PDF)](resume.pdf)

Personal portfolio of Ngo Thien An, a Software Engineering student at FPT University in Ho Chi Minh City, seeking a Java Developer Internship.

## Featured projects

- **[Smart StudyHub RAG](https://github.com/Tung-pro123/Smart-StudyHub-RAG)** — academic team project. My contributions include AI settings, admin tools, subscription management, and RAG quota controls.
- **[LegacyVault](https://github.com/Abaddon8386/Legacy_Vault)** — academic team project. My contributions include backend APIs, check-in processing, password recovery, and notification integrations.

## Website

Built with HTML, CSS, and vanilla JavaScript — no build step. Four pages with responsive layouts, light/dark themes and an English/Vietnamese switch (both choices are remembered in the browser).

- `index.html` — home: intro, photo strip, selected work, contact
- `about.html` — story, interests, education and certifications
- `projects.html` — full project write-ups and toolkit
- `uses.html` — hardware and software I use every day
- `style.css` — responsive styles
- `script.js` — theme and language switches
- `i18n.js` — Vietnamese translations (English lives in the HTML)
- `images/` — photos (resized, metadata stripped) and the social share image
- `resume.pdf`, `resume.docx` — English CV
- `favicon.svg`, `sitemap.xml`, `robots.txt` — icon and SEO
- `check.cjs` — checks links, anchors, assets, translation keys and both toggles

To add text: put the English in the HTML with a `data-i18n="key"` attribute and the Vietnamese under the same key in `i18n.js`. `node check.cjs` fails if a key is missing on either side.

Open `index.html` locally, or run `python -m http.server 8000` and visit `http://localhost:8000`.

Run checks with `node check.cjs`.

## Deployment

GitHub Pages publishes the repository root from the `main` branch. Changes committed or pushed to `main` automatically trigger deployment.

## Design reference

Visual inspiration: [Brian Ruiz](https://www.b-r.io/). Portfolio content is based on my CV; project graphics are decorative illustrations, not application screenshots.
