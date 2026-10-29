import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { HashRouter, Link, Navigate, NavLink, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { apiRequest } from './api.js';
import { normalizeArtCells, normalizeArtCsv, normalizeArtRecord } from './art-format.js';
import { PALETTE } from './palette.js';
import {
  CELL_COUNT,
  COLUMN_COUNT,
  EMPTY_CSV,
  ROW_COUNT,
  createId,
  publishRoomEvent,
  readArt,
  saveDraft,
  subscribeToRoom,
} from './store.js';

export { PALETTE };
const PROFILE_CONTEXT = createContext('');
const BASE_URL = import.meta.env.BASE_URL;

function useProfile() {
  return useContext(PROFILE_CONTEXT);
}

export default function App() {
  const [profile, setProfile] = useState('');
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    apiRequest('/auth/me')
      .then((user) => setProfile(user.email))
      .catch(() => setProfile(''))
      .finally(() => setAuthLoading(false));
  }, []);

  async function signOut() {
    try { await apiRequest('/auth/logout', { method: 'DELETE' }); } catch { /* Clear the local view even if the API is offline. */ }
    setProfile('');
  }

  return (
    <PROFILE_CONTEXT.Provider value={profile}>
      <HashRouter>
        <AnalyticsTracker />
        <div className="art-app">
          <header className="art-header">
            <Link className="art-brand" to="/" aria-label="Lines of Light home">
              <span>Lines of Light<small>ART STUDIO</small></span>
            </Link>
            <nav className="art-nav" aria-label="Art studio navigation">
              <NavLink to="/">Login</NavLink>
              {profile && <NavLink to="/navigation">Artist’s Page</NavLink>}
              {profile && <NavLink to="/draw/new">Draw</NavLink>}
              <NavLink to="/quote">Quote</NavLink>
              {profile && <button className="nav-signout" onClick={signOut}>Sign out</button>}
            </nav>
          </header>

          <Routes>
            <Route path="/" element={<ProfilePage profile={profile} onSignIn={setProfile} />} />
            <Route path="/navigation" element={<RequireProfile loading={authLoading} profile={profile}><GalleryPage /></RequireProfile>} />
            <Route path="/draw/:artId" element={<RequireProfile loading={authLoading} profile={profile}><DrawPage /></RequireProfile>} />
            <Route path="/watch/:artId" element={<RequireProfile loading={authLoading} profile={profile}><WatchPage /></RequireProfile>} />
            <Route path="/quote" element={<QuotePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>

          <footer className="art-footer">
            <span>Lines of Light</span>
            <span>Made for small acts of imagination.</span>
            <a href="/">Calvin Merrell</a>
          </footer>
        </div>
      </HashRouter>
    </PROFILE_CONTEXT.Provider>
  );
}

