# 🚀 Quick Reference - Phase 1 MVP

## File Structure at a Glance

```
speckit-workshop/
├── src/
│   ├── main.js                 # Entry point
│   ├── index.css               # Global styles
│   ├── db/
│   │   ├── sqlite.js           # SQLite wrapper
│   │   ├── schema.js           # Schema & sample data
│   │   └── dal.js              # Data Access Layer
│   ├── state/
│   │   ├── appState.js         # State management
│   │   └── actions.js          # Action creators
│   ├── utils/
│   │   ├── dateFormat.js       # Date helpers
│   │   └── storage.js          # LocalStorage wrapper
│   └── ui/
│       ├── app.js              # Main orchestrator ⭐
│       ├── albumList.js        # Group renderer ⭐
│       ├── albumCard.js        # Album card component
│       ├── modal.js            # Photo modal
│       ├── controls.js         # Header buttons
│       └── styles/
│           ├── layout.css      # Cards & groups
│           ├── modal.css       # Modal styling
│           └── responsive.css  # Mobile & animations
├── tests/
│   └── unit/
│       └── dateFormat.test.js  # Example tests
├── CONSTITUTION.md             # Code principles
├── SPEC.md                      # Requirements
├── PLAN.md                      # Architecture
├── PHASE_1_MVP_COMPLETE.md     # Status
├── ARCHITECTURE.md              # Diagrams & flows
├── TESTING.md                   # Test guide
├── SUMMARY.md                   # This doc
└── README.md                    # Setup guide
```

**⭐ = Just built!**

---

## Component API Quick Reference

### app.js (Main Orchestrator)
```javascript
import { renderApp, destroyApp } from './ui/app.js';

// Initialize app
renderApp(appState, db);

// Cleanup
destroyApp();

// What it does:
// - Creates app layout (header, main, modal)
// - Wires up all event handlers
// - Subscribes to state changes
// - Rerenders on state update
```

### albumList.js (Album Renderer)
```javascript
import { renderAlbumList, scrollToGroup } from './ui/albumList.js';

// Render albums grouped by date
renderAlbumList(container, db, appState, {
  onAlbumOpen: (album) => { /* ... */ },
  onDragDrop: () => { /* ... */ },
});

// Scroll to group by date
scrollToGroup(container, "2024-01-15");

// What it does:
// - Groups albums by day/month/year
// - Renders group headers
// - Creates album cards with drag-drop
// - Handles move/reorder operations
```

### albumCard.js (Single Album)
```javascript
import { createAlbumCard } from './ui/albumCard.js';

// Create single album card
const card = createAlbumCard(album, {
  onOpen: (album) => { /* ... */ },
  onDragStart: (albumId) => { /* ... */ },
  onDragEnd: () => { /* ... */ },
});

// What it does:
// - Renders 3-photo preview tiles
// - Shows photo count and title
// - Supports drag operations
// - Clickable to open modal
```

### modal.js (Photo Viewer)
```javascript
import { createModal, openModal, closeModal } from './ui/modal.js';

// Create modal element
const modal = createModal();

// Open with album photos
openModal(modal, album);

// Close modal
closeModal(modal);

// What it does:
// - Shows photos in grid (140px tiles)
// - Handles close (button, ESC, overlay)
// - Manages focus
// - Responsive layout
```

### controls.js (Header)
```javascript
import { createHeader, updateHeader } from './ui/controls.js';

// Create header with buttons
const header = createHeader({
  onGroupingChange: () => { /* ... */ },
  onUndo: () => { /* ... */ },
  onRedo: () => { /* ... */ },
  onReset: () => { /* ... */ },
});

// Update button states
updateHeader(header, appState);

// What it does:
// - Renders 4 buttons (Grouping, Undo, Redo, Reset)
// - Disables buttons when unavailable
// - Calls callbacks on click
```

---

## State Management Quick Reference

### AppState
```javascript
import { AppState } from './state/appState.js';

const appState = new AppState(db);

// Properties
appState.groupingMode;      // 'day' | 'month' | 'year'
appState.selectedAlbum;     // current album or null
appState.undoStack;         // array of actions
appState.redoStack;         // array of actions

// Methods
appState.subscribe(listener);           // Listen to changes
appState.setGroupingMode(mode);         // Change grouping
appState.setSelectedAlbum(album);       // Select album
appState.undo();                        // Undo last action
appState.redo();                        // Redo last undo
appState.pushHistory(action);           // Record action
appState.clearHistory();                // Clear undo/redo
```

