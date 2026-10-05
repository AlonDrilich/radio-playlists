# Internet radio M3U playlists by country and genre

Free, weekly-updated **M3U playlists of internet radio stations**: one per country,
one per genre and a top-500 list. They open in VLC, mpv, pyradio and most
other players that read M3U, and are easy to parse on an ESP32 or Raspberry Pi radio.

- **49,015** working, de-duplicated stations in the source directory at the last build
- **170** country playlists, **60** genre playlists, [top 500](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/top/top-500.m3u)
- Last build: **2026-10-05** (rebuilt every Monday)
- Machine-readable list of every playlist: [`index.json`](index.json)
- Browse online, one page per country and genre: **[https://alondrilich.github.io/radio-playlists/](https://alondrilich.github.io/radio-playlists/)**

Listen in the browser, no install: **https://72fm.com**

## Related tools

- [internet-radio-mcp](https://github.com/AlonDrilich/internet-radio-mcp): lets Claude, Cursor and other AI assistants search the same directory and return stream URLs.
- [radio-player-72fm](https://github.com/AlonDrilich/radio-player-72fm): a WordPress plugin that puts a station's player on any post or page.
- [72FM radio widget](https://72fm.com/radio-widget): copy-and-paste player for any website. All tools: [72fm.com/developers](https://72fm.com/developers).

## Where the data comes from

Every entry comes from [Radio Browser](https://www.radio-browser.info), a
community-maintained public directory of radio streams. Its operator states that the
collected data (station names, tags, stream links, homepages, language, country) is
released to the **public domain**. Thank you to Radio Browser and everyone who adds
and fixes stations there.

**72FM does not own, operate or curate these streams.** They are the directory's
entries, filtered automatically. The station names, logos and audio belong to the
stations themselves.

How the playlists are built (`scripts/build.mjs`):

- only stations that passed Radio Browser's most recent stream check (`lastcheckok = 1`)
- only `http://` and `https://` stream URLs on public hosts (no credentials, no `localhost` or
  private-network addresses); the resolved URL is used when available
- station names and other text are cleaned: line breaks, control characters and invisible or
  direction-changing characters are removed, and names are cut at 120 characters
- duplicates removed by stream URL; when several entries share one, the most-voted is kept
- sorted by community votes, then click count; at most 300 stations per file
- countries with at least 5 working stations
- genres: a fixed list of common genres, each matching several spellings of the same tag
  (for example `hip-hop`, `hiphop` and `rap`), ranked by how many stations use them;
  stations with more than 15 tags are left out of genre playlists
- every generated file is checked before it is written: only a header, comments and
  `#EXTINF`/URL pairs are allowed, otherwise the build stops

Streams go offline, move or change format between checks, so **some entries will
not play**. That is normal for any radio list. If one is broken, please
[open an issue](../../issues) with the station name and playlist; the lasting fix is
to correct the station on [radio-browser.info](https://www.radio-browser.info), which
this repository picks up on the next weekly build.

## File format

Standard extended M3U, UTF-8:

```
#EXTM3U
# 72FM: https://72fm.com/station/<stationuuid>
#EXTINF:-1 tvg-logo="https://…/logo.png" group-title="Germany" radio="true",Station name
https://stream.example.com/live.mp3
```

The `# 72FM:` line is a plain M3U comment that links to the station's page on
72fm.com. In the M3U format, lines that start with `#` and are not a directive the
player knows are skipped, and this one sits above the `#EXTINF` line so parsers
that pair `#EXTINF` with the next line are unaffected. If a player you use trips
over it, [open an issue](../../issues).
Quotes and commas are removed from attribute values, because some players split
the `#EXTINF` line on its first comma.

## How to use

**VLC** – Media → Open Network Stream, paste a raw playlist URL, e.g.
`https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/de.m3u`. Or download the file and open it.

**mpv**

```sh
mpv https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/de.m3u
# pick another station: > / < (next / previous in playlist)
```

**pyradio** – load an M3U directly (pyradio converts it to its CSV format), or put
the `.m3u` in your pyradio stations folder and pick it in the playlist browser:

```sh
curl -LO https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/jazz.m3u
pyradio -s jazz.m3u          # play it
pyradio --convert jazz.m3u   # or just convert to jazz.csv
```

**Kodi** – enable the **IPTV Simple Client** PVR add-on (Add-ons → My add-ons →
PVR clients), open **Configure → General**, choose a remote path and paste a playlist's
raw URL, for example `https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/de.m3u`. Every entry carries
`radio="true"`, so the stations appear under **Radio** in Kodi's main menu.
Step-by-step: [72fm.com/guide/kodi-radio](https://72fm.com/guide/kodi-radio).

**Home Assistant** – Home Assistant already ships a Radio Browser integration for
browsing. To play a specific station from an automation or script, copy its stream
URL from a playlist and call `media_player.play_media` with
`media_content_type: music` and `media_content_id: <stream URL>`.

More: [Home Assistant radio guide](https://72fm.com/guide/home-assistant-radio).

**ESP32 / Raspberry Pi radios** – fetch a playlist over HTTP and take every line
that does not start with `#` as a stream URL (the preceding `#EXTINF` line has the
name). Libraries such as ESP32-audioI2S take one URL at a time
(`audio.connecttohost(url)`). ESP32 boards usually cope best with MP3 or AAC streams
at modest bitrates, and plain `http://` saves memory compared with TLS; a few
entries are HLS (`.m3u8`), which most microcontroller decoders cannot play.
On a Pi, `mpv --no-video <url>` or MPD work well.

**Scripts** – [`index.json`](index.json) lists every playlist with its raw URL and
station count.

## Top 500

[top-500.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/top/top-500.m3u) – the most-voted working stations
worldwide.

## Genres

Station counts are "in this file of all that matched" when a genre has more than
300. The last column links to the matching genre page on 72FM where one exists.

| Genre | Stations | Playlist | Listen on 72FM |
|---|---|---|---|
| 2000s | 300 of 345 | [2000s.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/2000s.m3u) | — |
| 60s | 294 | [60s.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/60s.m3u) | [72fm.com/genre/60s](https://72fm.com/genre/60s) |
| 70s | 300 of 578 | [70s.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/70s.m3u) | [72fm.com/genre/70s](https://72fm.com/genre/70s) |
| 80s | 300 of 1176 | [80s.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/80s.m3u) | [72fm.com/genre/80s](https://72fm.com/genre/80s) |
| 90s | 300 of 911 | [90s.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/90s.m3u) | [72fm.com/genre/90s](https://72fm.com/genre/90s) |
| Adult Contemporary | 300 of 819 | [adult-contemporary.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/adult-contemporary.m3u) | — |
| Alternative | 300 of 736 | [alternative.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/alternative.m3u) | [72fm.com/genre/alternative](https://72fm.com/genre/alternative) |
| Ambient | 300 of 323 | [ambient.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/ambient.m3u) | [72fm.com/genre/ambient](https://72fm.com/genre/ambient) |
| Blues | 283 | [blues.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/blues.m3u) | [72fm.com/genre/blues](https://72fm.com/genre/blues) |
| Chill \& Relax | 300 of 359 | [chill.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/chill.m3u) | [72fm.com/genre/chill](https://72fm.com/genre/chill) |
| Chillout | 300 of 358 | [chillout.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/chillout.m3u) | [72fm.com/genre/chillout](https://72fm.com/genre/chillout) |
| Christian | 300 of 813 | [christian.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/christian.m3u) | [72fm.com/genre/christian](https://72fm.com/genre/christian) |
| Christmas | 232 | [christmas.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/christmas.m3u) | — |
| Classic Hits | 300 of 605 | [classic-hits.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/classic-hits.m3u) | — |
| Classic Rock | 300 of 698 | [classic-rock.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/classic-rock.m3u) | [72fm.com/genre/classic-rock](https://72fm.com/genre/classic-rock) |
| Classical | 300 of 1190 | [classical.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/classical.m3u) | [72fm.com/genre/classical](https://72fm.com/genre/classical) |
| Country | 300 of 633 | [country.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/country.m3u) | [72fm.com/genre/country](https://72fm.com/genre/country) |
| Cumbia | 140 | [cumbia.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/cumbia.m3u) | [72fm.com/genre/cumbia](https://72fm.com/genre/cumbia) |
| Dance | 300 of 1266 | [dance.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/dance.m3u) | [72fm.com/genre/dance](https://72fm.com/genre/dance) |
| Deep House | 170 | [deep-house.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/deep-house.m3u) | [72fm.com/genre/deep-house](https://72fm.com/genre/deep-house) |
| Disco | 286 | [disco.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/disco.m3u) | [72fm.com/genre/disco](https://72fm.com/genre/disco) |
| Drum and Bass | 128 | [drum-and-bass.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/drum-and-bass.m3u) | [72fm.com/genre/drum-and-bass](https://72fm.com/genre/drum-and-bass) |
| Easy Listening | 295 | [easy-listening.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/easy-listening.m3u) | [72fm.com/genre/easy-listening](https://72fm.com/genre/easy-listening) |
| EDM | 195 | [edm.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/edm.m3u) | [72fm.com/genre/edm](https://72fm.com/genre/edm) |
| Electronic | 300 of 1068 | [electronic.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/electronic.m3u) | [72fm.com/genre/electronic](https://72fm.com/genre/electronic) |
| Folk | 300 of 601 | [folk.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/folk.m3u) | [72fm.com/genre/folk](https://72fm.com/genre/folk) |
| Funk | 258 | [funk.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/funk.m3u) | [72fm.com/genre/funk](https://72fm.com/genre/funk) |
| Gospel | 269 | [gospel.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/gospel.m3u) | [72fm.com/genre/gospel](https://72fm.com/genre/gospel) |
| Hard Rock | 203 | [hard-rock.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/hard-rock.m3u) | [72fm.com/genre/hard-rock](https://72fm.com/genre/hard-rock) |
| Hip-Hop \& Rap | 300 of 621 | [hip-hop.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/hip-hop.m3u) | [72fm.com/genre/hip-hop](https://72fm.com/genre/hip-hop) |
| House | 300 of 585 | [house.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/house.m3u) | [72fm.com/genre/house](https://72fm.com/genre/house) |
| Indie | 300 of 439 | [indie.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/indie.m3u) | [72fm.com/genre/indie](https://72fm.com/genre/indie) |
| Instrumental | 170 | [instrumental.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/instrumental.m3u) | [72fm.com/genre/instrumental](https://72fm.com/genre/instrumental) |
| Jazz | 300 of 950 | [jazz.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/jazz.m3u) | [72fm.com/genre/jazz](https://72fm.com/genre/jazz) |
| Kids | 141 | [kids.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/kids.m3u) | [72fm.com/genre/kids](https://72fm.com/genre/kids) |
| Latin | 300 of 410 | [latin.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/latin.m3u) | [72fm.com/genre/latin](https://72fm.com/genre/latin) |
| Lounge | 267 | [lounge.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/lounge.m3u) | [72fm.com/genre/lounge](https://72fm.com/genre/lounge) |
| Metal | 300 of 447 | [metal.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/metal.m3u) | [72fm.com/genre/metal](https://72fm.com/genre/metal) |
| News | 300 of 3079 | [news.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/news.m3u) | [72fm.com/genre/news](https://72fm.com/genre/news) |
| Oldies | 300 of 1038 | [oldies.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/oldies.m3u) | [72fm.com/genre/oldies](https://72fm.com/genre/oldies) |
| Pop | 300 of 4731 | [pop.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/pop.m3u) | [72fm.com/genre/pop](https://72fm.com/genre/pop) |
| Punk | 168 | [punk.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/punk.m3u) | [72fm.com/genre/punk](https://72fm.com/genre/punk) |
| R\&B | 300 of 333 | [r-and-b.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/r-and-b.m3u) | [72fm.com/genre/r-and-b](https://72fm.com/genre/r-and-b) |
| Ranchera | 33 | [ranchera.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/ranchera.m3u) | [72fm.com/genre/ranchera](https://72fm.com/genre/ranchera) |
| Reggae | 200 | [reggae.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/reggae.m3u) | [72fm.com/genre/reggae](https://72fm.com/genre/reggae) |
| Reggaeton | 161 | [reggaeton.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/reggaeton.m3u) | [72fm.com/genre/reggaeton](https://72fm.com/genre/reggaeton) |
| Regional Mexican | 125 | [regional-mexican.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/regional-mexican.m3u) | [72fm.com/genre/regional-mexican](https://72fm.com/genre/regional-mexican) |
| Religious | 300 of 514 | [religious.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/religious.m3u) | — |
| Rock | 300 of 2440 | [rock.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/rock.m3u) | [72fm.com/genre/rock](https://72fm.com/genre/rock) |
| Salsa | 222 | [salsa.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/salsa.m3u) | [72fm.com/genre/salsa](https://72fm.com/genre/salsa) |
| Schlager | 214 | [schlager.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/schlager.m3u) | [72fm.com/genre/schlager](https://72fm.com/genre/schlager) |
| Smooth Jazz | 209 | [smooth-jazz.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/smooth-jazz.m3u) | [72fm.com/genre/smooth-jazz](https://72fm.com/genre/smooth-jazz) |
| Soul | 300 of 363 | [soul.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/soul.m3u) | [72fm.com/genre/soul](https://72fm.com/genre/soul) |
| Sports | 300 of 467 | [sports.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/sports.m3u) | — |
| Talk | 300 of 1601 | [talk.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/talk.m3u) | [72fm.com/genre/talk](https://72fm.com/genre/talk) |
| Techno | 299 | [techno.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/techno.m3u) | [72fm.com/genre/techno](https://72fm.com/genre/techno) |
| Top 40 \& Hits | 300 of 1910 | [top-40.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/top-40.m3u) | — |
| Trance | 222 | [trance.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/trance.m3u) | [72fm.com/genre/trance](https://72fm.com/genre/trance) |
| Tropical | 138 | [tropical.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/tropical.m3u) | — |
| World Music | 279 | [world.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/world.m3u) | [72fm.com/genre/world](https://72fm.com/genre/world) |

## Countries

| | Country | Stations | Playlist | Listen on 72FM |
|---|---|---|---|---|
| 🇦🇫 | Afghanistan | 72 | [af.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/af.m3u) | [72fm.com/radio/af](https://72fm.com/radio/af) |
| 🇦🇱 | Albania | 30 | [al.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/al.m3u) | [72fm.com/radio/al](https://72fm.com/radio/al) |
| 🇩🇿 | Algeria | 117 | [dz.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/dz.m3u) | [72fm.com/radio/dz](https://72fm.com/radio/dz) |
| 🇦🇸 | American Samoa | 8 | [as.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/as.m3u) | [72fm.com/radio/as](https://72fm.com/radio/as) |
| 🇦🇩 | Andorra | 7 | [ad.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ad.m3u) | [72fm.com/radio/ad](https://72fm.com/radio/ad) |
| 🇦🇴 | Angola | 9 | [ao.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ao.m3u) | [72fm.com/radio/ao](https://72fm.com/radio/ao) |
| 🇦🇮 | Anguilla | 5 | [ai.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ai.m3u) | [72fm.com/radio/ai](https://72fm.com/radio/ai) |
| 🇦🇶 | Antarctica | 9 | [aq.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/aq.m3u) | [72fm.com/radio/aq](https://72fm.com/radio/aq) |
| 🇦🇬 | Antigua \& Barbuda | 5 | [ag.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ag.m3u) | [72fm.com/radio/ag](https://72fm.com/radio/ag) |
| 🇦🇷 | Argentina | 300 of 995 | [ar.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ar.m3u) | [72fm.com/radio/ar](https://72fm.com/radio/ar) |
| 🇦🇲 | Armenia | 13 | [am.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/am.m3u) | [72fm.com/radio/am](https://72fm.com/radio/am) |
| 🇦🇼 | Aruba | 7 | [aw.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/aw.m3u) | [72fm.com/radio/aw](https://72fm.com/radio/aw) |
| 🇦🇺 | Australia | 300 of 1549 | [au.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/au.m3u) | [72fm.com/radio/au](https://72fm.com/radio/au) |
| 🇦🇹 | Austria | 300 of 301 | [at.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/at.m3u) | [72fm.com/radio/at](https://72fm.com/radio/at) |
| 🇦🇿 | Azerbaijan | 34 | [az.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/az.m3u) | [72fm.com/radio/az](https://72fm.com/radio/az) |
| 🇧🇸 | Bahamas | 6 | [bs.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/bs.m3u) | [72fm.com/radio/bs](https://72fm.com/radio/bs) |
| 🇧🇭 | Bahrain | 8 | [bh.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/bh.m3u) | [72fm.com/radio/bh](https://72fm.com/radio/bh) |
| 🇧🇩 | Bangladesh | 22 | [bd.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/bd.m3u) | [72fm.com/radio/bd](https://72fm.com/radio/bd) |
| 🇧🇧 | Barbados | 14 | [bb.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/bb.m3u) | [72fm.com/radio/bb](https://72fm.com/radio/bb) |
| 🇧🇾 | Belarus | 61 | [by.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/by.m3u) | [72fm.com/radio/by](https://72fm.com/radio/by) |
| 🇧🇪 | Belgium | 300 of 433 | [be.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/be.m3u) | [72fm.com/radio/be](https://72fm.com/radio/be) |
| 🇧🇲 | Bermuda | 5 | [bm.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/bm.m3u) | [72fm.com/radio/bm](https://72fm.com/radio/bm) |
| 🇧🇴 | Bolivia | 66 | [bo.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/bo.m3u) | [72fm.com/radio/bo](https://72fm.com/radio/bo) |
| 🇧🇦 | Bosnia \& Herzegovina | 143 | [ba.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ba.m3u) | [72fm.com/radio/ba](https://72fm.com/radio/ba) |
| 🇧🇷 | Brazil | 300 of 1272 | [br.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/br.m3u) | [72fm.com/radio/br](https://72fm.com/radio/br) |
| 🇮🇴 | British Indian Ocean Territory | 5 | [io.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/io.m3u) | [72fm.com/radio/io](https://72fm.com/radio/io) |
| 🇧🇬 | Bulgaria | 300 of 312 | [bg.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/bg.m3u) | [72fm.com/radio/bg](https://72fm.com/radio/bg) |
| 🇰🇭 | Cambodia | 8 | [kh.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/kh.m3u) | [72fm.com/radio/kh](https://72fm.com/radio/kh) |
| 🇨🇦 | Canada | 300 of 1259 | [ca.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ca.m3u) | [72fm.com/radio/ca](https://72fm.com/radio/ca) |
| 🇨🇻 | Cape Verde | 18 | [cv.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/cv.m3u) | [72fm.com/radio/cv](https://72fm.com/radio/cv) |
| 🇧🇶 | Caribbean Netherlands | 11 | [bq.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/bq.m3u) | [72fm.com/radio/bq](https://72fm.com/radio/bq) |
| 🇰🇾 | Cayman Islands | 7 | [ky.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ky.m3u) | [72fm.com/radio/ky](https://72fm.com/radio/ky) |
| 🇨🇱 | Chile | 300 of 474 | [cl.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/cl.m3u) | [72fm.com/radio/cl](https://72fm.com/radio/cl) |
| 🇨🇳 | China | 300 of 1827 | [cn.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/cn.m3u) | [72fm.com/radio/cn](https://72fm.com/radio/cn) |
| 🇨🇴 | Colombia | 300 of 599 | [co.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/co.m3u) | [72fm.com/radio/co](https://72fm.com/radio/co) |
| 🇨🇩 | Congo - Kinshasa | 15 | [cd.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/cd.m3u) | [72fm.com/radio/cd](https://72fm.com/radio/cd) |
| 🇨🇷 | Costa Rica | 49 | [cr.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/cr.m3u) | [72fm.com/radio/cr](https://72fm.com/radio/cr) |
| 🇨🇮 | Côte d’Ivoire | 11 | [ci.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ci.m3u) | [72fm.com/radio/ci](https://72fm.com/radio/ci) |
| 🇭🇷 | Croatia | 254 | [hr.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/hr.m3u) | [72fm.com/radio/hr](https://72fm.com/radio/hr) |
| 🇨🇺 | Cuba | 21 | [cu.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/cu.m3u) | [72fm.com/radio/cu](https://72fm.com/radio/cu) |
| 🇨🇼 | Curaçao | 19 | [cw.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/cw.m3u) | [72fm.com/radio/cw](https://72fm.com/radio/cw) |
| 🇨🇾 | Cyprus | 47 | [cy.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/cy.m3u) | [72fm.com/radio/cy](https://72fm.com/radio/cy) |
| 🇨🇿 | Czechia | 251 | [cz.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/cz.m3u) | [72fm.com/radio/cz](https://72fm.com/radio/cz) |
| 🇩🇰 | Denmark | 207 | [dk.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/dk.m3u) | [72fm.com/radio/dk](https://72fm.com/radio/dk) |
| 🇩🇲 | Dominica | 5 | [dm.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/dm.m3u) | [72fm.com/radio/dm](https://72fm.com/radio/dm) |
| 🇩🇴 | Dominican Republic | 96 | [do.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/do.m3u) | [72fm.com/radio/do](https://72fm.com/radio/do) |
| 🇪🇨 | Ecuador | 145 | [ec.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ec.m3u) | [72fm.com/radio/ec](https://72fm.com/radio/ec) |
| 🇪🇬 | Egypt | 51 | [eg.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/eg.m3u) | [72fm.com/radio/eg](https://72fm.com/radio/eg) |
| 🇸🇻 | El Salvador | 53 | [sv.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/sv.m3u) | [72fm.com/radio/sv](https://72fm.com/radio/sv) |
| 🇪🇪 | Estonia | 96 | [ee.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ee.m3u) | [72fm.com/radio/ee](https://72fm.com/radio/ee) |
| 🇪🇹 | Ethiopia | 23 | [et.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/et.m3u) | [72fm.com/radio/et](https://72fm.com/radio/et) |
| 🇫🇴 | Faroe Islands | 13 | [fo.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/fo.m3u) | [72fm.com/radio/fo](https://72fm.com/radio/fo) |
| 🇫🇮 | Finland | 126 | [fi.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/fi.m3u) | [72fm.com/radio/fi](https://72fm.com/radio/fi) |
| 🇫🇷 | France | 300 of 2620 | [fr.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/fr.m3u) | [72fm.com/radio/fr](https://72fm.com/radio/fr) |
| 🇵🇫 | French Polynesia | 8 | [pf.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/pf.m3u) | [72fm.com/radio/pf](https://72fm.com/radio/pf) |
| 🇬🇪 | Georgia | 27 | [ge.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ge.m3u) | [72fm.com/radio/ge](https://72fm.com/radio/ge) |
| 🇩🇪 | Germany | 300 of 5370 | [de.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/de.m3u) | [72fm.com/radio/de](https://72fm.com/radio/de) |
| 🇬🇭 | Ghana | 85 | [gh.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/gh.m3u) | [72fm.com/radio/gh](https://72fm.com/radio/gh) |
| 🇬🇮 | Gibraltar | 6 | [gi.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/gi.m3u) | [72fm.com/radio/gi](https://72fm.com/radio/gi) |
| 🇬🇷 | Greece | 300 of 1769 | [gr.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/gr.m3u) | [72fm.com/radio/gr](https://72fm.com/radio/gr) |
| 🇬🇱 | Greenland | 5 | [gl.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/gl.m3u) | [72fm.com/radio/gl](https://72fm.com/radio/gl) |
| 🇬🇩 | Grenada | 5 | [gd.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/gd.m3u) | [72fm.com/radio/gd](https://72fm.com/radio/gd) |
| 🇬🇵 | Guadeloupe | 15 | [gp.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/gp.m3u) | [72fm.com/radio/gp](https://72fm.com/radio/gp) |
| 🇬🇺 | Guam | 5 | [gu.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/gu.m3u) | [72fm.com/radio/gu](https://72fm.com/radio/gu) |
| 🇬🇹 | Guatemala | 65 | [gt.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/gt.m3u) | [72fm.com/radio/gt](https://72fm.com/radio/gt) |
| 🇬🇾 | Guyana | 10 | [gy.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/gy.m3u) | [72fm.com/radio/gy](https://72fm.com/radio/gy) |
| 🇭🇹 | Haiti | 31 | [ht.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ht.m3u) | [72fm.com/radio/ht](https://72fm.com/radio/ht) |
| 🇭🇳 | Honduras | 36 | [hn.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/hn.m3u) | [72fm.com/radio/hn](https://72fm.com/radio/hn) |
| 🇭🇰 | Hong Kong SAR China | 63 | [hk.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/hk.m3u) | [72fm.com/radio/hk](https://72fm.com/radio/hk) |
| 🇭🇺 | Hungary | 300 of 318 | [hu.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/hu.m3u) | [72fm.com/radio/hu](https://72fm.com/radio/hu) |
| 🇮🇸 | Iceland | 24 | [is.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/is.m3u) | [72fm.com/radio/is](https://72fm.com/radio/is) |
| 🇮🇳 | India | 300 of 703 | [in.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/in.m3u) | [72fm.com/radio/in](https://72fm.com/radio/in) |
| 🇮🇩 | Indonesia | 300 of 482 | [id.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/id.m3u) | [72fm.com/radio/id](https://72fm.com/radio/id) |
| 🇮🇷 | Iran | 26 | [ir.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ir.m3u) | [72fm.com/radio/ir](https://72fm.com/radio/ir) |
| 🇮🇶 | Iraq | 20 | [iq.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/iq.m3u) | [72fm.com/radio/iq](https://72fm.com/radio/iq) |
| 🇮🇪 | Ireland | 185 | [ie.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ie.m3u) | [72fm.com/radio/ie](https://72fm.com/radio/ie) |
| 🇮🇲 | Isle of Man | 7 | [im.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/im.m3u) | [72fm.com/radio/im](https://72fm.com/radio/im) |
| 🇮🇱 | Israel | 125 | [il.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/il.m3u) | [72fm.com/radio/il](https://72fm.com/radio/il) |
| 🇮🇹 | Italy | 300 of 1525 | [it.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/it.m3u) | [72fm.com/radio/it](https://72fm.com/radio/it) |
| 🇯🇲 | Jamaica | 42 | [jm.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/jm.m3u) | [72fm.com/radio/jm](https://72fm.com/radio/jm) |
| 🇯🇵 | Japan | 106 | [jp.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/jp.m3u) | [72fm.com/radio/jp](https://72fm.com/radio/jp) |
| 🇯🇴 | Jordan | 12 | [jo.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/jo.m3u) | [72fm.com/radio/jo](https://72fm.com/radio/jo) |
| 🇰🇿 | Kazakhstan | 33 | [kz.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/kz.m3u) | [72fm.com/radio/kz](https://72fm.com/radio/kz) |
| 🇰🇪 | Kenya | 46 | [ke.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ke.m3u) | [72fm.com/radio/ke](https://72fm.com/radio/ke) |
| 🇽🇰 | Kosovo | 15 | [xk.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/xk.m3u) | [72fm.com/radio/xk](https://72fm.com/radio/xk) |
| 🇰🇼 | Kuwait | 12 | [kw.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/kw.m3u) | [72fm.com/radio/kw](https://72fm.com/radio/kw) |
| 🇰🇬 | Kyrgyzstan | 6 | [kg.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/kg.m3u) | [72fm.com/radio/kg](https://72fm.com/radio/kg) |
| 🇱🇻 | Latvia | 98 | [lv.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/lv.m3u) | [72fm.com/radio/lv](https://72fm.com/radio/lv) |
| 🇱🇧 | Lebanon | 56 | [lb.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/lb.m3u) | [72fm.com/radio/lb](https://72fm.com/radio/lb) |
| 🇱🇾 | Libya | 6 | [ly.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ly.m3u) | [72fm.com/radio/ly](https://72fm.com/radio/ly) |
| 🇱🇹 | Lithuania | 83 | [lt.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/lt.m3u) | [72fm.com/radio/lt](https://72fm.com/radio/lt) |
| 🇱🇺 | Luxembourg | 30 | [lu.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/lu.m3u) | [72fm.com/radio/lu](https://72fm.com/radio/lu) |
| 🇲🇴 | Macao SAR China | 8 | [mo.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/mo.m3u) | [72fm.com/radio/mo](https://72fm.com/radio/mo) |
| 🇲🇬 | Madagascar | 14 | [mg.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/mg.m3u) | [72fm.com/radio/mg](https://72fm.com/radio/mg) |
| 🇲🇼 | Malawi | 9 | [mw.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/mw.m3u) | [72fm.com/radio/mw](https://72fm.com/radio/mw) |
| 🇲🇾 | Malaysia | 78 | [my.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/my.m3u) | [72fm.com/radio/my](https://72fm.com/radio/my) |
| 🇲🇱 | Mali | 13 | [ml.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ml.m3u) | [72fm.com/radio/ml](https://72fm.com/radio/ml) |
| 🇲🇹 | Malta | 12 | [mt.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/mt.m3u) | [72fm.com/radio/mt](https://72fm.com/radio/mt) |
| 🇲🇶 | Martinique | 10 | [mq.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/mq.m3u) | [72fm.com/radio/mq](https://72fm.com/radio/mq) |
| 🇲🇺 | Mauritius | 14 | [mu.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/mu.m3u) | [72fm.com/radio/mu](https://72fm.com/radio/mu) |
| 🇲🇽 | Mexico | 300 of 1501 | [mx.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/mx.m3u) | [72fm.com/radio/mx](https://72fm.com/radio/mx) |
| 🇲🇩 | Moldova | 76 | [md.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/md.m3u) | [72fm.com/radio/md](https://72fm.com/radio/md) |
| 🇲🇨 | Monaco | 6 | [mc.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/mc.m3u) | [72fm.com/radio/mc](https://72fm.com/radio/mc) |
| 🇲🇳 | Mongolia | 7 | [mn.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/mn.m3u) | [72fm.com/radio/mn](https://72fm.com/radio/mn) |
| 🇲🇪 | Montenegro | 42 | [me.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/me.m3u) | [72fm.com/radio/me](https://72fm.com/radio/me) |
| 🇲🇦 | Morocco | 52 | [ma.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ma.m3u) | [72fm.com/radio/ma](https://72fm.com/radio/ma) |
| 🇲🇿 | Mozambique | 7 | [mz.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/mz.m3u) | [72fm.com/radio/mz](https://72fm.com/radio/mz) |
| 🇳🇦 | Namibia | 13 | [na.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/na.m3u) | [72fm.com/radio/na](https://72fm.com/radio/na) |
| 🇳🇵 | Nepal | 142 | [np.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/np.m3u) | [72fm.com/radio/np](https://72fm.com/radio/np) |
| 🇳🇱 | Netherlands | 300 of 1119 | [nl.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/nl.m3u) | [72fm.com/radio/nl](https://72fm.com/radio/nl) |
| 🇳🇨 | New Caledonia | 7 | [nc.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/nc.m3u) | [72fm.com/radio/nc](https://72fm.com/radio/nc) |
| 🇳🇿 | New Zealand | 194 | [nz.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/nz.m3u) | [72fm.com/radio/nz](https://72fm.com/radio/nz) |
| 🇳🇮 | Nicaragua | 22 | [ni.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ni.m3u) | [72fm.com/radio/ni](https://72fm.com/radio/ni) |
| 🇳🇬 | Nigeria | 65 | [ng.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ng.m3u) | [72fm.com/radio/ng](https://72fm.com/radio/ng) |
| 🇰🇵 | North Korea | 7 | [kp.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/kp.m3u) | [72fm.com/radio/kp](https://72fm.com/radio/kp) |
| 🇲🇰 | North Macedonia | 43 | [mk.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/mk.m3u) | [72fm.com/radio/mk](https://72fm.com/radio/mk) |
| 🇳🇴 | Norway | 114 | [no.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/no.m3u) | [72fm.com/radio/no](https://72fm.com/radio/no) |
| 🇴🇲 | Oman | 7 | [om.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/om.m3u) | [72fm.com/radio/om](https://72fm.com/radio/om) |
| 🇵🇰 | Pakistan | 53 | [pk.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/pk.m3u) | [72fm.com/radio/pk](https://72fm.com/radio/pk) |
| 🇵🇸 | Palestinian Territories | 8 | [ps.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ps.m3u) | [72fm.com/radio/ps](https://72fm.com/radio/ps) |
| 🇵🇦 | Panama | 30 | [pa.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/pa.m3u) | [72fm.com/radio/pa](https://72fm.com/radio/pa) |
| 🇵🇾 | Paraguay | 61 | [py.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/py.m3u) | [72fm.com/radio/py](https://72fm.com/radio/py) |
| 🇵🇪 | Peru | 285 | [pe.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/pe.m3u) | [72fm.com/radio/pe](https://72fm.com/radio/pe) |
| 🇵🇭 | Philippines | 300 of 604 | [ph.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ph.m3u) | [72fm.com/radio/ph](https://72fm.com/radio/ph) |
| 🇵🇱 | Poland | 300 of 868 | [pl.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/pl.m3u) | [72fm.com/radio/pl](https://72fm.com/radio/pl) |
| 🇵🇹 | Portugal | 300 of 319 | [pt.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/pt.m3u) | [72fm.com/radio/pt](https://72fm.com/radio/pt) |
| 🇵🇷 | Puerto Rico | 47 | [pr.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/pr.m3u) | [72fm.com/radio/pr](https://72fm.com/radio/pr) |
| 🇶🇦 | Qatar | 15 | [qa.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/qa.m3u) | [72fm.com/radio/qa](https://72fm.com/radio/qa) |
| 🇷🇪 | Réunion | 35 | [re.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/re.m3u) | [72fm.com/radio/re](https://72fm.com/radio/re) |
| 🇷🇴 | Romania | 300 of 849 | [ro.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ro.m3u) | [72fm.com/radio/ro](https://72fm.com/radio/ro) |
| 🇷🇺 | Russia | 300 of 2270 | [ru.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ru.m3u) | [72fm.com/radio/ru](https://72fm.com/radio/ru) |
| 🇷🇼 | Rwanda | 8 | [rw.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/rw.m3u) | [72fm.com/radio/rw](https://72fm.com/radio/rw) |
| 🇸🇲 | San Marino | 5 | [sm.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/sm.m3u) | [72fm.com/radio/sm](https://72fm.com/radio/sm) |
| 🇸🇦 | Saudi Arabia | 58 | [sa.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/sa.m3u) | [72fm.com/radio/sa](https://72fm.com/radio/sa) |
| 🇸🇳 | Senegal | 32 | [sn.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/sn.m3u) | [72fm.com/radio/sn](https://72fm.com/radio/sn) |
| 🇷🇸 | Serbia | 300 of 346 | [rs.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/rs.m3u) | [72fm.com/radio/rs](https://72fm.com/radio/rs) |
| 🇸🇬 | Singapore | 59 | [sg.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/sg.m3u) | [72fm.com/radio/sg](https://72fm.com/radio/sg) |
| 🇸🇰 | Slovakia | 121 | [sk.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/sk.m3u) | [72fm.com/radio/sk](https://72fm.com/radio/sk) |
| 🇸🇮 | Slovenia | 120 | [si.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/si.m3u) | [72fm.com/radio/si](https://72fm.com/radio/si) |
| 🇿🇦 | South Africa | 183 | [za.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/za.m3u) | [72fm.com/radio/za](https://72fm.com/radio/za) |
| 🇰🇷 | South Korea | 101 | [kr.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/kr.m3u) | [72fm.com/radio/kr](https://72fm.com/radio/kr) |
| 🇪🇸 | Spain | 300 of 1114 | [es.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/es.m3u) | [72fm.com/radio/es](https://72fm.com/radio/es) |
| 🇱🇰 | Sri Lanka | 62 | [lk.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/lk.m3u) | [72fm.com/radio/lk](https://72fm.com/radio/lk) |
| 🇱🇨 | St. Lucia | 13 | [lc.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/lc.m3u) | [72fm.com/radio/lc](https://72fm.com/radio/lc) |
| 🇻🇨 | St. Vincent \& Grenadines | 12 | [vc.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/vc.m3u) | [72fm.com/radio/vc](https://72fm.com/radio/vc) |
| 🇸🇷 | Suriname | 6 | [sr.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/sr.m3u) | [72fm.com/radio/sr](https://72fm.com/radio/sr) |
| 🇸🇪 | Sweden | 218 | [se.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/se.m3u) | [72fm.com/radio/se](https://72fm.com/radio/se) |
| 🇨🇭 | Switzerland | 300 of 505 | [ch.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ch.m3u) | [72fm.com/radio/ch](https://72fm.com/radio/ch) |
| 🇸🇾 | Syria | 24 | [sy.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/sy.m3u) | [72fm.com/radio/sy](https://72fm.com/radio/sy) |
| 🇹🇼 | Taiwan | 167 | [tw.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/tw.m3u) | [72fm.com/radio/tw](https://72fm.com/radio/tw) |
| 🇹🇿 | Tanzania | 15 | [tz.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/tz.m3u) | [72fm.com/radio/tz](https://72fm.com/radio/tz) |
| 🇹🇭 | Thailand | 93 | [th.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/th.m3u) | [72fm.com/radio/th](https://72fm.com/radio/th) |
| 🇹🇬 | Togo | 6 | [tg.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/tg.m3u) | [72fm.com/radio/tg](https://72fm.com/radio/tg) |
| 🇹🇹 | Trinidad \& Tobago | 22 | [tt.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/tt.m3u) | [72fm.com/radio/tt](https://72fm.com/radio/tt) |
| 🇹🇳 | Tunisia | 45 | [tn.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/tn.m3u) | [72fm.com/radio/tn](https://72fm.com/radio/tn) |
| 🇹🇷 | Türkiye | 300 of 639 | [tr.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/tr.m3u) | [72fm.com/radio/tr](https://72fm.com/radio/tr) |
| 🇺🇲 | U.S. Outlying Islands | 25 | [um.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/um.m3u) | [72fm.com/radio/um](https://72fm.com/radio/um) |
| 🇻🇮 | U.S. Virgin Islands | 8 | [vi.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/vi.m3u) | [72fm.com/radio/vi](https://72fm.com/radio/vi) |
| 🇺🇬 | Uganda | 109 | [ug.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ug.m3u) | [72fm.com/radio/ug](https://72fm.com/radio/ug) |
| 🇺🇦 | Ukraine | 249 | [ua.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ua.m3u) | [72fm.com/radio/ua](https://72fm.com/radio/ua) |
| 🇦🇪 | United Arab Emirates | 300 of 689 | [ae.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ae.m3u) | [72fm.com/radio/ae](https://72fm.com/radio/ae) |
| 🇬🇧 | United Kingdom | 300 of 1887 | [gb.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/gb.m3u) | [72fm.com/radio/gb](https://72fm.com/radio/gb) |
| 🇺🇸 | United States | 300 of 6169 | [us.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/us.m3u) | [72fm.com/radio/us](https://72fm.com/radio/us) |
| 🇺🇾 | Uruguay | 123 | [uy.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/uy.m3u) | [72fm.com/radio/uy](https://72fm.com/radio/uy) |
| 🇺🇿 | Uzbekistan | 9 | [uz.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/uz.m3u) | [72fm.com/radio/uz](https://72fm.com/radio/uz) |
| 🇻🇦 | Vatican City | 13 | [va.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/va.m3u) | [72fm.com/radio/va](https://72fm.com/radio/va) |
| 🇻🇪 | Venezuela | 145 | [ve.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ve.m3u) | [72fm.com/radio/ve](https://72fm.com/radio/ve) |
| 🇻🇳 | Vietnam | 27 | [vn.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/vn.m3u) | [72fm.com/radio/vn](https://72fm.com/radio/vn) |
| 🇾🇪 | Yemen | 14 | [ye.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ye.m3u) | [72fm.com/radio/ye](https://72fm.com/radio/ye) |
| 🇿🇲 | Zambia | 6 | [zm.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/zm.m3u) | [72fm.com/radio/zm](https://72fm.com/radio/zm) |

## Build it yourself

Needs Node.js 22 or newer, no dependencies:

```sh
node scripts/build.mjs
```

The script queries the Radio Browser API (`de1`, then `de2`, then `all` mirrors)
with the user agent `72FM-playlists/1.0 (+https://72fm.com)`. It also writes the static browsing site in
`docs/` (served by GitHub Pages). A GitHub Actions workflow runs it every Monday
and commits the result. It refuses to write anything if the directory returns
unusually few stations (under 40,000, or more than 15% fewer than the last build),
so a bad API day cannot empty the playlists. If the directory really did shrink,
run the workflow by hand with its `allow_shrink` option (locally: `ALLOW_SHRINK=1`). Station
data from the directory is treated as untrusted input; see the list above.

## License

- Playlists, `index.json` and README tables: [CC0 1.0](LICENSE-DATA) (public domain
  dedication), matching the public-domain status of the Radio Browser data.
- `scripts/` and workflow code: [MIT](LICENSE).
- Station names, logos and streams remain the property of the respective stations.
  This repository only lists links to them.

Made by [72FM](https://72fm.com), a free web radio player built on the same directory.
