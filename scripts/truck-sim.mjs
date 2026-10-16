/**
 * Euro Truck Simulator 2 and American Truck Simulator read their internet radio list from
 * live_streams.sii. This builds that file for ets2/<country>/. It is a copy of scripts/lib/truck-sim.mjs
 * in the 72FM site, which builds the same file at https://72fm.com/ets2-ats-radio-stations; change both.
 *
 * What the game takes (checked against maintained community files and tools, Oct 2026):
 * - one `stream_data[i]: "url|name|genre|language|bitrate|favourite"` line per station, numbered
 *   from 0 in order, after a `stream_data: <count>` line; the game refuses entries out of order;
 * - MP3 and Ogg Vorbis streams only: its audio engine is set to those two (g_stream_exts), and
 *   players report AAC and HLS stations staying silent;
 * - plain ASCII: SII text files write anything else as \xNN UTF-8 bytes, and so do we;
 * - a language of at most three characters.
 * Players also report the game failing to open https addresses on a port other than 443, so those
 * are left out rather than handed to someone as a station that will not play.
 */

const ADDRESS = /^https?:\/\/[^\s"'<>@\\|]+$/i;

/** Why the game cannot take a station, or '' when it can. */
export function truckSimProblem(url, codec) {
  const u = String(url || '').trim();
  if (!u || u.length > 300 || !ADDRESS.test(u)) return 'address';
  const c = String(codec || '').trim().toUpperCase();
  if (c !== 'MP3' && c !== 'OGG') return 'format';
  if (/\.(m3u8?|pls|asx|xspf)(?:[?#]|$)/i.test(u)) return 'playlist';
  const port = /^https:\/\/[^/?#]*:(\d+)(?:[/?#]|$)/i.exec(u);
  if (port && port[1] !== '443') return 'port';
  return '';
}

/** The station's address when the game can play it, otherwise ''. */
export function truckSimStream(url, codec) {
  return truckSimProblem(url, codec) ? '' : String(url).trim();
}

function escapeNonAscii(text) {
  let out = '';
  for (const ch of text) {
    const code = ch.codePointAt(0);
    if (code >= 0x20 && code <= 0x7e) { out += ch; continue; }
    for (const b of new TextEncoder().encode(ch)) out += '\\x' + b.toString(16).padStart(2, '0');
  }
  return out;
}

/** One field of a line: no separators or quotes, accents dropped, the rest escaped, at most `max` characters. */
export function siiField(text, max) {
  const plain = String(text || '')
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/[|"\\\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ').trim();
  const chars = [...plain];
  let cut = chars.slice(0, max).join('');
  // Cut at a word, not inside one: "Club dance electronic house" rather than "Club dance electronic ho".
  if (chars.length > max && chars[max] !== ' ' && cut.includes(' ')) cut = cut.slice(0, cut.lastIndexOf(' '));
  return escapeNonAscii(cut.trim());
}

/** "german,english" → "GER"; no usable language → the country code, or MUL. */
export function siiLanguage(language, countryCode) {
  const first = String(language || '').split(',')[0].normalize('NFKD').replace(/[^A-Za-z]/g, '');
  if (first.length >= 2) return first.slice(0, 3).toUpperCase();
  return /^[A-Za-z]{2}$/.test(countryCode || '') ? countryCode.toUpperCase() : 'MUL';
}

/** A station as one entry of the list; null when the game cannot play it. */
export function truckSimEntry(s) {
  const url = truckSimStream(s.streamUrl, s.codec);
  const name = siiField(s.name, 60);
  if (!url || !name) return null;
  const genre = siiField(s.genre && s.genre !== 'Various' ? s.genre : '', 24) || 'Various';
  const bitrate = Number.isInteger(s.bitrate) && s.bitrate > 0 && s.bitrate < 1000 ? s.bitrate : 128;
  return {
    url,
    name,
    genre: genre.charAt(0).toUpperCase() + genre.slice(1),
    language: siiLanguage(s.language, s.countryCode),
    bitrate,
    favourite: s.favourite ? 1 : 0,
  };
}

export function siiLine(e, index) {
  return ` stream_data[${index}]: "${e.url}|${e.name}|${e.genre}|${e.language}|${e.bitrate}|${e.favourite ? 1 : 0}"`;
}

/** A whole live_streams.sii holding these entries and nothing else. */
export function siiFile(entries) {
  return [
    'SiiNunit',
    '{',
    'live_stream_def : .live_streams {',
    ` stream_data: ${entries.length}`,
    ...entries.map((e, i) => siiLine(e, i)),
    '}',
    '',
    '}',
    '',
  ].join('\r\n');
}

/** Lines to paste under the last line of an existing file that already holds `start` stations. */
export function siiLines(entries, start) {
  const from = Number.isInteger(start) && start > 0 ? start : 0;
  return entries.map((e, i) => siiLine(e, from + i)).join('\r\n') + '\r\n';
}
