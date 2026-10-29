import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { HashRouter, Link, Navigate, NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import {
  CELL_COUNT,
  COLUMN_COUNT,
  EMPTY_CSV,
  PROFILE_KEY,
  ROW_COUNT,
  createId,
  deleteArtwork,
  publishRoomEvent,
  readArt,
  readLibrary,
  readRoomMessages,
  saveArtwork,
  saveDraft,
  saveRoomMessage,
  subscribeToRoom,
} from './store.js';

export const PALETTE = [
  { name: 'Sunshine', value: 'yellow' },
  { name: 'Ocean', value: 'blue' },
  { name: 'Coral', value: 'red' },
  { name: 'Leaf', value: 'green' },
  { name: 'Blush', value: 'pink' },
  { name: 'Iris', value: 'purple' },
  { name: 'Stone', value: 'grey' },
  { name: 'Tangerine', value: 'orange' },
  { name: 'Ink', value: 'black' },
  { name: 'Paper', value: 'whitesmoke' },
];
const PROFILE_CONTEXT = createContext('');
const BASE_URL = import.meta.env.BASE_URL;

function useProfile() {
  return useContext(PROFILE_CONTEXT);
}

export default function App() {
  const [profile, setProfile] = useState(() => localStorage.getItem(PROFILE_KEY) || '');

  function signIn(name) {
    const cleanName = name.trim().slice(0, 32);
    localStorage.setItem(PROFILE_KEY, cleanName);
    setProfile(cleanName);
  }

  function signOut() {
    localStorage.removeItem(PROFILE_KEY);
    setProfile('');
  }

  return (
    <PROFILE_CONTEXT.Provider value={profile}>
      <HashRouter>
        <div className="art-app">
          <header className="art-header">
            <Link className="art-brand" to="/" aria-label="Lines of Light home">
              <span className="brand-spark" aria-hidden="true">✳</span>
              <span>Lines of Light<small>ART STUDIO</small></span>
            </Link>
            <nav className="art-nav" aria-label="Art studio navigation">
              {profile && <NavLink to="/navigation">Gallery</NavLink>}
              <NavLink to="/quote">Quote</NavLink>
              {profile && <button className="nav-signout" onClick={signOut}>Sign out</button>}
            </nav>
          </header>

          <Routes>
            <Route path="/" element={<ProfilePage profile={profile} onSignIn={signIn} />} />
            <Route path="/navigation" element={<RequireProfile profile={profile}><GalleryPage /></RequireProfile>} />
            <Route path="/draw/:artId" element={<RequireProfile profile={profile}><DrawPage /></RequireProfile>} />
            <Route path="/watch/:artId" element={<RequireProfile profile={profile}><WatchPage /></RequireProfile>} />
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

function RequireProfile({ profile, children }) {
  return profile ? children : <Navigate to="/" replace />;
}

function ProfilePage({ profile, onSignIn }) {
  const [artistName, setArtistName] = useState(profile);
  const navigate = useNavigate();

  function submit(event) {
    event.preventDefault();
    if (!artistName.trim()) return;
    onSignIn(artistName);
    navigate('/navigation');
  }

  return (
    <main className="welcome-layout">
      <section className="welcome-copy">
        <p className="eyebrow">A little space to make something</p>
        <h1>Lines of <em>Light.</em></h1>
        <p className="welcome-lede">A calm, colorful grid for pixel art, quick sketches, and playful ideas.</p>
        <ul className="feature-list">
          <li><span>01</span> Paint with a simple palette</li>
          <li><span>02</span> Save a gallery in this browser</li>
          <li><span>03</span> Open a live view in another tab</li>
        </ul>
      </section>
      <section className="profile-card">
        <div className="card-icon" aria-hidden="true">✦</div>
        {profile ? (
          <>
            <p className="eyebrow">Welcome back</p>
            <h2>{profile}</h2>
            <p>Your profile and artwork are saved in this browser.</p>
            <button className="button primary full" onClick={() => navigate('/navigation')}>Open my studio</button>
          </>
        ) : (
          <>
            <p className="eyebrow">Start creating</p>
            <h2>What should we call you?</h2>
            <p>Choose an artist name to keep your work together.</p>
            <form onSubmit={submit}>
              <label htmlFor="artist-name">Artist name</label>
              <input
                id="artist-name"
                autoComplete="nickname"
                maxLength={32}
                placeholder="e.g. Sky Painter"
                value={artistName}
                onChange={(event) => setArtistName(event.target.value)}
              />
              <button className="button primary full" type="submit" disabled={!artistName.trim()}>Enter the studio <span aria-hidden="true">↗</span></button>
            </form>
          </>
        )}
        <p className="local-note">No password or server account. Your profile and saved pieces stay in this browser.</p>
      </section>
    </main>
  );
}

function GalleryPage() {
  const profile = useProfile();
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState(readLibrary);
  const [title, setTitle] = useState('');

  useEffect(() => {
    const refresh = () => setArtworks(readLibrary());
    window.addEventListener('lines-of-light:library-change', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('lines-of-light:library-change', refresh);
      window.removeEventListener('storage', refresh);
    };
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
      artCsv: art.artCsv,
    };
    saveDraft(copy);
    navigate(`/draw/${copy.id}`);
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
          <p>Browse pieces saved in this browser or start a new canvas.</p>
        </div>
        <div className="intro-stamp" aria-hidden="true">✳</div>
      </section>

      <form className="new-art-card" onSubmit={createArtwork}>
        <div className="new-art-mark" aria-hidden="true">＋</div>
        <div className="new-art-text"><strong>Start with a blank grid</strong><span>Name your next idea and make it yours.</span></div>
        <label className="sr-only" htmlFor="new-art-title">New artwork title</label>
        <input id="new-art-title" maxLength={60} placeholder="Artwork title" value={title} onChange={(event) => setTitle(event.target.value)} />
        <button className="button primary" type="submit" disabled={!title.trim()}>New artwork <span aria-hidden="true">↗</span></button>
      </form>

      {artworks.length === 0 ? (
        <section className="empty-gallery">
          <div aria-hidden="true">▦</div>
          <h2>Your gallery is waiting</h2>
          <p>Create your first piece above. It will be saved on this device.</p>
        </section>
      ) : (
        Object.entries(groups).map(([artist, pieces]) => (
          <section className="gallery-section" key={artist}>
            <div className="gallery-heading"><h2>{artist === profile ? 'Your artwork' : `${artist}’s artwork`}</h2><span>{pieces.length} {pieces.length === 1 ? 'piece' : 'pieces'}</span></div>
            <div className="artwork-grid">
              {pieces.map((art) => (
                <article className="artwork-card" key={art.id}>
                  <ArtThumbnail artCsv={art.artCsv} title={art.title} />
                  <div className="artwork-card-body">
                    <h3>{art.title}</h3>
                    <p>{art.userName === profile ? 'Saved by you' : `By ${art.userName}`}</p>
                    <div className="card-actions">
                      <button className="button subtle" onClick={() => navigate(`/watch/${art.id}`)}>View piece</button>
                      {art.userName === profile ? (
                        <button className="button subtle" onClick={() => navigate(`/draw/${art.id}`)}>Edit</button>
                      ) : (
                        <button className="button subtle" onClick={() => copyArtwork(art)}>Make a copy</button>
                      )}
                      {art.userName === profile && <button className="icon-button" onClick={() => { deleteArtwork(art.id); setArtworks(readLibrary()); }} aria-label={`Delete ${art.title}`}>×</button>}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))
      )}

      <section className="featured-card">
        <img src={`${BASE_URL}sunset.jpeg`} alt="Warm sunset over a quiet landscape" />
        <div><p className="eyebrow">A little inspiration</p><h2>Color outside the lines.</h2><p>Small marks can become something wonderful.</p></div>
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
    const values = artCsv?.split(',') || [];
    values.forEach((value, index) => {
      const color = PALETTE[Number(value)]?.value || 'whitesmoke';
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

  function save() {
    const saved = saveArtwork({ id: artId, userName: profile, title, artCsv: cells.join(',') });
    setNotice(saved ? 'Saved to your gallery on this browser.' : 'Could not save in this browser. Check available storage.');
  }

  function openLiveView() {
    window.open(`${BASE_URL}#/watch/${artId}`, '_blank', 'noopener,noreferrer');
  }

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
            <button className="button subtle full" onClick={openLiveView}>Open live view ↗</button>
            <button className="button text-button full" onClick={clearCanvas}>Clear canvas</button>
          </div>
          {notice && <p className="save-notice" role="status">{notice}</p>}
          <p className="local-note">A live view can follow this canvas in another tab in the same browser.</p>
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
  const profile = useProfile();
  const [art] = useState(() => readArt(artId));
  const [cells, setCells] = useState(() => parseCsv(art?.artCsv));

  useEffect(() => subscribeToRoom((event) => {
    if (event?.roomId !== artId) return;
    if (event.type === 'clear') {
      setCells(Array(CELL_COUNT).fill(9));
    } else if (event.type === 'pixel') {
      setCells((previous) => {
        const next = previous.slice();
        next[event.index] = event.colorIndex;
        return next;
      });
    }
  }), [artId]);

  if (!art) {
    return <main className="page-wrap"><section className="empty-gallery"><h1>Artwork not found</h1><p>Saved pieces live in the browser where they were created.</p><Link className="button primary" to="/navigation">Return to gallery</Link></section></main>;
  }

  return (
    <main className="page-wrap draw-page">
      <section className="page-intro draw-intro">
        <div><p className="eyebrow">Live art view</p><h1>{art.title}</h1><p>By {art.userName} <span className="live-indicator"><i /> Same-browser updates</span></p></div>
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
  const profile = useProfile();
  const [messages, setMessages] = useState(() => readRoomMessages(roomId));
  const [text, setText] = useState('');
  const chatRef = useRef(null);

  useEffect(() => {
    setMessages(readRoomMessages(roomId));
    return subscribeToRoom((event) => {
      if (event?.type !== 'chat' || event.roomId !== roomId) return;
      setMessages((previous) => previous.some((message) => message.id === event.message.id)
        ? previous
        : [...previous, event.message].slice(-100));
    });
  }, [roomId]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  function send(event) {
    event.preventDefault();
    if (!text.trim()) return;
    const message = { id: createId(), name: profile, message: text.trim().slice(0, 500), sentAt: new Date().toISOString() };
    setMessages(saveRoomMessage(roomId, message));
    setText('');
  }

  return (
    <aside className="chat-panel">
      <div className="chat-heading"><div><p className="eyebrow">Studio chat</p><h2>Notes & ideas</h2></div><span aria-hidden="true">✎</span></div>
      <div className="chat-messages" ref={chatRef} aria-live="polite">
        {messages.length === 0 ? <p className="chat-empty">Leave a note for this piece. Messages are shared with other tabs in this browser.</p> : messages.map((message) => (
          <article className="chat-message" key={message.id}>
            <strong>{message.name}</strong><p>{message.message}</p>
          </article>
        ))}
      </div>
      <form className="chat-form" onSubmit={send}>
        <label className="sr-only" htmlFor={`chat-${roomId}`}>Write a note</label>
        <input id={`chat-${roomId}`} maxLength={500} placeholder="Write a note…" value={text} onChange={(event) => setText(event.target.value)} />
        <button className="button primary" type="submit" disabled={!text.trim()} aria-label="Send note">Send</button>
      </form>
    </aside>
  );
}

function QuotePage() {
  const [quote, setQuote] = useState({ quote: 'Creativity takes courage.', author: 'Henri Matisse' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch('https://quote.cs260.click')
      .then((response) => response.json())
      .then((result) => {
        if (active && result?.quote) setQuote({ quote: result.quote, author: result.author || 'Unknown' });
      })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <main className="quote-page">
      <p className="eyebrow">A thought for your next sketch</p>
      <div className="quote-mark" aria-hidden="true">“</div>
      <blockquote>{quote.quote}</blockquote>
      <p className="quote-author">— {quote.author}</p>
      <p className="quote-status">{loading ? 'Finding a little inspiration…' : 'Take what you need, then make something.'}</p>
    </main>
  );
}

function NotFound() {
  return <main className="page-wrap"><section className="empty-gallery"><h1>Page not found</h1><Link className="button primary" to="/navigation">Back to the studio</Link></section></main>;
}

function parseCsv(csv) {
  const values = typeof csv === 'string' ? csv.split(',').slice(0, CELL_COUNT).map((value) => Number(value)) : [];
  while (values.length < CELL_COUNT) values.push(9);
  return values.map((value) => Number.isInteger(value) && value >= 0 && value < PALETTE.length ? value : 9);
}
