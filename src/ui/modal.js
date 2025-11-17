/**
 * Modal component for viewing album photos
 */

/**
 * Create modal element
 * @returns {HTMLElement}
 */
export function createModal() {
  const modal = document.createElement('div');
  modal.className = 'modal hidden';
  modal.id = 'album-modal';
  modal.role = 'dialog';
  modal.setAttribute('aria-modal', 'true');

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  const content = document.createElement('div');
  content.className = 'modal-content';

  const header = document.createElement('div');
  header.className = 'modal-header';

  const title = document.createElement('h2');
  title.className = 'modal-title';
  title.id = 'modal-title';
  title.textContent = 'Album';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'modal-close-btn';
  closeBtn.id = 'modal-close-btn';
  closeBtn.setAttribute('aria-label', 'Close modal');
  closeBtn.innerHTML = '&times;';

  header.appendChild(title);
  header.appendChild(closeBtn);

  const body = document.createElement('div');
  body.className = 'modal-body';

  const grid = document.createElement('div');
  grid.className = 'photo-grid';
  grid.id = 'modal-grid';

  body.appendChild(grid);

  content.appendChild(header);
  content.appendChild(body);

  modal.appendChild(overlay);
  modal.appendChild(content);

  // Event handlers
  closeBtn.addEventListener('click', () => closeModal(modal));
  overlay.addEventListener('click', () => closeModal(modal));
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal(modal);
    }
  });

  return modal;
}

/**
 * Open modal with album photos
 * @param {HTMLElement} modal
 * @param {Album} album
 */
export function openModal(modal, album) {
  const title = modal.querySelector('#modal-title');
  const grid = modal.querySelector('#modal-grid');

  title.textContent = album.title;
  grid.innerHTML = '';

  if (!album.photos || album.photos.length === 0) {
    const noPhotos = document.createElement('div');
    noPhotos.className = 'no-photos';
    noPhotos.innerHTML = `
      <div class="no-photos-icon">📷</div>
      <div class="no-photos-text">No photos in this album yet</div>
    `;
    grid.appendChild(noPhotos);
  } else {
    album.photos.forEach((photo) => {
      const item = document.createElement('div');
      item.className = 'photo-grid-item';

      const img = document.createElement('img');
      img.src = photo.file_path;
      img.alt = album.title;
      img.loading = 'lazy';

      item.appendChild(img);
      grid.appendChild(item);
    });
  }

  modal.classList.remove('hidden');
  // Focus first photo for accessibility
  const firstPhoto = grid.querySelector('img');
  if (firstPhoto) firstPhoto.focus();
}

/**
 * Close modal
 * @param {HTMLElement} modal
 */
export function closeModal(modal) {
  modal.classList.add('hidden');
}
