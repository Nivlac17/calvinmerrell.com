export const PROFILE_KEY = 'linesOfLight.profile.v1';
const LIBRARY_KEY = 'linesOfLight.library.v1';
const DRAFT_PREFIX = 'linesOfLight.draft.';
const CHAT_PREFIX = 'linesOfLight.chat.';
const ROOM_CHANNEL = 'linesOfLight.rooms.v1';
export const COLUMN_COUNT = 80;
export const ROW_COUNT = 57;
export const CELL_COUNT = COLUMN_COUNT * ROW_COUNT;
export const EMPTY_CSV = Array(CELL_COUNT).fill('9').join(',');

let roomChannel;
try {
  roomChannel = typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel(ROOM_CHANNEL);
} catch {
  roomChannel = null;
}

function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function announceLibraryChange() {
  window.dispatchEvent(new CustomEvent('lines-of-light:library-change'));
}

export function createId() {
  return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function readLibrary() {
  const library = readJson(LIBRARY_KEY, []);
  return Array.isArray(library) ? library : [];
}

export function readArt(id) {
  const draft = readJson(`${DRAFT_PREFIX}${id}`, null);
  if (draft) return draft;
  const saved = readLibrary().find((art) => art.id === id);
  if (saved) return saved;
  return null;
}

export function saveDraft(art) {
  try {
    localStorage.setItem(`${DRAFT_PREFIX}${art.id}`, JSON.stringify(art));
  } catch {
    // Keep the current drawing usable if this browser has disabled local storage.
  }
}

export function saveArtwork(art) {
  const saved = {
    ...art,
    title: art.title.trim() || 'Untitled art',
    updated: new Date().toISOString(),
  };
  const library = readLibrary().filter((item) => item.id !== saved.id);
  library.unshift(saved);
  try {
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(library));
    saveDraft(saved);
    announceLibraryChange();
    return true;
  } catch {
    return false;
  }
}

export function deleteArtwork(id) {
  const library = readLibrary().filter((art) => art.id !== id);
  localStorage.setItem(LIBRARY_KEY, JSON.stringify(library));
  localStorage.removeItem(`${DRAFT_PREFIX}${id}`);
  announceLibraryChange();
}

export function readRoomMessages(roomId) {
  const messages = readJson(`${CHAT_PREFIX}${roomId}`, []);
  return Array.isArray(messages) ? messages : [];
}

export function subscribeToRoom(handler) {
  if (!roomChannel) return () => {};
  const listener = (event) => handler(event.data);
  roomChannel.addEventListener('message', listener);
  return () => roomChannel.removeEventListener('message', listener);
}

export function publishRoomEvent(event) {
  roomChannel?.postMessage(event);
}

export function saveRoomMessage(roomId, message) {
  const messages = readRoomMessages(roomId);
  const next = [...messages, message].slice(-100);
  localStorage.setItem(`${CHAT_PREFIX}${roomId}`, JSON.stringify(next));
  publishRoomEvent({ type: 'chat', roomId, message });
  return next;
}
