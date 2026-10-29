import { websocketUrl } from './api.js';

const DRAFT_PREFIX = 'linesOfLight.draft.';
export const COLUMN_COUNT = 80;
export const ROW_COUNT = 57;
export const CELL_COUNT = COLUMN_COUNT * ROW_COUNT;
export const EMPTY_CSV = Array(CELL_COUNT).fill('9').join(',');

let socket;
let reconnectTimer;
const roomSubscribers = new Map();
const pendingEvents = [];

function connectSocket() {
  if (typeof WebSocket === 'undefined') return;
  if (socket && [WebSocket.CONNECTING, WebSocket.OPEN].includes(socket.readyState)) return;
  socket = new WebSocket(websocketUrl());
  socket.addEventListener('open', () => {
    roomSubscribers.forEach((_handlers, roomId) => socket.send(JSON.stringify({ type: 'join', roomId })));
    while (pendingEvents.length) socket.send(JSON.stringify(pendingEvents.shift()));
  });
  socket.addEventListener('message', (event) => {
    try {
      const message = JSON.parse(event.data);
      roomSubscribers.get(message.roomId)?.forEach((handler) => handler(message));
    } catch { /* Ignore malformed server messages. */ }
  });
  socket.addEventListener('close', () => {
    clearTimeout(reconnectTimer);
    if (roomSubscribers.size) reconnectTimer = setTimeout(connectSocket, 2000);
  });
}

function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function createId() {
  return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function readArt(id) {
  const draft = readJson(`${DRAFT_PREFIX}${id}`, null);
  if (draft) return draft;
  return null;
}

export function saveDraft(art) {
  try {
    localStorage.setItem(`${DRAFT_PREFIX}${art.id}`, JSON.stringify(art));
  } catch {
    // Keep the current drawing usable if this browser has disabled local storage.
  }
}

export function subscribeToRoom(roomId, handler) {
  const handlers = roomSubscribers.get(roomId) || new Set();
  handlers.add(handler);
  roomSubscribers.set(roomId, handlers);
  connectSocket();
  if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ type: 'join', roomId }));
  return () => {
    handlers.delete(handler);
    if (handlers.size === 0) roomSubscribers.delete(roomId);
    if (roomSubscribers.size === 0) {
      clearTimeout(reconnectTimer);
      socket?.close();
    }
  };
}

export function publishRoomEvent(event) {
  if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify(event));
  else pendingEvents.push(event);
}
