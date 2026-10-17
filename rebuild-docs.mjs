// Optional authoring helper. Run: node rebuild-docs.mjs
import { readdir, readFile, writeFile } from 'node:fs/promises';
const root = new URL('./', import.meta.url);
const files = (await readdir(new URL('docs/', root))).filter(name => name.endsWith('.md'));
const data = Object.fromEntries(await Promise.all(files.map(async name => [name.slice(0,-3), await readFile(new URL('docs/'+name, root),'utf8')])));
await writeFile(new URL('docs-data.js',root), '// Generated from docs/*.md\nwindow.BOZ_DOCS = '+JSON.stringify(data)+';\n');
console.log(`Bundled ${files.length} documentation pages.`);
