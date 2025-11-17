# 🧪 Testing Guide - Phase 1 MVP

## Quick Start

### Prerequisites
- Node.js 16+ installed
- npm or yarn available
- Modern browser (Chrome, Firefox, Safari, Edge)

### Setup

```bash
cd speckit-workshop
npm install
npm run dev
```

Open browser to `http://localhost:5173`

## Manual Testing Checklist

### 1. Application Initialization ✓

**Test:** Application loads without errors

- [ ] Page loads and displays header with buttons
- [ ] Header shows "Grouping", "Undo", "Redo", "Reset" buttons
- [ ] Sample albums display in groups
- [ ] Groups appear with headers (e.g., "Today", "January 2024", "2024")
- [ ] Album cards show 3-photo preview tiles
- [ ] Album cards show photo count
- [ ] Console has no error messages

**Expected Result:** Full app UI renders with sample data organized by date groups

---

### 2. Grouping Mode Toggle ✓

**Test:** Cycling through day/month/year grouping modes

#### Day Mode
- [ ] Click "Grouping" button
- [ ] Albums group by day (e.g., "Today", "Yesterday", "2 days ago")
- [ ] Day groups collapse when scrolling

**Step-by-Step:**
1. Click "Grouping" button
2. Verify group headers change to day format
3. Observe album positions update

#### Month Mode
- [ ] Click "Grouping" button again
- [ ] Albums group by month (e.g., "January 2024", "December 2023")
- [ ] Month groups show correct photo counts

**Step-by-Step:**
1. Click "Grouping" button
2. Verify group headers change to month format (Month Year)
3. Albums rearrange into new groups

#### Year Mode
- [ ] Click "Grouping" button again
- [ ] Albums group by year (e.g., "2024", "2023")
- [ ] Year groups contain all albums from that year

**Step-by-Step:**
1. Click "Grouping" button
2. Verify group headers change to year format
3. Albums collapse into year-based groups

#### Persistence
- [ ] Grouping mode persists after page refresh
- [ ] localStorage contains 'grouping_mode' key

**Step-by-Step:**
1. Select Month mode
2. Press F5 to refresh
3. Verify Month mode is still active
4. Open DevTools → Application → localStorage
5. Verify 'grouping_mode' = 'month'

**Expected Result:** Button cycles modes; UI updates; preference persists

---

### 3. Album Drag and Drop - Move ✓

**Test:** Moving album from one group to another (Move operation)

**Setup:**
1. Set grouping to "Day" mode
2. Identify two different day groups (e.g., "Today" and "Yesterday")
3. Pick an album from "Today" group

**Step-by-Step:**
1. Click and hold on album card in "Today" group
2. Drag to "Yesterday" group
3. Release mouse over the group container
4. Album should move to "Yesterday" group
5. Both groups update album counts

**Verification:**
- [ ] Album moved to new group
- [ ] Old group album count decreased
- [ ] New group album count increased
- [ ] Album's date in DAL updated (if inspecting DB)
- [ ] No JavaScript errors in console

**Expected Result:** Album successfully moves between groups

---

### 4. Album Drag and Drop - Reorder ✓

**Test:** Reordering albums within same group (Reorder operation)

**Setup:**
1. Set grouping to "Day" mode
2. Identify a group with 2+ albums
3. Note the current order

**Step-by-Step:**
1. Click and hold first album in group
2. Drag and hover over second album
3. Second album should highlight with visual indicator
4. Release mouse to insert before second album
5. Order should change

**Verification:**
- [ ] Album position changes in group
- [ ] Visual drag-target highlight appears
- [ ] Album sort_order field updated in DAL (if inspecting DB)
- [ ] Album count stays same
- [ ] No console errors

**Expected Result:** Album reorders within same group

---

### 5. Undo/Redo History ✓

**Test:** Undo and redo operations

#### Undo After Move
1. Move album from Group A to Group B (see Test 3)
2. Click "Undo" button
3. Album should return to Group A
4. Group counts restore

**Verification:**
- [ ] Album returns to original group
- [ ] Undo button might disable (if at start of history)
- [ ] Redo button becomes enabled
- [ ] No console errors

