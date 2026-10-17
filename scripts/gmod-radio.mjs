/**
 * Copy of scripts/lib/gmod-radio.mjs in the 72FM site (https://72fm.com); change both. Used here for garrys-mod/.
 * Garry's Mod's 3D Stream Radio addon plays, on a multiplayer server, only addresses listed in the
 * server's playlist files (its URL whitelist). This builds such a playlist file: PLS, the format of
 * the addon's own stock playlists, saved as <name>_pls.txt for garrysmod/data/streamradio/playlists/.
 *
 * From the addon's source and wiki (github.com/Grocel/3D-Stream-Radio, Oct 2026):
 * - playlist files are found by the pattern *_<type>.txt (pls, m3u, json, vdf) under data/streamradio/playlists;
 * - the whitelist is multiplayer only, built from those playlists; after editing files by hand,
 *   sv_streamradio_url_whitelist_reload (or a restart) makes it take effect;
 * - supported formats: MP3, OGG, AAC, WAV, WMA, FLAC; web pages and players do not work.
 * We offer MP3, OGG, AAC and FLAC stations (AAC+, the HE-AAC variant, is not listed, so it is left out)
 * and leave out HLS (.m3u8) addresses.
 */

const ADDRESS = /^https?:\/\/[^\s"'<>\\]+$/i;
const FORMATS = new Set(['MP3', 'OGG', 'AAC', 'FLAC']);

/** Why the radio cannot take a station, or '' when it can. */
export function gmodProblem(url, codec) {
  const u = String(url || '').trim();
  if (!u || u.length > 300 || !ADDRESS.test(u)) return 'address';
  if (!FORMATS.has(String(codec || '').trim().toUpperCase())) return 'format';
  if (/\.m3u8(?:[?#]|$)/i.test(u)) return 'playlist';
  return '';
}

/** A station's title for the playlist: one line, at most 60 characters. */
export function gmodTitle(name) {
  const plain = String(name || '').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim();
  const chars = [...plain];
  let cut = chars.slice(0, 60).join('');
  if (chars.length > 60 && chars[60] !== ' ' && cut.includes(' ')) cut = cut.slice(0, cut.lastIndexOf(' '));
  return cut.trim() || 'Radio';
}

/** A whole PLS playlist holding these stations. */
export function gmodPlaylist(stations) {
  const ok = stations.filter(s => !gmodProblem(s.streamUrl, s.codec));
  const lines = ['[playlist]', `NumberOfEntries=${ok.length}`];
  ok.forEach((s, i) => {
    const n = i + 1;
    lines.push(`File${n}=${String(s.streamUrl).trim()}`, `Title${n}=${gmodTitle(s.name)}`, `Length${n}=-1`);
  });
  lines.push('Version=2', '');
  return lines.join('\r\n');
}
