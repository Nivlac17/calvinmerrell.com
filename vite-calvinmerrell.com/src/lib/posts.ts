import matter from 'gray-matter';

const modules = import.meta.glob('../content/articles/*.md', {
  eager: true,
  as: 'raw',
});

export interface Post {
  title: string;
  description: string;
  image: string;
  slug: string;
  date: string;
  content: string;
}

export function getAllPosts(): Post[] {
  return Object.entries(modules).map(([path, raw]) => {
    const { data, content } = matter(raw as string);

    return {
      title: data.title,
      description: data.description,
      image: data.image,
      slug: data.slug,
      date: data.date,
      content,
    };
  });
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}