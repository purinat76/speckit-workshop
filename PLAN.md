# Speckit Photo Organizer — Implementation Plan

## Overview
Build a production-ready photo organizer web app using **Vite**, **vanilla HTML/CSS/JavaScript**, and **local SQLite** for metadata storage. Albums are organized by hierarchical date grouping with drag-and-drop support and full undo/redo. Photos are stored locally (no cloud upload).

## Tech Stack

### Frontend
- **Build tool**: Vite (fast HMR, minimal config, tree-shaking)
- **UI**: Vanilla HTML, CSS (grid/flexbox, CSS variables for theming)
- **JavaScript**: Vanilla JS (no React, Vue, or Angular; minimal dependencies)
- **State management**: In-memory state + localStorage for UI preferences; database for metadata persistence
- **Database access**: sql.js (SQLite compiled to WASM) or IndexedDB as fallback

### Backend / Storage
- **Metadata store**: SQLite (local, using sql.js or electron-sql-bricks if Electron wrapper needed)
- **Photo storage**: Local filesystem (drag/drop or file input); no cloud sync in MVP
- **Persistence**: sql.js in-memory with periodic dump to IndexedDB or localStorage (serialized JSON backup)

### Quality & DevOps
- **Testing**: Vitest (lightweight, Vite-native) for unit/integration tests
- **Linting**: ESLint + Prettier
- **Type checking**: Optional JSDoc or TypeScript (start with JSDoc for quick iteration)
- **CI/CD**: GitHub Actions with:
  - Lint check
  - Unit tests
  - Build verification
  - Bundle size report (optional: Lighthouse CI)

## Architecture

### High-Level Layers

```
┌─────────────────────────────────────────┐
│  UI Layer (Vanilla JS + DOM)            │
│  - Album list, grouping controls        │
│  - Drag-and-drop handlers               │
│  - Modal dialogs                        │
└────────────────┬────────────────────────┘
                 │
┌─────────────────────────────────────────┐
│  State Management Layer                 │
│  - In-memory app state (immutable ops)  │
│  - Undo/redo history stack              │
│  - Event dispatcher                     │
└────────────────┬────────────────────────┘
                 │
┌─────────────────────────────────────────┐
│  Data Access Layer (DAL)                │
│  - Album CRUD operations                │
│  - Grouping & filtering queries         │
│  - Batch operations                     │
└────────────────┬────────────────────────┘
                 │
┌─────────────────────────────────────────┐
│  SQLite Database (sql.js)               │
│  - Albums table (id, title, date, ...)  │
│  - Photos table (id, album_id, path)    │
│  - Settings table (key, value)          │
└─────────────────────────────────────────┘
```

### File Structure

```
speckit-workshop/
├── index.html                 # Entry point
├── vite.config.js            # Vite configuration
├── package.json              # Dependencies
├── .github/workflows/        # CI/CD pipelines
│   ├── lint.yml
│   ├── test.yml
│   └── build.yml
├── src/
│   ├── main.js               # App initialization
│   ├── index.css             # Global styles
│   ├── db/                   # Database layer
│   │   ├── schema.js         # Schema definition & init
│   │   ├── dal.js            # Data access layer (queries)
│   │   └── sqlite.js         # sql.js wrapper
│   ├── state/                # State management
│   │   ├── appState.js       # Central state store
│   │   ├── history.js        # Undo/redo logic
│   │   └── actions.js        # Action creators
│   ├── ui/                   # UI components (vanilla JS)
│   │   ├── albumList.js      # Main album view
│   │   ├── groupHeader.js    # Group headers
│   │   ├── albumCard.js      # Album card component
│   │   ├── modal.js          # Modal dialog wrapper
│   │   ├── controls.js       # Header controls
│   │   └── styles/
│   │       ├── layout.css
│   │       ├── cards.css
│   │       ├── modal.css
│   │       ├── theme.css     # CSS variables
│   │       └── responsive.css
│   ├── utils/                # Utilities
│   │   ├── dateFormat.js
│   │   ├── dragDrop.js       # DnD utilities
│   │   ├── storage.js        # localStorage wrapper
│   │   └── imageCache.js     # Image preview caching
│   └── workers/              # Web Workers (optional)
│       └── dbWorker.js       # Offload heavy DB ops
├── tests/
│   ├── unit/
│   │   ├── dal.test.js
│   │   ├── state.test.js
│   │   ├── dateFormat.test.js
│   │   └── history.test.js
│   ├── integration/
│   │   ├── albums.test.js
│   │   └── dragDrop.test.js
│   └── fixtures/
│       └── sampleData.js
├── public/                   # Static assets
│   └── favicon.ico
├── CONSTITUTION.md           # Code quality principles
├── SPEC.md                   # Feature specification
└── PLAN.md                   # This file
```

