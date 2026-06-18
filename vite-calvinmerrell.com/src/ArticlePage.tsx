import { useParams } from 'react-router-dom';
import { getPostBySlug } from './lib/posts';
import { marked } from 'marked';

export default function ArticlePage() {
  const { slug } = useParams();

  const post = getPostBySlug(slug!);

  if (!post) return <p>Article not found</p>;

  const html = marked.parse(post.content);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <h1>{post.title}</h1>
      <img src={post.image} alt={post.title} style={{ width: '100%' }} />
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}