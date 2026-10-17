const pages = [
  ["README", "Introduction", "Start here"],
  ["getting-started", "Getting started", "Start here"],
  ["lua-mods", "Lua mods", "Create"],
  ["map-editor", "Map editor", "Create"],
  ["weapons-and-assets", "Weapons & assets", "Create"],
  ["standard-library", "Standard library", "Reference"],
  ["console-reference", "Console reference", "Reference"],
  ["game-events", "Game events", "Reference"],
  ["sdk-reference", "SDK reference", "Reference"],
  ["how-the-game-works", "How the game works", "Under the hood"],
  ["contributing", "Contributing", "Under the hood"],
];
const main = document.querySelector("main");
const home =
  () => `<section class="hero"><div class="hero-copy"><h1>Black Ops Zombies.<br><span>Back on PC.</span></h1><p>The original Android game on Windows and Linux, with keyboard and mouse controls and tools for making your own mods.</p><div class="actions"><a class="button" href="https://github.com/ZappaVinny/boz-redux/releases" target="_blank" rel="noopener">Download client ↗</a><a class="button secondary" href="#/docs/getting-started">Getting started →</a></div></div><div class="hero-art"><img src="assets/client-logo.png" alt="BOZ Redux"></div></section>
<section class="section tools-section" id="tools"><div class="products"><article class="product"><img class="product-logo" src="assets/client-logo.png" alt="BOZ Redux client"><h2>The client</h2><p>Play on your desktop with configurable controls, display settings, and mod support.</p><div class="product-links"><a href="https://github.com/ZappaVinny/boz-redux" target="_blank" rel="noopener">Client on GitHub ↗</a><a href="https://github.com/ZappaVinny/boz-redux/releases" target="_blank" rel="noopener">Downloads ↗</a></div></article><article class="product"><img class="product-logo" src="assets/sdk-logo.png" alt="BOZ Redux SDK"><h2>The SDK</h2><p>Write Lua mods, build maps in Blender, and edit weapons, models, sounds, and game data.</p><div class="product-links"><a href="https://github.com/ZappaVinny/boz-redux-sdk" target="_blank" rel="noopener">SDK on GitHub ↗</a><a href="#/docs/README">Documentation →</a></div></article></div></section>
<section class="section apk" id="game-files"><div><h2>Need the APK?</h2><p>The client requires your own Android 1.0.11 APK. Game files aren't included.</p></div><div class="apk-community"><p>For APK availability and help getting set up, visit the community Discord.</p><a class="button secondary" href="#discord" data-discord>Join Discord ↗</a></div></section>
<section class="section" id="project"><div class="project-columns"><div><h2>Made with AI assistance</h2><p>BOZ Redux and its SDK were developed using human-guided generative AI. Human verification has mainly focused on functionality testing.</p><a class="text-link" href="#/docs/contributing">Contribute to the project →</a></div><div><h2>Credits</h2><p>By <a href="https://github.com/ZappaVinny">ZappaVinny</a> and contributors. Based on <a href="https://github.com/Producdevity/cod-boz-port">cod-boz-port by Producdevity</a>.</p><p>Built with <a href="https://github.com/unicorn-engine/unicorn">Unicorn</a>, <a href="https://github.com/libsdl-org/SDL">SDL2</a>, <a href="https://www.blender.org/">Blender</a>, <a href="https://github.com/Tatsh/destin">destin by Tatsh</a>, <a href="https://github.com/NationalSecurityAgency/ghidra">Ghidra</a>, and <a href="https://github.com/recastnavigation/recastnavigation">Recast Navigation</a>.</p><a class="text-link" href="https://github.com/ZappaVinny/boz-redux/blob/main/packaging/THIRD-PARTY.txt">Third-party notices ↗</a></div></div></section>`;
function sidebar(id) {
  let group = "";
  return (
    `<div class="search-wrap"><input id="docs-search" aria-label="Search all documentation" placeholder="Search documentation…" type="search" autocomplete="off"></div><div class="search-results" aria-live="polite"></div><div class="page-links">` +
    pages
      .map(([key, title, g]) => {
        let label =
          g !== group ? `<p class="docs-label">${g.toUpperCase()}</p>` : "";
        group = g;
        return `${label}<a class="${id === key ? "current" : ""}" ${id === key ? 'aria-current="page"' : ""} href="#/docs/${key}">${title}</a>`;
      })
      .join("") +
    "</div>"
  );
}
function slug(s) {
  return s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s_-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}
function escapeText(s) {
  return s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}
