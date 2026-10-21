import { Link, useLocation } from 'react-router-dom';
import {
  languageFromPathname,
  languages,
  messages,
  pathForLanguage,
} from './lib/i18n';

export default function SiteHeader() {
  const location = useLocation();
  const language = languageFromPathname(location.pathname);
  const text = messages[language];

  return (
    <header className="site-header">
      <Link className="site-home-link" to={pathForLanguage('/', language)}>
        Calvin W. Merrell
      </Link>
      <a className="site-games-link" href="/games/">
        {text.games}
      </a>
      <details className="language-menu">
        <summary>{text.changeLanguage}</summary>
        <nav aria-label={text.changeLanguage}>
          {languages.map((option) => (
            <Link
              key={option.code}
              lang={option.code}
              aria-current={language === option.code ? 'page' : undefined}
              to={`${pathForLanguage(location.pathname, option.code)}${location.search}${location.hash}`}
            >
              {option.name}
            </Link>
          ))}
        </nav>
      </details>
    </header>
  );
}
