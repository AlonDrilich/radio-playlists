// Tests for the cleaning and checking helpers in build.mjs: node --test scripts/build.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { assertM3u, cleanText, guardAgainstShrink, m3u, mdEscape, normalise, safeUrl } from './build.mjs';

const U = (n) => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`;
const st = (over) => ({
  stationuuid: U(1), name: 'Radio One', url: 'http://a.example.com/live', url_resolved: '', favicon: '',
  lastcheckok: 1, countrycode: 'DE', country: 'Germany', tags: 'jazz', votes: 1, clickcount: 1,
  codec: 'MP3', bitrate: 128, ...over,
});
const E = (c) => String.fromCharCode(c); // build special characters without literal escapes in this file

test('cleanText removes line breaks, invisibles and tag characters, and caps length', () => {
  const dirty = `A${E(10)}B${E(13)}C${E(0x2028)}D${E(0x2029)}E${E(0x85)}F${E(0x200b)}G${E(0x202e)}H${E(0xfeff)}I${String.fromCodePoint(0xe0041)}J${E(0xe000)}K`;
  assert.equal(cleanText(dirty), 'A B C D E FGHIJK');
  assert.equal(cleanText('x'.repeat(500), 120).length, 120);
  assert.equal(cleanText(`می${E(0x200c)}خواهم`), `می${E(0x200c)}خواهم`, 'ZWNJ kept');
});

test('safeUrl accepts public http(s) and rejects everything else', () => {
  assert.equal(safeUrl('http://stream.example.com:8000/live;'), 'http://stream.example.com:8000/live;');
  assert.equal(safeUrl('https://a.example.com/x?y=1'), 'https://a.example.com/x?y=1');
  for (const bad of [
    'javascript:alert(1)', 'file:///etc/passwd', 'ftp://a.example.com/x', 'data:text/plain,hi', 'rtsp://a.example.com/x',
    'http://user:pw@a.example.com/x', 'http://localhost/x', 'http://127.0.0.1:8000/', 'http://10.0.0.5/x',
    'http://192.168.1.2/x', 'http://172.20.0.1/x', 'http://169.254.169.254/latest', 'http://[::1]/x', 'http://radio/x',
    'http://printer.local/x', 'http://localhost./x', 'http://printer.local./x', 'http://127.1/x', 'http://2130706433/x', 'http://[::ffff:127.0.0.1]/x', 'http://0x7f.0.0.1/x', 'http://a.example.com/' + 'x'.repeat(1000), 'http://a b.example.com/', '', 'not a url',
  ]) assert.equal(safeUrl(bad), null, bad);
  assert.equal(safeUrl('http://a.example.com/x', { httpsOnly: true }), null);
  assert.equal(safeUrl('http://a.example.com/café'), 'http://a.example.com/caf%C3%A9', 'non-ASCII is percent-encoded');
});

test('normalise keeps only valid uuids, working stations and safe URLs; best-voted duplicate wins', () => {
  const out = normalise([
    st({ stationuuid: U(1), name: 'Zed', votes: 5, url: 'http://dup.example.com/s' }),
    st({ stationuuid: U(2), name: 'Alpha', votes: 1, url: 'http://dup.example.com/s/' }),
    st({ stationuuid: 'x/../vote/abc', name: 'Bad id' }),
    st({ stationuuid: U(3), name: 'Dead', lastcheckok: 0 }),
    st({ stationuuid: U(4), name: 'Js', url: 'javascript:alert(1)' }),
    st({ stationuuid: U(5), name: 'Lan', url: 'http://192.168.0.9/x' }),
    st({ stationuuid: U(6), name: `Line${E(10)}#EXTINF:-1,Injected`, url: 'http://ok.example.com/a' }),
    st({ stationuuid: U(7), name: 'Kbps', url: 'http://kb.example.com/a', bitrate: 128000 }),
    null,
  ]);
  assert.deepEqual(out.map((s) => s.name).sort(), ['Kbps', 'Line #EXTINF:-1,Injected', 'Zed']);
  assert.equal(out.find((s) => s.name === 'Kbps').bitrate, null, 'bits per second dropped');
});

test('m3u output passes the shape check, and the check rejects tampered files', () => {
  const entries = normalise([st({ name: 'A, "B"', favicon: 'https://l.example.com/x.png' }), st({ stationuuid: U(2), url: 'http://b.example.com/s' })]);
  const body = m3u('Test', entries, () => 'Germany');
  assert.match(body, /^#EXTM3U\n/);
  assertM3u('ok', body, 2);
  assert.throws(() => assertM3u('t', body + '#EXTINF:-1 radio="true",Extra\n', 2), /without a URL/);
  assert.throws(() => assertM3u('t', body + 'http://x.example.com/\n', 2), /URL without #EXTINF/);
  assert.throws(() => assertM3u('t', body.replace('radio="true"', 'radio="true" x="1"'), 2), /malformed/);
  assert.throws(() => assertM3u('t', body + 'whatever\n', 2), /unexpected line/);
  assert.throws(() => assertM3u('t', body.replace('Radio One', 'Radio' + E(0x2028) + 'One'), 2), /line-separator/);
});

test('mdEscape neutralises markdown and HTML', () => {
  assert.equal(mdEscape('[x](http://e.com) <b>|`'), '\\[x\\]\\(http://e.com\\) \\<b\\>\\|\\`');
});

test('guardAgainstShrink refuses a much smaller build and accepts normal drift', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'pl-'));
  const prev = join(dir, 'index.json');
  await writeFile(prev, JSON.stringify({ totals: { working_unique_stations: 48000, countries: 167, genres: 60 } }));
  await guardAgainstShrink({ working_unique_stations: 47000, countries: 166, genres: 60 }, prev);
  await assert.rejects(guardAgainstShrink({ working_unique_stations: 30000, countries: 167, genres: 60 }, prev), /shrank/);
  await assert.rejects(guardAgainstShrink({ working_unique_stations: 48000, countries: 100, genres: 60 }, prev), /country playlists/);
  await guardAgainstShrink({ working_unique_stations: 1, countries: 1, genres: 1 }, join(dir, 'missing.json')); // first build
});
