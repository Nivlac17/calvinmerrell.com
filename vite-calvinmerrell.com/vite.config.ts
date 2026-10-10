import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return entities[character];
  });
}

function generateStaticArticleRoutes(): Plugin {
  return {
    name: 'generate-static-article-routes',
    apply: 'build',
    async closeBundle() {
      const articlesDirectory = resolve(projectRoot, 'articles');
      const outputDirectory = resolve(projectRoot, 'dist');
      const html = await readFile(resolve(outputDirectory, 'index.html'), 'utf8');
      const files = await readdir(articlesDirectory);

      for (const file of files.filter((entry) => entry.endsWith('.md'))) {
        const source = await readFile(resolve(articlesDirectory, file), 'utf8');
        const { data } = matter(source);
        const slug = typeof data.slug === 'string' ? data.slug : '';

        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
          throw new Error(`Cannot generate an article route for ${file}: invalid slug.`);
        }

        const title = typeof data.title === 'string' ? data.title : slug;
        const description = typeof data.description === 'string' ? data.description : title;
        const articleHtml = html
          .replace(
            /<title>[\s\S]*?<\/title>/,
            `<title>${escapeHtml(title)} | Calvin W. Merrell</title>`,
          )
          .replace(
            /<meta\s+name="description"[\s\S]*?>/,
            `<meta name="description" content="${escapeHtml(description)}" />`,
          );
        const routeDirectory = resolve(outputDirectory, 'article', slug);
        await mkdir(routeDirectory, { recursive: true });
        await writeFile(resolve(routeDirectory, 'index.html'), articleHtml);
      }

      await writeFile(resolve(outputDirectory, '404.html'), html);
    },
  };
}

export default defineConfig({
  plugins: [react(), generateStaticArticleRoutes()],
});
