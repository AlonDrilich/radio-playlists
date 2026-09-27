#!/usr/bin/env node
// Builds M3U playlists from the Radio Browser public directory
// (https://www.radio-browser.info, data released to the public domain).
//
// No dependencies. Needs Node 20+ (global fetch, Intl.DisplayNames).
// Usage: node scripts/build.mjs

import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MIRRORS = [
  'https://de1.api.radio-browser.info',
  'https://de2.api.radio-browser.info',
  'https://all.api.radio-browser.info',
];
const USER_AGENT = '72FM-playlists/1.0 (+https://72fm.com)';
const TIMEOUT_MS = 15_000;
const PAGE_SIZE = 5000;
const RAW_BASE = 'https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main';
const REPO_URL = 'https://github.com/AlonDrilich/radio-playlists';
const PAGES_BASE = 'https://alondrilich.github.io/radio-playlists/';
const SITE = 'https://72fm.com';

const MIN_COUNTRY_STATIONS = 5;
const PER_FILE_CAP = 300;
const TOP_N = 500;
const GENRE_COUNT = 60;
const MIN_GENRE_STATIONS = 10;
// If the directory answers with far fewer stations than usual, something is
// wrong upstream. Refuse to overwrite good playlists with a degraded set.
const MIN_TOTAL_STATIONS = 20_000;

// Curated genre candidates. Radio Browser tags are free text, so each genre
// lists the tags that mean the same thing. The top GENRE_COUNT candidates
// (ranked by /json/tags stationcount) get a playlist. Slugs match 72FM's
// /genre/<slug> URLs where 72FM has such a page.
const GENRES = [
  ['pop', 'Pop', ['pop', 'pop music', 'música pop', 'musica pop']],
  ['rock', 'Rock', ['rock', 'rock music']],
  ['news', 'News', ['news', 'noticias', 'nachrichten', 'local news', 'news talk']],
  ['talk', 'Talk', ['talk', 'talk radio', 'talk & speech', 'hablada', 'radio hablada', 'spoken word']],
  ['classical', 'Classical', ['classical', 'classical music', 'klassik', 'música clásica']],
  ['dance', 'Dance', ['dance', 'dance music', 'pop dance']],
  ['oldies', 'Oldies', ['oldies', 'oldie', 'goldies']],
  ['50s', '50s', ['50s', "50's", '1950s']],
  ['60s', '60s', ['60s', "60's", '1960s', '60er']],
  ['70s', '70s', ['70s', "70's", '1970s', '70er']],
  ['80s', '80s', ['80s', "80's", '1980s', '80er']],
  ['90s', '90s', ['90s', "90's", '1990s', '90er']],
  ['2000s', '2000s', ['2000s', '00s', "00's", '2000er']],
  ['jazz', 'Jazz', ['jazz']],
  ['smooth-jazz', 'Smooth Jazz', ['smooth jazz']],
  ['electronic', 'Electronic', ['electronic', 'electronica', 'electrónica', 'electro', 'elektronik']],
  ['top-40', 'Top 40 & Hits', ['top 40', 'top40', 'hits', 'top hits', 'contemporary hits', 'contemporary hits radio', 'chr', 'charts', 'top charts']],
  ['christian', 'Christian', ['christian', 'christian music', 'christian contemporary', 'ccm', 'worship', 'praise']],
  ['religious', 'Religious', ['religious', 'religion', 'catholic', 'islamic', 'islam', 'quran']],
  ['gospel', 'Gospel', ['gospel']],
  ['classic-rock', 'Classic Rock', ['classic rock']],
  ['adult-contemporary', 'Adult Contemporary', ['adult contemporary', 'hot adult contemporary', 'soft adult contemporary']],
  ['classic-hits', 'Classic Hits', ['classic hits']],
  ['house', 'House', ['house', 'house music']],
  ['deep-house', 'Deep House', ['deep house']],
  ['alternative', 'Alternative', ['alternative', 'alternative rock', 'alt rock']],
  ['indie', 'Indie', ['indie', 'indie rock', 'indie pop']],
  ['country', 'Country', ['country', 'country music', 'new country']],
  ['classic-country', 'Classic Country', ['classic country']],
  ['folk', 'Folk', ['folk', 'folk music']],
  ['soul', 'Soul', ['soul', 'soul music']],
  ['r-and-b', 'R&B', ['rnb', 'r&b', "r'n'b", 'r & b', 'rhythm and blues', 'rhythm & blues']],
  ['funk', 'Funk', ['funk']],
  ['disco', 'Disco', ['disco']],
  ['metal', 'Metal', ['metal', 'heavy metal']],
  ['hard-rock', 'Hard Rock', ['hard rock']],
  ['soft-rock', 'Soft Rock', ['soft rock']],
  ['punk', 'Punk', ['punk', 'punk rock']],
  ['grunge', 'Grunge', ['grunge']],
  ['chillout', 'Chillout', ['chillout', 'chill out', 'chill-out']],
  ['chill', 'Chill & Relax', ['chill', 'relax', 'relaxing', 'relaxation']],
  ['lounge', 'Lounge', ['lounge']],
  ['ambient', 'Ambient', ['ambient']],
  ['easy-listening', 'Easy Listening', ['easy listening']],
  ['techno', 'Techno', ['techno']],
  ['trance', 'Trance', ['trance']],
  ['psytrance', 'Psytrance', ['psytrance', 'psy trance', 'goa']],
  ['edm', 'EDM', ['edm']],
  ['drum-and-bass', 'Drum and Bass', ['drum and bass', 'drum & bass', 'drum n bass', "drum'n'bass", 'dnb']],
  ['dubstep', 'Dubstep', ['dubstep']],
  ['hip-hop', 'Hip-Hop & Rap', ['hip-hop', 'hiphop', 'hip hop', 'rap']],
  ['trap', 'Trap', ['trap']],
  ['reggae', 'Reggae', ['reggae']],
  ['reggaeton', 'Reggaeton', ['reggaeton']],
  ['salsa', 'Salsa', ['salsa']],
  ['cumbia', 'Cumbia', ['cumbia']],
  ['bachata', 'Bachata', ['bachata']],
  ['merengue', 'Merengue', ['merengue']],
  ['latin', 'Latin', ['latin', 'latino', 'latin music', 'latin pop', 'música latina']],
  ['tropical', 'Tropical', ['tropical']],
  ['regional-mexican', 'Regional Mexican', ['regional mexican', 'regional mexicana', 'música regional mexicana', 'banda', 'grupera', 'grupero', 'norteño', 'norteña']],
  ['ranchera', 'Ranchera', ['ranchera', 'rancheras']],
  ['mariachi', 'Mariachi', ['mariachi']],
  ['sertanejo', 'Sertanejo', ['sertanejo']],
  ['mpb', 'MPB', ['mpb']],
  ['samba', 'Samba', ['samba']],
  ['blues', 'Blues', ['blues']],
  ['schlager', 'Schlager', ['schlager']],
  ['chanson', 'Chanson', ['chanson', 'french chanson']],
  ['world', 'World Music', ['world music', 'world', 'worldmusic']],
  ['instrumental', 'Instrumental', ['instrumental']],
  ['soundtrack', 'Soundtracks', ['soundtrack', 'soundtracks', 'film music', 'movie soundtracks']],
  ['new-age', 'New Age', ['new age']],
  ['synthwave', 'Synthwave', ['synthwave']],
  ['sports', 'Sports', ['sports', 'sport', 'deportes']],
  ['comedy', 'Comedy', ['comedy']],
  ['christmas', 'Christmas', ['christmas', 'christmas music', 'weihnachten', 'navidad']],
  ['kpop', 'K-Pop', ['k-pop', 'kpop']],
  ['jpop', 'J-Pop', ['j-pop', 'jpop']],
  ['anime', 'Anime', ['anime']],
  ['bollywood', 'Bollywood', ['bollywood']],
  ['lofi', 'Lo-fi', ['lofi', 'lo-fi']],
  ['meditation', 'Meditation', ['meditation']],
  ['kids', 'Kids', ['kids', 'children', "children's music"]],
  ['opera', 'Opera', ['opera']],
  ['piano', 'Piano', ['piano']],
  ['swing', 'Swing', ['swing']],
  ['americana', 'Americana', ['americana']],
];

