# Lines of Light

Lines of Light is built as part of the main Vite website and deployed at `/art/` with GitHub Pages.

From `vite-calvinmerrell.com`, run `npm run dev` for local development or `npm run build` to build the whole website. The `build:art` script builds this app into the main site's public files before the main site build.

GitHub Pages serves static files only. This version keeps profiles, drafts, saved artwork, and chat in the browser's local storage. Live drawing and chat updates work between tabs open in the same browser. They do not sync between devices or visitors. The quote page uses its remote quote service when available and has a built-in fallback.