### Actions
```javascript
import {
  createMoveAlbumAction,
  createReorderAlbumAction,
  applyAction,
} from './state/actions.js';

// Move album to different group
const action = createMoveAlbumAction(
  albumId,
  fromDate,
  toDate,
  fromOrder,
  toOrder
);

// Reorder album within group
const action = createReorderAlbumAction(
  albumId,
  date,
  fromOrder,
  toOrder
);

// Apply action to database
applyAction(db, action, true);  // true = forward

// What they do:
// - MOVE_ALBUM: Changes album date and order
// - REORDER_ALBUM: Changes album order only
// - applyAction: Updates database + reverses action
```

---

## Database Quick Reference

### DAL Functions (dal.js)

```javascript
import * as dal from './db/dal.js';

// ALBUMS
dal.getAllAlbums(db);                     // Get all albums
dal.getAlbumById(db, albumId);            // Get one album
dal.createAlbum(db, title);               // Create new
dal.updateAlbum(db, albumId, data);       // Update album
dal.deleteAlbum(db, albumId);             // Delete album
dal.moveAlbum(db, albumId, toDate);       // Move to group
dal.reorderAlbum(db, albumId, newOrder);  // Reorder in group

// PHOTOS
dal.getPhotosByAlbum(db, albumId);        // Get album photos
dal.addPhotos(db, albumId, photoData);    // Add photos
dal.deletePhoto(db, photoId);             // Delete photo

// GROUPS
dal.getAlbumsGroupedByDate(db, mode);     // Get grouped data
// Returns: [{date, albums: [...]}, ...]

// SAMPLE DATA
dal.loadSampleData(db);                   // Load test data
```

---

## CSS Classes Reference

### Layout
```css
.app-layout              /* Full viewport container */
.app-header              /* Header bar */
.app-main                /* Scrollable content area */
.album-list-container    /* Centered content (max 1400px) */
```

### Groups
```css
.groups-container        /* All groups wrapper */
.group                   /* Single group section */
.group-header            /* Group title row */
.group-title             /* Group title text */
.group-count             /* Album count badge */
.album-list              /* Album cards container */
.album-list.drag-over    /* Drag-over state */
```

### Cards
```css
article.album-card       /* Single album card */
.album-card.drag-target  /* Drag target highlight */
.album-images            /* Photo preview tiles (3 tiles) */
.album-meta              /* Title + count area */
.album-actions           /* Hover action buttons */
```

### Buttons
```css
.btn                     /* Base button */
.btn:hover:not(:disabled)
.btn:disabled
.btn:focus-visible       /* Keyboard focus */
```

### Modal
```css
.modal                   /* Modal dialog container */
.modal.hidden            /* Hidden state */
.modal.visible           /* Visible state */
.modal-overlay           /* Click to close area */
.modal-content           /* Dialog box */
.modal-header            /* Title area */
.modal-body              /* Photo grid area */
.photo-grid              /* Grid container */
.photo-tile              /* Single photo (140px) */
```

### States
```css
.drag-over               /* Hover drop zone */
.drag-target             /* Target for reorder */
.hidden                  /* Hidden element */
.empty-state             /* No data state */
.skeleton                /* Loading placeholder */
```

---

## Common Tasks

### Add a New Grouping Mode
```javascript
// 1. Update dateFormat.js
export function formatDateLabel(date, mode) {
  // Add case for new mode
}

// 2. Update SPEC.md if needed
// 3. Test in app:
//    - Mode cycles in header
//    - Groups render correctly
//    - DAL queries work
```

### Add a New Action Type
```javascript
// 1. Add to actions.js
export function createNewAction(albumId, data) {
  return {
    type: 'NEW_ACTION',
    payload: { albumId, data }
  };
}

// 2. Add reversal logic in applyAction()

// 3. Use in albumList.js drop handler:
//    const action = createNewAction(...);
//    applyAction(db, action, true);
//    appState.pushHistory(action);
```

