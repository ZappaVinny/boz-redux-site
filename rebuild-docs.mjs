// Authoring helper: run `node rebuild-docs.mjs` after changing docs/*.md, templates/doc.html or
// the header/footer in index.html. It writes, from docs/*.md:
//   docs/<name>.html  one prerendered page per doc (README becomes docs/index.html)
//   404.html          the page GitHub Pages serves for unknown paths
//   sitemap.xml       every page, for search engines
//   docs-data.js      the Markdown of every page, loaded by the docs search
import { readFile, writeFile } from "node:fs/promises";
import { statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { Marked } = require("./vendor/marked.js");

const SITE = "https://" + (await read("CNAME")).trim(); // https://boz-redux.com
const SITE_NAME = "BOZ Redux";
const OG_IMAGE = SITE + "/assets/og-image.png";

function read(path) {
  return readFile(new URL(path, import.meta.url), "utf8");
}
function write(path, text) {
  return writeFile(new URL(path, import.meta.url), text);
}

const escapeHtml = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const decodeHtml = (s) =>
  s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
const textOf = (html) => decodeHtml(html.replace(/<[^>]*>/g, ""));

// Same rules as the heading ids the site has always used.
function slug(s) {
  return s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s_-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}

// The date a file last changed: its last commit, or its modification time while it has
// uncommitted changes (or git is not available).
function lastModified(path) {
  const git = (...args) =>
    execFileSync("git", args, { cwd: new URL(".", import.meta.url), encoding: "utf8" }).trim();
  try {
    const date = !git("status", "--porcelain", "--", path) && git("log", "-1", "--format=%cI", "--", path);
    if (date) return date;
  } catch {}
  return statSync(new URL(path, import.meta.url)).mtime.toISOString();
}

// ---------- Pages ----------

const template = await read("templates/doc.html");
const indexHtml = await read("index.html");

// The page list: the sidebar links in templates/doc.html, in order, each under its label.
const pages = [];
{
  const list = template.match(/<div class="page-links"[\s\S]*?<\/div>/)[0];
  let group = "";
  for (const m of list.matchAll(/<p class="docs-label">([^<]*)<\/p>|<a href="([^"]+)">([^<]*)<\/a>/g)) {
    if (m[1]) group = m[1].trim();
    else {
      const file = m[2];
      const id = file === "index.html" ? "README" : file.replace(/\.html$/, "");
      pages.push({ id, file, title: decodeHtml(m[3].trim()), group });
    }
  }
}
const byId = Object.fromEntries(pages.map((p) => [p.id, p]));
const docs = Object.fromEntries(
  await Promise.all(pages.map(async (p) => [p.id, await read(`docs/${p.id}.md`)])),
);
const urlOf = (page) => SITE + "/docs/" + (page.file === "index.html" ? "" : page.file);

// ---------- Markdown ----------

