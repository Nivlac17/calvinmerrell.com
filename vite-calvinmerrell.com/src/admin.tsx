import { useState } from 'react';

export default function AdminPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [content, setContent] = useState('');

  async function submitArticle() {
    await fetch('/api/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
        imageUrl,
        content,
      }),
    });

    alert('Article created!');
  }

  return (
    <div>
      <h1>Create Article</h1>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        placeholder="Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />

      <textarea
        placeholder="Article Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button onClick={submitArticle}>
        Publish Article
      </button>
    </div>
  );
}