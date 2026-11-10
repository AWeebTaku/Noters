# Suggestions: Noters

Priority: **Low**, only worth touching to remove the "learning project" caveat.

1. Add user auth (JWT or sessions) so notes are per-user; this fixes the README's main warning.
2. Backend tests (supertest + in-memory Mongo) and input validation (zod).
3. Deploy a demo and link it.

Or: leave as-is and hide it from the portfolio. Don't invest more than a day.

## Recolor the app to match the portfolio: pink

The portfolio card uses pink `#e879a8`; keep it. Change the app so it matches. Today the daisyUI themes in `frontend/src/index.css` use emerald green as primary.

- `noters-dark` theme: `--color-primary: #e879a8; --color-primary-content: #2a0a17;`
- `noters` (light) theme: `--color-primary: #be185d; --color-primary-content: #ffffff;` (a darker pink, so buttons and text keep contrast on white).
- Search the frontend for hard-coded green classes (`emerald`, `green`, `#047857`, `#34d399`) and swap them for `primary`/`pink` equivalents.
- Leave `--color-error` red, but check that red errors still stand out against a pink primary.
- Replace the portfolio's Noters screenshot/preview if it shows the old green UI.
- Check contrast (WCAG AA, 4.5:1 for text) in both themes.
