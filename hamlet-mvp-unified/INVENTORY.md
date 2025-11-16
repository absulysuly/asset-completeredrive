# HAMLET MVP Unified Inventory

## Frontend Inventory
- **`asset-completeredrive/hamlet-platform-nextjs/`** – Vite/React SPA that blends a governorate-aware social feed with a deep election dashboard. Strengths: Arabic/Kurdish/English copy, RTL-safe components, glassmorphism system, social primitives (`PostCard`, `ComposeView`, `LoginModal`, `HomeView` tabbing) already wired to mock APIs. Weakness: navigation and hero blocks focus heavily on election marketing.
- **`asset-completeredrive/test-new-frontend/`** – Vite/React “Iraq Compass” experience. Strengths: category grid, business/event cards, translations with dir-awareness, inclusive/high-contrast toggles, mock governorate filtering. Weakness: shipped with CDN Tailwind + import maps; no real backend wiring.
- **`asset-completeredrive/hamlet-unified-complete-2027/test-new-frontend/`** – duplicate of the Compass build, bundled with additional scripts for data collection.
- **`asset-completeredrive/HamletUnified/full_consolidation/frontend-aigoodstudeio/`** – clean Next.js 14 brochure/landing site that proves deployment tooling but lacks social/compass depth.

## Backend Inventory
- **`asset-completeredrive/hamlet-unified-complete-2027/backend/`** *(copied to `hamlet-mvp-unified/backend/`)* – Node 18 + Express + Prisma. Mock data lives in `src/mockData.ts`, and routers already expose `/api/social` (posts, events, debates), `/api/civic` (stats, governorate data), and `/api/candidatePortal`. Good starting point for thin MVP API.
- **`asset-completeredrive/unified-hamlet-backend/`** – Another Express + Prisma service, but social routes are stubs that simply return “coming soon”. Better for long-term election ingest but not ideal for this MVP.
- **`asset-completeredrive/HamletUnified/full_consolidation/backend/`** – placeholder README noting the original backend repo was missing.

## Shared Assets & Systems
- **Translations** – `asset-completeredrive/dictionaries/{ar,en,ku}.json` plus UI copy in `frontend/translations.ts`. Copied JSON packs live in `assets/dictionaries/` for reuse.
- **Iconography** – `asset-completeredrive/icons/Icons.tsx` (Compass icon, verified badge, etc.) now mirrored under `assets/icons/` and consumed by the unified frontend.
- **Color/Glass system** – CSS variables + `utils/colorThemes.ts` from the social repo, and Tailwind tokens from Compass, now merged into `frontend/app/globals.css` + `tailwind.config.ts`.

## Election Code – TO IGNORE FOR MVP
- Frontend election dashboards remain isolated under `frontend/components/election/` plus supporting views (`components/views/ElectionManagementView.tsx`, `components/election/pages/*`).
- `frontend/translations.ts` still contains election strings, but navigation now omits those screens.
- Backend election endpoints (`/api/candidatePortal`, `/api/civic`) stayed intact but unused by the MVP flow.

## Chosen Bases & Consolidation
- **Social base:** `hamlet-platform-nextjs` (for its multilingual social feed, Compose flow, and glass UI). The full app skeleton now lives under `hamlet-mvp-unified/frontend/` with a Vite toolchain. The MVP keeps `Header`, `Sidebar`, `BottomBar`, `LoginModal`, `PostCard`, `ComposeView`, and supporting services (`services/apiService.ts`).
- **Compass base:** `test-new-frontend` (best category grid + directory). Components were copied into `frontend/compass/components/`, with stateful shell logic in `frontend/compass/components/CompassShell.tsx` and exported via `frontend/compass/CompassView.tsx`.

