# Calvin Merrell's blog

This is a static React and TypeScript blog hosted on GitHub Pages. Blog posts live in `articles/` as Markdown files. Each production build creates a homepage and a static route for every article, so article links work when opened directly or refreshed.

## Write a post

Add a `.md` file to `articles/` with the required frontmatter:

```md
---
title: "A clear article title"
description: A short summary for the article card and search results.
image: /images/article-cover.jpg
slug: a-clear-article-title
date: 2026-10-10
---

Write the article in Markdown below the closing `---`.
```

Use a unique lowercase slug made of letters, numbers, and hyphens. Put cover images in `public/images/` and reference them from the site root, such as `/images/article-cover.jpg`.

## Run and build

```sh
npm ci
npm run dev
npm run build
```

Push a commit to `main` to run the GitHub Actions workflow and publish the generated `dist/` folder to GitHub Pages.