## Database Schema

### Albums Table
```sql
CREATE TABLE albums (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,           -- YYYY-MM-DD
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  sort_order INTEGER DEFAULT 0  -- For custom ordering within date group
);
```

### Photos Table
```sql
CREATE TABLE photos (
  id TEXT PRIMARY KEY,
  album_id TEXT NOT NULL,
  file_path TEXT NOT NULL,      -- Local file path or blob URL
  size INTEGER,                 -- File size in bytes
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE
);
```

### Settings Table
```sql
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
-- Example rows:
-- ('grouping_mode', 'day')
-- ('last_backup', '2025-11-17T10:00:00Z')
```

### Indexes
```sql
CREATE INDEX idx_albums_date ON albums(date DESC);
CREATE INDEX idx_photos_album ON photos(album_id);
```

## Phased Delivery

### Phase 1: Core App (MVP) — Weeks 1–2
**Goal**: Functional photo organizer with local database and drag/drop.

- **Sprint 1a** (Days 1–2):
  - [ ] Vite project scaffold with build config
  - [ ] Basic HTML structure and global CSS
  - [ ] SQL schema and sql.js integration
  - [ ] Sample data loader

- **Sprint 1b** (Days 3–4):
  - [ ] Album list UI (vanilla JS)
  - [ ] Grouping modes (day/month/year)
  - [ ] Album cards with photo previews
  - [ ] Modal for album details

- **Sprint 1c** (Days 5–7):
  - [ ] Drag-and-drop within groups
  - [ ] Undo/redo with history stack
  - [ ] Persistence to SQLite + localStorage fallback
  - [ ] Acceptance tests for core features

**Deliverables**: Functional MVP with working database, grouping, DnD, and undo/redo.

### Phase 2: File Handling & Polish — Week 3
**Goal**: Photo import, image preview caching, mobile UX.

- **Sprint 2a** (Days 1–2):
  - [ ] File input (drag/drop or file picker) for photos
  - [ ] Image preview generation and caching
  - [ ] Album creation UI
  - [ ] Batch photo import

- **Sprint 2b** (Days 3–4):
  - [ ] Mobile-responsive tweaks
  - [ ] Keyboard navigation (ESC, arrow keys)
  - [ ] Accessibility audit (WCAG 2.1 AA baseline)
  - [ ] Performance optimizations (lazy loading, image resizing)

- **Sprint 2c** (Day 5):
  - [ ] Theme switcher (light/dark)
  - [ ] Settings UI (backup, export)
  - [ ] Documentation (README, inline comments)

**Deliverables**: Full-featured app with import, mobile UX, and a11y baseline.

### Phase 3: Advanced Features — Week 4 (Optional)
**Goal**: Search, filtering, advanced UX polish.

- [ ] Album search and filtering
- [ ] Batch operations (move, delete, rename)
- [ ] Custom sorting and tagging
- [ ] Export to JSON or Zip
- [ ] Scheduled backups (localStorage dump)

**Deliverables**: Enhanced app with pro features.

## Quality Gates

### Testing Strategy
- **Unit tests**: Database queries (DAL), date formatting, state mutations
- **Integration tests**: Album CRUD with undo/redo, drag/drop operations
- **E2E (manual or minimal automation)**: Full workflow (import → organize → export)
- **Coverage target**: 70%+ for critical paths (DAL, state management, history)

### CI/CD Pipeline
1. **Lint** (ESLint + Prettier): Enforce code style; fail on errors
2. **Build** (Vite): Verify no build errors; output production bundle
3. **Test** (Vitest): Run all tests; fail if coverage drops or tests fail
4. **Bundle analysis** (optional): Report bundle size; warn if over 200 KB gzipped
5. **Accessibility check** (optional): axe-core on sample pages

### Performance Budget
- **Initial load**: < 1.5s (lab conditions)
- **JS bundle**: < 150 KB gzipped (vanilla + sql.js overhead)
- **CSS**: < 30 KB gzipped
- **Database operations**: < 100ms for typical queries (< 1000 albums)

## Development Workflow

### Local Setup
```bash
git clone https://github.com/purinat76/speckit-workshop.git
cd speckit-workshop
npm install
npm run dev          # Start dev server with HMR
npm run build        # Production build to dist/
npm run preview      # Preview built app
npm test             # Run test suite
npm run lint         # Lint and format check
```

