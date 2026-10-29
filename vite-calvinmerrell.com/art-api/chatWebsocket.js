const { WebSocketServer, WebSocket } = require('ws');
const DB = require('./database.js');

const cookieName = process.env.AUTH_COOKIE_NAME || 'token';
const allowedOrigins = new Set((process.env.CLIENT_ORIGINS || 'https://calvinmerrell.com,http://localhost:5173')
  .split(',').map((origin) => origin.trim()).filter(Boolean));

function cookieValue(header, name) {
  for (const part of (header || '').split(';')) {
    const [key, ...value] = part.trim().split('=');
    if (key === name) return decodeURIComponent(value.join('='));
  }
  return '';
}

function chatWebsocket(server) {
  const socketServer = new WebSocketServer({
    server,
    path: '/ws',
    verifyClient: (info, done) => {
      const origin = info.origin;
      const token = cookieValue(info.req.headers.cookie, cookieName);
      if (!origin || !allowedOrigins.has(origin) || !token) {
        done(false, 401, 'Unauthorized');
        return;
      }
      DB.getUserByToken(token).then((user) => {
        if (!user) return done(false, 401, 'Unauthorized');
        done(true);
      }).catch((error) => {
        console.error('WebSocket authentication failed:', error);
        done(false, 500, 'Authentication unavailable');
      });
    },
  });

  socketServer.on('connection', (socket) => {
    socket.rooms = new Set();
    socket.isAlive = true;
    socket.on('pong', () => { socket.isAlive = true; });
    socket.on('message', (raw) => {
      let event;
      try { event = JSON.parse(raw.toString()); } catch { return; }
      if (event?.type === 'join' && typeof event.roomId === 'string') {
        socket.rooms.add(event.roomId);
        return;
      }
      if (!['pixel', 'clear'].includes(event?.type) || typeof event.roomId !== 'string') return;
      broadcastRoom(event.roomId, event, socket);
    });
  });

  const heartbeat = setInterval(() => {
    for (const socket of socketServer.clients) {
      if (socket.isAlive === false) {
        socket.terminate();
        continue;
      }
      socket.isAlive = false;
      socket.ping();
    }
  }, 25000);
  socketServer.on('close', () => clearInterval(heartbeat));

  function broadcastRoom(roomId, event, sender = null) {
    const payload = JSON.stringify(event);
    for (const client of socketServer.clients) {
      if (client !== sender && client.readyState === WebSocket.OPEN && client.rooms?.has(roomId)) {
        client.send(payload);
      }
    }
  }

  return { broadcastRoom };
}

module.exports = { chatWebsocket };
