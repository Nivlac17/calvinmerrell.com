const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const DB = require('./database.js');
const { chatWebsocket } = require('./chatWebsocket.js');

const app = express();
const cookieName = process.env.AUTH_COOKIE_NAME || 'token';
const allowedOrigins = new Set((process.env.CLIENT_ORIGINS || 'https://calvinmerrell.com,http://localhost:5173')
  .split(',').map((origin) => origin.trim()).filter(Boolean));

app.disable('x-powered-by');
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  if (origin && !allowedOrigins.has(origin)) return res.sendStatus(403);
  next();
});
app.use(express.json({ limit: '64kb' }));
app.use(cookieParser());
app.get('/health', (_req, res) => res.json({ ok: true }));

const api = express.Router();
app.use('/api', api);

async function findSession(req) {
  const token = req.cookies[cookieName];
  return token ? DB.getUserByToken(token) : null;
}

async function requireAuth(req, res, next) {
  try {
    req.user = await findSession(req);
    if (!req.user) return res.status(401).json({ msg: 'Unauthorized' });
    next();
  } catch (error) { next(error); }
}

function normalizeEmail(email) {
  return typeof email === 'string' ? email.trim().toLowerCase() : '';
}

function setAuthCookie(res, token) {
  res.cookie(cookieName, token, {
    maxAge: 1000 * 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });
}

api.post('/auth/create', async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = typeof req.body.password === 'string' ? req.body.password : '';
    if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 8 || password.length > 128) {
      return res.status(400).json({ msg: 'Enter a valid email and a password between 8 and 128 characters.' });
    }
    if (await DB.getUserByEmail(email)) return res.status(409).json({ msg: 'Existing user' });
    const user = { email, password: await bcrypt.hash(password, 12), token: uuidv4() };
    await DB.addUser(user);
    setAuthCookie(res, user.token);
    res.status(201).json({ email: user.email });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ msg: 'Existing user' });
    next(error);
  }
});

api.post('/auth/login', async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = typeof req.body.password === 'string' ? req.body.password : '';
    const user = await DB.getUserByEmail(email);
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ msg: 'Email or password is incorrect.' });
    }
    user.token = uuidv4();
    await DB.updateUser(user);
    setAuthCookie(res, user.token);
    res.json({ email: user.email });
  } catch (error) { next(error); }
});

api.get('/auth/me', requireAuth, (req, res) => res.json({ email: req.user.email }));

api.delete('/auth/logout', async (req, res, next) => {
  try {
    const user = await findSession(req);
    if (user) {
      delete user.token;
      await DB.updateUser(user);
    }
    res.clearCookie(cookieName, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' });
    res.sendStatus(204);
  } catch (error) { next(error); }
});

api.post('/subscribe', async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const consent = req.body.consent === true;
    const honeypot = typeof req.body.website === 'string' ? req.body.website.trim() : '';

    // Silently accept filled honeypots so simple bots do not learn the field is monitored.
    if (honeypot) return res.sendStatus(202);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || !consent) {
      return res.status(400).json({ msg: 'Enter a valid email address and confirm the subscription.' });
    }

    try {
      await DB.addSubscriber({
        email,
        status: 'subscribed',
        source: 'website',
        consentTextVersion: 'newsletter-v1',
        subscribedAt: new Date(),
      });
    } catch (error) {
      if (error.code !== 11000) throw error;
    }

    res.sendStatus(202);
  } catch (error) { next(error); }
});

api.get('/portfolio/all', requireAuth, async (_req, res, next) => {
  try { res.json(await DB.getAllArt()); } catch (error) { next(error); }
});

api.get('/portfolio/:id', requireAuth, async (req, res, next) => {
  try {
    const art = await DB.getArt(req.params.id);
    if (!art) return res.status(404).json({ msg: 'Artwork not found' });
    res.json(art);
  } catch (error) { next(error); }
});

api.post('/portfolio', requireAuth, async (req, res, next) => {
  try {
    const { title, artCsv, id } = req.body;
    if (typeof title !== 'string' || !title.trim() || title.length > 60 || typeof artCsv !== 'string' || artCsv.length > 30000) {
      return res.status(400).json({ msg: 'A title and valid artwork grid are required.' });
    }
    const art = await DB.saveArt({ id, userName: req.user.email, title: title.trim(), artCsv });
    if (!art) return res.status(404).json({ msg: 'Artwork not found in your account.' });
    res.json(art);
  } catch (error) { next(error); }
});

api.delete('/portfolio/:id', requireAuth, async (req, res, next) => {
  try {
    const deleted = await DB.deleteArt(req.params.id, req.user.email);
    if (!deleted) return res.status(404).json({ msg: 'Artwork not found in your account.' });
    res.sendStatus(204);
  } catch (error) { next(error); }
});

api.get('/chat/:roomId', requireAuth, async (req, res, next) => {
  try {
    const art = await DB.getArt(req.params.roomId);
    if (!art) return res.status(404).json({ msg: 'Artwork not found' });
    res.json(await DB.getChat(req.params.roomId));
  } catch (error) { next(error); }
});

let broadcastRoom = () => {};
api.post('/chat/:roomId', requireAuth, async (req, res, next) => {
  try {
    const art = await DB.getArt(req.params.roomId);
    if (!art) return res.status(404).json({ msg: 'Artwork not found' });
    const text = typeof req.body.message === 'string' ? req.body.message.trim().slice(0, 500) : '';
    if (!text) return res.status(400).json({ msg: 'Message is required.' });
    const message = { id: uuidv4(), roomId: req.params.roomId, name: req.user.email.split('@')[0], message: text, createdAt: new Date() };
    await DB.addChat(message);
    broadcastRoom(req.params.roomId, { type: 'chat', roomId: req.params.roomId, message });
    res.status(201).json(message);
  } catch (error) { next(error); }
});

app.use((error, _req, res, _next) => {
  console.error('API request failed:', error);
  res.status(500).json({ msg: 'Server error' });
});

async function start() {
  await DB.connect();
  const port = process.env.PORT || 4000;
  const server = app.listen(port, '0.0.0.0', () => console.log(`Lines of Light API listening on ${port}`));
  ({ broadcastRoom } = chatWebsocket(server));
}

start().catch((error) => {
  console.error('Could not start Lines of Light API:', error);
  process.exit(1);
});
