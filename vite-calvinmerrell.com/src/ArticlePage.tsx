import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPostBySlug } from './lib/posts';
import ReactMarkdown from 'react-markdown';

export default function ArticlePage() {
  const { slug } = useParams();
  const post = slug ? getPostBySlug(slug) : undefined;

  useEffect(() => {
    document.title = post
      ? `${post.title} | Calvin W. Merrell`
      : 'Article not found | Calvin W. Merrell';
  }, [post?.title]);

  if (!post) {
    return (
      <main className="article-page page-container">
        <p className="eyebrow">Article not found</p>
        <h1>This article is not available.</h1>
        <Link className="text-link" to="/">
          Return to all articles
        </Link>
      </main>
    );
  }

  return (
    <main className="article-page page-container">
      <Link className="back-link" to="/">
        <span aria-hidden="true">←</span> All articles
      </Link>
      <article>
        <header className="article-header">
          <p className="eyebrow">Article</p>
          <h1>{post.title}</h1>
          <p className="article-description">{post.description}</p>
          <time dateTime={post.date}>
            {new Intl.DateTimeFormat('en', {
              dateStyle: 'long',
              timeZone: 'UTC',
            }).format(new Date(`${post.date}T00:00:00Z`))}
          </time>
        </header>
        <img className="article-cover" src={post.image} alt="" />
        <div className="article-content">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </article>
    </main>
  );
}
