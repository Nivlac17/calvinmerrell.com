import { FormEvent, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { languageFromPathname, messages, pathForLanguage } from './lib/i18n';

const configuredApi = import.meta.env.VITE_ART_API_BASE_URL;
const apiBase = (configuredApi || (import.meta.env.DEV ? 'http://localhost:4000' : 'https://api.calvinmerrell.com'))
  .replace(/\/$/, '');

export default function SubscribePage() {
  const location = useLocation();
  const language = languageFromPathname(location.pathname);
  const text = messages[language];
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<'success' | 'error' | ''>('');

  useEffect(() => {
    document.title = `${text.subscribe} | Calvin W. Merrell`;
  }, [text.subscribe]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setStatus('');

    try {
      const response = await fetch(`${apiBase}/api/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, consent, website }),
      });
      if (!response.ok) throw new Error('Subscription request failed');
      setStatus('success');
      setEmail('');
      setConsent(false);
      setWebsite('');
    } catch {
      setStatus('error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="subscribe-page page-container">
      <Link className="back-link" to={pathForLanguage('/', language)}>
        ← {text.allArticles}
      </Link>
      <section className="subscribe-card" aria-labelledby="subscribe-title">
        <p className="eyebrow">{text.subscribe}</p>
        <h1 id="subscribe-title">{text.subscribeTitle}</h1>
        <p className="subscribe-description">{text.subscribeDescription}</p>

        <form className="subscribe-form" onSubmit={submit}>
          <label htmlFor="subscriber-email">{text.emailAddress}</label>
          <input
            id="subscriber-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder={text.emailPlaceholder}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            maxLength={254}
            required
          />

          <label className="subscribe-consent">
            <input
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
              required
            />
            <span>{text.subscribeConsent}</span>
          </label>

          <label className="subscribe-honeypot" aria-hidden="true">
            Leave this field empty
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
            />
          </label>

          <button className="subscribe-submit" type="submit" disabled={busy}>
            {busy ? text.subscribeSubmitting : text.subscribeSubmit}
          </button>
          <p className="subscribe-privacy">{text.subscribePrivacy}</p>
          <p className="subscribe-status" role="status" aria-live="polite">
            {status === 'success' ? text.subscribeSuccess : status === 'error' ? text.subscribeError : ''}
          </p>
        </form>
      </section>
    </main>
  );
}