function AnalyticsTracker() {
  const location = useLocation();
  const lastPage = useRef('');

  useEffect(() => {
    const pagePath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (!window.gtag || pagePath === lastPage.current) return;
    lastPage.current = pagePath;
    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [location.pathname, location.search, location.hash]);

  return null;
}

function RequireProfile({ loading, profile, children }) {
  if (loading) return <main className="page-wrap"><p className="eyebrow">Checking your account…</p></main>;
  return profile ? children : <Navigate to="/" replace />;
}

function ProfilePage({ profile, onSignIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const user = await apiRequest(`/auth/${mode === 'create' ? 'create' : 'login'}`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      onSignIn(user.email);
      navigate('/navigation');
    } catch (requestError) {
      setError(requestError.message === 'Failed to fetch'
        ? 'Could not reach the Lines of Light service. Please try again shortly.'
        : requestError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="welcome-layout">
      <section className="welcome-copy">
        <h1>Lines of <em>Light.</em></h1>
      </section>
      <section className="profile-card">
        {profile ? (
          <>
            <p className="eyebrow">Welcome back</p>
            <h2>{profile}</h2>
            <p>Your account and gallery are stored online.</p>
            <button className="button primary full" onClick={() => navigate('/navigation')}>Open my studio</button>
          </>
        ) : (
          <>
            <p className="eyebrow">{mode === 'create' ? 'New artist account' : 'Welcome back'}</p>
            <h2>{mode === 'create' ? 'Create your account' : 'Sign in to your studio'}</h2>
            <p>Use your account to save and share your artwork.</p>
            <form onSubmit={submit}>
              <label htmlFor="artist-email">Email</label>
              <input id="artist-email" type="email" autoComplete="email" maxLength={254} required placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} />
              <label htmlFor="artist-password">Password</label>
              <input id="artist-password" type="password" autoComplete={mode === 'create' ? 'new-password' : 'current-password'} minLength={mode === 'create' ? 8 : 1} maxLength={128} required placeholder={mode === 'create' ? 'At least 8 characters' : 'Password'} value={password} onChange={(event) => setPassword(event.target.value)} />
              {error && <p className="form-error" role="alert">{error}</p>}
              <button className="button primary full" type="submit" disabled={busy || !email.trim() || !password || (mode === 'create' && password.length < 8)}>
                {busy ? 'Connecting…' : mode === 'create' ? 'Create account' : 'Sign in'} <span aria-hidden="true">↗</span>
              </button>
            </form>
            <button className="text-button auth-mode-toggle" onClick={() => { setMode(mode === 'create' ? 'login' : 'create'); setError(''); }}>
              {mode === 'create' ? 'Already have an account? Sign in' : 'New here? Create an account'}
            </button>
          </>
        )}
      </section>
    </main>
  );
}

function GalleryPage() {
  const profile = useProfile();
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [galleryError, setGalleryError] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    apiRequest('/portfolio/all')
      .then((records) => setArtworks(Array.isArray(records) ? records.map(normalizeArtRecord).filter((art) => art?.id) : []))
      .catch((error) => setGalleryError(error.message))
      .finally(() => setLoading(false));
  }, []);

  function createArtwork(event) {
    event.preventDefault();
    if (!title.trim()) return;
    const draft = { id: createId(), userName: profile, title: title.trim(), artCsv: EMPTY_CSV };
    saveDraft(draft);
    setTitle('');
    navigate(`/draw/${draft.id}`);
  }

  function copyArtwork(art) {
    const copy = {
      id: createId(),
      userName: profile,
      title: `Copy of ${art.title}`,
      artCsv: normalizeArtCsv(art.artCsv),
    };
    saveDraft(copy);
    navigate(`/draw/${copy.id}`);
  }

  async function removeArtwork(art) {
    try {
      await apiRequest(`/portfolio/${art.id}`, { method: 'DELETE' });
      setArtworks((previous) => previous.filter((item) => item.id !== art.id));
    } catch (error) {
      setGalleryError(error.message);
    }
  }

  const groups = artworks.reduce((result, art) => {
    const artist = art.userName || 'Guest artist';
    (result[artist] ||= []).push(art);
    return result;
  }, {});

  return (
    <main className="page-wrap">
      <section className="page-intro">
        <div>
          <p className="eyebrow">Your sketchbook</p>
          <h1>Artist’s gallery</h1>
          <p>Browse artwork from the studio or start a new canvas.</p>
        </div>
      </section>

      <form className="new-art-card" onSubmit={createArtwork}>
        <div className="new-art-mark" aria-hidden="true">＋</div>
        <div className="new-art-text"><strong>Start with a blank grid</strong><span>Name your next idea and make it yours.</span></div>
        <label className="sr-only" htmlFor="new-art-title">New artwork title</label>
        <input id="new-art-title" maxLength={60} placeholder="Artwork title" value={title} onChange={(event) => setTitle(event.target.value)} />
        <button className="button primary" type="submit" disabled={!title.trim()}>New artwork <span aria-hidden="true">↗</span></button>
      </form>

      {artworks.length === 0 ? (
        loading ? <section className="empty-gallery"><h2>Loading your gallery…</h2></section> : galleryError ? <section className="empty-gallery"><h2>Could not load the gallery</h2><p>{galleryError}</p></section> : <section className="empty-gallery">
          <div aria-hidden="true">▦</div>
          <h2>Your gallery is waiting</h2>
          <p>Create your first piece above. It will be saved to your account.</p>
        </section>
      ) : (
        Object.entries(groups).map(([artist, pieces]) => (
          <section className="gallery-section" key={artist}>
            <div className="gallery-heading"><h2>{artist === profile ? 'Your artwork' : `${artistLabel(artist)}’s artwork`}</h2><span>{pieces.length} {pieces.length === 1 ? 'piece' : 'pieces'}</span></div>
            <div className="artwork-grid">
              {pieces.map((art) => (
                <article className="artwork-card" key={art.id}>
                  <ArtThumbnail artCsv={art.artCsv} title={art.title} />
                  <div className="artwork-card-body">
                    <h3>{art.title}</h3>
                    <p>{art.userName === profile ? 'Saved by you' : `By ${artistLabel(art.userName)}`}</p>
                    <div className="card-actions">
                      <button className="button subtle" onClick={() => navigate(`/watch/${art.id}`)}>View piece</button>
                      {art.userName === profile ? (
                        <button className="button subtle" onClick={() => navigate(`/draw/${art.id}`)}>Edit</button>
                      ) : (
                        <button className="button subtle" onClick={() => copyArtwork(art)}>Make a copy</button>
                      )}
                      {art.userName === profile && <button className="icon-button" onClick={() => removeArtwork(art)} aria-label={`Delete ${art.title}`}>×</button>}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))
      )}

      {galleryError && artworks.length > 0 && <p className="form-error" role="alert">{galleryError}</p>}
      <section className="featured-card">
        <img src={`${BASE_URL}sunset.jpeg`} alt="Warm sunset over a quiet landscape" />
        <div><p className="eyebrow">A little inspiration</p><h2>Color outside the lines.</h2></div>
      </section>
    </main>
  );
}

function ArtThumbnail({ artCsv, title }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = COLUMN_COUNT;
    canvas.height = ROW_COUNT;
    const context = canvas.getContext('2d');
    const values = normalizeArtCells(artCsv);
    values.forEach((value, index) => {
      const color = PALETTE[value]?.value || 'whitesmoke';
      context.fillStyle = color;
      context.fillRect(index % COLUMN_COUNT, Math.floor(index / COLUMN_COUNT), 1, 1);
    });
  }, [artCsv]);
  return <canvas className="art-thumbnail" ref={canvasRef} role="img" aria-label={`Preview of ${title}`} />;
}

function DrawPage() {
  const { artId } = useParams();
  const profile = useProfile();
  const navigate = useNavigate();
  const initialArt = readArt(artId) || { id: artId, userName: profile, title: 'Untitled art', artCsv: EMPTY_CSV };
  const [title, setTitle] = useState(initialArt.title || 'Untitled art');
  const [cells, setCells] = useState(() => parseCsv(initialArt.artCsv));
  const [colorIndex, setColorIndex] = useState(8);
  const [notice, setNotice] = useState('');
  const isDrawing = useRef(false);
  const cellsRef = useRef(cells);
  cellsRef.current = cells;

  useEffect(() => {
    const draft = { id: artId, userName: profile, title, artCsv: cells.join(',') };
    saveDraft(draft);
  }, [artId, cells, profile, title]);

  useEffect(() => {
    if (!/^[0-9a-f]{24}$/i.test(artId)) return;
    let active = true;
    apiRequest(`/portfolio/${artId}`).then((result) => {
      if (!active) return;
      const saved = normalizeArtRecord(result);
      if (!saved) return;
      setTitle(saved.title);
      cellsRef.current = parseCsv(saved.artCsv);
      setCells(cellsRef.current);
    }).catch(() => {});
    return () => { active = false; };
  }, [artId]);

  useEffect(() => subscribeToRoom(artId, (event) => {
    if (event.type === 'clear') setCells(Array(CELL_COUNT).fill(9));
    if (event.type === 'pixel') {
      setCells((previous) => {
        if (event.index < 0 || event.index >= CELL_COUNT) return previous;
        const next = previous.slice();
        next[event.index] = event.colorIndex;
        return next;
      });
    }
  }), [artId]);

  function paint(index) {
    if (index < 0 || index >= CELL_COUNT || cellsRef.current[index] === colorIndex) return;
    const next = cellsRef.current.slice();
    next[index] = colorIndex;
    cellsRef.current = next;
    setCells(next);
    publishRoomEvent({ type: 'pixel', roomId: artId, index, colorIndex });
  }

  function cellFromPointer(event) {
    const element = document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-cell-index]');
    if (element) paint(Number(element.dataset.cellIndex));
  }

  function startDrawing(event) {
    if (event.button !== 0 && event.pointerType === 'mouse') return;
    isDrawing.current = true;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    cellFromPointer(event);
  }

  function continueDrawing(event) {
    if (isDrawing.current) cellFromPointer(event);
  }

  function finishDrawing() {
    isDrawing.current = false;
  }

  function clearCanvas() {
    const blank = Array(CELL_COUNT).fill(9);
    cellsRef.current = blank;
    setCells(blank);
    publishRoomEvent({ type: 'clear', roomId: artId });
  }

  async function save() {
    setNotice('Saving to your account…');
    try {
      const saved = await apiRequest('/portfolio', {
        method: 'POST',
        body: JSON.stringify({ id: artId, title, artCsv: cells.join(',') }),
      });
      saveDraft(saved);
      setNotice('Saved to your account.');
      if (saved.id !== artId) navigate(`/draw/${saved.id}`, { replace: true });
    } catch (error) {
      setNotice(`Could not save: ${error.message}`);
    }
  }

  function openLiveView() {
    window.open(`${BASE_URL}#/watch/${artId}`, '_blank', 'noopener,noreferrer');
  }

  const savedToAccount = /^[0-9a-f]{24}$/i.test(artId);

  return (
    <main className="page-wrap draw-page">
      <section className="page-intro draw-intro">
        <div>
          <p className="eyebrow">Your canvas</p>
          <label className="title-input-label" htmlFor="art-title">Artwork title</label>
          <input id="art-title" className="title-input" maxLength={60} value={title} onChange={(event) => setTitle(event.target.value)} />
          <p>Choose a color, then drag across the grid to paint.</p>
        </div>
        <Link className="button subtle" to="/navigation">← Gallery</Link>
      </section>

      <div className="studio-layout">
        <aside className="tools-panel">
          <div className="tools-heading"><span>Color palette</span><span className="selected-swatch" style={{ backgroundColor: PALETTE[colorIndex].value }} /></div>
          <div className="palette-grid" role="group" aria-label="Choose paint color">
            {PALETTE.map((color, index) => (
              <button
                className={`palette-color ${index === colorIndex ? 'selected' : ''}`}
                key={color.value}
                style={{ backgroundColor: color.value }}
                onClick={() => setColorIndex(index)}
                aria-label={color.name}
                aria-pressed={index === colorIndex}
                title={color.name}
              />
            ))}
          </div>
          <div className="tool-actions">
            <button className="button primary full" onClick={save}>Save artwork</button>
            <button className="button subtle full" onClick={openLiveView} disabled={!savedToAccount}>Open live view ↗</button>
            <button className="button text-button full" onClick={clearCanvas}>Clear canvas</button>
          </div>
          {notice && <p className="save-notice" role="status">{notice}</p>}
          <p className="local-note">Save this piece to your account before opening a live view or chat room.</p>
        </aside>

        <section className="canvas-panel" aria-label="Drawing canvas">
          <div
            className="pixel-grid"
            role="grid"
            aria-label={`${title} drawing grid, ${COLUMN_COUNT} columns by ${ROW_COUNT} rows`}
            onPointerDown={startDrawing}
            onPointerMove={continueDrawing}
            onPointerUp={finishDrawing}
            onPointerCancel={finishDrawing}
            onLostPointerCapture={finishDrawing}
          >
            {cells.map((value, index) => (
              <div
                key={index}
                className="pixel-cell"
                role="gridcell"
                data-cell-index={index}
                style={{ backgroundColor: PALETTE[value]?.value || 'whitesmoke' }}
              />
            ))}
          </div>
          <p className="canvas-caption">80 × 57 grid <span>·</span> {cells.filter((value) => value !== 9).length.toLocaleString()} colored cells</p>
        </section>

        <ChatPanel roomId={artId} />
      </div>
    </main>
  );
}

