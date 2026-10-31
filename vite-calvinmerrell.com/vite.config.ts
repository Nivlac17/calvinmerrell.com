import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import { languages, messages, type Language } from './src/lib/i18n';

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

function pageHtml(
  template: string,
  language: Language,
  title: string,
  description: string,
  canonicalUrl: string,
): string {
  const escapedTitle = escapeHtml(title);
  const escapedDescription = escapeHtml(description);

  return template
    .replace(/<html lang="[^"]*"/, `<html lang="${language}"`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapedTitle}</title>`)
    .replace(
      /<meta\s+name="description"[\s\S]*?>/,
      `<meta name="description" content="${escapedDescription}" />`,
    )
    .replace(
      /<link rel="canonical" href="[^"]*"\s*\/>/,
      `<link rel="canonical" href="${canonicalUrl}" />`,
    )
    .replace(
      /<meta property="og:url" content="[^"]*"\s*\/>/,
      `<meta property="og:url" content="${canonicalUrl}" />`,
    )
    .replace(
      /<meta property="og:title" content="[^"]*"\s*\/>/,
      `<meta property="og:title" content="${escapedTitle}" />`,
    )
    .replace(
      /<meta property="og:description"[\s\S]*?>/,
      `<meta property="og:description" content="${escapedDescription}" />`,
    )
    .replace(
      /<meta name="twitter:title" content="[^"]*"\s*\/>/,
      `<meta name="twitter:title" content="${escapedTitle}" />`,
    )
    .replace(
      /<meta name="twitter:description"[\s\S]*?>/,
      `<meta name="twitter:description" content="${escapedDescription}" />`,
    );
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

      for (const { code } of languages) {
        if (code === 'en') continue;
        const directory = resolve(outputDirectory, code);
        const url = `https://calvinmerrell.com/${code}/`;
        const localizedHtml = pageHtml(
          html,
          code,
          messages[code].siteTitle,
          messages[code].siteDescription,
          url,
        );
        await mkdir(directory, { recursive: true });
        await writeFile(resolve(directory, 'index.html'), localizedHtml);
      }

      for (const { code } of languages) {
        const localePrefix = code === 'en' ? '' : `${code}/`;
        const subscribeUrl = `https://calvinmerrell.com/${localePrefix}subscribe/`;
        const subscribeHtml = pageHtml(
          html,
          code,
          `${messages[code].subscribe} | Calvin W. Merrell`,
          messages[code].subscribeDescription,
          subscribeUrl,
        );
        const subscribeDirectory = resolve(outputDirectory, localePrefix, 'subscribe');
        await mkdir(subscribeDirectory, { recursive: true });
        await writeFile(resolve(subscribeDirectory, 'index.html'), subscribeHtml);
      }

      for (const file of files.filter((entry) => entry.endsWith('.md'))) {
        const source = await readFile(resolve(articlesDirectory, file), 'utf8');
        const { data } = matter(source);
        const slug = typeof data.slug === 'string' ? data.slug : '';

        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
          throw new Error(`Cannot generate an article route for ${file}: invalid slug.`);
        }

        const localeMatch = file.match(/\.(de|es|ja|ru)\.md$/);
        const language = (localeMatch?.[1] ?? 'en') as Language;
        const title = typeof data.title === 'string' ? data.title : slug;
        const description = typeof data.description === 'string' ? data.description : title;
        const articleTitle = `${title} | Calvin W. Merrell`;
        const localePrefix = language === 'en' ? '' : `${language}/`;
        const articleUrl = `https://calvinmerrell.com/${localePrefix}article/${slug}/`;
        const articleHtml = pageHtml(html, language, articleTitle, description, articleUrl);
        const routeDirectory = resolve(
          outputDirectory,
          language === 'en' ? 'article' : `${language}/article`,
          slug,
        );
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
