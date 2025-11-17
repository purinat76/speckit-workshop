# Speckit Photo Organizer — Specification

## Overview
A client-side web app to organize photos into date-grouped albums with drag-and-drop reordering, hierarchical date grouping (day/month/year), and undo/redo support. Albums are never nested; all albums are top-level within a date group.

## Answered Requirements
1. **Q2 (Grouping)**: Support day, month, and year grouping. Albums can be grouped by exact date (YYYY-MM-DD), by month (YYYY-MM), or by year (YYYY). User can toggle grouping mode via UI.
2. **Q6 (Undo/Redo)**: Yes. Implement undo/redo for album moves and reorders. Persist undo/redo history in localStorage.
3. **All others**: Use defaults (localStorage only, sample data, no server-sync, basic accessibility, responsive layout, etc.).

## Data Model

### Entities
```
Group {
  id: string (derived from grouping mode: YYYY, YYYY-MM, or YYYY-MM-DD)
  label: string (e.g., "2025", "November 2025", "November 17, 2025")
  albums: Album[]
}

Album {
  id: string (unique)
  title: string
  photos: string[] (array of image URLs)
}

HistoryEntry {
  action: 'move' | 'reorder'
  fromGroupId: string
  toGroupId: string
  albumId: string
  beforeAlbumId?: string (if reorder within group)
  timestamp: number
}
```

### Grouping Modes
- **Day**: Group by YYYY-MM-DD (exact date); label: "Monday, November 17, 2025"
- **Month**: Group by YYYY-MM; label: "November 2025"
- **Year**: Group by YYYY; label: "2025"

Each album has an associated date (or datetime). When switching grouping modes, groups are re-derived from album dates.

## User Interface

### Main Page
- Header with title and controls:
  - Grouping mode toggle (Day / Month / Year)
  - Reset sample data
  - Clear saved order
  - Undo button (disabled if no history)
  - Redo button (disabled if no redo stack)
- Groups list, each containing:
  - Group header (label, e.g., "November 17, 2025")
  - Album cards in persisted order
    - Album title
    - Up to 6 thumbnail tiles (preview)
    - Photo count
    - Draggable
- Hint text: "Albums are grouped by [mode]. Drag an album to reorder or move it."

### Album Modal
- Full tile grid of all album photos (responsive, scrollable)
- Album title and date
- Close button (× or ESC key)
- Click backdrop to close (optional)

### Drag-and-Drop Behavior
- **Drag from album card**:
  - Highlight the source album (opacity change, "dragging" class)
  - Show drop target feedback on groups or other albums
- **Drop onto group area**: Append album to that group
- **Drop onto album card**: Insert source album before target album in the same group
- **Drop into same position**: No-op (no state change, no undo entry)
- After drop: Save to localStorage, add entry to undo history, clear redo stack

## Features

### 1. Album Organization
- Albums are grouped by the selected grouping mode.
- Reorder albums within a group by dragging.
- Move albums between groups by dragging.
- Albums are never nested; all albums are top-level in a group.

### 2. Album Modal
- Click an album card to open a modal with a tile grid of all photos.
- Modal shows album title, date, and full photo grid.
- Close via close button, ESC key, or backdrop click.
- Basic focus management: focus first photo tile on open; restore focus on close (optional).

### 3. Undo/Redo
- **Undo**: Revert the last move or reorder action. Pop from undo stack, push to redo stack.
- **Redo**: Reapply the last undone action. Pop from redo stack, push to undo stack.
- **Constraints**:
  - Only moves and reorders are undoable. Grouping mode changes clear undo/redo history.
  - Persisted in localStorage under key `speckit.photo.organizer.history`.
  - Limit history to last 50 entries (FIFO) to avoid bloat.
- **UI**: Undo and Redo buttons in header; disabled if no history in respective stack.

### 4. Persistence
- **Data**: Persisted to localStorage under key `speckit.photo.organizer.v1` (groups and albums).
- **History**: Persisted to localStorage under key `speckit.photo.organizer.history` (undo/redo stack).
- **Grouping mode**: Persisted to localStorage under key `speckit.photo.organizer.grouping` (current mode).
- Save on every action (move, reorder, undo, redo, grouping change).

### 5. Controls
- **Reset sample data**: Clear localStorage, reload sample dataset, clear undo/redo history.
- **Clear saved order**: Clear localStorage, preserve grouping mode, reload sample dataset.
- **Grouping mode toggle**: Day / Month / Year; update groups and UI; clear undo/redo history (groups are re-derived).

## Acceptance Criteria

- AC1: Albums display grouped by the selected mode (day, month, or year); groups update when mode changes.
- AC2: Dragging an album and dropping onto another group or album changes its group/order and is persisted.
- AC3: Undo reverts the last move/reorder; Redo reapplies it. Both buttons are disabled when stacks are empty.
- AC4: Clicking an album opens a modal with a tile grid of all photos.
- AC5: Albums are never nested; all albums are top-level within a group.
- AC6: Reloading the page restores the last saved state (groups, album order, grouping mode, undo/redo history).

## Edge Cases & Behavior

- **Empty groups**: Show group header and allow dropping; remove empty groups on render if desired (optional).
- **Dropping onto the same album**: No-op (cancel drop if source === target).
- **Grouping mode change**: Re-derive groups from album dates; clear undo/redo history (groups are no longer meaningful in old hierarchy).
- **Large photo sets**: Modal grid scrolls; virtualize if >1000 photos per album (optional optimization).
- **Touch drag/drop**: Best-effort support; may degrade on older mobile browsers.
- **Accessibility**: Meaningful alt text for images, aria-modal on modal, focus management, and basic keyboard support (ESC to close modal).

## Performance & Scale
- Expected scale: 10–100 albums, 10–1000 photos per album, 10–100 groups (depending on grouping mode).
- No virtualization required for current scale.
- LocalStorage size limit: ~5–10 MB per domain (should be sufficient for hundreds of albums with URL-based photos).

## Implementation Notes

### Tech Stack
- Plain HTML/CSS/JS (no build required for MVP).
- Future: React/Vite with tests and CI checks (optional enhancement).

### Key Functions
- `setGroupingMode(mode)`: Update grouping mode and re-derive groups.
- `moveAlbum(albumId, toGroupId, beforeAlbumId?)`: Move album to group and optionally insert before another album.
- `undo()` / `redo()`: Apply or revert history entries.
- `saveState()` / `loadState()`: Persist and load from localStorage.
- `render()`: Re-render main page based on current state.

### Testing
- Manual smoke tests: render main page, toggle grouping, open modal, reorder/move albums, undo/redo.
- Automated tests (optional): unit tests for move/reorder logic and undo/redo state transitions.
- Accessibility: run axe-core on rendered pages and verify ESC/focus management.

## Assumptions
- Photos are represented as URLs (or blob references); no heavy image processing on client.
- Album dates are provided (not extracted from image EXIF).
- localStorage is available (no fallback to cookies or IndexedDB required).
- No real-time sync or server; all state is local to one browser.

## Future Enhancements
- Server-side sync (user accounts, cloud backup).
- Photo upload/import from files or cloud storage.
- Album creation, renaming, deletion.
- Search and filtering.
- Thumbnail caching and lazy loading.
- Full keyboard navigation for drag/drop.
- Keyboard shortcuts (Ctrl+Z for undo, etc.).
- Sharing and collaborative editing.
