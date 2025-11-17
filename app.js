// Photo organizer with hierarchical grouping and undo/redo
(function(){
  const STORAGE_KEY = 'speckit.photo.organizer.v1';
  const HISTORY_KEY = 'speckit.photo.organizer.history';
  const MODE_KEY = 'speckit.photo.organizer.grouping';
  const MAX_HISTORY = 50;
  const GROUPING_MODES = ['day', 'month', 'year'];

  const sampleData = [
    {
      date: '2025-11-17',
      albums: [
        { id: 'a1', title: 'Morning walk', photos: [
          'https://picsum.photos/seed/p1/800/600',
          'https://picsum.photos/seed/p2/800/600',
          'https://picsum.photos/seed/p3/800/600',
          'https://picsum.photos/seed/p4/800/600'
        ]},
        { id: 'a2', title: 'Brunch', photos: [
          'https://picsum.photos/seed/p5/800/600',
          'https://picsum.photos/seed/p6/800/600',
          'https://picsum.photos/seed/p7/800/600'
        ]}
      ]
    },
    {
      date: '2025-11-16',
      albums: [
        { id: 'b1', title: 'Conference', photos: [
          'https://picsum.photos/seed/p8/800/600',
          'https://picsum.photos/seed/p9/800/600',
          'https://picsum.photos/seed/p10/800/600',
          'https://picsum.photos/seed/p11/800/600'
        ]}
      ]
    },
    {
      date: '2025-10-01',
      albums: [
        { id: 'c1', title: 'October trip', photos: [
          'https://picsum.photos/seed/p12/800/600',
          'https://picsum.photos/seed/p13/800/600'
        ]}
      ]
    }
  ];

  let data = null;
  let groupingMode = 'day';
  let undoStack = [];
  let redoStack = [];
  let dragSrcId = null;

  const groupsEl = document.getElementById('groups');
  const modal = document.getElementById('album-modal');
  const modalGrid = document.getElementById('modal-grid');
  const modalTitle = document.getElementById('modal-title');

  // --- Utility functions ---
  function getDatePart(dateStr, mode){
    if(mode === 'day') return dateStr;
    if(mode === 'month') return dateStr.slice(0,7);
    if(mode === 'year') return dateStr.slice(0,4);
  }

  function formatGroupLabel(dateStr, mode){
    const d = new Date(dateStr + 'T00:00:00Z');
    if(isNaN(d)) return dateStr;
    const opts = {timeZone: 'UTC'};
    if(mode === 'day'){
      const day = d.toLocaleDateString('en-US', {weekday: 'long', ...opts});
      const date = d.toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric', ...opts});
      return `${day}, ${date}`;
    }
    if(mode === 'month') return d.toLocaleDateString('en-US', {month: 'long', year: 'numeric', ...opts});
    if(mode === 'year') return d.toLocaleDateString('en-US', {year: 'numeric', ...opts});
    return dateStr;
  }

  function deriveGroups(){
    const map = {};
    const allAlbums = [];
    data.forEach(dateGroup => {
      dateGroup.albums.forEach(album => {
        allAlbums.push({...album, date: dateGroup.date});
      });
    });

    allAlbums.forEach(album => {
      const groupId = getDatePart(album.date, groupingMode);
      if(!map[groupId]) map[groupId] = [];
      map[groupId].push(album);
    });

    return Object.entries(map).sort().reverse().map(([gId, albums]) => ({
      id: gId,
      label: formatGroupLabel(gId, groupingMode),
      albums: albums.map(({date, ...a}) => a)
    }));
  }

  // --- Persistence ---
  function loadData(){
    const raw = localStorage.getItem(STORAGE_KEY);
    const modeRaw = localStorage.getItem(MODE_KEY);
    const histRaw = localStorage.getItem(HISTORY_KEY);

    if(raw){
      try{ data = JSON.parse(raw); }catch(e){ data = JSON.parse(JSON.stringify(sampleData)); }
    } else {
      data = JSON.parse(JSON.stringify(sampleData));
    }

    groupingMode = modeRaw && GROUPING_MODES.includes(modeRaw) ? modeRaw : 'day';
    try {
      const parsed = histRaw ? JSON.parse(histRaw) : {undo: [], redo: []};
      undoStack = parsed.undo || [];
      redoStack = parsed.redo || [];
    } catch(e) {
      undoStack = [];
      redoStack = [];
    }
  }

  function loadState(){
    loadData();
    updateHistoryUI();
  }

  function saveState(){
    saveData();
    updateHistoryUI();
  }

  function saveData(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem(MODE_KEY, groupingMode);
    localStorage.setItem(HISTORY_KEY, JSON.stringify({undo: undoStack, redo: redoStack}));
  }

  // --- History ---
  function pushHistory(action){
    undoStack.push(action);
    if(undoStack.length > MAX_HISTORY) undoStack.shift();
    redoStack = [];
    saveData();
  }

  function undo(){
    if(undoStack.length === 0) return;
    const entry = undoStack.pop();
    redoStack.push(entry);

    const src = findAlbumById(entry.albumId);
    if(!src) { redoStack.pop(); return; }

    const fromGroup = data.find(g => g.date === entry.fromGroupId);
    if(!fromGroup) { redoStack.pop(); return; }

    fromGroup.albums = fromGroup.albums.filter(a => a.id !== entry.albumId);
    if(entry.beforeAlbumId){
      const beforeIdx = fromGroup.albums.findIndex(a => a.id === entry.beforeAlbumId);
      if(beforeIdx >= 0){
        fromGroup.albums.splice(beforeIdx, 0, src.album);
      } else {
        fromGroup.albums.push(src.album);
      }
    } else {
      fromGroup.albums.push(src.album);
    }

    saveData(); render(); updateHistoryUI();
  }

  function redo(){
    if(redoStack.length === 0) return;
    const entry = redoStack.pop();
    undoStack.push(entry);

    const src = findAlbumById(entry.albumId);
    if(!src) { undoStack.pop(); return; }

    const fromGroup = src.group;
    fromGroup.albums = fromGroup.albums.filter(a => a.id !== entry.albumId);

    const toGroup = data.find(g => g.date === entry.toGroupId);
    if(!toGroup) { undoStack.pop(); return; }

    if(entry.beforeAlbumId){
      const beforeIdx = toGroup.albums.findIndex(a => a.id === entry.beforeAlbumId);
      if(beforeIdx >= 0){
        toGroup.albums.splice(beforeIdx, 0, src.album);
      } else {
        toGroup.albums.push(src.album);
      }
    } else {
      toGroup.albums.push(src.album);
    }

    saveData(); render(); updateHistoryUI();
  }

  function findAlbumById(id){
    for(const group of data){
      for(const album of group.albums){ if(album.id===id) return {group,album}; }
    }
    return null;
  }

  function render(){
    const groups = deriveGroups();
    groupsEl.innerHTML = '';
    groups.forEach(group => {
      const g = document.createElement('section');
      g.className = 'group';
      const header = document.createElement('div'); header.className='group-header';
      const title = document.createElement('div'); title.className='group-title'; title.textContent = group.label;
      header.appendChild(title);
      g.appendChild(header);

      const list = document.createElement('div'); list.className = 'album-list';
      list.addEventListener('dragover', (ev)=>{ ev.preventDefault(); list.classList.add('drop-target'); });
      list.addEventListener('dragleave', ()=>{ list.classList.remove('drop-target'); });
      list.addEventListener('drop', (ev)=>{
        ev.preventDefault(); list.classList.remove('drop-target');
        const id = ev.dataTransfer.getData('text/plain');
        if(!id || id === dragSrcId) return;
        moveAlbumToGroup(id, group.id);
      });

      group.albums.forEach(album => {
        const card = createAlbumElement(album);
        card.addEventListener('dragover', (ev)=>{ ev.preventDefault(); card.classList.add('drop-target'); });
        card.addEventListener('dragleave', ()=>{ card.classList.remove('drop-target'); });
        card.addEventListener('drop', (ev)=>{
          ev.preventDefault(); card.classList.remove('drop-target');
          const id = ev.dataTransfer.getData('text/plain');
          if(!id || id === dragSrcId) return;
          insertAlbumBefore(id, album.id);
        });

        list.appendChild(card);
      });

      g.appendChild(list);
      groupsEl.appendChild(g);
    });
  }

  function createAlbumElement(album){
    const el = document.createElement('article'); el.className='album'; el.draggable=true; el.dataset.id = album.id;
    el.addEventListener('dragstart', (ev)=>{ dragSrcId = album.id; el.classList.add('dragging'); ev.dataTransfer.setData('text/plain', album.id); ev.dataTransfer.effectAllowed = 'move'; });
    el.addEventListener('dragend', ()=>{ el.classList.remove('dragging'); dragSrcId = null; });

    const h = document.createElement('h3'); h.textContent = album.title; el.appendChild(h);

    const tiles = document.createElement('div'); tiles.className='tiles';
    // show up to 6 thumbnails
    (album.photos||[]).slice(0,6).forEach(src=>{
      const img = document.createElement('img'); img.className='tile'; img.src = src; img.alt = album.title;
      tiles.appendChild(img);
    });
    el.appendChild(tiles);

    const meta = document.createElement('div'); meta.className='meta'; meta.textContent = `${(album.photos||[]).length} photos`;
    el.appendChild(meta);

    // open album on click
    el.addEventListener('click', (ev)=>{
      // prevent opening when drop events occur
      if(ev.target && ev.target.draggable) return;
      openAlbumModal(album.id);
    });

    return el;
  }

  function moveAlbumToGroup(albumId, targetGroupId){
    const src = findAlbumById(albumId);
    if(!src) return;

    const groups = deriveGroups();
    const targetGroup = groups.find(g => g.id === targetGroupId);
    if(!targetGroup) return;

    let targetDate = null;
    for(const dateGroup of data){
      for(const album of dateGroup.albums){
        const found = targetGroup.albums.find(a => a.id === album.id);
        if(found) {
          targetDate = dateGroup.date;
          break;
        }
      }
      if(targetDate) break;
    }

    if(!targetDate && targetGroup.albums.length > 0){
      const firstAlbum = targetGroup.albums[0];
      targetDate = data.find(g => g.albums.some(a => a.id === firstAlbum.id))?.date;
    }

    if(!targetDate) return;

    const toGroup = data.find(g => g.date === targetDate);
    src.group.albums = src.group.albums.filter(a => a.id !== albumId);
    if(toGroup) toGroup.albums.push(src.album);

    pushHistory({action: 'move', albumId, fromGroupId: src.group.date, toGroupId: targetDate});
    saveState(); render();
  }

  function insertAlbumBefore(albumId, beforeAlbumId){
    if(albumId === beforeAlbumId) return;
    const src = findAlbumById(albumId); if(!src) return;
    const before = findAlbumById(beforeAlbumId); if(!before) return;

    const srcGroup = src.group;
    const beforeGroup = before.group;

    srcGroup.albums = srcGroup.albums.filter(a => a.id !== albumId);
    const beforeIdx = beforeGroup.albums.findIndex(a => a.id === beforeAlbumId);
    if(beforeIdx >= 0) beforeGroup.albums.splice(beforeIdx, 0, src.album);
    else beforeGroup.albums.push(src.album);

    pushHistory({action: 'reorder', albumId, fromGroupId: srcGroup.date, toGroupId: beforeGroup.date, beforeAlbumId});
    saveState(); render();
  }

  function openAlbumModal(albumId){
    const res = findAlbumById(albumId); if(!res) return;
    modalTitle.textContent = res.album.title + ' — ' + formatGroupLabel(res.group.date, 'day');
    modalGrid.innerHTML = '';
    (res.album.photos||[]).forEach(src=>{
      const img = document.createElement('img'); img.src = src; img.alt = res.album.title;
      modalGrid.appendChild(img);
    });
    modal.classList.remove('hidden');
  }

  function updateHistoryUI(){
    document.getElementById('undo-btn').disabled = undoStack.length === 0;
    document.getElementById('redo-btn').disabled = redoStack.length === 0;
  }

  function cycleGroupingMode(){
    const idx = GROUPING_MODES.indexOf(groupingMode);
    groupingMode = GROUPING_MODES[(idx + 1) % GROUPING_MODES.length];
    undoStack = [];
    redoStack = [];
    saveData(); render(); updateGroupingUI();
  }

  function updateGroupingUI(){
    const label = groupingMode.charAt(0).toUpperCase() + groupingMode.slice(1);
    document.getElementById('grouping-btn').textContent = `Group by: ${label}`;
  }

  function initEvents(){
    document.getElementById('modal-close').addEventListener('click', ()=>{ modal.classList.add('hidden'); });
    modal.addEventListener('click', (ev)=>{ if(ev.target===modal) modal.classList.add('hidden'); });
    document.addEventListener('keydown', (ev)=>{ if(ev.key === 'Escape' && !modal.classList.contains('hidden')) modal.classList.add('hidden'); });

    document.getElementById('reset-data').addEventListener('click', ()=>{ localStorage.clear(); location.reload(); });
    document.getElementById('clear-storage').addEventListener('click', ()=>{ localStorage.removeItem(STORAGE_KEY); localStorage.removeItem(HISTORY_KEY); loadState(); render(); });
    document.getElementById('grouping-btn').addEventListener('click', cycleGroupingMode);
    document.getElementById('undo-btn').addEventListener('click', undo);
    document.getElementById('redo-btn').addEventListener('click', redo);
    updateGroupingUI();
  }

  // Initialize
  loadState(); initEvents(); render();

})();
