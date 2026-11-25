# Noters: plan

Reference: `../career-job-search-and-project-priorities.md` (priorities), `../career-role-market-research.md` (market evidence), `../profile-resume.md` and `../profile-portfolio.md` (how to present it).

## Brief

**Status:** built. **One line:** MERN notes app, to be upgraded into a real full-stack project.

**Roles it serves:** Full-stack web (lead, after upgrade)

**Stack:** React, Node.js, Express, MongoDB, Tailwind, daisyUI, Upstash Redis rate limiting

**Resume and portfolio line (truthful, edit numbers only if they change):**
- Today: REST API, rate limiting (100 requests per minute), light and dark UI. After upgrade add: accounts, validation, tests, CI, TypeScript.

**Proof gaps (what a reviewer will look for):**
- No auth, no tests, no CI; README calls it a learning project; free hosting sleeps.

**Next (only this):**
Run the upgrade list in the suggestions section below.

## Suggestions and status log

Priority: **Low**, only worth touching to remove the "learning project" caveat.

1. Add user auth (JWT or sessions) so notes are per-user; this fixes the README's main warning.
2. Backend tests (supertest + in-memory Mongo) and input validation (zod).
3. Deploy a demo and link it.

Or: leave as-is and hide it from the portfolio. Don't invest more than a day.

### Recolor the app to match the portfolio: pink

The portfolio card uses pink `#e879a8`; keep it. Change the app so it matches. Today the daisyUI themes in `frontend/src/index.css` use emerald green as primary.

- `noters-dark` theme: `--color-primary: #e879a8; --color-primary-content: #2a0a17;`
- `noters` (light) theme: `--color-primary: #be185d; --color-primary-content: #ffffff;` (a darker pink, so buttons and text keep contrast on white).
- Search the frontend for hard-coded green classes (`emerald`, `green`, `#047857`, `#34d399`) and swap them for `primary`/`pink` equivalents.
- Leave `--color-error` red, but check that red errors still stand out against a pink primary.
- Replace the portfolio's Noters screenshot/preview if it shows the old green UI.
- Check contrast (WCAG AA, 4.5:1 for text) in both themes.

### Status update (2026-11-11) and new priority

Priority: **Medium. Becomes the backend for the Android app** (see `../Summarizer-Android/PLAN.md`, "Smaller first app" option).

Done: pink recolor, favicon, license.
Left:
- [ ] Auth (JWT) so notes are per-user; then remove the "learning project, shared notes" warning.
- [ ] Backend tests (supertest) and input validation (zod).
- [ ] CI workflow (no `.github` yet).
- [ ] Update `updatedAt`-style fields in the API if you want offline sync later (needed for the Android client).

### Role-focus update (2026-11-25)

**Roles:** Full-stack web (becomes the lead). **Priority: #1 build (1-2 weeks).** This is your weakest card today and your cheapest route to a full-stack proof, because it is already deployed.
Upgrade list, in order:
- [x] **Auth**: sign up / log in, bcrypt hashed passwords, httpOnly cookie JWT; notes belong to a user; "shared notes" warning removed (only the demo account is shared).
- [x] **TypeScript** on backend and frontend (Express API kept, React kept).
- [x] **Validation** with Zod; one error format (`{ message, errors? }`); pagination and search on `GET /api/notes`.
- [x] **Tests**: 9 supertest API tests (including "user A cannot read user B's note") and 6 component tests; **CI** workflow in `.github/workflows/ci.yml`.
- [x] **Database**: staying on MongoDB (decision recorded in the README).
- [ ] **Deploy** with a visible demo account. Code is ready (demo seed script, "waking up the server" message). Still to do by hand: push, add `JWT_SECRET` on Render, run `npm run seed --prefix backend` once, check the live site.
- [~] **README**: architecture, API table and "Known limits" done. Screenshot still missing.
Until the deploy is verified, keep Noters out of the resume (see `../profile-resume.md`).

### Status update (2026-11-25, upgrade built)

Done locally, not yet committed or deployed. `npm test` passes (9 API + 6 component tests), frontend lint, typecheck and build are clean, and the server boots against the real MongoDB and Upstash.
Left:
- [ ] Commit and push, then confirm the CI run is green.
- [ ] Add `JWT_SECRET` to the Render environment, redeploy, run the seed script, try the demo button on the live site.
- [ ] Take a screenshot for the README.
- [ ] Optional: keep-alive ping so the free tier does not sleep; MongoDB text index for search.
- [ ] Old notes with no owner are hidden. Delete them in Atlas or assign them to an account.