#### Redo After Undo
1. With album back in Group A (from above)
2. Click "Redo" button
3. Album should move back to Group B
4. Operation repeats

**Verification:**
- [ ] Album moves back to Group B
- [ ] Redo button might disable (if at end of history)
- [ ] Undo button becomes enabled

#### Undo After Reorder
1. Reorder album within group (see Test 4)
2. Click "Undo" button
3. Album should return to previous position in group

**Verification:**
- [ ] Album position restores
- [ ] Undo/Redo buttons respond
- [ ] History count accurate

#### Button States
- [ ] Undo button disabled when history is empty
- [ ] Redo button disabled when at end of history
- [ ] Buttons disabled while at terminal history positions

**Expected Result:** Full undo/redo support for move and reorder operations

---

### 6. Album Modal - Photo View ✓

**Test:** Clicking album opens modal with photo grid

**Setup:**
1. Have app loaded with sample albums

**Step-by-Step:**
1. Click on any album card
2. Modal dialog appears with overlay
3. Modal shows album title (if available)
4. Photos display in grid (140px tiles)
5. Modal has close button (X or similar)

**Verification:**
- [ ] Modal overlays full viewport
- [ ] Photo grid visible with album photos
- [ ] Album has at least 1 photo (sample data has many)
- [ ] Each photo tile displays as square 140px

#### Close Modal
1. Click X button in modal
2. Modal closes and disappears
3. Background content visible again

**Alternate Close - ESC Key:**
1. Open modal again
2. Press ESC key
3. Modal closes

**Alternate Close - Overlay:**
1. Open modal again
2. Click dark overlay area outside modal
3. Modal closes

**Verification:**
- [ ] All three close methods work
- [ ] Modal hidden after close
- [ ] No stuck focus
- [ ] No console errors

**Expected Result:** Modal opens on click, displays photos, closes via button/ESC/overlay

---

### 7. Reset Functionality ✓

**Test:** Reset button clears data and reloads

**Setup:**
1. Perform several operations (moves, reorders)
2. History stack has multiple entries

**Step-by-Step:**
1. Click "Reset" button
2. Confirmation dialog appears: "Reset all changes?"
3. Click "OK" to confirm
4. Page reloads
5. Sample data reloaded
6. History cleared
7. Grouping mode reset to default

**Verification After Reset:**
- [ ] All moved albums return to original state
- [ ] Album counts match original
- [ ] Undo/Redo buttons disabled (empty history)
- [ ] Grouping mode is "Day"
- [ ] All localStorage cleared
- [ ] Sample data fully restored

**Cancel Reset:**
1. Click "Reset" button
2. Confirmation dialog appears
3. Click "Cancel"
4. Nothing changes
5. App continues with current state

**Verification:**
- [ ] No state change
- [ ] Album positions unchanged
- [ ] Undo/Redo still available if had history

**Expected Result:** Reset clears all data and reloads sample; Cancel aborts

---

### 8. Responsive Design ✓

**Test:** App works at different viewport sizes

#### Desktop (1920x1080)
- [ ] Full header with all buttons visible
- [ ] Album grid fills width nicely (240px cards)
- [ ] Modal centered and sized appropriately
- [ ] No horizontal scroll
- [ ] Scrollbar on main content if needed

#### Tablet (768x1024)
- [ ] Header buttons wrap if needed
- [ ] Album cards still display properly
- [ ] Modal responsive on medium screen
- [ ] Touch-friendly button sizes

#### Mobile (375x667)
- [ ] Header buttons stack or resize
- [ ] Album cards stack in single column (or 2)
- [ ] Modal full-width or near-full
- [ ] Photo grid responsive (maybe 2x2 or 1x1)
- [ ] No content cutoff

**Testing with DevTools:**
1. Open DevTools (F12)
2. Click device toggle (mobile icon)
3. Select device (iPhone 12, iPad, Desktop)
4. Verify layout adjusts

**Verification:**
- [ ] No layout breaks at any size
- [ ] Text readable
- [ ] Buttons clickable
- [ ] No horizontal overflow

**Expected Result:** UI adapts to all screen sizes

---

### 9. Accessibility Features ✓