### GitHub Workflow
1. Create feature branch from `main`
2. Implement feature with tests
3. Open PR with description and acceptance criteria
4. CI pipeline runs (lint, build, tests)
5. Code review + approval
6. Merge to `main` (auto-deploy on success)

### Commit conventions
- `feat: add album grouping by month`
- `fix: correct undo/redo history clearing on mode change`
- `test: add DAL integration tests for album CRUD`
- `docs: update SPEC.md with new acceptance criteria`
- `chore: update dependencies, bump version`

## Dependencies

### Runtime
- **sql.js** (~600 KB, loaded async): SQLite in WASM
- **optional: IndexedDB** (native API): Fallback for large datasets
- **optional: localforage** (if IndexedDB fallback needed): ~8 KB

### Dev & Build
- **vite**: Fast dev server and build tool
- **vitest**: Lightweight test runner
- **eslint**: Code quality
- **prettier**: Code formatting
- **jsdom**: DOM emulation for tests (optional)

**Total runtime: ~600 KB (mostly sql.js); minimal app code.**

## Deployment

### Development
- **Local dev**: `npm run dev` → HMR at http://localhost:5173

### Production
- **Build**: `npm run build` → optimized `dist/` folder
- **Host**: Static hosting (Vercel, Netlify, GitHub Pages, or simple HTTP server)
- **Database**: sql.js runs in-browser; no server required
- **CDN**: Serve `dist/` assets via CDN for fast global delivery

### Backup & Export
- **Auto-save**: Periodically dump SQLite state to localStorage as JSON (optional)
- **Manual export**: Button to download database as `.sql` or `.json`
- **Import**: Restore from exported file

## Known Constraints & Risks

### Constraints
- **No cloud sync**: All data stays local; no cross-device sync in MVP
- **Single database per browser**: No multi-tab coordination (can be added with SharedWorker if needed)
- **Browser storage limits**: ~50 MB IndexedDB quota per origin (sufficient for thousands of photos at thumbnail scale)

### Risks & Mitigations
| Risk | Mitigation |
|------|-----------|
| sql.js memory overhead | Monitor bundle size; lazy-load sql.js; consider IndexedDB-only fallback for large datasets |
| Browser crashes lose unsaved state | Periodic auto-save to localStorage; prompt user to export on long sessions |
| Drag/drop on touch devices | Implement touch gesture alternative (long-press → drag); test on mobile browsers |
| Image file size blowup | Compress/resize on import; warn user of quota limits |
| Performance with 10K+ photos | Implement pagination or virtual scrolling; add database indexes |

## Success Criteria

### MVP (Phase 1)
- ✅ Albums can be organized by date (day/month/year grouping modes)
- ✅ Drag-and-drop reordering and moving works smoothly
- ✅ Undo/redo is full and reversible
- ✅ Data persists across browser sessions
- ✅ No external dependencies for photo storage (files stay local)
- ✅ All tests pass; code is linted and formatted

### Polish (Phase 2)
- ✅ Photos can be imported via drag/drop or file picker
- ✅ Image previews are cached and load quickly
- ✅ Mobile-friendly responsive layout
- ✅ Keyboard navigation works (ESC, arrows)
- ✅ Basic a11y compliance (WCAG 2.1 AA)

### Nice-to-have (Phase 3)
- ✅ Search and filter albums by title or date
- ✅ Export/backup functionality
- ✅ Theme switcher

## References & Resources

- **Vite docs**: https://vitejs.dev
- **sql.js**: https://sql.js.org
- **SPEC.md**: Feature specification and acceptance criteria
- **CONSTITUTION.md**: Code quality and testing standards
- **MDN Web Docs**: Vanilla JS, CSS Grid, Fetch API
- **Web Storage API**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API
- **Drag and Drop API**: https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API

## Timeline

| Week | Phase | Deliverable |
|------|-------|-------------|
| 1 | Setup + Core DB | Database layer, Vite scaffold, initial UI |
| 2 | UI + State | Album list, grouping, DnD, undo/redo |
| 3 | Import + Polish | File handling, mobile UX, a11y, theme |
| 4 | Optional | Search, export, advanced features |

**Estimated total**: 2–3 weeks for Phase 1 + 2 (MVP to polished).

---

## Next Steps

1. ✅ Scaffold Vite project with index.html and build config
2. ✅ Set up sql.js integration and database schema
3. ✅ Build state management and DAL
4. ✅ Implement UI components in vanilla JS
5. ✅ Add tests and CI/CD
6. 📋 Begin Phase 1 implementation

See `SPEC.md` for detailed feature requirements and `CONSTITUTION.md` for code quality standards.