function docs(id, anchor) {
  const page = pages.find((p) => p[0] === id);
  if (!page) {
    main.innerHTML =
      '<section class="section"><h1>Page not found</h1><a href="#/docs/README">Back to documentation →</a></section>';
    return;
  }
  document.title = page[1] + " — BOZ Redux Docs";
  main.innerHTML = `<button class="docs-mobile" aria-expanded="false">☰ Browse documentation</button><div class="docs-shell"><aside class="docs-sidebar" aria-label="Documentation navigation">${sidebar(id)}</aside><div class="doc-area"><div class="breadcrumb">DOCUMENTATION / <span>${page[2].toUpperCase()}</span></div><article class="doc-content">${DOMPurify.sanitize(marked.parse(window.BOZ_DOCS[id]))}</article><div class="doc-pagination"></div></div><aside class="doc-toc" aria-label="On this page"><p>ON THIS PAGE</p></aside></div>`;
  const article = main.querySelector("article");
  let used = {};
  article.querySelectorAll("h1,h2,h3,h4").forEach((h) => {
    const base = slug(h.textContent);
    used[base] = (used[base] || 0) + 1;
    h.id = base + (used[base] > 1 ? "-" + (used[base] - 1) : "");
    if (h.matches("h2,h3")) {
      const a = document.createElement("a");
      a.href = `#/docs/${id}#${h.id}`;
      a.textContent = h.textContent;
      if (h.matches("h3")) a.className = "sub";
      main.querySelector(".doc-toc").append(a);
    }
  });
  article.querySelectorAll("a").forEach((a) => {
    let href = a.getAttribute("href") || "";
    if (href.startsWith("#")) a.href = `#/docs/${id}${href}`;
    else if (/\.md(?:#|$)/.test(href) && !/^https?:/.test(href)) {
      const [path, hash] = href.split("#");
      const key = path.split("/").pop().replace(/\.md$/, "");
      a.href = pages.some((p) => p[0] === key)
        ? `#/docs/${key}${hash ? "#" + hash : ""}`
        : `https://github.com/ZappaVinny/boz-redux-sdk/blob/main/docs/${href}`;
    } else if (/^https?:/.test(href)) {
      a.target = "_blank";
      a.rel = "noopener";
    }
  });
  article.querySelectorAll("table").forEach((t) => {
    const wrapper = document.createElement("div");
    wrapper.className = "table-scroll";
    wrapper.tabIndex = 0;
    t.before(wrapper);
    wrapper.append(t);
  });
  article.querySelectorAll("pre").forEach((pre) => {
    const button = document.createElement("button");
    button.className = "copy-code";
    button.textContent = "Copy";
    button.setAttribute("aria-label", "Copy code");
    button.onclick = async () => {
      try {
        await navigator.clipboard.writeText(
          pre.querySelector("code").textContent,
        );
        button.textContent = "Copied";
        setTimeout(() => (button.textContent = "Copy"), 1500);
      } catch {
        button.textContent = "Select to copy";
        const range = document.createRange();
        range.selectNodeContents(pre.querySelector("code"));
        getSelection().removeAllRanges();
        getSelection().addRange(range);
      }
    };
    pre.append(button);
  });
  const index = pages.indexOf(page);
  main.querySelector(".doc-pagination").innerHTML =
    (index
      ? `<a href="#/docs/${pages[index - 1][0]}"><small>PREVIOUS</small>← ${pages[index - 1][1]}</a>`
      : "<span></span>") +
    (index < pages.length - 1
      ? `<a href="#/docs/${pages[index + 1][0]}"><small>NEXT</small>${pages[index + 1][1]} →</a>`
      : "");
  main.querySelector(".docs-mobile").onclick = (e) => {
    const open = main.querySelector(".docs-sidebar").classList.toggle("open");
    e.currentTarget.setAttribute("aria-expanded", open);
  };
  main.querySelector("#docs-search").oninput = (e) => {
    const q = e.target.value.trim().toLowerCase();
    const results = main.querySelector(".search-results");
    main.querySelector(".page-links").hidden = !!q;
    if (!q) {
      results.innerHTML = "";
      return;
    }
    const matches = pages.filter((p) =>
      (p[1] + " " + window.BOZ_DOCS[p[0]]).toLowerCase().includes(q),
    );
    results.innerHTML = matches.length
      ? matches
          .map((p) => {
            const raw = window.BOZ_DOCS[p[0]].replace(/[#*`|]/g, " ");
            const at = raw.toLowerCase().indexOf(q);
            return `<a href="#/docs/${p[0]}">${p[1]}<small>${escapeText(raw.slice(Math.max(0, at - 35), Math.max(0, at - 35) + 120))}…</small></a>`;
          })
          .join("")
      : "<p>No results. Try “weapons” or “Lua”.</p>";
  };
  if (anchor)
    requestAnimationFrame(() =>
      document.getElementById(decodeURIComponent(anchor))?.scrollIntoView(),
    );
}
let lastPage = "";
function route() {
  const hash = location.hash || "#/";
  if (hash === "#discord") return;
  const match = hash.match(/^#\/docs\/([^#]+)(?:#(.*))?$/);
  const isDocs = !!match;
  document.body.classList.toggle("is-docs", isDocs);
  document.querySelectorAll("[data-nav]").forEach((a) => {
    a.classList.toggle("active", a.dataset.nav === (isDocs ? "docs" : "home"));
    a.removeAttribute("aria-current");
    if (a.classList.contains("active")) a.setAttribute("aria-current", "page");
  });
  const page = isDocs ? match[1] : "home";
  if (page !== lastPage) window.scrollTo(0, 0);
  if (isDocs) {
    if (lastPage === page && main.querySelector(".doc-content")) {
      if (match[2])
        document.getElementById(decodeURIComponent(match[2]))?.scrollIntoView();
      else window.scrollTo(0, 0);
    } else docs(match[1], match[2]);
  } else {
    document.title = "BOZ Redux";
    main.innerHTML = home();
    const section = hash.split("#")[2];
    if (section)
      requestAnimationFrame(() =>
        document.getElementById(section)?.scrollIntoView(),
      );
  }
  lastPage = page;
}
document.addEventListener("click", (e) => {
  const a = e.target.closest("[data-discord]");
  if (!a) return;
  e.preventDefault();
  const url = window.BOZ_CONFIG?.discordUrl;
  if (url && /^https:\/\/(discord\.gg\/|discord\.com\/invite\/)/.test(url)) {
    window.open(url, "_blank", "noopener");
  } else document.querySelector("dialog").showModal();
});
document.querySelector(".dialog-close").onclick = () =>
  document.querySelector("dialog").close();
document.querySelector("dialog").onclick = (e) => {
  if (e.target === e.currentTarget) e.currentTarget.close();
};
window.addEventListener("hashchange", route);
route();
