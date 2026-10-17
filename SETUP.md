# BOZ Redux static website

Open `index.html` directly, or upload this folder to any static host. No backend, install step, or build is required. Runtime files are HTML, CSS, JS, and image assets. Markdown sources and the optional authoring script are included for maintenance.

## Discord

Set `discordUrl` in `config.js` to your permanent `https://discord.gg/...` invite. All three Discord buttons use it. Until configured, they show a community dialog linking to GitHub rather than sending visitors to an invented invite.

## Documentation

All 11 supplied Markdown files are preserved in `docs/`. The site renders the bundled Markdown in `docs-data.js` using Marked and sanitizes it with DOMPurify. Bundling avoids local-file fetch restrictions, so docs work when index.html is opened directly. After updating Markdown, run `node rebuild-docs.mjs` once. To add a new page, also add its ID, title, and group to `pages` in `app.js`.

Documentation supports full-text search, heading links, relative Markdown links, code copying, scrollable tables, previous/next pages, and mobile navigation. URLs use hash routing, so static hosts need no rewrite rules.

## Assets and third parties

The client and SDK logos are supplied project branding. Marked 15.0.12 (MIT) and DOMPurify 3.2.6 (Apache-2.0 OR MPL-2.0) are vendored in `vendor/`; their upstream license files are included. The site uses the BOZ Redux brand of the client launcher and the SDK app: the same colours, and the Barlow and Barlow Condensed fonts (SIL Open Font License, `assets/fonts/OFL.txt`), served from `assets/fonts/` with no external font requests. The logos have their source files' faint grey background removed. No analytics or API calls are used.

Homepage product information and acknowledgments are based on the client and SDK READMEs. The AI disclosure reflects their creation notes. No game files are included.