// ---------------------------------------------------------------- fetching

async function fetchWithTimeout(url, accept = 'application/json') {
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, Accept: accept },
    signal: AbortSignal.timeout(TIMEOUT_MS),
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res;
}

/** GET a Radio Browser path as JSON, trying each mirror in order. */
async function api(path) {
  const errors = [];
  for (const base of MIRRORS) {
    try {
      const res = await fetchWithTimeout(base + path);
      return await res.json();
    } catch (err) {
      errors.push(`${base}: ${err.message}`);
    }
  }
  throw new Error(`All mirrors failed for ${path}\n  ${errors.join('\n  ')}`);
}

async function fetchAllWorkingStations() {
  const all = [];
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const page = await api(
      `/json/stations/search?hidebroken=true&order=name&limit=${PAGE_SIZE}&offset=${offset}`,
    );
    if (!Array.isArray(page)) throw new Error('Unexpected station page');
    all.push(...page);
    process.stderr.write(`  fetched ${all.length} stations\n`);
    if (page.length < PAGE_SIZE) break;
  }
  return all;
}

async function fetchLinkableSlugs() {
  try {
    const res = await fetchWithTimeout(`${SITE}/sitemap.xml`, 'application/xml');
    const xml = await res.text();
    const locs = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
    const pick = (prefix) =>
      new Set(
        locs
          .map((u) => u.replace(/^https?:\/\/[^/]+/, ''))
          .filter((p) => p.startsWith(prefix))
          .map((p) => decodeURIComponent(p.slice(prefix.length).replace(/\/$/, ''))),
      );
    const genres = pick('/genre/');
    const countries = pick('/radio/');
    if (genres.size === 0 && countries.size === 0) throw new Error('empty sitemap');
    return { genres, countries, fromSitemap: true };
  } catch (err) {
    // Fall back to what the previous run linked, so a flaky sitemap fetch
    // does not strip every link from the README.
    process.stderr.write(`  sitemap unavailable (${err.message}); reusing previous links\n`);
    try {
      const prev = JSON.parse(await readFile(join(ROOT, 'index.json'), 'utf8'));
      const set = (type) =>
        new Set(prev.playlists.filter((p) => p.type === type && p.page_72fm).map((p) => p.id));
      return { genres: set('genre'), countries: set('country'), fromSitemap: false };
    } catch {
      return { genres: new Set(), countries: new Set(), fromSitemap: false };
    }
  }
}

