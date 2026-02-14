# ZimPOS

Offline-first mobile POS for Zimbabwe SMEs. Expo + Convex.

## Setup

- **Expo:** From project root run `npm install`, then `npx expo start`. Convex is not linked to any existing project; add backend when you start the sync layer.
- **Convex (new project):** From project root run `npx convex dev` when ready; it will create a new Convex project and link this app.

## Folder structure

- `app/` — Expo Router screens (`(auth)`, `(main)`, etc.)
- `components/` — UI components
- `constants/` — Theme, config
- `hooks/` — React hooks
- `lib/domain/` — Business rules (money, stock, permissions, receipts)
- `lib/data/` — SQLite repositories (to be added)
- `lib/sync/` — Convex sync service (to be added)
- `convex/` — Convex schema and functions (standalone; no existing project link)

Next: build out the architectural side (domain, data, then sync).