### Add a New UI Component
```javascript
// 1. Create src/ui/newComponent.js
export function createNewComponent() {
  const el = document.createElement('div');
  // Build element
  return el;
}

// 2. Import in app.js
import { createNewComponent } from './newComponent.js';

// 3. Use in renderApp()
const component = createNewComponent();
headerEl.appendChild(component);

// 4. Add styles to src/ui/styles/layout.css
.new-component { /* ... */ }
```

### Extend the Database Schema
```javascript
// 1. Update src/db/schema.js
const sql = `
  CREATE TABLE IF NOT EXISTS new_table (
    id TEXT PRIMARY KEY,
    -- columns
  );
`;

// 2. Create DAL functions in src/db/dal.js
export function getNewData(db) {
  // SQL query
}

// 3. Use in components as needed
```

---

## Debugging Checklist

- [ ] Check browser console (F12)
- [ ] Verify modules import paths
- [ ] Check localStorage keys ('grouping_mode')
- [ ] Inspect appState in console
- [ ] Check database tables exist
- [ ] Verify drag-drop data format (JSON)
- [ ] Check CSS class names
- [ ] Verify event handlers attached
- [ ] Test with devtools mobile mode
- [ ] Check focus-visible styling

---

## Important Imports

```javascript
// Main entry
import { renderApp } from './ui/app.js';

// UI Components
import { renderAlbumList } from './ui/albumList.js';
import { createAlbumCard } from './ui/albumCard.js';
import { createModal, openModal } from './ui/modal.js';
import { createHeader, updateHeader } from './ui/controls.js';

// State
import { AppState } from './state/appState.js';
import { createMoveAlbumAction } from './state/actions.js';

// Database
import * as dal from './db/dal.js';
import { initDatabase } from './db/sqlite.js';

// Utils
import { formatDateLabel } from './utils/dateFormat.js';
import { getStorageValue, setStorageValue } from './utils/storage.js';
```

---

## Event Flow Map

```
Button Click → Callback in app.js → appState method
                                       ↓
                                  Database update
                                       ↓
                                  State change
                                       ↓
                                  Subscriber notified
                                       ↓
                                  rerender()
                                       ↓
                                  DOM updated
                                       ↓
                                  User sees change
```

---

## Performance Tips

- ✅ Single rerender per state change (via subscriber)
- ✅ Efficient date formatting (cached patterns)
- ✅ CSS transitions for smooth animations
- ✅ Event delegation where possible
- ✅ Lazy modal creation
- ⚠️ Avoid excessive re-queries (cache grouped results)
- ⚠️ Consider virtual scroll for 1000+ albums

---

## Browser DevTools Tips

### View Database
```javascript
// In console
db.exec("SELECT * FROM albums;")
db.exec("SELECT * FROM photos;")
db.exec("SELECT * FROM settings;")
```

### View App State
```javascript
console.log(window.appState);
console.log(window.appState.undoStack);
```

### Monitor LocalStorage
```
DevTools → Application → Storage → Local Storage → http://localhost:5173
Look for: grouping_mode
```

### Check CSS
```
DevTools → Elements → Select element
Review: .group, .album-card, .modal classes
```

### Performance Profile
```
DevTools → Performance → Record
Perform action → Stop
Review: FPS, main thread, paint time
```

---

## Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| "Cannot read 'albums' of undefined" | DAL query returned null | Check DB data exists |
| "Modal won't close" | Focus not returned | Check modal focus/blur events |
| "Undo button stays disabled" | History empty | Clear, perform action, try undo |
| "Drag-drop not working" | Data format wrong | Check JSON parse in drop handler |
| "Groups not updating" | Rerender not triggered | Check appState.subscribe() |
| "CSS not applying" | Class name typo | Check .album-card vs album-card |

---

## Quick Commands

```bash
# Start dev server
npm run dev

# Lint code
npm run lint

# Run tests
npm run test

# Build production
npm run build

# Preview build
npm run preview
```

---

## Resources

| Resource | Location |
|----------|----------|
| Architecture | ARCHITECTURE.md |
| Testing | TESTING.md |
| Requirements | SPEC.md |
| Principles | CONSTITUTION.md |
| Setup | README.md |
| Timeline | PLAN.md |

---

**Last Updated:** Phase 1 MVP Complete ✅

**Next:** Phase 2 - Album Management

