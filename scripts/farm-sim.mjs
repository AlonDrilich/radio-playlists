/**
 * Copy of scripts/lib/farm-sim.mjs in the 72FM site (https://72fm.com); change both. Used here for farming-simulator/<country>/.
 * Farming Simulator 25 (and 22) read their internet radio list from streamingInternetRadios.xml in the
 * game's music folder (Documents/My Games/FarmingSimulator2025/music). This builds that file.
 *
 *
 * What the game takes (checked against the game's own file and player guides, Oct 2026 — GIANTS
 * publishes no reference for it):
 * - a <streamingInternetRadios> root holding one <streamingInternetRadio href="…" /> per station; there
 *   is no name attribute (the game shows what the stream announces), so the station's name goes in an
 *   XML comment above its line, the way the game's own file comments its examples;
 * - every working example players share is an MP3 stream or a playlist link (.m3u/.pls); one guide
 *   lists AAC too, but no player report confirms it, so only MP3 stations are offered, and HLS (.m3u8)
 *   is left out.
 */

const ADDRESS = /^https?:\/\/[^\s"'<>@\\]+$/i;

/** Why the game cannot take a station, or '' when it can. */
export function farmSimProblem(url, codec) {
  const u = String(url || '').trim();
  if (!u || u.length > 300 || !ADDRESS.test(u)) return 'address';
  if (String(codec || '').trim().toUpperCase() !== 'MP3') return 'format';
  if (/\.m3u8(?:[?#]|$)/i.test(u)) return 'playlist';
  return '';
}

function xmlAttr(text) {
  return String(text).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** A station's name as an XML comment body: no line breaks, no "--", trimmed to 80 characters. */
export function xmlComment(text) {
  const plain = String(text || '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/-{2,}/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
  return [...plain].slice(0, 80).join('').replace(/-$/, '').trim();
}

/** The two lines for one station, or '' when the game cannot play it. */
export function farmSimLines(s) {
  if (farmSimProblem(s.streamUrl, s.codec)) return '';
  const name = xmlComment(s.name);
  return (name ? `    <!-- ${name} -->\r\n` : '') + `    <streamingInternetRadio href="${xmlAttr(String(s.streamUrl).trim())}" />`;
}

/** A whole streamingInternetRadios.xml holding these stations and nothing else. */
export function farmSimFile(stations) {
  const body = stations.map(farmSimLines).filter(Boolean);
  return [
    '<?xml version="1.0" encoding="utf-8" standalone="no" ?>',
    '<streamingInternetRadios>',
    ...body,
    '</streamingInternetRadios>',
    '',
  ].join('\r\n');
}

/** The station lines alone, to paste above </streamingInternetRadios> in an existing file. */
export function farmSimAppend(stations) {
  return stations.map(farmSimLines).filter(Boolean).join('\r\n') + '\r\n';
}
