/**
 * Album card component
 */

import * as dal from '../../db/dal.js';
import { createMoveAlbumAction, createReorderAlbumAction, applyAction } from '../../state/actions.js';

/**
 * Create album card element
 * @param {Album} album
 * @param {Function} onOpen - Callback when album is opened
 * @param {Function} onDragStart - Callback for drag start
 * @param {Function} onDragEnd - Callback for drag end
 * @returns {HTMLElement}
 */
export function createAlbumCard(album, { onOpen, onDragStart, onDragEnd }) {
  const card = document.createElement('article');
  card.className = 'album-card';
  card.draggable = true;
  card.dataset.albumId = album.id;

  // Album title
  const title = document.createElement('h3');
  title.className = 'album-title';
  title.textContent = album.title;
  title.title = album.title;
  card.appendChild(title);

  // Photo tiles
  const tilesContainer = document.createElement('div');
  tilesContainer.className = 'album-tiles';

  // Show up to 3 thumbnail tiles
  if (album.photos && album.photos.length > 0) {
    album.photos.slice(0, 3).forEach((photo) => {
      const tile = document.createElement('div');
      tile.className = 'album-tile';

      const img = document.createElement('img');
      img.src = photo.file_path;
      img.alt = album.title;
      img.loading = 'lazy';

      tile.appendChild(img);
      tilesContainer.appendChild(tile);
    });
  } else {
    // Placeholder if no photos
    for (let i = 0; i < 3; i++) {
      const tile = document.createElement('div');
      tile.className = 'album-tile';
      tilesContainer.appendChild(tile);
    }
  }

  card.appendChild(tilesContainer);

  // Metadata
  const meta = document.createElement('div');
  meta.className = 'album-meta';

  const photoCount = document.createElement('span');
  photoCount.className = 'photo-count';
  photoCount.textContent = `${album.photo_count || 0} photo${
    (album.photo_count || 0) !== 1 ? 's' : ''
  }`;
  meta.appendChild(photoCount);

  card.appendChild(meta);

  // Event handlers
  card.addEventListener('dragstart', (ev) => {
    card.classList.add('dragging');
    ev.dataTransfer.effectAllowed = 'move';
    ev.dataTransfer.setData('application/json', JSON.stringify({ albumId: album.id }));
    if (onDragStart) onDragStart(album.id);
  });

  card.addEventListener('dragend', () => {
    card.classList.remove('dragging');
    if (onDragEnd) onDragEnd();
  });

  card.addEventListener('click', (ev) => {
    // Don't open if clicking drag handle area
    if (ev.target.closest('.album-actions')) return;
    if (onOpen) onOpen(album.id);
  });

  return card;
}

/**
 * Update album card with new data
 * @param {HTMLElement} card
 * @param {Album} album
 */
export function updateAlbumCard(card, album) {
  const title = card.querySelector('.album-title');
  if (title) title.textContent = album.title;

  const photoCount = card.querySelector('.photo-count');
  if (photoCount) {
    photoCount.textContent = `${album.photo_count || 0} photo${
      (album.photo_count || 0) !== 1 ? 's' : ''
    }`;
  }

  const tilesContainer = card.querySelector('.album-tiles');
  if (tilesContainer && album.photos) {
    tilesContainer.innerHTML = '';
    album.photos.slice(0, 3).forEach((photo) => {
      const tile = document.createElement('div');
      tile.className = 'album-tile';

      const img = document.createElement('img');
      img.src = photo.file_path;
      img.alt = album.title;
      img.loading = 'lazy';

      tile.appendChild(img);
      tilesContainer.appendChild(tile);
    });
  }
}