function WatchPage() {
  const { artId } = useParams();
  const [art, setArt] = useState(null);
  const [cells, setCells] = useState(() => Array(CELL_COUNT).fill(9));
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;
    apiRequest(`/portfolio/${artId}`).then((result) => {
      if (!active) return;
      const saved = normalizeArtRecord(result);
      if (!saved) { setLoadError(true); return; }
      setArt(saved);
      setCells(parseCsv(saved.artCsv));
    })
      .catch(() => { if (active) setLoadError(true); });
    const unsubscribe = subscribeToRoom(artId, (event) => {
      if (event.type === 'clear') {
        setCells(Array(CELL_COUNT).fill(9));
      } else if (event.type === 'pixel') {
        setCells((previous) => {
          const next = previous.slice();
          next[event.index] = event.colorIndex;
          return next;
        });
      }
    });
    return () => { active = false; unsubscribe(); };
  }, [artId]);

  if (loadError) {
    return <main className="page-wrap"><section className="empty-gallery"><h1>Artwork not found</h1><p>This artwork may have been removed or is temporarily unavailable.</p><Link className="button primary" to="/navigation">Return to gallery</Link></section></main>;
  }

  if (!art) return <main className="page-wrap"><p className="eyebrow">Loading artwork…</p></main>;

  return (
    <main className="page-wrap draw-page">
      <section className="page-intro draw-intro">
        <div><p className="eyebrow">Live art view</p><h1>{art.title}</h1><p>By {art.userName} <span className="live-indicator"><i /> Live updates</span></p></div>
        <Link className="button subtle" to="/navigation">← Gallery</Link>
      </section>
      <div className="studio-layout viewer-layout">
        <section className="canvas-panel viewer-canvas" aria-label="Artwork viewer">
          <div className="pixel-grid viewer-grid" role="img" aria-label={art.title}>
            {cells.map((value, index) => <div className="pixel-cell" key={index} style={{ backgroundColor: PALETTE[value]?.value || 'whitesmoke' }} />)}
          </div>
          <p className="canvas-caption">{art.userName}’s artwork</p>
        </section>
        <ChatPanel roomId={artId} />
      </div>
    </main>
  );
}

