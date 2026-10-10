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

## Enable Google Analytics

The site can send Google Analytics 4 page views without adding a server or database. To enable it:

1. In Google Analytics, create a property and a Web data stream for `calvinmerrell.com`.
2. Set the stream's Measurement ID in `.github/workflows/static.yml` as `VITE_GA_MEASUREMENT_ID`. The current configured ID is `G-RQR96YE3ZD`. This is a public identifier, not a password.
3. In Google Analytics, open that web stream's **Enhanced measurement → Page views → Show advanced settings** and enable **Page changes based on browser history events**. This tracks navigation between articles in the React app.
4. Push a commit to `main` to rebuild and deploy the site with Analytics enabled.

The build only adds the Google tag when the variable contains a valid Measurement ID. The Measurement ID is included in public browser code by design, so do not put passwords or private API keys in this variable. Add an appropriate privacy disclosure and check whether your audience requires consent before enabling tracking.

To enable Analytics in a local production build, create an ignored `.env.local` file in this project folder with `VITE_GA_MEASUREMENT_ID=G-RQR96YE3ZD`.
