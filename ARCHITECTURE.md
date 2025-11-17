# 🎨 Phase 1 MVP UI Architecture

## Component Hierarchy

```
┌─────────────────────────────────────────────────────┐
│                   renderApp()                        │
│              (app.js - Orchestrator)                 │
└──────────┬────────────────┬──────────────┬───────────┘
           │                │              │
      ┌────▼────┐    ┌──────▼───────┐  ┌──▼────────┐
      │ Header  │    │  Album List  │  │  Modal   │
      │ (controls)   │ (albumList)  │  │(modal.js)│
      └─────────┘    └──────────────┘  └──────────┘
           │                │
      ┌────▼──────────┐  ┌──▼───────────────┐
      │  Buttons      │  │  Groups + Cards  │
      ├───────────────┤  ├──────────────────┤
      │ • Grouping    │  │ Group Headers    │
      │ • Undo        │  │ Album Cards      │
      │ • Redo        │  │ • Drag handlers  │
      │ • Reset       │  │ • Photo preview  │
      └───────────────┘  └──────────────────┘
```

## Data Flow Diagram

```
┌──────────────────────────────────────────────────┐
│            Main.js - Entry Point                 │
│  ├─ Initialize Database (sql.js)                 │
│  ├─ Load Schema & Sample Data                    │
│  ├─ Create AppState                              │
│  └─ Call renderApp(appState, db)                │
└────────────────────┬─────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   renderApp()         │
         │  (app.js)             │
         └───────┬───────────────┘
                 │
        ┌────────┼────────┐
        │        │        │
        ▼        ▼        ▼
    ┌────────┐ ┌──────┐ ┌─────┐
    │Header  │ │Lists │ │Modal│
    └────────┘ └──────┘ └─────┘
        │        │        │
        ├─▶ appState.subscribe() ◀────┤
        │        │        │
        └────┬───┴───┬────┘
             │       │
             ▼       ▼
    ┌────────────────────────┐
    │   State Change         │
    │ - setGroupingMode()    │
    │ - undo()               │
    │ - redo()               │
    │ - setSelectedAlbum()   │
    │ - pushHistory()        │
    └────────┬───────────────┘
             │
             ▼
    ┌────────────────────────┐
    │   Database Layer       │
    │ - moveAlbum()          │
    │ - reorderAlbum()       │
    │ - getAlbums*()         │
    └────────┬───────────────┘
             │
             ▼
    ┌────────────────────────┐
    │    SQLite Database     │
    │  (sql.js in WASM)      │
    │  - albums              │
    │  - photos              │
    │  - settings            │
    └────────────────────────┘
```

## Interaction Flows

### 1. Grouping Mode Change
```
User clicks "Grouping" button
        │
        ▼
onGroupingChange() callback
        │
        ├─ Cycle: day → month → year
        │
        ├─ appState.setGroupingMode(newMode)
        │
        ├─ setStorageValue('grouping_mode', newMode)
        │
        ├─ State subscriber triggered
        │
        ├─ rerender()
        │
        ├─ getAlbumsGroupedByDate(db, newMode)
        │
        ├─ renderAlbumList() with new groups
        │
        └─ UI updates with new grouping
```

### 2. Album Drag & Drop (Move)
```
User drags album from Group A to Group B
        │
        ├─ dragstart: onDragStart(albumId)
        │
        ├─ dragover Group B: classList.add('drag-over')
        │
        ├─ drop on Group B:
        │   ├─ handleAlbumDropped()
        │   ├─ fromDate = Group A date
        │   ├─ toDate = Group B date
        │   ├─ createMoveAlbumAction()
        │   ├─ dal.moveAlbum(db, action)
        │   ├─ appState.pushHistory(action)
        │   ├─ State change triggers subscriber
        │   ├─ rerender()
        │   └─ UI reflects album in Group B
        │
        └─ dragend: classList.remove('drag-over')
```

### 3. Undo Operation
```
User clicks Undo button
        │
        ├─ appState.undo()
        │
        ├─ Pop action from undoStack
        │
        ├─ createReverseAction()
        │
        ├─ applyAction(db, reverseAction)
        │
        ├─ Push reverseAction to redoStack
        │
        ├─ State change triggers subscriber
        │
        ├─ rerender()
        │
        └─ UI reflects previous state
```

### 4. Album Click → Modal Open
```
User clicks album card
        │
        ├─ onAlbumOpen(album) callback
        │
        ├─ appState.setSelectedAlbum(album)
        │
        ├─ openModal(modal, album)
        │
        ├─ Query: getPhotosByAlbum(db, albumId)
        │
        ├─ Render 140px photo grid
        │
        ├─ Show modal with fadeIn animation
        │
        └─ User can close with ESC or overlay click
```

## Component Dependencies