// ---------------------------------------------------------------- cleaning

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });

function countryName(code, fallback) {
  try {
    const n = regionNames.of(code);
    if (n && n !== code) return n;
  } catch {}
  return fallback || code;
}

function flag(code) {
  return [...code.toUpperCase()].map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65)).join('');
}

function cleanText(s) {
  return String(s ?? '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Attribute values: no quotes (would end the value) and no commas (several
// players split the #EXTINF line on its first comma to find the title).
function attr(s) {
  return cleanText(s).replace(/[",]/g, ' ').replace(/\s+/g, ' ').trim();
}

function streamUrl(st) {
  for (const u of [st.url_resolved, st.url]) {
    const v = String(u ?? '').trim();
    if (/^https?:\/\/[^\s]+$/i.test(v)) return v;
  }
  return null;
}

function logoUrl(favicon) {
  const v = String(favicon ?? '').trim();
  if (!/^https:\/\/[^\s",]+$/i.test(v) || v.length > 400) return null;
  return v;
}

function normalise(raw) {
  const out = [];
  const seen = new Set();
  const seenUuid = new Set();
  for (const st of raw) {
    if (st.lastcheckok !== 1) continue;
    const url = streamUrl(st);
    const name = cleanText(st.name);
    if (!url || !name || !st.stationuuid) continue;
    // Pages are ordered by name, so a station can repeat across a page
    // boundary; dedupe by uuid as well as by stream URL.
    if (seen.has(url) || seenUuid.has(st.stationuuid)) continue;
    seen.add(url);
    seenUuid.add(st.stationuuid);
    const cc = String(st.countrycode ?? '').toUpperCase();
    out.push({
      uuid: st.stationuuid,
      name,
      url,
      logo: logoUrl(st.favicon),
      cc: /^[A-Z]{2}$/.test(cc) ? cc : null,
      countryRaw: cleanText(st.country),
      tags: String(st.tags ?? '')
        .toLowerCase()
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      votes: Number(st.votes) || 0,
      clicks: Number(st.clickcount) || 0,
      codec: /^[A-Za-z0-9+ .-]{1,16}$/.test(String(st.codec ?? '').trim()) &&
        String(st.codec).trim().toUpperCase() !== 'UNKNOWN'
        ? String(st.codec).trim().toUpperCase()
        : null,
      bitrate: Number.isInteger(Number(st.bitrate)) && Number(st.bitrate) > 0 && Number(st.bitrate) < 10_000
        ? Number(st.bitrate)
        : null,
    });
  }
  return out;
}

const byPopularity = (a, b) =>
  b.votes - a.votes || b.clicks - a.clicks || a.name.localeCompare(b.name) || a.uuid.localeCompare(b.uuid);

// ---------------------------------------------------------------- output

function m3u(title, entries, groupOf) {
  const lines = [
    '#EXTM3U',
    `# ${title}`,
    '# Source: Radio Browser (https://www.radio-browser.info), public domain data.',
    '# Streams belong to their stations; 72FM does not own, operate or curate them.',
    '# Listen in the browser: https://72fm.com',
    '',
  ];
  for (const s of entries) {
    const attrs = [];
    if (s.logo) attrs.push(`tvg-logo="${s.logo}"`);
    const group = attr(groupOf(s));
    if (group) attrs.push(`group-title="${group}"`);
    lines.push(`# 72FM: ${SITE}/station/${s.uuid}`);
    lines.push(`#EXTINF:-1${attrs.length ? ' ' + attrs.join(' ') : ''},${s.name}`);
    lines.push(s.url);
  }
  return lines.join('\n') + '\n';
}

async function writeDir(dir, files) {
  const abs = join(ROOT, dir);
  await rm(abs, { recursive: true, force: true });
  await mkdir(abs, { recursive: true });
  for (const [name, body] of files) await writeFile(join(abs, name), body);
}

function mdEscape(s) {
  return String(s).replace(/\|/g, '\\|');
}

// ---------------------------------------------------------------- main

async function main() {
  process.stderr.write('Fetching stations from Radio Browser...\n');
  const raw = await fetchAllWorkingStations();
  const stations = normalise(raw);
  process.stderr.write(`  ${raw.length} returned, ${stations.length} working and unique by stream URL\n`);
  if (stations.length < MIN_TOTAL_STATIONS) {
    throw new Error(`Only ${stations.length} usable stations (expected >= ${MIN_TOTAL_STATIONS}); aborting without writing.`);
  }
  stations.sort(byPopularity);

  process.stderr.write('Fetching tag counts...\n');
  const tags = await api('/json/tags?order=stationcount&reverse=true&hidebroken=true&limit=5000');
  const tagCount = new Map(tags.map((t) => [String(t.name).toLowerCase().trim(), Number(t.stationcount) || 0]));

  process.stderr.write('Fetching 72FM sitemap...\n');
  const links = await fetchLinkableSlugs();

  const nameOf = (s) => (s.cc ? countryName(s.cc, s.countryRaw) : s.countryRaw || 'Unknown');
  const playlists = [];
  const entriesOf = new Map(); // "type:id" -> stations in that file (for docs/)

  // Countries
  const byCountry = new Map();
  for (const s of stations) {
    if (!s.cc) continue;
    if (!byCountry.has(s.cc)) byCountry.set(s.cc, []);
    byCountry.get(s.cc).push(s);
  }
  const countryFiles = [];
  for (const [cc, list] of [...byCountry].sort((a, b) => countryName(a[0]).localeCompare(countryName(b[0])))) {
    if (list.length < MIN_COUNTRY_STATIONS) continue;
    const id = cc.toLowerCase();
    const name = countryName(cc, list[0].countryRaw);
    const entries = list.slice(0, PER_FILE_CAP);
    countryFiles.push([`${id}.m3u`, m3u(`Radio stations in ${name}`, entries, () => name)]);
    entriesOf.set(`country:${id}`, entries);
    playlists.push({
      type: 'country',
      id,
      name,
      flag: flag(cc),
      stations: entries.length,
      stations_available: list.length,
      path: `countries/${id}.m3u`,
      url: `${RAW_BASE}/countries/${id}.m3u`,
      page_72fm: links.countries.has(id) ? `${SITE}/radio/${id}` : null,
    });
  }

  // Genres
  const ranked = GENRES.map(([slug, name, aliases]) => {
    const set = new Set(aliases);
    const members = stations.filter((s) => s.tags.some((t) => set.has(t)));
    const rank = aliases.reduce((n, a) => n + (tagCount.get(a) || 0), 0);
    return { slug, name, members, rank };
  })
    .filter((g) => g.members.length >= MIN_GENRE_STATIONS)
    .sort((a, b) => b.rank - a.rank || b.members.length - a.members.length)
    .slice(0, GENRE_COUNT)
    .sort((a, b) => a.name.localeCompare(b.name));

  const genreFiles = [];
  for (const g of ranked) {
    const entries = g.members.slice(0, PER_FILE_CAP);
    genreFiles.push([`${g.slug}.m3u`, m3u(`${g.name} radio stations`, entries, () => g.name)]);
    entriesOf.set(`genre:${g.slug}`, entries);
    playlists.push({
      type: 'genre',
      id: g.slug,
      name: g.name,
      stations: entries.length,
      stations_available: g.members.length,
      path: `genres/${g.slug}.m3u`,
      url: `${RAW_BASE}/genres/${g.slug}.m3u`,
      page_72fm: links.genres.has(g.slug) ? `${SITE}/genre/${g.slug}` : null,
    });
  }

  // Top
  const top = stations.slice(0, TOP_N);
  const topFiles = [[`top-${TOP_N}.m3u`, m3u(`Top ${TOP_N} radio stations by votes`, top, nameOf)]];
  playlists.push({
    type: 'top',
    id: `top-${TOP_N}`,
    name: `Top ${TOP_N} by votes`,
    stations: top.length,
    stations_available: stations.length,
    path: `top/top-${TOP_N}.m3u`,
    url: `${RAW_BASE}/top/top-${TOP_N}.m3u`,
    page_72fm: SITE,
  });

  await writeDir('countries', countryFiles);
  await writeDir('genres', genreFiles);
  await writeDir('top', topFiles);

  const generated = new Date().toISOString().slice(0, 10);
  const index = {
    generated,
    source: 'Radio Browser (https://www.radio-browser.info)',
    data_license: 'Public domain (Radio Browser); playlists in this repository: CC0 1.0',
    note: 'Stream URLs point to third-party stations. 72FM does not own, operate or curate them.',
    criteria: {
      lastcheckok: 1,
      dedupe: 'by stream URL (url_resolved preferred)',
      sort: 'votes desc, then clickcount desc',
      per_file_cap: PER_FILE_CAP,
      min_country_stations: MIN_COUNTRY_STATIONS,
    },
    totals: {
      working_unique_stations: stations.length,
      countries: countryFiles.length,
      genres: genreFiles.length,
    },
    playlists,
  };
  await writeFile(join(ROOT, 'index.json'), JSON.stringify(index, null, 2) + '\n');
  await writeFile(join(ROOT, 'README.md'), readme(index, links.fromSitemap));
  const pageCount = await writeSite(index, entriesOf);

  process.stderr.write(
    `Done: ${countryFiles.length} countries, ${genreFiles.length} genres, top ${top.length}. ` +
      `${stations.length} working unique stations. docs/: ${pageCount} HTML pages.\n`,
  );
}

// ---------------------------------------------------------------- docs/ site
//
// Static GitHub Pages site (served from main /docs): an index page plus one
// page per country and genre playlist. Plain HTML, no JavaScript.

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

const fmtInt = (n) => Number(n).toLocaleString('en-US');

const CSS = `:root{color-scheme:light dark;--bg:#fff;--fg:#1b1b1b;--muted:#5c5c5c;--line:#d9d9d9;--row:#f5f5f5;--link:#0b57d0;--btn:#0b57d0;--btnfg:#fff}
@media (prefers-color-scheme:dark){:root{--bg:#121212;--fg:#e6e6e6;--muted:#a6a6a6;--line:#343434;--row:#1b1b1b;--link:#8ab4f8;--btn:#8ab4f8;--btnfg:#10131a}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.55 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
main{max-width:980px;margin:0 auto;padding:16px}
a{color:var(--link)}
h1{font-size:1.65rem;line-height:1.25;margin:.4em 0 .5em}
h2{font-size:1.25rem;margin:1.6em 0 .5em}
p,li{overflow-wrap:anywhere}
.muted,.crumbs{color:var(--muted)}
.crumbs{font-size:.9rem;margin:0}
.actions{display:flex;flex-wrap:wrap;gap:.7em 1.3em;align-items:center;margin:1.1em 0}
.btn{display:inline-block;background:var(--btn);color:var(--btnfg);padding:.55em 1em;border-radius:6px;text-decoration:none;font-weight:600}
.cta{font-weight:600}
code,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.88em}
pre{background:var(--row);border:1px solid var(--line);border-radius:6px;padding:.7em .9em;overflow-x:auto;white-space:pre}
.tw{overflow-x:auto;-webkit-overflow-scrolling:touch;border:1px solid var(--line);border-radius:6px;margin:.5em 0 1em}
table{border-collapse:collapse;width:100%;font-size:.94rem}
th,td{padding:.45em .7em;text-align:left;border-bottom:1px solid var(--line);vertical-align:top}
tbody tr:last-child td{border-bottom:0}
tbody tr:nth-child(even){background:var(--row)}
th{white-space:nowrap}
td.nw,td.num{white-space:nowrap}
td.num,th.num{text-align:right}
td.name{min-width:11em}
footer{color:var(--muted);font-size:.875rem;border-top:1px solid var(--line);margin-top:2.5em;padding-top:1em}`;

function htmlPage({ title, description, canonical, body }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(canonical)}">
<style>
${CSS}
</style>
</head>
<body>
<main>
${body}
</main>
</body>
</html>
`;
}

function footerHtml(generated) {
  return `<footer>
<p>Data: <a href="https://www.radio-browser.info">Radio Browser</a>, a community-maintained directory whose data is released to the public domain. 72FM does not own, operate or curate these streams; station names, logos and audio belong to the stations. Some streams stop working between checks.</p>
<p>Last updated ${esc(generated)}, rebuilt weekly. Playlists: CC0 1.0. Source and issue tracker: <a href="${REPO_URL}">github.com/AlonDrilich/radio-playlists</a>. Listen in the browser: <a href="${SITE}">72fm.com</a>.</p>
</footer>`;
}

function formatOf(s) {
  const parts = [];
  if (s.bitrate) parts.push(`${s.bitrate} kbps`);
  if (s.codec) parts.push(s.codec);
  return parts.join(' ');
}

function stationTable(entries) {
  const rows = entries
    .map(
      (s, i) =>
        `<tr><td class="num">${i + 1}</td><td class="name">${esc(s.name)}</td><td class="nw">${esc(formatOf(s)) || '<span class="muted">–</span>'}</td>` +
        `<td class="nw"><a href="${esc(s.url)}" rel="nofollow noopener">Stream</a></td>` +
        `<td class="nw"><a href="${SITE}/station/${esc(encodeURIComponent(s.uuid))}">Listen on 72FM</a></td></tr>`,
    )
    .join('\n');
  return `<div class="tw"><table>
<thead><tr><th class="num">#</th><th>Station</th><th>Format</th><th>Stream</th><th>72FM</th></tr></thead>
<tbody>
${rows}
</tbody>
</table></div>`;
}

function playlistPage(p, entries, generated) {
  const isCountry = p.type === 'country';
  const path = `${p.type}/${p.id}/`;
  const canonical = PAGES_BASE + path;
  const n = p.stations;
  const title = `${p.name} radio stations — M3U playlist (${n} stations)`;
  const scope = isCountry ? `from ${p.name}` : `tagged ${p.name}`;
  const description =
    `Free M3U playlist of ${n} internet radio stations ${scope}, from the Radio Browser directory. ` +
    `Opens in VLC and mpv. Updated weekly, last on ${generated}.`;
  const ofAll =
    p.stations_available > n
      ? ` These are the ${fmtInt(n)} with the most community votes out of ${fmtInt(p.stations_available)} working stations ${scope} in the directory.`
      : ` That is every station ${scope} that passed the directory's last check, sorted by community votes.`;
  const intro =
    `This playlist has ${fmtInt(n)} internet radio stations ${scope}, taken from the public-domain ` +
    `<a href="https://www.radio-browser.info">Radio Browser</a> directory.${ofAll} ` +
    `Each one passed Radio Browser's most recent stream check, but streams go offline or move, so a few may not play. ` +
    `Last updated ${esc(generated)}.`;
  const link72 = p.page_72fm
    ? `<a class="cta" href="${esc(p.page_72fm)}">Listen to ${esc(p.name)} radio in the browser on 72FM →</a>`
    : `<a class="cta" href="${SITE}">Listen in the browser on 72FM →</a>`;
  const heading = isCountry ? `${p.flag} ${esc(p.name)} radio stations — M3U playlist` : `${esc(p.name)} radio stations — M3U playlist`;
  const body = `<p class="crumbs"><a href="../../">All playlists</a> › ${isCountry ? 'Countries' : 'Genres'} › ${esc(p.name)}</p>
<h1>${heading}</h1>
<p>${intro}</p>
<div class="actions">
<a class="btn" href="${esc(p.url)}">Download playlist (.m3u)</a>
${link72}
</div>
<p class="muted">In VLC: Media → Open Network Stream and paste the playlist link. With mpv:</p>
<pre><code>mpv ${esc(p.url)}</code></pre>
<h2>Stations (${fmtInt(entries.length)})</h2>
${stationTable(entries)}
${footerHtml(generated)}`;
  return { path, html: htmlPage({ title, description, canonical, body }) };
}

function indexPage(index) {
  const { generated, totals } = index;
  const countries = index.playlists.filter((p) => p.type === 'country');
  const genres = index.playlists.filter((p) => p.type === 'genre');
  const top = index.playlists.find((p) => p.type === 'top');
  const ex = `${RAW_BASE}/countries/de.m3u`;
  const count = (p) =>
    p.stations_available > p.stations ? `${fmtInt(p.stations)} <span class="muted">of ${fmtInt(p.stations_available)}</span>` : fmtInt(p.stations);

  const genreRows = genres
    .map(
      (p) =>
        `<tr><td class="name"><a href="genre/${esc(p.id)}/">${esc(p.name)}</a></td><td class="num">${count(p)}</td>` +
        `<td class="nw"><a href="${esc(p.url)}">Download .m3u</a></td><td class="nw"><a href="genre/${esc(p.id)}/">Station list</a></td></tr>`,
    )
    .join('\n');
  const countryRows = countries
    .map(
      (p) =>
        `<tr><td>${p.flag}</td><td class="name"><a href="country/${esc(p.id)}/">${esc(p.name)}</a></td><td class="num">${count(p)}</td>` +
        `<td class="nw"><a href="${esc(p.url)}">Download .m3u</a></td><td class="nw"><a href="country/${esc(p.id)}/">Station list</a></td></tr>`,
    )
    .join('\n');

  const title = 'Internet Radio M3U Playlists by Country and Genre — free, updated weekly';
  const description =
    `Free M3U playlists of internet radio stations: ${totals.countries} countries and ${totals.genres} genres, ` +
    `built from the public-domain Radio Browser directory. For VLC, mpv and other players. Updated weekly.`;
  const body = `<h1>Internet radio M3U playlists by country and genre</h1>
<p>Free M3U playlists of internet radio stations, one per country and one per genre, rebuilt every week from
<a href="https://www.radio-browser.info">Radio Browser</a>, a community-maintained directory whose data is released to the public domain.
Only stations that passed the directory's most recent stream check are included, at most ${PER_FILE_CAP} per playlist, sorted by community votes.</p>
<p><strong>72FM does not own, operate or curate these streams.</strong> They are the directory's entries, filtered automatically.
Streams go offline or move between checks, so some entries will not play.</p>
<p class="actions"><a class="btn" href="${SITE}">Listen in the browser on 72FM → 72fm.com</a></p>
<ul>
<li>${fmtInt(totals.working_unique_stations)} working, de-duplicated stations in the directory at the last build</li>
<li>${totals.countries} country playlists, ${totals.genres} genre playlists, and a <a href="${esc(top.url)}">top ${TOP_N} by votes</a> playlist</li>
<li>Last updated ${esc(generated)}</li>
<li>Every playlist with its raw URL, for scripts: <a href="${RAW_BASE}/index.json">index.json</a> · source code: <a href="${REPO_URL}">GitHub</a></li>
</ul>
<h2>How to use</h2>
<p><strong>VLC:</strong> Media → Open Network Stream, paste a playlist link (the “Download .m3u” links below), or download the file and open it.</p>
<p><strong>mpv:</strong> use <code>&gt;</code> and <code>&lt;</code> to move to the next or previous station.</p>
<pre><code>mpv ${esc(ex)}</code></pre>
<p><strong>Command line download:</strong></p>
<pre><code>curl -LO ${esc(RAW_BASE)}/genres/jazz.m3u</code></pre>
<p>More player notes (pyradio, Home Assistant, ESP32 and Raspberry Pi) are in the <a href="${REPO_URL}#how-to-use">README</a>.</p>
<h2 id="genres">Genres</h2>
<p class="muted">“300 of 1,234” means the playlist holds the ${PER_FILE_CAP} most-voted of that many matching stations.</p>
<div class="tw"><table>
<thead><tr><th>Genre</th><th class="num">Stations</th><th>Playlist</th><th>Page</th></tr></thead>
<tbody>
${genreRows}
</tbody>
</table></div>
<h2 id="countries">Countries</h2>
<div class="tw"><table>
<thead><tr><th></th><th>Country</th><th class="num">Stations</th><th>Playlist</th><th>Page</th></tr></thead>
<tbody>
${countryRows}
</tbody>
</table></div>
${footerHtml(generated)}`;
  return htmlPage({ title, description, canonical: PAGES_BASE, body });
}

async function writeSite(index, entriesOf) {
  const files = [['index.html', indexPage(index)]];
  for (const p of index.playlists) {
    if (p.type !== 'country' && p.type !== 'genre') continue;
    const page = playlistPage(p, entriesOf.get(`${p.type}:${p.id}`) ?? [], index.generated);
    files.push([`${page.path}index.html`, page.html]);
  }
  const urls = files.map(([f]) => PAGES_BASE + f.replace(/index\.html$/, ''));
  const sitemap =
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map((u) => `  <url><loc>${esc(u)}</loc><lastmod>${index.generated}</lastmod></url>`).join('\n') +
    '\n</urlset>\n';
  files.push(['sitemap.xml', sitemap]);
  files.push(['robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${PAGES_BASE}sitemap.xml\n`]);
  files.push(['.nojekyll', '']);

  const abs = join(ROOT, 'docs');
  await rm(abs, { recursive: true, force: true });
  for (const [name, body] of files) {
    const target = join(abs, name);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, body);
  }
  return files.filter(([f]) => f.endsWith('.html')).length;
}

// ---------------------------------------------------------------- README

function readme(index, _fromSitemap) {
  const countries = index.playlists.filter((p) => p.type === 'country');
  const genres = index.playlists.filter((p) => p.type === 'genre');
  const ex = `${RAW_BASE}/countries/de.m3u`;

  const countryRows = countries
    .map(
      (p) =>
        `| ${p.flag} | ${mdEscape(p.name)} | ${p.stations}${p.stations_available > p.stations ? ` of ${p.stations_available}` : ''} | [${p.id}.m3u](${p.url}) | ${
          p.page_72fm ? `[72fm.com/radio/${p.id}](${p.page_72fm})` : '—'
        } |`,
    )
    .join('\n');
  const genreRows = genres
    .map(
      (p) =>
        `| ${mdEscape(p.name)} | ${p.stations}${p.stations_available > p.stations ? ` of ${p.stations_available}` : ''} | [${p.id}.m3u](${p.url}) | ${
          p.page_72fm ? `[72fm.com/genre/${p.id}](${p.page_72fm})` : '—'
        } |`,
    )
    .join('\n');

  return `# Internet radio M3U playlists by country and genre

Free, weekly-updated **M3U playlists of internet radio stations**: one per country,
one per genre and a top-${TOP_N} list. They open in VLC, mpv, pyradio and most
other players that read M3U, and are easy to parse on an ESP32 or Raspberry Pi radio.

- **${index.totals.working_unique_stations.toLocaleString('en-US')}** working, de-duplicated stations in the source directory at the last build
- **${index.totals.countries}** country playlists, **${index.totals.genres}** genre playlists, [top ${TOP_N}](${RAW_BASE}/top/top-${TOP_N}.m3u)
- Last build: **${index.generated}** (rebuilt every Monday)
- Machine-readable list of every playlist: [\`index.json\`](index.json)
- Browse online, one page per country and genre: **[${PAGES_BASE}](${PAGES_BASE})**

Listen in the browser, no install: **https://72fm.com**

## Where the data comes from

Every entry comes from [Radio Browser](https://www.radio-browser.info), a
community-maintained public directory of radio streams. Its operator states that the
collected data (station names, tags, stream links, homepages, language, country) is
released to the **public domain**. Thank you to Radio Browser and everyone who adds
and fixes stations there.

**72FM does not own, operate or curate these streams.** They are the directory's
entries, filtered automatically. The station names, logos and audio belong to the
stations themselves.

How the playlists are built (\`scripts/build.mjs\`):

- only stations that passed Radio Browser's most recent stream check (\`lastcheckok = 1\`)
- only \`http://\` and \`https://\` stream URLs; the resolved URL is used when available
- duplicates removed by stream URL
- sorted by community votes, then click count; at most ${PER_FILE_CAP} stations per file
- countries with at least ${MIN_COUNTRY_STATIONS} working stations
- genres: a fixed list of common genres, each matching several spellings of the same tag
  (for example \`hip-hop\`, \`hiphop\` and \`rap\`), ranked by how many stations use them

Streams go offline, move or change format between checks, so **some entries will
not play**. That is normal for any radio list. If one is broken, please
[open an issue](../../issues) with the station name and playlist; the lasting fix is
to correct the station on [radio-browser.info](https://www.radio-browser.info), which
this repository picks up on the next weekly build.

## File format

Standard extended M3U, UTF-8:

\`\`\`
#EXTM3U
# 72FM: https://72fm.com/station/<stationuuid>
#EXTINF:-1 tvg-logo="https://…/logo.png" group-title="Germany",Station name
https://stream.example.com/live.mp3
\`\`\`

The \`# 72FM:\` line is a plain M3U comment that links to the station's page on
72fm.com. Players skip lines that start with \`#\` and are not directives they know
(checked against the VLC, mpv and pyradio M3U parsers), and it sits above the
\`#EXTINF\` line so parsers that pair \`#EXTINF\` with the next line are unaffected.
Quotes and commas are removed from attribute values, because some players split
the \`#EXTINF\` line on its first comma.

## How to use

**VLC** – Media → Open Network Stream, paste a raw playlist URL, e.g.
\`${ex}\`. Or download the file and open it.

**mpv**

\`\`\`sh
mpv ${ex}
# pick another station: > / < (next / previous in playlist)
\`\`\`

**pyradio** – load an M3U directly (pyradio converts it to its CSV format), or put
the \`.m3u\` in your pyradio stations folder and pick it in the playlist browser:

\`\`\`sh
curl -LO ${RAW_BASE}/genres/jazz.m3u
pyradio -s jazz.m3u          # play it
pyradio --convert jazz.m3u   # or just convert to jazz.csv
\`\`\`

**Home Assistant** – Home Assistant already ships a Radio Browser integration for
browsing. To play a specific station from an automation or script, copy its stream
URL from a playlist and call \`media_player.play_media\` with
\`media_content_type: music\` and \`media_content_id: <stream URL>\`.

**ESP32 / Raspberry Pi radios** – fetch a playlist over HTTP and take every line
that does not start with \`#\` as a stream URL (the preceding \`#EXTINF\` line has the
name). Libraries such as ESP32-audioI2S take one URL at a time
(\`audio.connecttohost(url)\`). ESP32 boards usually cope best with MP3 or AAC streams
at modest bitrates, and plain \`http://\` saves memory compared with TLS; a few
entries are HLS (\`.m3u8\`), which most microcontroller decoders cannot play.
On a Pi, \`mpv --no-video <url>\` or MPD work well.

**Scripts** – [\`index.json\`](index.json) lists every playlist with its raw URL and
station count.

## Top ${TOP_N}

[top-${TOP_N}.m3u](${RAW_BASE}/top/top-${TOP_N}.m3u) – the most-voted working stations
worldwide.

## Genres

Station counts are "in this file of all that matched" when a genre has more than
${PER_FILE_CAP}. The last column links to the matching genre page on 72FM where one exists.

| Genre | Stations | Playlist | Listen on 72FM |
|---|---|---|---|
${genreRows}

## Countries

| | Country | Stations | Playlist | Listen on 72FM |
|---|---|---|---|---|
${countryRows}

## Build it yourself

Needs Node.js 20 or newer, no dependencies:

\`\`\`sh
node scripts/build.mjs
\`\`\`

The script queries the Radio Browser API (\`de1\`, then \`de2\`, then \`all\` mirrors)
with the user agent \`${USER_AGENT}\`. It also writes the static browsing site in
\`docs/\` (served by GitHub Pages). A GitHub Actions workflow runs it every Monday
and commits the result. It refuses to write anything if the directory returns
unusually few stations, so a bad API day cannot empty the playlists.

## License

- Playlists, \`index.json\` and README tables: [CC0 1.0](LICENSE-DATA) (public domain
  dedication), matching the public-domain status of the Radio Browser data.
- \`scripts/\` and workflow code: [MIT](LICENSE).
- Station names, logos and streams remain the property of the respective stations.
  This repository only lists links to them.

Made by [72FM](https://72fm.com), a free web radio player built on the same directory.
`;
}

main().catch((err) => {
  console.error(err.stack || String(err));
  process.exit(1);
});
