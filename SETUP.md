# BOZ Redux static website

Open `index.html` directly, or upload this folder to any static host. No backend, install step, or build is required at deploy time. Runtime files are HTML, CSS, JS, and image assets. Markdown sources and the authoring script are included for maintenance.

## Discord

Set `discordUrl` in `config.js` to your permanent `https://discord.gg/...` invite. All three Discord buttons use it. Until configured, they show a community dialog linking to GitHub rather than sending visitors to an invented invite.

## Documentation

The Markdown sources are in `docs/`. Each one is prerendered into its own static page, `docs/<name>.html` (`README.md` becomes `docs/index.html`), so every page has a real URL, its own title, description and social preview, and its full text in the HTML for search engines.

After changing anything in `docs/*.md`, `templates/doc.html`, or the header, footer or Discord dialog in `index.html`, run:

```bash
node rebuild-docs.mjs
```

It regenerates the doc pages, `404.html`, `sitemap.xml` and `docs-data.js` (the search index), using the vendored Marked. Commit the generated files with your change.

To add a page: add `docs/<name>.md`, add a link to it in the `page-links` list in `templates/doc.html` (that list sets the page order, titles and groups), and run the script.

Doc pages support full-text search (the index loads the first time the search box is used), heading links, an "On this page" list, code copying, scrollable tables, previous/next pages, and mobile navigation. Old `#/docs/<page>` links redirect to the new pages.

## Search engines

- Every page has a canonical URL on `https://boz-redux.com` (from `CNAME`), Open Graph and Twitter card tags, and JSON-LD structured data (home: `WebSite` and `SoftwareApplication`; docs: `TechArticle` and `BreadcrumbList`).
- `sitemap.xml` lists every page with its last change date (from git, or the file's modification time while it has uncommitted changes). `robots.txt` points to it.
- `assets/og-image.png` (1200×630) is the preview image shown when a link is shared.
- `404.html` is served by GitHub Pages for unknown paths and is marked `noindex`.
- `.nojekyll` makes GitHub Pages serve the files as they are, without Jekyll.
- The home page's title, description and structured data are written directly in `index.html`.

## Assets and third parties

The client and SDK logos are supplied project branding. Marked 15.0.12 (MIT) is vendored in `vendor/` with its license; it is used only by `rebuild-docs.mjs`, not in the browser. The site uses the BOZ Redux brand of the client launcher and the SDK app: the same colours, and the Barlow and Barlow Condensed fonts (SIL Open Font License, `assets/fonts/OFL.txt`), served from `assets/fonts/` with no external font requests. The logos have their source files' faint grey background removed. No analytics or API calls are used.

Homepage product information and acknowledgments are based on the client and SDK READMEs. The AI disclosure reflects their creation notes. No game files are included.
