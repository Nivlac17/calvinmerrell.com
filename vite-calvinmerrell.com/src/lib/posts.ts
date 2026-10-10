const modules = import.meta.glob('../../articles/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

export interface Post {
  title: string;
  description: string;
  image: string;
  slug: string;
  date: string;
  content: string;
}

function requiredText(value: unknown, field: string, path: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Article ${path} is missing a valid ${field}.`);
  }

  return value.trim();
}

function normaliseDate(value: unknown, path: string): string {
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Article ${path} is missing a valid date.`);
  }

  return date.toISOString().slice(0, 10);
}

function parseFrontmatter(raw: string, path: string) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) {
    throw new Error(`Article ${path} must start with YAML frontmatter.`);
  }

  const data: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(':');
    if (separator < 1) continue;

    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if (value.startsWith('"') && value.endsWith('"')) {
      value = JSON.parse(value) as string;
    } else if (value.startsWith("'") && value.endsWith("'")) {
      value = value.slice(1, -1).replaceAll("''", "'");
    }
    data[key] = value;
  }

  return { data, content: raw.slice(match[0].length) };
}

export function getAllPosts(): Post[] {
  return Object.entries(modules)
    .map(([path, raw]) => {
      const { data, content } = parseFrontmatter(raw, path);
      const slug = requiredText(data.slug, 'slug', path);
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
        throw new Error(`Article ${path} has an invalid slug: ${slug}.`);
      }

      return {
        title: requiredText(data.title, 'title', path),
        description: requiredText(data.description, 'description', path),
        image: requiredText(data.image, 'image', path),
        slug,
        date: normaliseDate(data.date, path),
        content: content.trim(),
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}