**Test:** Keyboard navigation and accessibility

#### Focus Visible
- [ ] Click buttons with Tab key
- [ ] Focus ring visible around active element
- [ ] Can navigate all buttons with Tab
- [ ] Shift+Tab goes backward

**Verification:**
- [ ] Focus indicators present
- [ ] Order is logical
- [ ] No focus trap (except modal if designed)

#### Modal Keyboard
- [ ] ESC key closes modal
- [ ] No other keys interfere

**Verification:**
- [ ] ESC closes reliably
- [ ] Modal receives focus on open
- [ ] Focus returns to album card after close

**ARIA Labels** (inspect with DevTools)
- [ ] Buttons have descriptive labels
- [ ] Modal marked as dialog
- [ ] Images have alt text or are decorative

**Verification:**
1. Right-click element
2. Inspect
3. Check aria-label or role attributes

**Expected Result:** Full keyboard navigation; accessible labels; focus visible

---

### 10. Dark Mode Support ✓

**Test:** Dark mode rendering (if OS setting is available)

**On macOS:**
1. System Preferences → General → Appearance
2. Select "Dark"
3. Refresh browser

**On Windows:**
1. Settings → Personalization → Colors
2. Select "Dark"
3. Refresh browser

**On Linux:**
1. Varies by desktop environment
2. Or use browser DevTools

**Verification:**
- [ ] Background is dark
- [ ] Text is light and readable
- [ ] Cards have appropriate dark styling
- [ ] Modal shows dark theme
- [ ] All UI elements theme correctly
- [ ] No white flashes

**Expected Result:** UI adapts to system dark mode preference

---

### 11. Performance Checks ✓

**Test:** App performance under normal use

#### Initial Load
- [ ] App loads in <3 seconds
- [ ] Sample data loads without lag
- [ ] No visible jank on render

**Verification:**
1. Open DevTools → Performance tab
2. Reload page and record
3. Check FPS (should be smooth, 60fps)
4. Check main thread activity

#### Drag & Drop
- [ ] Dragging is smooth (no stuttering)
- [ ] Drop is instant
- [ ] Re-render completes quickly

**Verification:**
1. Open DevTools → Performance
2. Start recording
3. Drag album
4. Stop recording
5. Review frame rate

#### Grouping Mode Change
- [ ] Mode switch instant (<500ms)
- [ ] No noticeable lag
- [ ] Smooth transition

#### Modal Open
- [ ] Modal opens with animation
- [ ] Photo grid renders quickly
- [ ] Animation is smooth

**Expected Result:** All operations responsive and smooth

---

### 12. Data Integrity ✓

**Test:** Database consistency after operations

**Setup:**
1. Open DevTools → Application → IndexedDB or check console logs
2. Perform operations: move, reorder, undo, redo

**Verify After Each Operation:**
- [ ] Album IDs consistent
- [ ] Photo counts correct
- [ ] Dates valid
- [ ] sort_order values sensible
- [ ] No duplicate albums
- [ ] No orphaned photos

**Corruption Check:**
1. Move album 3 times
2. Undo 1.5 times (undo, redo, undo)
3. Check database state is consistent
4. All dates, counts, IDs valid

**Expected Result:** Data remains consistent through all operations

---

## Automated Testing (Future)

### Unit Tests to Add

```javascript
// tests/unit/albumList.test.js
- renderAlbumList() renders correct groups
- handleAlbumDropped() creates correct action type
- scrollToGroup() scrolls to correct element

// tests/unit/app.test.js
- renderApp() creates expected DOM structure
- Button click handlers call correct callbacks
- State subscriber triggers rerender

// tests/unit/controls.test.js
- createHeader() renders all buttons
- Button states update based on appState
- Callbacks fire on click

// tests/unit/albumCard.test.js
- createAlbumCard() renders card correctly
- Card is draggable
- Click event fires onOpen callback

// tests/unit/modal.test.js
- createModal() creates dialog element
- openModal() renders photos
- closeModal() hides element
- ESC key closes modal
```

### Integration Tests to Add

