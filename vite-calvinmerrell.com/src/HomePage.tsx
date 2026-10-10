import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllPosts } from './lib/posts';

export default function HomePage() {
  const posts = getAllPosts();
  const lastUpdated = import.meta.env.VITE_BUILD_DATE;

  useEffect(() => {
    document.title = 'Calvin W. Merrell | Articles';
  }, []);

  return (
    <>
      <div className="hero-background">
        <img
          src="/images/vernal-sunset.jpeg"
          alt="Sunset over the Vernal landscape"
        />
        <div className="hero-overlay" aria-hidden="true"></div>
        <div className="hero-content">
          <p className="eyebrow">Personal blog</p>
          <h1>Calvin W. Merrell</h1>
          <p>Notes on technology, computing, and ideas.</p>
        </div>
      </div>

      <main className="page-container">
        <section className="articles" aria-labelledby="articles-heading">
          <div className="section-heading">
            <div>
              <p className="eyebrow">From the blog</p>
              <h2 id="articles-heading">Latest articles</h2>
            </div>
            {lastUpdated && <p className="build-date">Updated {lastUpdated}</p>}
          </div>

          {posts.length > 0 ? (
            <div className="article-grid">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  to={`/article/${post.slug}/`}
                  className="article-card"
                >
                  <img src={post.image} alt={post.title} />
                  <h3>{post.title}</h3>
                  <p>{post.description}</p>
                  <time dateTime={post.date}>
                    {new Intl.DateTimeFormat('en', {
                      dateStyle: 'long',
                      timeZone: 'UTC',
                    }).format(new Date(`${post.date}T00:00:00Z`))}
                  </time>
                </Link>
              ))}
            </div>
          ) : (
            <p className="empty-state">New articles are on the way.</p>
          )}
        </section>
      </main>
    </>
  );
}
