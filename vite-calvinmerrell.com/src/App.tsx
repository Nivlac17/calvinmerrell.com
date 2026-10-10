import { lazy, Suspense } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './HomePage';

const ArticlePage = lazy(() => import('./ArticlePage'));

function NotFoundPage() {
  return (
    <main className="not-found page-container">
      <p className="eyebrow">404</p>
      <h1>Page not found</h1>
      <p>That page may have moved or the address may be incorrect.</p>
      <Link className="text-link" to="/">
        Return to all articles
      </Link>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/article/:slug"
          element={
            <Suspense
              fallback={
                <main className="article-page page-container" aria-live="polite">
                  Loading article…
                </main>
              }
            >
              <ArticlePage />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