```javascript
// tests/integration/dragDrop.test.js
- Full drag-drop flow updates database
- Move operation creates correct action
- Reorder operation creates correct action
- UI updates after drop

// tests/integration/history.test.js
- Undo reverses move operation
- Redo reapplies move operation
- History max cap works (50 entries)
- Clear history resets stack

// tests/integration/grouping.test.js
- Grouping mode changes rerender UI
- getAlbumsGroupedByDate returns correct groups
- Group headers formatted correctly
- localStorage persists mode
```

---

## Browser Compatibility Testing

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| Chrome | 90+ | ✓ Test | Baseline |
| Firefox | 88+ | ✓ Test | Verify drag-drop |
| Safari | 14+ | ✓ Test | Check CSS support |
| Edge | 90+ | ✓ Test | Chromium-based |
| Mobile Safari | 14+ | ⚠️ Test | Touch drag-drop limited |
| Chrome Mobile | 90+ | ⚠️ Test | Touch drag-drop limited |

**Known Limitations:**
- Touch drag-drop not implemented yet (desktop only)
- Some older browsers may lack CSS grid support

---

## Debugging Tips

### Enable Debug Logging

Add to `main.js`:
```javascript
window.DEBUG = true;
```

Then in code:
```javascript
if (window.DEBUG) console.log('Debug:', message);
```

### Inspect Database State

In browser console:
```javascript
// See current DB state
db.exec("SELECT * FROM albums");
db.exec("SELECT * FROM photos");

// See AppState
console.log(appState);
console.log(appState.undoStack);
console.log(appState.redoStack);
```

### Monitor State Changes

In browser console:
```javascript
// Log state changes
const origSubscribe = appState.subscribe.bind(appState);
appState.subscribe = function(listener) {
  return origSubscribe(() => {
    console.log('State changed:', appState);
    listener();
  });
};
```

### Check LocalStorage

In DevTools:
```
Application tab → Storage → Local Storage → http://localhost:5173
Look for 'grouping_mode' key
```

---

## Known Issues & Workarounds

### Issue: Modal won't close with ESC
**Workaround:** Check browser console for errors; ensure modal element has focus

### Issue: Drag-drop not working on mobile
**Status:** Expected limitation; drag-drop only on desktop
**Workaround:** Use future touch-based implementation

### Issue: Undo/Redo buttons stuck disabled
**Workaround:** Refresh page; history cleared
**Cause:** May indicate state management issue

### Issue: Albums not updating after move
**Workaround:** Refresh page to see latest state
**Cause:** Usually indicates database transaction issue

---

## Test Report Template

```markdown
# Test Report - Date: [DATE]

## Tester: [NAME]
## Browser: [BROWSER] [VERSION]
## OS: [OS] [VERSION]
## Screen Size: [RESOLUTION]

## Summary
- [ ] Passed: [COUNT]
- [ ] Failed: [COUNT]
- [ ] Blocked: [COUNT]
- [ ] Skipped: [COUNT]

## Results

### Basic Functionality
- [ ] App loads without errors
- [ ] Sample data displays
- [ ] No console errors

### Grouping
- [ ] Day mode works
- [ ] Month mode works
- [ ] Year mode works
- [ ] Mode persists

### Drag & Drop
- [ ] Move operation works
- [ ] Reorder operation works
- [ ] Visual feedback works

### Undo/Redo
- [ ] Undo works
- [ ] Redo works
- [ ] Button states correct
- [ ] History limited to 50

### Modal
- [ ] Open on click works
- [ ] Close button works
- [ ] ESC closes
- [ ] Overlay click closes

### Reset
- [ ] Reset confirms
- [ ] Data reloads
- [ ] History clears
- [ ] Cancel works

### Responsive
- [ ] Desktop layout
- [ ] Tablet layout
- [ ] Mobile layout

### Accessibility
- [ ] Keyboard navigation
- [ ] Focus visible
- [ ] Dark mode

### Performance
- [ ] Load time <3s
- [ ] Drag smooth
- [ ] No jank

## Issues Found
1. [Issue description]
2. [Issue description]

## Recommendations
- [Recommendation]
- [Recommendation]

## Sign-off
- [ ] Ready for Phase 2
- [ ] Needs fixes
```