```
app.js
├── Imports controls.js
│   ├── Uses: createHeader()
│   └── Uses: updateHeader()
├── Imports albumList.js
│   ├── Uses: renderAlbumList()
│   ├── Uses: dal.getAlbumsGroupedByDate()
│   ├── Uses: dal.getAlbumById()
│   ├── Uses: dal.getAllAlbums()
│   ├── Uses: createAlbumCard()
│   └── Uses: formatDateLabel()
├── Imports modal.js
│   ├── Uses: createModal()
│   ├── Uses: openModal()
│   └── Uses: closeModal()
└── Imports dal.js
    ├── Uses: dal.moveAlbum()
    ├── Uses: dal.reorderAlbum()
    ├── Uses: dal.getAlbums*()
    └── Uses: dal.loadSampleData()

albumList.js
├── Imports albumCard.js
│   └── Uses: createAlbumCard()
├── Imports actions.js
│   ├── Uses: createMoveAlbumAction()
│   ├── Uses: createReorderAlbumAction()
│   └── Uses: applyAction()
├── Imports utils/dateFormat.js
│   └── Uses: formatDateLabel()
└── Imports dal.js
    ├── Uses: getAlbumsGroupedByDate()
    ├── Uses: getAlbumById()
    └── Uses: getAllAlbums()

modal.js
├── Imports dal.js
│   └── Uses: getPhotosByAlbum()
└── Standalone (no other UI imports)

controls.js
├── Imports dal.js (optional, for reset)
└── Standalone

albumCard.js
├── Standalone (no imports needed)
└── Uses vanilla JavaScript APIs only
```

## State Management Flow

```
┌────────────────────────────┐
│     appState (in memory)   │
├────────────────────────────┤
│ Properties:                │
│  • groupingMode            │
│  • selectedAlbum           │
│  • undoStack (50 max)      │
│  • redoStack (50 max)      │
│  • subscribers []          │
└────────┬───────────────────┘
         │
    ┌────┴─────────┬────────────┬──────────────┐
    │              │            │              │
setGroupingMode() │   undo()    redo()    setSelectedAlbum()
    │              │            │              │
    ▼              ▼            ▼              ▼
Notify subscribers ─────►Listener in app.js
                         rerender() ──► renderAlbumList()
                                        updateHeader()
```

## CSS Class Structure

```
.app-layout (full viewport)
├── .app-header (flex row, sticky-like)
│   └── .app-controls (flex row)
│       ├── .btn (grouping)
│       ├── .btn (undo)
│       ├── .btn (redo)
│       └── .btn (reset)
├── .app-main (scrollable)
│   └── .album-list-container (max-width)
│       └── .groups-container
│           └── .group (section)
│               ├── .group-header
│               │   ├── .group-title
│               │   └── .group-count
│               └── .album-list (.drag-over state)
│                   └── article.album-card (.drag-target state)
│                       ├── .album-images
│                       ├── .album-meta
│                       └── .album-actions
└── .modal (.hidden state, .visible state)
    ├── .modal-overlay
    ├── .modal-content
    └── .photo-grid
        └── .photo-tile (140px)
```

## Event Listener Map

```
Event Source          │ Event Type    │ Handler Function      │ Result
──────────────────────┼───────────────┼──────────────────────┼─────────────
Grouping Button       │ click         │ onGroupingChange()    │ Cycle mode
Undo Button           │ click         │ onUndo()              │ Undo action
Redo Button           │ click         │ onRedo()              │ Redo action
Reset Button          │ click         │ onReset()             │ Reload data
──────────────────────┼───────────────┼──────────────────────┼─────────────
Album Card            │ dragstart     │ onDragStart()         │ Set draggedId
Album Card            │ dragend       │ onDragEnd()           │ Clear draggedId
──────────────────────┼───────────────┼──────────────────────┼─────────────
Group Container       │ dragover      │ classList.add()       │ Visual feedback
Group Container       │ dragleave     │ classList.remove()    │ Clear feedback
Group Container       │ drop          │ handleAlbumDropped()  │ Move album
──────────────────────┼───────────────┼──────────────────────┼─────────────
Album Card (target)   │ dragover      │ classList.add()       │ Highlight card
Album Card (target)   │ dragleave     │ classList.remove()    │ Clear highlight
Album Card (target)   │ drop          │ handleAlbumDropped()  │ Reorder album
──────────────────────┼───────────────┼──────────────────────┼─────────────
Album Card            │ click         │ onAlbumOpen()         │ Open modal
──────────────────────┼───────────────┼──────────────────────┼─────────────
Modal Overlay         │ click         │ closeModal()          │ Close modal
Modal Close Button    │ click         │ closeModal()          │ Close modal
Document              │ keydown (ESC) │ closeModal()          │ Close modal
──────────────────────┼───────────────┼──────────────────────┼─────────────
AppState              │ subscribe()   │ rerender()            │ UI updates
```

## Performance Characteristics

| Operation | Time Complexity | Space | Notes |
|-----------|-----------------|-------|-------|
| Initial render | O(n) | O(n) | n = albums |
| Group by date | O(n log n) | O(n) | Sorting by date |
| Rerender on state change | O(n) | O(n) | Full re-DOM |
| Drag-drop album move | O(n) | O(1) | Database update |
| Undo/Redo action | O(n) | O(1) | Database reverse |
| Modal photo render | O(p) | O(p) | p = photos in album |

**Optimization opportunities:**
- Virtual scrolling for large album lists (future)
- Memoization of grouped results (future)
- Incremental DOM updates vs full rerender (future)
- Lazy-load modal photos (future)

## Testing Strategy

```
Unit Tests:
  ✓ dateFormat.test.js
  • albumCard component rendering
  • modal open/close logic
  • drag-drop event handling
  • action creation and reversal

Integration Tests:
  • Full drag-drop flow
  • Grouping mode changes
  • Undo/redo through modal open
  • localStorage persistence

E2E Tests:
  • Load app and verify render
  • Complete user interaction flows
  • Cross-browser compatibility
```

