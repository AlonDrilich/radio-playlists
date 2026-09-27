// Announces every page in docs/sitemap.xml to IndexNow (via Bing, which shares it with the other IndexNow engines).
// The key file docs/d4fa494ef57c3c0f1500efdd4c367576.txt is written by build.mjs.
import { readFile } from 'node:fs/promises';
const KEY = 'd4fa494ef57c3c0f1500efdd4c367576';
const HOST = 'alondrilich.github.io';
const xml = await readFile(new URL('../docs/sitemap.xml', import.meta.url), 'utf8');
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
const res = await fetch('https://www.bing.com/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/radio-playlists/${KEY}.txt`, urlList }),
});
console.log(`IndexNow: ${urlList.length} URLs → ${res.status}`);
