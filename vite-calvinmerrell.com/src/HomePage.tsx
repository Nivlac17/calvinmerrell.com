import { useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { getAllPosts } from './lib/posts';
import { dateLocales, isLanguage, languageFromPathname, messages, pathForLanguage } from './lib/i18n';

export default function HomePage() {
  const location = useLocation();
  const { locale: localeParam } = useParams();
  const locale = localeParam && isLanguage(localeParam)
    ? localeParam
    : languageFromPathname(location.pathname);
  const text = messages[locale];
  const posts = getAllPosts(locale);
  const lastUpdated = import.meta.env.VITE_BUILD_DATE;

  useEffect(() => {
    document.title = text.siteTitle;
  }, [text.siteTitle]);

  return (
    <>
      <div className="hero-background">
        <img
          src="/images/vernal-sunset.jpeg"
          alt={text.heroImageAlt}
        />
        <div className="hero-overlay" aria-hidden="true"></div>
        <div className="hero-content">
          <p className="eyebrow">{text.personalBlog}</p>
          <h1>Calvin W. Merrell</h1>
          <p>{text.heroSubtitle}</p>
        </div>
      </div>

      <main className="page-container">
        <section className="articles" aria-labelledby="articles-heading">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{text.fromTheBlog}</p>
              <h2 id="articles-heading">{text.latestArticles}</h2>
            </div>
            {lastUpdated && <p className="build-date">{text.updated} {lastUpdated}</p>}
          </div>

          {posts.length > 0 ? (
            <div className="article-grid">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  to={pathForLanguage(`/article/${post.slug}/`, locale)}
                  className="article-card"
                >
                  <img src={post.image} alt={post.title} />
                  <h3>{post.title}</h3>
                  <p>{post.description}</p>
                  <time dateTime={post.date}>
                    {new Intl.DateTimeFormat(dateLocales[locale], {
                      dateStyle: 'long',
                      timeZone: 'UTC',
                    }).format(new Date(`${post.date}T00:00:00Z`))}
                  </time>
                </Link>
              ))}
            </div>
          ) : (
            <p className="empty-state">{text.emptyState}</p>
          )}
        </section>
      </main>
    </>
  );
}
