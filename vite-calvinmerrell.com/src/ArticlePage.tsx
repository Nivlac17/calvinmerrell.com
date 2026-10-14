import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPostBySlug } from './lib/posts';
import ReactMarkdown from 'react-markdown';
import { dateLocales, isLanguage, messages, pathForLanguage } from './lib/i18n';

export default function ArticlePage() {
  const { slug, locale: localeParam } = useParams();
  const locale = localeParam ? (isLanguage(localeParam) ? localeParam : undefined) : 'en';
  const text = messages[locale ?? 'en'];
  const post = slug && locale ? getPostBySlug(slug, locale) : undefined;

  useEffect(() => {
    document.title = post
      ? `${post.title} | Calvin W. Merrell`
      : 'Article not found | Calvin W. Merrell';
  }, [post?.title]);

  if (!post) {
    return (
      <main className="article-page page-container">
        <p className="eyebrow">{text.articleNotFound}</p>
        <h1>{text.articleNotAvailable}</h1>
        <Link className="text-link" to={pathForLanguage('/', locale ?? 'en')}>
          {text.returnToAllArticles}
        </Link>
      </main>
    );
  }

  return (
    <main className="article-page page-container">
      <Link className="back-link" to={pathForLanguage('/', locale!)}>
        <span aria-hidden="true">←</span> {text.allArticles}
      </Link>
      <article>
        <header className="article-header">
          <p className="eyebrow">{text.article}</p>
          <h1>{post.title}</h1>
          <p className="article-description">{post.description}</p>
          <time dateTime={post.date}>
            {new Intl.DateTimeFormat(dateLocales[locale!], {
              dateStyle: 'long',
              timeZone: 'UTC',
            }).format(new Date(`${post.date}T00:00:00Z`))}
          </time>
        </header>
        <img className="article-cover" src={post.image} alt="" />
        <div className="article-content" lang={locale}>
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </article>
    </main>
  );
}
