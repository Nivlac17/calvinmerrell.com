import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, type Plugin } from 'vite';

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
        const articleTitle = `${title} | Calvin W. Merrell`;
        const articleUrl = `https://calvinmerrell.com/article/${slug}/`;
        const articleHtml = html
          .replace(
            /<title>[\s\S]*?<\/title>/,
            `<title>${escapeHtml(articleTitle)}</title>`,
          )
          .replace(
            /<meta\s+name="description"[\s\S]*?>/,
            `<meta name="description" content="${escapeHtml(description)}" />`,
          )
          .replace(
            /<link rel="canonical" href="[^"]*"\s*\/>/,
            `<link rel="canonical" href="${articleUrl}" />`,
          )
          .replace(
            /<meta property="og:url" content="[^"]*"\s*\/>/,
            `<meta property="og:url" content="${articleUrl}" />`,
          )
          .replace(
            /<meta property="og:title" content="[^"]*"\s*\/>/,
            `<meta property="og:title" content="${escapeHtml(articleTitle)}" />`,
          )
          .replace(
            /<meta property="og:description"[\s\S]*?>/,
            `<meta property="og:description" content="${escapeHtml(description)}" />`,
          )
          .replace(
            /<meta name="twitter:title" content="[^"]*"\s*\/>/,
            `<meta name="twitter:title" content="${escapeHtml(articleTitle)}" />`,
          )
          .replace(
            /<meta name="twitter:description"[\s\S]*?>/,
            `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
          );
        const routeDirectory = resolve(outputDirectory, 'article', slug);
        await mkdir(routeDirectory, { recursive: true });
        await writeFile(resolve(routeDirectory, 'index.html'), articleHtml);
      }

      await writeFile(resolve(outputDirectory, '404.html'), html);
    },
  };
}

function googleAnalyticsTag(measurementId: string | undefined): Plugin {
  const id = measurementId?.trim();

  if (!id) {
    return { name: 'google-analytics-tag' };
  }

  if (!/^G-[A-Z0-9]+$/i.test(id)) {
    throw new Error('VITE_GA_MEASUREMENT_ID must be a Google Analytics ID such as G-ABC123DEF4.');
  }

  return {
    name: 'google-analytics-tag',
    apply: 'build',
    transformIndexHtml() {
      return [
        {
          tag: 'script',
          attrs: {
            async: true,
            src: `https://www.googletagmanager.com/gtag/js?id=${id}`,
          },
          injectTo: 'head',
        },
        {
          tag: 'script',
          children: [
            'window.dataLayer = window.dataLayer || [];',
            'function gtag(){window.dataLayer.push(arguments);}',
            "gtag('js', new Date());",
            `gtag('config', '${id}');`,
          ].join('\n'),
          injectTo: 'head',
        },
      ];
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, projectRoot, 'VITE_');

  return {
    plugins: [
      react(),
      googleAnalyticsTag(env.VITE_GA_MEASUREMENT_ID),
      generateStaticArticleRoutes(),
    ],
  };
});