### Key Frontend Placements
- Social feed entry: `frontend/App.tsx` renders `components/views/HomeView.tsx` for Tab 1 (HOME) and lazy-loads `compass/CompassView.tsx` for Tab 2 (COMPASS). Profile still points to `components/views/UserProfileView.tsx`.
- Governorate filter & feed: `components/views/HomeView.tsx` now focuses on `ComposeView`, `PostCard`, and a single governorate dropdown – party/gender filters and tea-house/reel tabs were removed to align with MVP scope.
- Compass pieces:
  - Category grid & filters – `frontend/compass/components/CategoryGrid.tsx` + `GovernorateFilter.tsx`.
  - Business directory & cards – `frontend/compass/components/BusinessDirectory.tsx`, `FeaturedBusinesses.tsx`, `DealsMarketplace.tsx`.
  - Event/personalization – `frontend/compass/components/PersonalizedEvents.tsx`, `CommunityStories.tsx`, `CityGuide.tsx` (optionally powered by `@google/genai`).
  - Shell wrapper – `frontend/compass/components/CompassShell.tsx` hosts the navigation, modal flows, and high-contrast toggle. `frontend/compass/CompassView.tsx` simply renders that shell inside the global React tree.
- Shared styling lives in `frontend/app/globals.css` (fonts + glass system) and an expanded `tailwind.config.ts` that now covers `components/`, `compass/`, and service folders.

### Backend Notes
- `hamlet-mvp-unified/backend/` mirrors the Express project from `hamlet-unified-complete-2027`. Routes of interest:
  - `src/routes/social.ts` – `GET /posts`, `POST /posts`, likes/comments, `GET/POST /events`.
  - `src/routes/civic.ts` – governorate stats + report intake (useful for future Compass insights).
  - Auth, Facebook ingest, and candidate portal endpoints remain for future wiring but are not invoked in this MVP.
- TODO for the next phase: point the frontend’s axios helpers (`services/apiService.ts`) to this backend instead of mock promises.

## Election Isolation Status
- Navigation: `Sidebar.tsx` and `BottomBar.tsx` only expose HOME, COMPASS, and PROFILE. Candidate dashboards, analytics, whisper/tea-house tabs, and countdown hero blocks were removed from `App.tsx`/`HomeView.tsx` so the UI loads directly into the social feed.
- Components still stored under `frontend/components/election/` for archival purposes but no longer imported into the runtime bundle.
- `HomeView` now loads a single feed tab; reels, women/minority showcases, and tea-house/discussion panels are hidden.

## Current Entry Points & TODOs
- **Frontend dev command:** run `npm install && npm run dev` from `hamlet-mvp-unified/frontend/` (Vite). Entry file `index.tsx` mounts `App.tsx`.
  - Tab 1 (Social Home): `components/views/HomeView.tsx` (governorate filter + `PostCard`).
  - Tab 2 (Compass): `compass/CompassView.tsx` (category grid → listings, events, dashboard).
  - Profile: `components/views/UserProfileView.tsx` (still uses mock data; needs backend wiring).
- **Backend dev command:** `npm install && npm run dev` inside `hamlet-mvp-unified/backend/`. Starts Express server with the mock Prisma layer.
- **Assets:** translations at `assets/dictionaries/`, icons at `assets/icons/` for shared consumption.

### Remaining Work / Notes for Next AI
1. **API wiring:** Point `services/apiService.ts` to the Express backend and replace mock arrays with real fetch calls (posts, likes, comments, places, events).
2. **Auth & profile data:** Login modal still simulates auth; integrate with backend auth endpoints or stub JWT flow.
3. **Compass data:** Components currently read from `compass/constants.tsx`. Swap in backend-driven `GET /places` / `GET /events` once endpoints exist.
4. **Testing:** run `npm run dev` / `npm run build` in `frontend/` and `npm run dev` in `backend/` to ensure the consolidated stack works end-to-end.
5. **Keep election code dormant:** Do not delete `frontend/components/election` yet; it remains a reference but should stay disconnected from navigation until election features return to scope.
