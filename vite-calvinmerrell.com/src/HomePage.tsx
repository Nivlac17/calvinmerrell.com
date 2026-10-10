import './HomePage.css';
import { Link } from 'react-router-dom';
import { getAllPosts } from './lib/posts';

export default function HomePage() {
  const posts = getAllPosts();
  const lastUpdated = import.meta.env.VITE_BUILD_DATE;

  return (
    <>
      <div className="hero-background">
        <img src="/images/vernal-sunset.jpeg" alt="" />
        <div className="hero-overlay"></div>
      </div>

      <header>
        <h1>Calvin W. Merrell</h1>
        <p>{lastUpdated}</p>
      </header>

      <section className="articles">
        <h2>Latest Articles</h2>

        <div className="article-grid">
          {posts.map((post) => (
            <Link
              key={post.slug}
              to={`/article/${post.slug}`}
              className="article-card"
            >
              <img src={post.image} alt={post.title} />
              <h3>{post.title}</h3>
              <p>{post.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