function ChatPanel({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const chatRef = useRef(null);
  const savedToAccount = /^[0-9a-f]{24}$/i.test(roomId);

  useEffect(() => {
    setMessages([]);
    if (!savedToAccount) return undefined;
    apiRequest(`/chat/${roomId}`).then(setMessages).catch(() => {});
    return subscribeToRoom(roomId, (event) => {
      if (event?.type !== 'chat' || event.roomId !== roomId) return;
      setMessages((previous) => previous.some((message) => message.id === event.message.id)
        ? previous
        : [...previous, event.message].slice(-100));
    });
  }, [roomId, savedToAccount]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  async function send(event) {
    event.preventDefault();
    if (!text.trim() || !savedToAccount) return;
    const content = text.trim().slice(0, 500);
    setText('');
    try {
      const message = await apiRequest(`/chat/${roomId}`, { method: 'POST', body: JSON.stringify({ message: content }) });
      setMessages((previous) => previous.some((item) => item.id === message.id) ? previous : [...previous, message].slice(-100));
    } catch {
      setText(content);
    }
  }

  return (
    <aside className="chat-panel">
      <div className="chat-heading"><div><p className="eyebrow">Studio chat</p><h2>Notes & ideas</h2></div><span aria-hidden="true">✎</span></div>
      <div className="chat-messages" ref={chatRef} aria-live="polite">
        {messages.length === 0 ? <p className="chat-empty">{savedToAccount ? 'Leave a note for this piece. Other signed-in visitors can join the conversation.' : 'Save your artwork to open its chat room.'}</p> : messages.map((message) => (
          <article className="chat-message" key={message.id}>
            <strong>{message.name}</strong><p>{message.message}</p>
          </article>
        ))}
      </div>
      <form className="chat-form" onSubmit={send}>
        <label className="sr-only" htmlFor={`chat-${roomId}`}>Write a note</label>
        <input id={`chat-${roomId}`} maxLength={500} placeholder="Write a note…" value={text} onChange={(event) => setText(event.target.value)} />
        <button className="button primary" type="submit" disabled={!text.trim() || !savedToAccount} aria-label="Send note">Send</button>
      </form>
    </aside>
  );
}

function QuotePage() {
  const [quote, setQuote] = useState({ quote: 'Creativity takes courage.', author: 'Henri Matisse' });

  useEffect(() => {
    let active = true;
    fetch('https://quote.cs260.click')
      .then((response) => response.json())
      .then((result) => {
        if (active && result?.quote) setQuote({ quote: result.quote, author: result.author || 'Unknown' });
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  return (
    <main className="quote-page">
      <div className="quote-mark" aria-hidden="true">“</div>
      <blockquote>{quote.quote}</blockquote>
      <p className="quote-author">— {quote.author}</p>
    </main>
  );
}

function NotFound() {
  return <main className="page-wrap"><section className="empty-gallery"><h1>Page not found</h1><Link className="button primary" to="/navigation">Back to the studio</Link></section></main>;
}

function parseCsv(csv) {
  return normalizeArtCells(csv);
}

function artistLabel(userName) {
  if (typeof userName !== 'string' || !userName) return 'Guest artist';
  const name = userName.split('@')[0] || 'Guest artist';
  return name.charAt(0).toUpperCase() + name.slice(1);
}