function render(page) {
  const headings = [];
  const used = {};
  const marked = new Marked({
    renderer: {
      heading({ tokens, depth }) {
        const inner = this.parser.parseInline(tokens);
        if (depth > 4) return `<h${depth}>${inner}</h${depth}>\n`;
        const text = textOf(inner);
        const base = slug(text);
        used[base] = (used[base] || 0) + 1;
        const id = base + (used[base] > 1 ? "-" + (used[base] - 1) : "");
        headings.push({ depth, id, text });
        return `<h${depth} id="${id}">${inner}</h${depth}>\n`;
      },
      link({ href, title, tokens }) {
        const inner = this.parser.parseInline(tokens);
        const titleAttr = title ? ` title="${escapeHtml(title)}"` : "";
        if (/^https?:/.test(href))
          return `<a href="${escapeHtml(href)}"${titleAttr} target="_blank" rel="noopener">${inner}</a>`;
        if (/\.md(?:#|$)/.test(href)) {
          const [path, hash] = href.split("#");
          const key = path.split("/").pop().replace(/\.md$/, "");
          href = byId[key]
            ? byId[key].file + (hash ? "#" + hash : "")
            : `https://github.com/ZappaVinny/boz-redux-sdk/blob/main/docs/${href}`;
        }
        return `<a href="${escapeHtml(href)}"${titleAttr}>${inner}</a>`;
      },
    },
  });
  const html = marked
    .parse(docs[page.id])
    .replace(/<table>/g, '<div class="table-scroll" tabindex="0"><table>')
    .replace(/<\/table>/g, "</table></div>");
  return { html, headings };
}

// The first paragraph of a page as plain text, cut to about 155 characters.
function description(markdown) {
  const para = markdown
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .find((b) => b && !/^(#|```|\||<|- |\d+\. )/.test(b));
  const code = [];
  let text = (para || "")
    .replace(/`([^`]*)`/g, (_, c) => `\u0000${code.push(c) - 1}\u0000`) // keep code as written
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/(\*\*|__|\*|_)(?=\S)(.+?)(?<=\S)\1/g, "$2")
    .replace(/\u0000(\d+)\u0000/g, (_, i) => code[i])
    .replace(/\s+/g, " ")
    .trim()
    .replace(/(?<=[.!?])\s+[^.!?]*:$/, ""); // drop a closing "…you can:" that leads into a list
  if (text.length > 155) text = text.slice(0, 155).replace(/\s+\S*$/, "") + "…";
  return text;
}

// ---------- Shared markup ----------

// Relative links in markup taken from index.html, rewritten for a page at another depth.
const relink = (html, root) =>
  html.replace(/(href|src)="(?!https?:|#|\/|mailto:|data:)([^"]*)"/g, `$1="${root}$2"`);

const shared = (name, re) => {
  const m = indexHtml.match(re);
  if (!m) throw new Error(`index.html has no ${name}`);
  return m[0];
};
const header = shared("<header>", /<header>[\s\S]*?<\/header>/);
const footer = shared("<footer>", /<footer>[\s\S]*?<\/footer>/);
const dialog = shared("<dialog>", /<dialog[\s\S]*?<\/dialog>/);

function headerFor(root, nav) {
  return relink(header, root)
    .replace(' class="active" aria-current="page"', "")
    .replace(`data-nav="${nav}"`, `data-nav="${nav}" class="active" aria-current="page"`);
}

function head({ root, title, description, canonical, type, robots = "index,follow", jsonld, home = false }) {
  const lines = [
    `<meta charset="utf-8" />`,
    `<meta name="viewport" content="width=device-width,initial-scale=1" />`,
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<meta name="robots" content="${robots}" />`,
    canonical && `<link rel="canonical" href="${canonical}" />`,
    `<meta name="theme-color" content="#0d0e10" />`,
    `<link rel="icon" href="${root}assets/favicon.ico" sizes="any" />`,
    `<link rel="icon" type="image/png" sizes="32x32" href="${root}assets/favicon-32.png" />`,
    `<link rel="icon" type="image/png" sizes="256x256" href="${root}assets/favicon.png" />`,
    `<link rel="apple-touch-icon" href="${root}assets/apple-touch-icon.png" />`,
    `<link rel="manifest" href="${root}site.webmanifest" />`,
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    canonical && `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="BOZ Redux: Black Ops Zombies Mobile on PC" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    jsonld &&
      `<script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, "\\u003c")}</script>`,
    `<link rel="preload" href="${root}assets/fonts/BarlowCondensed-Bold.ttf" as="font" type="font/ttf" crossorigin />`,
    `<link rel="preload" href="${root}assets/fonts/Barlow-Regular.ttf" as="font" type="font/ttf" crossorigin />`,
    `<link rel="stylesheet" href="${root}styles.css" />`,
    home && `<link rel="stylesheet" href="${root}home.css" />`,
    `<script defer src="${root}config.js"></script>`,
    `<script defer src="${root}app.js"></script>`,
  ];
  return lines
    .filter(Boolean)
    .map((l) => "    " + l)
    .join("\n");
}

const fill = (html, values) => html.replace(/\{\{(\w+)\}\}/g, (_, key) => values[key] ?? "");

// ---------- Write the doc pages ----------

const sitemap = [{ loc: SITE + "/", lastmod: lastModified("index.html") }];

for (const [index, page] of pages.entries()) {
  const root = "../";
  const { html, headings } = render(page);
  const desc = description(docs[page.id]);
  const url = urlOf(page);
  const modified = lastModified(`docs/${page.id}.md`);
  const title = page.id === "README" ? "BOZ Redux Docs: Modding SDK documentation" : `${page.title} | BOZ Redux Docs`;

  const sidebar = template
    .match(/<div class="page-links"[\s\S]*?<\/div>/)[0]
    .replace(`<a href="${page.file}">`, `<a href="${page.file}" class="current" aria-current="page">`);

  const toc = headings
    .filter((h) => h.depth === 2 || h.depth === 3)
    .map(
      (h) =>
        `            <a href="#${h.id}"${h.depth === 3 ? ' class="sub"' : ""}>${escapeHtml(h.text)}</a>`,
    )
    .join("\n");

  const pager = (other, cls, small, label) =>
    other
      ? `              <a class="${cls}" href="${other.file}"><small>${small}</small><span>${escapeHtml(label(other.title))}</span></a>`
      : `              <span class="${cls}"></span>`;
  const pagination = [
    pager(pages[index - 1], "doc-prev", "PREVIOUS", (t) => "← " + t),
    pager(pages[index + 1], "doc-next", "NEXT", (t) => t + " →"),
  ].join("\n");

  const jsonld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        headline: page.title,
        description: desc,
        url,
        dateModified: modified,
        inLanguage: "en",
        image: OG_IMAGE,
        isPartOf: { "@type": "WebSite", "@id": SITE + "/#website", name: SITE_NAME, url: SITE + "/" },
        publisher: { "@type": "Organization", name: SITE_NAME, url: SITE + "/" },
        about: { "@type": "SoftwareApplication", name: "BOZ Redux SDK" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Documentation", item: SITE + "/docs/" },
          ...(page.id === "README"
            ? []
            : [{ "@type": "ListItem", position: 2, name: page.title, item: url }]),
        ],
      },
    ],
  };

  const out = fill(template, {
    head: head({ root, title, description: desc, canonical: url, type: "article", jsonld }),
    header: headerFor(root, "docs"),
    footer: relink(footer, root),
    dialog: relink(dialog, root),
    root,
    group: escapeHtml(page.group),
    article: html,
    pagination,
    toc,
  }).replace(/<div class="page-links"[\s\S]*?<\/div>/, sidebar);

  await write(`docs/${page.file}`, out);
  sitemap.push({ loc: url, lastmod: modified });
}

// ---------- 404 page (served at any depth, so links start at the site root) ----------

{
  const root = "/";
  const body = `
    <main id="main" tabindex="-1">
      <section class="section">
        <h1>Page not found</h1>
        <p>That page doesn't exist. It may have moved when the documentation got its own pages.</p>
        <p><a href="/docs/">Browse the documentation →</a></p>
        <p><a href="/">Back to the home page →</a></p>
      </section>
    </main>`;
  const out = `<!doctype html>
<html lang="en">
  <head>
${head({ root, title: "Page not found | BOZ Redux", description: "This page does not exist on boz-redux.com.", type: "website", robots: "noindex", home: true })}
  </head>
  <body>
    <a class="skip" href="#main">Skip to content</a>
${headerFor(root, "none")}
${body}

${relink(footer, root)}
${relink(dialog, root)}
  </body>
</html>
`;
  await write("404.html", out);
}

// ---------- sitemap.xml ----------

await write(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemap.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod.slice(0, 10)}</lastmod></url>`).join("\n")}
</urlset>
`,
);

// ---------- docs-data.js (search index) ----------

await write("docs-data.js", "// Generated from docs/*.md\nwindow.BOZ_DOCS = " + JSON.stringify(docs) + ";\n");

console.log(`Wrote ${pages.length} doc pages, 404.html, sitemap.xml and docs-data.js.`);
