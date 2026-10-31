import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Link, Route, Routes, useLocation, useParams } from 'react-router-dom';
import './App.css';
import HomePage from './HomePage';
import SiteHeader from './SiteHeader';
import ResumePage from './ResumePage';
import SubscribePage from './SubscribePage';
import { isLanguage, languageFromPathname, messages, pathForLanguage } from './lib/i18n';

const ArticlePage = lazy(() => import('./ArticlePage'));

function NotFoundPage() {
  const { pathname } = useLocation();
  const text = messages[languageFromPathname(pathname)];

  return (
    <main className="not-found page-container">
      <p className="eyebrow">404</p>
      <h1>{text.pageNotFound}</h1>
      <p>{text.pageMoved}</p>
      <Link className="text-link" to={pathForLanguage('/', languageFromPathname(pathname))}>
        {text.returnToAllArticles}
      </Link>
    </main>
  );
}

function LocalizedHomePage() {
  const { locale } = useParams();
  return locale && !isLanguage(locale) ? <NotFoundPage /> : <HomePage />;
}

function SiteRoutes() {
  const location = useLocation();
  const language = languageFromPathname(location.pathname);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <>
      {location.pathname !== '/resume' && <SiteHeader />}
      <Routes>
        <Route path="/resume" element={<ResumePage />} />
        <Route path="/subscribe" element={<SubscribePage />} />
        <Route path="/:locale/subscribe" element={<SubscribePage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/:locale" element={<LocalizedHomePage />} />
        <Route
          path="/article/:slug"
          element={
            <Suspense
              fallback={
                <main className="article-page page-container" aria-live="polite">
                  {messages[language].loading}
                </main>
              }
            >
              <ArticlePage />
            </Suspense>
          }
        />
        <Route
          path="/:locale/article/:slug"
          element={
            <Suspense
              fallback={
                <main className="article-page page-container" aria-live="polite">
                  {messages[language].loading}
                </main>
              }
            >
              <ArticlePage />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <SiteRoutes />
    </BrowserRouter>
  );
}
