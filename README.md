# Internet radio M3U playlists by country and genre

Free, weekly-updated **M3U playlists of internet radio stations**: one per country,
one per genre and a top-500 list. They open in VLC, mpv, pyradio and most
other players that read M3U, and are easy to parse on an ESP32 or Raspberry Pi radio.

- **51,329** working, de-duplicated stations in the source directory at the last build
- **172** country playlists, **60** genre playlists, [top 500](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/top/top-500.m3u)
- Last build: **2026-10-26** (rebuilt every Monday)
- Machine-readable list of every playlist: [`index.json`](index.json)
- Browse online, one page per country and genre: **[https://alondrilich.github.io/radio-playlists/](https://alondrilich.github.io/radio-playlists/)**

Listen in the browser, no install: **https://72fm.com**

## Related tools

- [internet-radio-mcp](https://github.com/AlonDrilich/internet-radio-mcp): lets Claude, Cursor and other AI assistants search the same directory and return stream URLs.
- [radio-player-72fm](https://github.com/AlonDrilich/radio-player-72fm): a WordPress plugin that puts a station's player on any post or page.
- [Radio stream URL finder](https://72fm.com/radio-stream-url-finder): type a station's name, get the address of its stream to copy or download as a one-station .m3u.
- [Radio M3U playlist maker](https://72fm.com/radio-m3u-playlist-maker): pick your own stations by country, genre or name and download them as one .m3u.
- [72FM radio widget](https://72fm.com/radio-widget): copy-and-paste player for any website. All tools: [72fm.com/developers](https://72fm.com/developers).

## Euro Truck Simulator 2 and American Truck Simulator

Every country also gets a ready-made `live_streams.sii` for the games' internet radio, in
[`ets2/<country>/`](ets2/): up to 100 of its most-voted stations, and only ones the games can
play (MP3 and Ogg streams; AAC stations, playlist addresses and https on unusual ports are left out).
Rename the `live_streams.sii` in your `Documents/Euro Truck Simulator 2` (or
`American Truck Simulator`) folder, put the downloaded one in its place, and start the game.
The **ETS2 / ATS** column in the country table below links each file. To pick your own stations from
several countries, use the [ETS2 and ATS radio list builder](https://72fm.com/ets2-ats-radio-stations).
All countries on one page: [ETS2 and ATS radio stations by country](https://alondrilich.github.io/radio-playlists/ets2/).

## Farming Simulator and Garry's Mod

The same weekly build also writes, per country: (all countries on one page: [Farming Simulator](https://alondrilich.github.io/radio-playlists/farming-simulator/) · [Garry's Mod](https://alondrilich.github.io/radio-playlists/garrys-mod/))

- [`farming-simulator/<country>/streamingInternetRadios.xml`](farming-simulator/): up to 100 MP3 stations for
  Farming Simulator 25 and 22. Put it in `Documents/My Games/FarmingSimulator2025/music` (keep a copy of the file
  already there). Builder: [72fm.com/farming-simulator-radio-stations](https://72fm.com/farming-simulator-radio-stations).
- [`garrys-mod/<country>-radio_pls.txt`](garrys-mod/): a 3D Stream Radio playlist (MP3, OGG, AAC, FLAC) for a server's
  `garrysmod/data/streamradio/playlists` folder. On multiplayer the radio plays only addresses in these playlists, so the
  file also whitelists the stations; run `sv_streamradio_url_whitelist_reload` after adding it. Builder:
  [72fm.com/garrys-mod-radio-stations](https://72fm.com/garrys-mod-radio-stations).

## Mentioned in

- [The SWLing Post, "Radio Waves", 11 October 2026](https://swling.com/blog/2026/10/radio-waves-saq-un-day-broadcast-test-transmission-radio-bulgaria-qsl-10-liblice-transmitter-masts-demolition-and-source-for-streaming-station-urls/): listed as a source of stream URLs for Wi-Fi radios.

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
# 72FM: https://72fm.com/station/<stationuuid>?source=m3u
#EXTINF:-1 tvg-logo="https://…/logo.png" group-title="Germany" radio="true",Station name
https://stream.example.com/live.mp3
```

The `# 72FM:` line is a plain M3U comment that links to the station's page on
72fm.com (the `?source=m3u` only tells 72FM the visit came from a playlist file; it
carries no id). In the M3U format, lines that start with `#` and are not a directive the
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

**WiiM** – in the WiiM Home app, open **Browse → Open Network Stream → Import Streams**
and pick a playlist you downloaded to your phone; WiiM imports `.m3u` files as a list of
stations. Step-by-step: [72fm.com/guide/wiim-add-radio-station](https://72fm.com/guide/wiim-add-radio-station).

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
worldwide. The same list as a page, with each station's country: [https://alondrilich.github.io/radio-playlists/top/](https://alondrilich.github.io/radio-playlists/top/).

## Genres

Station counts are "in this file of all that matched" when a genre has more than
300. A genre's or country's name opens its station list as a page; the last column links
to the matching page on 72FM where one exists.

| Genre | Stations | Playlist | Listen on 72FM |
|---|---|---|---|
| [2000s](https://alondrilich.github.io/radio-playlists/genre/2000s/) | 300 of 354 | [2000s.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/2000s.m3u) | — |
| [60s](https://alondrilich.github.io/radio-playlists/genre/60s/) | 291 | [60s.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/60s.m3u) | [72fm.com/genre/60s](https://72fm.com/genre/60s) |
| [70s](https://alondrilich.github.io/radio-playlists/genre/70s/) | 300 of 586 | [70s.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/70s.m3u) | [72fm.com/genre/70s](https://72fm.com/genre/70s) |
| [80s](https://alondrilich.github.io/radio-playlists/genre/80s/) | 300 of 1207 | [80s.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/80s.m3u) | [72fm.com/genre/80s](https://72fm.com/genre/80s) |
| [90s](https://alondrilich.github.io/radio-playlists/genre/90s/) | 300 of 934 | [90s.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/90s.m3u) | [72fm.com/genre/90s](https://72fm.com/genre/90s) |
| [Adult Contemporary](https://alondrilich.github.io/radio-playlists/genre/adult-contemporary/) | 300 of 853 | [adult-contemporary.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/adult-contemporary.m3u) | — |
| [Alternative](https://alondrilich.github.io/radio-playlists/genre/alternative/) | 300 of 775 | [alternative.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/alternative.m3u) | [72fm.com/genre/alternative](https://72fm.com/genre/alternative) |
| [Ambient](https://alondrilich.github.io/radio-playlists/genre/ambient/) | 300 of 351 | [ambient.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/ambient.m3u) | [72fm.com/genre/ambient](https://72fm.com/genre/ambient) |
| [Blues](https://alondrilich.github.io/radio-playlists/genre/blues/) | 300 | [blues.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/blues.m3u) | [72fm.com/genre/blues](https://72fm.com/genre/blues) |
| [Chill \& Relax](https://alondrilich.github.io/radio-playlists/genre/chill/) | 300 of 381 | [chill.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/chill.m3u) | [72fm.com/genre/chill](https://72fm.com/genre/chill) |
| [Chillout](https://alondrilich.github.io/radio-playlists/genre/chillout/) | 300 of 381 | [chillout.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/chillout.m3u) | [72fm.com/genre/chillout](https://72fm.com/genre/chillout) |
| [Christian](https://alondrilich.github.io/radio-playlists/genre/christian/) | 300 of 936 | [christian.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/christian.m3u) | [72fm.com/genre/christian](https://72fm.com/genre/christian) |
| [Christmas](https://alondrilich.github.io/radio-playlists/genre/christmas/) | 235 | [christmas.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/christmas.m3u) | — |
| [Classic Hits](https://alondrilich.github.io/radio-playlists/genre/classic-hits/) | 300 of 638 | [classic-hits.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/classic-hits.m3u) | — |
| [Classic Rock](https://alondrilich.github.io/radio-playlists/genre/classic-rock/) | 300 of 741 | [classic-rock.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/classic-rock.m3u) | [72fm.com/genre/classic-rock](https://72fm.com/genre/classic-rock) |
| [Classical](https://alondrilich.github.io/radio-playlists/genre/classical/) | 300 of 1227 | [classical.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/classical.m3u) | [72fm.com/genre/classical](https://72fm.com/genre/classical) |
| [Country](https://alondrilich.github.io/radio-playlists/genre/country/) | 300 of 650 | [country.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/country.m3u) | [72fm.com/genre/country](https://72fm.com/genre/country) |
| [Cumbia](https://alondrilich.github.io/radio-playlists/genre/cumbia/) | 144 | [cumbia.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/cumbia.m3u) | [72fm.com/genre/cumbia](https://72fm.com/genre/cumbia) |
| [Dance](https://alondrilich.github.io/radio-playlists/genre/dance/) | 300 of 1376 | [dance.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/dance.m3u) | [72fm.com/genre/dance](https://72fm.com/genre/dance) |
| [Deep House](https://alondrilich.github.io/radio-playlists/genre/deep-house/) | 184 | [deep-house.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/deep-house.m3u) | [72fm.com/genre/deep-house](https://72fm.com/genre/deep-house) |
| [Disco](https://alondrilich.github.io/radio-playlists/genre/disco/) | 300 of 303 | [disco.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/disco.m3u) | [72fm.com/genre/disco](https://72fm.com/genre/disco) |
| [Drum and Bass](https://alondrilich.github.io/radio-playlists/genre/drum-and-bass/) | 136 | [drum-and-bass.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/drum-and-bass.m3u) | [72fm.com/genre/drum-and-bass](https://72fm.com/genre/drum-and-bass) |
| [Easy Listening](https://alondrilich.github.io/radio-playlists/genre/easy-listening/) | 300 of 309 | [easy-listening.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/easy-listening.m3u) | [72fm.com/genre/easy-listening](https://72fm.com/genre/easy-listening) |
| [EDM](https://alondrilich.github.io/radio-playlists/genre/edm/) | 209 | [edm.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/edm.m3u) | [72fm.com/genre/edm](https://72fm.com/genre/edm) |
| [Electronic](https://alondrilich.github.io/radio-playlists/genre/electronic/) | 300 of 1123 | [electronic.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/electronic.m3u) | [72fm.com/genre/electronic](https://72fm.com/genre/electronic) |
| [Folk](https://alondrilich.github.io/radio-playlists/genre/folk/) | 300 of 655 | [folk.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/folk.m3u) | [72fm.com/genre/folk](https://72fm.com/genre/folk) |
| [Funk](https://alondrilich.github.io/radio-playlists/genre/funk/) | 285 | [funk.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/funk.m3u) | [72fm.com/genre/funk](https://72fm.com/genre/funk) |
| [Gospel](https://alondrilich.github.io/radio-playlists/genre/gospel/) | 300 of 345 | [gospel.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/gospel.m3u) | [72fm.com/genre/gospel](https://72fm.com/genre/gospel) |
| [Hard Rock](https://alondrilich.github.io/radio-playlists/genre/hard-rock/) | 210 | [hard-rock.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/hard-rock.m3u) | [72fm.com/genre/hard-rock](https://72fm.com/genre/hard-rock) |
| [Hip-Hop \& Rap](https://alondrilich.github.io/radio-playlists/genre/hip-hop/) | 300 of 689 | [hip-hop.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/hip-hop.m3u) | [72fm.com/genre/hip-hop](https://72fm.com/genre/hip-hop) |
| [House](https://alondrilich.github.io/radio-playlists/genre/house/) | 300 of 631 | [house.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/house.m3u) | [72fm.com/genre/house](https://72fm.com/genre/house) |
| [Indie](https://alondrilich.github.io/radio-playlists/genre/indie/) | 300 of 462 | [indie.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/indie.m3u) | [72fm.com/genre/indie](https://72fm.com/genre/indie) |
| [Instrumental](https://alondrilich.github.io/radio-playlists/genre/instrumental/) | 183 | [instrumental.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/instrumental.m3u) | [72fm.com/genre/instrumental](https://72fm.com/genre/instrumental) |
| [Jazz](https://alondrilich.github.io/radio-playlists/genre/jazz/) | 300 of 1023 | [jazz.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/jazz.m3u) | [72fm.com/genre/jazz](https://72fm.com/genre/jazz) |
| [Kids](https://alondrilich.github.io/radio-playlists/genre/kids/) | 148 | [kids.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/kids.m3u) | [72fm.com/genre/kids](https://72fm.com/genre/kids) |
| [Latin](https://alondrilich.github.io/radio-playlists/genre/latin/) | 300 of 432 | [latin.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/latin.m3u) | [72fm.com/genre/latin](https://72fm.com/genre/latin) |
| [Lounge](https://alondrilich.github.io/radio-playlists/genre/lounge/) | 283 | [lounge.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/lounge.m3u) | [72fm.com/genre/lounge](https://72fm.com/genre/lounge) |
| [Metal](https://alondrilich.github.io/radio-playlists/genre/metal/) | 300 of 469 | [metal.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/metal.m3u) | [72fm.com/genre/metal](https://72fm.com/genre/metal) |
| [News](https://alondrilich.github.io/radio-playlists/genre/news/) | 300 of 3453 | [news.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/news.m3u) | [72fm.com/genre/news](https://72fm.com/genre/news) |
| [Oldies](https://alondrilich.github.io/radio-playlists/genre/oldies/) | 300 of 1111 | [oldies.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/oldies.m3u) | [72fm.com/genre/oldies](https://72fm.com/genre/oldies) |
| [Pop](https://alondrilich.github.io/radio-playlists/genre/pop/) | 300 of 5098 | [pop.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/pop.m3u) | [72fm.com/genre/pop](https://72fm.com/genre/pop) |
| [Punk](https://alondrilich.github.io/radio-playlists/genre/punk/) | 181 | [punk.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/punk.m3u) | [72fm.com/genre/punk](https://72fm.com/genre/punk) |
| [R\&B](https://alondrilich.github.io/radio-playlists/genre/r-and-b/) | 300 of 356 | [r-and-b.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/r-and-b.m3u) | [72fm.com/genre/r-and-b](https://72fm.com/genre/r-and-b) |
| [Ranchera](https://alondrilich.github.io/radio-playlists/genre/ranchera/) | 36 | [ranchera.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/ranchera.m3u) | [72fm.com/genre/ranchera](https://72fm.com/genre/ranchera) |
| [Reggae](https://alondrilich.github.io/radio-playlists/genre/reggae/) | 224 | [reggae.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/reggae.m3u) | [72fm.com/genre/reggae](https://72fm.com/genre/reggae) |
| [Reggaeton](https://alondrilich.github.io/radio-playlists/genre/reggaeton/) | 169 | [reggaeton.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/reggaeton.m3u) | [72fm.com/genre/reggaeton](https://72fm.com/genre/reggaeton) |
| [Regional Mexican](https://alondrilich.github.io/radio-playlists/genre/regional-mexican/) | 130 | [regional-mexican.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/regional-mexican.m3u) | [72fm.com/genre/regional-mexican](https://72fm.com/genre/regional-mexican) |
| [Religious](https://alondrilich.github.io/radio-playlists/genre/religious/) | 300 of 598 | [religious.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/religious.m3u) | — |
| [Rock](https://alondrilich.github.io/radio-playlists/genre/rock/) | 300 of 2562 | [rock.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/rock.m3u) | [72fm.com/genre/rock](https://72fm.com/genre/rock) |
| [Salsa](https://alondrilich.github.io/radio-playlists/genre/salsa/) | 236 | [salsa.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/salsa.m3u) | [72fm.com/genre/salsa](https://72fm.com/genre/salsa) |
| [Schlager](https://alondrilich.github.io/radio-playlists/genre/schlager/) | 214 | [schlager.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/schlager.m3u) | [72fm.com/genre/schlager](https://72fm.com/genre/schlager) |
| [Smooth Jazz](https://alondrilich.github.io/radio-playlists/genre/smooth-jazz/) | 217 | [smooth-jazz.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/smooth-jazz.m3u) | [72fm.com/genre/smooth-jazz](https://72fm.com/genre/smooth-jazz) |
| [Soul](https://alondrilich.github.io/radio-playlists/genre/soul/) | 300 of 396 | [soul.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/soul.m3u) | [72fm.com/genre/soul](https://72fm.com/genre/soul) |
| [Sports](https://alondrilich.github.io/radio-playlists/genre/sports/) | 300 of 548 | [sports.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/sports.m3u) | — |
| [Talk](https://alondrilich.github.io/radio-playlists/genre/talk/) | 300 of 1961 | [talk.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/talk.m3u) | [72fm.com/genre/talk](https://72fm.com/genre/talk) |
| [Techno](https://alondrilich.github.io/radio-playlists/genre/techno/) | 300 of 313 | [techno.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/techno.m3u) | [72fm.com/genre/techno](https://72fm.com/genre/techno) |
| [Top 40 \& Hits](https://alondrilich.github.io/radio-playlists/genre/top-40/) | 300 of 2096 | [top-40.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/top-40.m3u) | — |
| [Trance](https://alondrilich.github.io/radio-playlists/genre/trance/) | 230 | [trance.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/trance.m3u) | [72fm.com/genre/trance](https://72fm.com/genre/trance) |
| [Tropical](https://alondrilich.github.io/radio-playlists/genre/tropical/) | 159 | [tropical.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/tropical.m3u) | — |
| [World Music](https://alondrilich.github.io/radio-playlists/genre/world/) | 291 | [world.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/genres/world.m3u) | [72fm.com/genre/world](https://72fm.com/genre/world) |

## Countries

| | Country | Stations | Playlist | ETS2 / ATS | Listen on 72FM |
|---|---|---|---|---|---|
| 🇦🇫 | [Afghanistan](https://alondrilich.github.io/radio-playlists/country/af/) | 72 | [af.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/af.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/af/live_streams.sii) | — |
| 🇦🇱 | [Albania](https://alondrilich.github.io/radio-playlists/country/al/) | 98 | [al.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/al.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/al/live_streams.sii) | [72fm.com/radio/al](https://72fm.com/radio/al) |
| 🇩🇿 | [Algeria](https://alondrilich.github.io/radio-playlists/country/dz/) | 102 | [dz.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/dz.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/dz/live_streams.sii) | [72fm.com/radio/dz](https://72fm.com/radio/dz) |
| 🇦🇸 | [American Samoa](https://alondrilich.github.io/radio-playlists/country/as/) | 7 | [as.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/as.m3u) | — | — |
| 🇦🇩 | [Andorra](https://alondrilich.github.io/radio-playlists/country/ad/) | 8 | [ad.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ad.m3u) | — | — |
| 🇦🇴 | [Angola](https://alondrilich.github.io/radio-playlists/country/ao/) | 64 | [ao.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ao.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/ao/live_streams.sii) | [72fm.com/radio/ao](https://72fm.com/radio/ao) |
| 🇦🇮 | [Anguilla](https://alondrilich.github.io/radio-playlists/country/ai/) | 5 | [ai.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ai.m3u) | — | [72fm.com/radio/ai](https://72fm.com/radio/ai) |
| 🇦🇶 | [Antarctica](https://alondrilich.github.io/radio-playlists/country/aq/) | 9 | [aq.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/aq.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/aq/live_streams.sii) | — |
| 🇦🇬 | [Antigua \& Barbuda](https://alondrilich.github.io/radio-playlists/country/ag/) | 5 | [ag.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ag.m3u) | — | [72fm.com/radio/ag](https://72fm.com/radio/ag) |
| 🇦🇷 | [Argentina](https://alondrilich.github.io/radio-playlists/country/ar/) | 300 of 1020 | [ar.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ar.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/ar/live_streams.sii) | [72fm.com/radio/ar](https://72fm.com/radio/ar) |
| 🇦🇲 | [Armenia](https://alondrilich.github.io/radio-playlists/country/am/) | 13 | [am.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/am.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/am/live_streams.sii) | [72fm.com/radio/am](https://72fm.com/radio/am) |
| 🇦🇼 | [Aruba](https://alondrilich.github.io/radio-playlists/country/aw/) | 8 | [aw.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/aw.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/aw/live_streams.sii) | [72fm.com/radio/aw](https://72fm.com/radio/aw) |
| 🇦🇺 | [Australia](https://alondrilich.github.io/radio-playlists/country/au/) | 300 of 1557 | [au.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/au.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/au/live_streams.sii) | [72fm.com/radio/au](https://72fm.com/radio/au) |
| 🇦🇹 | [Austria](https://alondrilich.github.io/radio-playlists/country/at/) | 300 of 306 | [at.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/at.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/at/live_streams.sii) | [72fm.com/radio/at](https://72fm.com/radio/at) |
| 🇦🇿 | [Azerbaijan](https://alondrilich.github.io/radio-playlists/country/az/) | 38 | [az.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/az.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/az/live_streams.sii) | [72fm.com/radio/az](https://72fm.com/radio/az) |
| 🇧🇸 | [Bahamas](https://alondrilich.github.io/radio-playlists/country/bs/) | 8 | [bs.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/bs.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/bs/live_streams.sii) | [72fm.com/radio/bs](https://72fm.com/radio/bs) |
| 🇧🇭 | [Bahrain](https://alondrilich.github.io/radio-playlists/country/bh/) | 8 | [bh.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/bh.m3u) | — | [72fm.com/radio/bh](https://72fm.com/radio/bh) |
| 🇧🇩 | [Bangladesh](https://alondrilich.github.io/radio-playlists/country/bd/) | 25 | [bd.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/bd.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/bd/live_streams.sii) | [72fm.com/radio/bd](https://72fm.com/radio/bd) |
| 🇧🇧 | [Barbados](https://alondrilich.github.io/radio-playlists/country/bb/) | 14 | [bb.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/bb.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/bb/live_streams.sii) | [72fm.com/radio/bb](https://72fm.com/radio/bb) |
| 🇧🇾 | [Belarus](https://alondrilich.github.io/radio-playlists/country/by/) | 62 | [by.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/by.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/by/live_streams.sii) | [72fm.com/radio/by](https://72fm.com/radio/by) |
| 🇧🇪 | [Belgium](https://alondrilich.github.io/radio-playlists/country/be/) | 300 of 443 | [be.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/be.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/be/live_streams.sii) | [72fm.com/radio/be](https://72fm.com/radio/be) |
| 🇧🇲 | [Bermuda](https://alondrilich.github.io/radio-playlists/country/bm/) | 5 | [bm.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/bm.m3u) | — | [72fm.com/radio/bm](https://72fm.com/radio/bm) |
| 🇧🇴 | [Bolivia](https://alondrilich.github.io/radio-playlists/country/bo/) | 67 | [bo.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/bo.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/bo/live_streams.sii) | [72fm.com/radio/bo](https://72fm.com/radio/bo) |
| 🇧🇦 | [Bosnia \& Herzegovina](https://alondrilich.github.io/radio-playlists/country/ba/) | 140 | [ba.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ba.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/ba/live_streams.sii) | [72fm.com/radio/ba](https://72fm.com/radio/ba) |
| 🇧🇷 | [Brazil](https://alondrilich.github.io/radio-playlists/country/br/) | 300 of 1350 | [br.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/br.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/br/live_streams.sii) | [72fm.com/radio/br](https://72fm.com/radio/br) |
| 🇧🇬 | [Bulgaria](https://alondrilich.github.io/radio-playlists/country/bg/) | 300 of 323 | [bg.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/bg.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/bg/live_streams.sii) | [72fm.com/radio/bg](https://72fm.com/radio/bg) |
| 🇰🇭 | [Cambodia](https://alondrilich.github.io/radio-playlists/country/kh/) | 9 | [kh.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/kh.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/kh/live_streams.sii) | [72fm.com/radio/kh](https://72fm.com/radio/kh) |
| 🇨🇲 | [Cameroon](https://alondrilich.github.io/radio-playlists/country/cm/) | 48 | [cm.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/cm.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/cm/live_streams.sii) | [72fm.com/radio/cm](https://72fm.com/radio/cm) |
| 🇨🇦 | [Canada](https://alondrilich.github.io/radio-playlists/country/ca/) | 300 of 1306 | [ca.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ca.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/ca/live_streams.sii) | [72fm.com/radio/ca](https://72fm.com/radio/ca) |
| 🇨🇻 | [Cape Verde](https://alondrilich.github.io/radio-playlists/country/cv/) | 18 | [cv.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/cv.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/cv/live_streams.sii) | [72fm.com/radio/cv](https://72fm.com/radio/cv) |
| 🇧🇶 | [Caribbean Netherlands](https://alondrilich.github.io/radio-playlists/country/bq/) | 12 | [bq.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/bq.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/bq/live_streams.sii) | [72fm.com/radio/bq](https://72fm.com/radio/bq) |
| 🇰🇾 | [Cayman Islands](https://alondrilich.github.io/radio-playlists/country/ky/) | 8 | [ky.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ky.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/ky/live_streams.sii) | [72fm.com/radio/ky](https://72fm.com/radio/ky) |
| 🇨🇱 | [Chile](https://alondrilich.github.io/radio-playlists/country/cl/) | 300 of 489 | [cl.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/cl.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/cl/live_streams.sii) | [72fm.com/radio/cl](https://72fm.com/radio/cl) |
| 🇨🇳 | [China](https://alondrilich.github.io/radio-playlists/country/cn/) | 300 of 1953 | [cn.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/cn.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/cn/live_streams.sii) | [72fm.com/radio/cn](https://72fm.com/radio/cn) |
| 🇨🇴 | [Colombia](https://alondrilich.github.io/radio-playlists/country/co/) | 300 of 661 | [co.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/co.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/co/live_streams.sii) | [72fm.com/radio/co](https://72fm.com/radio/co) |
| 🇨🇩 | [Congo - Kinshasa](https://alondrilich.github.io/radio-playlists/country/cd/) | 13 | [cd.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/cd.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/cd/live_streams.sii) | [72fm.com/radio/cd](https://72fm.com/radio/cd) |
| 🇨🇷 | [Costa Rica](https://alondrilich.github.io/radio-playlists/country/cr/) | 50 | [cr.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/cr.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/cr/live_streams.sii) | [72fm.com/radio/cr](https://72fm.com/radio/cr) |
| 🇨🇮 | [Côte d’Ivoire](https://alondrilich.github.io/radio-playlists/country/ci/) | 62 | [ci.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ci.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/ci/live_streams.sii) | [72fm.com/radio/ci](https://72fm.com/radio/ci) |
| 🇭🇷 | [Croatia](https://alondrilich.github.io/radio-playlists/country/hr/) | 254 | [hr.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/hr.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/hr/live_streams.sii) | [72fm.com/radio/hr](https://72fm.com/radio/hr) |
| 🇨🇺 | [Cuba](https://alondrilich.github.io/radio-playlists/country/cu/) | 20 | [cu.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/cu.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/cu/live_streams.sii) | [72fm.com/radio/cu](https://72fm.com/radio/cu) |
| 🇨🇼 | [Curaçao](https://alondrilich.github.io/radio-playlists/country/cw/) | 19 | [cw.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/cw.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/cw/live_streams.sii) | [72fm.com/radio/cw](https://72fm.com/radio/cw) |
| 🇨🇾 | [Cyprus](https://alondrilich.github.io/radio-playlists/country/cy/) | 59 | [cy.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/cy.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/cy/live_streams.sii) | [72fm.com/radio/cy](https://72fm.com/radio/cy) |
| 🇨🇿 | [Czechia](https://alondrilich.github.io/radio-playlists/country/cz/) | 259 | [cz.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/cz.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/cz/live_streams.sii) | [72fm.com/radio/cz](https://72fm.com/radio/cz) |
| 🇩🇰 | [Denmark](https://alondrilich.github.io/radio-playlists/country/dk/) | 209 | [dk.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/dk.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/dk/live_streams.sii) | [72fm.com/radio/dk](https://72fm.com/radio/dk) |
| 🇩🇲 | [Dominica](https://alondrilich.github.io/radio-playlists/country/dm/) | 5 | [dm.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/dm.m3u) | — | [72fm.com/radio/dm](https://72fm.com/radio/dm) |
| 🇩🇴 | [Dominican Republic](https://alondrilich.github.io/radio-playlists/country/do/) | 105 | [do.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/do.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/do/live_streams.sii) | [72fm.com/radio/do](https://72fm.com/radio/do) |
| 🇪🇨 | [Ecuador](https://alondrilich.github.io/radio-playlists/country/ec/) | 142 | [ec.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ec.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/ec/live_streams.sii) | [72fm.com/radio/ec](https://72fm.com/radio/ec) |
| 🇪🇬 | [Egypt](https://alondrilich.github.io/radio-playlists/country/eg/) | 56 | [eg.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/eg.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/eg/live_streams.sii) | [72fm.com/radio/eg](https://72fm.com/radio/eg) |
| 🇸🇻 | [El Salvador](https://alondrilich.github.io/radio-playlists/country/sv/) | 57 | [sv.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/sv.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/sv/live_streams.sii) | [72fm.com/radio/sv](https://72fm.com/radio/sv) |
| 🇪🇪 | [Estonia](https://alondrilich.github.io/radio-playlists/country/ee/) | 131 | [ee.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ee.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/ee/live_streams.sii) | [72fm.com/radio/ee](https://72fm.com/radio/ee) |
| 🇪🇹 | [Ethiopia](https://alondrilich.github.io/radio-playlists/country/et/) | 23 | [et.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/et.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/et/live_streams.sii) | [72fm.com/radio/et](https://72fm.com/radio/et) |
| 🇫🇴 | [Faroe Islands](https://alondrilich.github.io/radio-playlists/country/fo/) | 13 | [fo.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/fo.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/fo/live_streams.sii) | [72fm.com/radio/fo](https://72fm.com/radio/fo) |
| 🇫🇮 | [Finland](https://alondrilich.github.io/radio-playlists/country/fi/) | 129 | [fi.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/fi.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/fi/live_streams.sii) | [72fm.com/radio/fi](https://72fm.com/radio/fi) |
| 🇫🇷 | [France](https://alondrilich.github.io/radio-playlists/country/fr/) | 300 of 2739 | [fr.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/fr.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/fr/live_streams.sii) | [72fm.com/radio/fr](https://72fm.com/radio/fr) |
| 🇬🇫 | [French Guiana](https://alondrilich.github.io/radio-playlists/country/gf/) | 5 | [gf.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/gf.m3u) | — | [72fm.com/radio/gf](https://72fm.com/radio/gf) |
| 🇵🇫 | [French Polynesia](https://alondrilich.github.io/radio-playlists/country/pf/) | 8 | [pf.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/pf.m3u) | — | [72fm.com/radio/pf](https://72fm.com/radio/pf) |
| 🇬🇪 | [Georgia](https://alondrilich.github.io/radio-playlists/country/ge/) | 26 | [ge.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ge.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/ge/live_streams.sii) | [72fm.com/radio/ge](https://72fm.com/radio/ge) |
| 🇩🇪 | [Germany](https://alondrilich.github.io/radio-playlists/country/de/) | 300 of 5466 | [de.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/de.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/de/live_streams.sii) | [72fm.com/radio/de](https://72fm.com/radio/de) |
| 🇬🇭 | [Ghana](https://alondrilich.github.io/radio-playlists/country/gh/) | 89 | [gh.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/gh.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/gh/live_streams.sii) | [72fm.com/radio/gh](https://72fm.com/radio/gh) |
| 🇬🇮 | [Gibraltar](https://alondrilich.github.io/radio-playlists/country/gi/) | 6 | [gi.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/gi.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/gi/live_streams.sii) | [72fm.com/radio/gi](https://72fm.com/radio/gi) |
| 🇬🇷 | [Greece](https://alondrilich.github.io/radio-playlists/country/gr/) | 300 of 1815 | [gr.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/gr.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/gr/live_streams.sii) | [72fm.com/radio/gr](https://72fm.com/radio/gr) |
| 🇬🇱 | [Greenland](https://alondrilich.github.io/radio-playlists/country/gl/) | 5 | [gl.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/gl.m3u) | — | [72fm.com/radio/gl](https://72fm.com/radio/gl) |
| 🇬🇩 | [Grenada](https://alondrilich.github.io/radio-playlists/country/gd/) | 5 | [gd.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/gd.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/gd/live_streams.sii) | [72fm.com/radio/gd](https://72fm.com/radio/gd) |
| 🇬🇵 | [Guadeloupe](https://alondrilich.github.io/radio-playlists/country/gp/) | 14 | [gp.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/gp.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/gp/live_streams.sii) | [72fm.com/radio/gp](https://72fm.com/radio/gp) |
| 🇬🇺 | [Guam](https://alondrilich.github.io/radio-playlists/country/gu/) | 5 | [gu.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/gu.m3u) | — | [72fm.com/radio/gu](https://72fm.com/radio/gu) |
| 🇬🇹 | [Guatemala](https://alondrilich.github.io/radio-playlists/country/gt/) | 68 | [gt.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/gt.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/gt/live_streams.sii) | [72fm.com/radio/gt](https://72fm.com/radio/gt) |
| 🇬🇾 | [Guyana](https://alondrilich.github.io/radio-playlists/country/gy/) | 9 | [gy.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/gy.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/gy/live_streams.sii) | [72fm.com/radio/gy](https://72fm.com/radio/gy) |
| 🇭🇹 | [Haiti](https://alondrilich.github.io/radio-playlists/country/ht/) | 32 | [ht.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ht.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/ht/live_streams.sii) | [72fm.com/radio/ht](https://72fm.com/radio/ht) |
| 🇭🇳 | [Honduras](https://alondrilich.github.io/radio-playlists/country/hn/) | 40 | [hn.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/hn.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/hn/live_streams.sii) | [72fm.com/radio/hn](https://72fm.com/radio/hn) |
| 🇭🇰 | [Hong Kong SAR China](https://alondrilich.github.io/radio-playlists/country/hk/) | 63 | [hk.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/hk.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/hk/live_streams.sii) | [72fm.com/radio/hk](https://72fm.com/radio/hk) |
| 🇭🇺 | [Hungary](https://alondrilich.github.io/radio-playlists/country/hu/) | 300 of 339 | [hu.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/hu.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/hu/live_streams.sii) | [72fm.com/radio/hu](https://72fm.com/radio/hu) |
| 🇮🇸 | [Iceland](https://alondrilich.github.io/radio-playlists/country/is/) | 23 | [is.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/is.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/is/live_streams.sii) | [72fm.com/radio/is](https://72fm.com/radio/is) |
| 🇮🇳 | [India](https://alondrilich.github.io/radio-playlists/country/in/) | 300 of 744 | [in.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/in.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/in/live_streams.sii) | [72fm.com/radio/in](https://72fm.com/radio/in) |
| 🇮🇩 | [Indonesia](https://alondrilich.github.io/radio-playlists/country/id/) | 300 of 497 | [id.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/id.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/id/live_streams.sii) | [72fm.com/radio/id](https://72fm.com/radio/id) |
| 🇮🇷 | [Iran](https://alondrilich.github.io/radio-playlists/country/ir/) | 25 | [ir.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ir.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/ir/live_streams.sii) | [72fm.com/radio/ir](https://72fm.com/radio/ir) |
| 🇮🇶 | [Iraq](https://alondrilich.github.io/radio-playlists/country/iq/) | 21 | [iq.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/iq.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/iq/live_streams.sii) | [72fm.com/radio/iq](https://72fm.com/radio/iq) |
| 🇮🇪 | [Ireland](https://alondrilich.github.io/radio-playlists/country/ie/) | 197 | [ie.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ie.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/ie/live_streams.sii) | [72fm.com/radio/ie](https://72fm.com/radio/ie) |
| 🇮🇲 | [Isle of Man](https://alondrilich.github.io/radio-playlists/country/im/) | 7 | [im.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/im.m3u) | — | [72fm.com/radio/im](https://72fm.com/radio/im) |
| 🇮🇱 | [Israel](https://alondrilich.github.io/radio-playlists/country/il/) | 128 | [il.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/il.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/il/live_streams.sii) | [72fm.com/radio/il](https://72fm.com/radio/il) |
| 🇮🇹 | [Italy](https://alondrilich.github.io/radio-playlists/country/it/) | 300 of 1557 | [it.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/it.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/it/live_streams.sii) | [72fm.com/radio/it](https://72fm.com/radio/it) |
| 🇯🇲 | [Jamaica](https://alondrilich.github.io/radio-playlists/country/jm/) | 42 | [jm.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/jm.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/jm/live_streams.sii) | [72fm.com/radio/jm](https://72fm.com/radio/jm) |
| 🇯🇵 | [Japan](https://alondrilich.github.io/radio-playlists/country/jp/) | 127 | [jp.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/jp.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/jp/live_streams.sii) | [72fm.com/radio/jp](https://72fm.com/radio/jp) |
| 🇯🇴 | [Jordan](https://alondrilich.github.io/radio-playlists/country/jo/) | 30 | [jo.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/jo.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/jo/live_streams.sii) | [72fm.com/radio/jo](https://72fm.com/radio/jo) |
| 🇰🇿 | [Kazakhstan](https://alondrilich.github.io/radio-playlists/country/kz/) | 34 | [kz.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/kz.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/kz/live_streams.sii) | [72fm.com/radio/kz](https://72fm.com/radio/kz) |
| 🇰🇪 | [Kenya](https://alondrilich.github.io/radio-playlists/country/ke/) | 46 | [ke.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ke.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/ke/live_streams.sii) | [72fm.com/radio/ke](https://72fm.com/radio/ke) |
| 🇽🇰 | [Kosovo](https://alondrilich.github.io/radio-playlists/country/xk/) | 15 | [xk.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/xk.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/xk/live_streams.sii) | [72fm.com/radio/xk](https://72fm.com/radio/xk) |
| 🇰🇼 | [Kuwait](https://alondrilich.github.io/radio-playlists/country/kw/) | 12 | [kw.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/kw.m3u) | — | [72fm.com/radio/kw](https://72fm.com/radio/kw) |
| 🇰🇬 | [Kyrgyzstan](https://alondrilich.github.io/radio-playlists/country/kg/) | 6 | [kg.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/kg.m3u) | — | [72fm.com/radio/kg](https://72fm.com/radio/kg) |
| 🇱🇻 | [Latvia](https://alondrilich.github.io/radio-playlists/country/lv/) | 154 | [lv.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/lv.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/lv/live_streams.sii) | [72fm.com/radio/lv](https://72fm.com/radio/lv) |
| 🇱🇧 | [Lebanon](https://alondrilich.github.io/radio-playlists/country/lb/) | 114 | [lb.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/lb.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/lb/live_streams.sii) | [72fm.com/radio/lb](https://72fm.com/radio/lb) |
| 🇱🇾 | [Libya](https://alondrilich.github.io/radio-playlists/country/ly/) | 6 | [ly.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ly.m3u) | — | [72fm.com/radio/ly](https://72fm.com/radio/ly) |
| 🇱🇹 | [Lithuania](https://alondrilich.github.io/radio-playlists/country/lt/) | 107 | [lt.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/lt.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/lt/live_streams.sii) | [72fm.com/radio/lt](https://72fm.com/radio/lt) |
| 🇱🇺 | [Luxembourg](https://alondrilich.github.io/radio-playlists/country/lu/) | 31 | [lu.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/lu.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/lu/live_streams.sii) | [72fm.com/radio/lu](https://72fm.com/radio/lu) |
| 🇲🇴 | [Macao SAR China](https://alondrilich.github.io/radio-playlists/country/mo/) | 10 | [mo.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/mo.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/mo/live_streams.sii) | [72fm.com/radio/mo](https://72fm.com/radio/mo) |
| 🇲🇬 | [Madagascar](https://alondrilich.github.io/radio-playlists/country/mg/) | 16 | [mg.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/mg.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/mg/live_streams.sii) | [72fm.com/radio/mg](https://72fm.com/radio/mg) |
| 🇲🇼 | [Malawi](https://alondrilich.github.io/radio-playlists/country/mw/) | 60 | [mw.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/mw.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/mw/live_streams.sii) | [72fm.com/radio/mw](https://72fm.com/radio/mw) |
| 🇲🇾 | [Malaysia](https://alondrilich.github.io/radio-playlists/country/my/) | 79 | [my.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/my.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/my/live_streams.sii) | [72fm.com/radio/my](https://72fm.com/radio/my) |
| 🇲🇱 | [Mali](https://alondrilich.github.io/radio-playlists/country/ml/) | 13 | [ml.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ml.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/ml/live_streams.sii) | [72fm.com/radio/ml](https://72fm.com/radio/ml) |
| 🇲🇹 | [Malta](https://alondrilich.github.io/radio-playlists/country/mt/) | 12 | [mt.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/mt.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/mt/live_streams.sii) | [72fm.com/radio/mt](https://72fm.com/radio/mt) |
| 🇲🇶 | [Martinique](https://alondrilich.github.io/radio-playlists/country/mq/) | 12 | [mq.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/mq.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/mq/live_streams.sii) | [72fm.com/radio/mq](https://72fm.com/radio/mq) |
| 🇲🇺 | [Mauritius](https://alondrilich.github.io/radio-playlists/country/mu/) | 14 | [mu.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/mu.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/mu/live_streams.sii) | [72fm.com/radio/mu](https://72fm.com/radio/mu) |
| 🇲🇽 | [Mexico](https://alondrilich.github.io/radio-playlists/country/mx/) | 300 of 1551 | [mx.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/mx.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/mx/live_streams.sii) | [72fm.com/radio/mx](https://72fm.com/radio/mx) |
| 🇲🇩 | [Moldova](https://alondrilich.github.io/radio-playlists/country/md/) | 79 | [md.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/md.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/md/live_streams.sii) | [72fm.com/radio/md](https://72fm.com/radio/md) |
| 🇲🇨 | [Monaco](https://alondrilich.github.io/radio-playlists/country/mc/) | 7 | [mc.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/mc.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/mc/live_streams.sii) | [72fm.com/radio/mc](https://72fm.com/radio/mc) |
| 🇲🇳 | [Mongolia](https://alondrilich.github.io/radio-playlists/country/mn/) | 7 | [mn.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/mn.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/mn/live_streams.sii) | [72fm.com/radio/mn](https://72fm.com/radio/mn) |
| 🇲🇪 | [Montenegro](https://alondrilich.github.io/radio-playlists/country/me/) | 43 | [me.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/me.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/me/live_streams.sii) | [72fm.com/radio/me](https://72fm.com/radio/me) |
| 🇲🇦 | [Morocco](https://alondrilich.github.io/radio-playlists/country/ma/) | 54 | [ma.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ma.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/ma/live_streams.sii) | [72fm.com/radio/ma](https://72fm.com/radio/ma) |
| 🇲🇿 | [Mozambique](https://alondrilich.github.io/radio-playlists/country/mz/) | 15 | [mz.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/mz.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/mz/live_streams.sii) | [72fm.com/radio/mz](https://72fm.com/radio/mz) |
| 🇳🇦 | [Namibia](https://alondrilich.github.io/radio-playlists/country/na/) | 13 | [na.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/na.m3u) | — | [72fm.com/radio/na](https://72fm.com/radio/na) |
| 🇳🇵 | [Nepal](https://alondrilich.github.io/radio-playlists/country/np/) | 148 | [np.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/np.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/np/live_streams.sii) | [72fm.com/radio/np](https://72fm.com/radio/np) |
| 🇳🇱 | [Netherlands](https://alondrilich.github.io/radio-playlists/country/nl/) | 300 of 1160 | [nl.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/nl.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/nl/live_streams.sii) | [72fm.com/radio/nl](https://72fm.com/radio/nl) |
| 🇳🇨 | [New Caledonia](https://alondrilich.github.io/radio-playlists/country/nc/) | 7 | [nc.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/nc.m3u) | — | [72fm.com/radio/nc](https://72fm.com/radio/nc) |
| 🇳🇿 | [New Zealand](https://alondrilich.github.io/radio-playlists/country/nz/) | 206 | [nz.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/nz.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/nz/live_streams.sii) | [72fm.com/radio/nz](https://72fm.com/radio/nz) |
| 🇳🇮 | [Nicaragua](https://alondrilich.github.io/radio-playlists/country/ni/) | 23 | [ni.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ni.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/ni/live_streams.sii) | [72fm.com/radio/ni](https://72fm.com/radio/ni) |
| 🇳🇬 | [Nigeria](https://alondrilich.github.io/radio-playlists/country/ng/) | 69 | [ng.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ng.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/ng/live_streams.sii) | [72fm.com/radio/ng](https://72fm.com/radio/ng) |
| 🇰🇵 | [North Korea](https://alondrilich.github.io/radio-playlists/country/kp/) | 7 | [kp.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/kp.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/kp/live_streams.sii) | [72fm.com/radio/kp](https://72fm.com/radio/kp) |
| 🇲🇰 | [North Macedonia](https://alondrilich.github.io/radio-playlists/country/mk/) | 44 | [mk.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/mk.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/mk/live_streams.sii) | [72fm.com/radio/mk](https://72fm.com/radio/mk) |
| 🇳🇴 | [Norway](https://alondrilich.github.io/radio-playlists/country/no/) | 119 | [no.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/no.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/no/live_streams.sii) | [72fm.com/radio/no](https://72fm.com/radio/no) |
| 🇴🇲 | [Oman](https://alondrilich.github.io/radio-playlists/country/om/) | 8 | [om.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/om.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/om/live_streams.sii) | [72fm.com/radio/om](https://72fm.com/radio/om) |
| 🇵🇰 | [Pakistan](https://alondrilich.github.io/radio-playlists/country/pk/) | 59 | [pk.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/pk.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/pk/live_streams.sii) | [72fm.com/radio/pk](https://72fm.com/radio/pk) |
| 🇵🇸 | [Palestinian Territories](https://alondrilich.github.io/radio-playlists/country/ps/) | 10 | [ps.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ps.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/ps/live_streams.sii) | [72fm.com/radio/ps](https://72fm.com/radio/ps) |
| 🇵🇦 | [Panama](https://alondrilich.github.io/radio-playlists/country/pa/) | 31 | [pa.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/pa.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/pa/live_streams.sii) | [72fm.com/radio/pa](https://72fm.com/radio/pa) |
| 🇵🇾 | [Paraguay](https://alondrilich.github.io/radio-playlists/country/py/) | 63 | [py.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/py.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/py/live_streams.sii) | [72fm.com/radio/py](https://72fm.com/radio/py) |
| 🇵🇪 | [Peru](https://alondrilich.github.io/radio-playlists/country/pe/) | 254 | [pe.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/pe.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/pe/live_streams.sii) | [72fm.com/radio/pe](https://72fm.com/radio/pe) |
| 🇵🇭 | [Philippines](https://alondrilich.github.io/radio-playlists/country/ph/) | 300 of 655 | [ph.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ph.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/ph/live_streams.sii) | [72fm.com/radio/ph](https://72fm.com/radio/ph) |
| 🇵🇱 | [Poland](https://alondrilich.github.io/radio-playlists/country/pl/) | 300 of 879 | [pl.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/pl.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/pl/live_streams.sii) | [72fm.com/radio/pl](https://72fm.com/radio/pl) |
| 🇵🇹 | [Portugal](https://alondrilich.github.io/radio-playlists/country/pt/) | 300 of 333 | [pt.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/pt.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/pt/live_streams.sii) | [72fm.com/radio/pt](https://72fm.com/radio/pt) |
| 🇵🇷 | [Puerto Rico](https://alondrilich.github.io/radio-playlists/country/pr/) | 48 | [pr.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/pr.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/pr/live_streams.sii) | [72fm.com/radio/pr](https://72fm.com/radio/pr) |
| 🇶🇦 | [Qatar](https://alondrilich.github.io/radio-playlists/country/qa/) | 15 | [qa.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/qa.m3u) | — | [72fm.com/radio/qa](https://72fm.com/radio/qa) |
| 🇷🇪 | [Réunion](https://alondrilich.github.io/radio-playlists/country/re/) | 34 | [re.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/re.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/re/live_streams.sii) | [72fm.com/radio/re](https://72fm.com/radio/re) |
| 🇷🇴 | [Romania](https://alondrilich.github.io/radio-playlists/country/ro/) | 300 of 837 | [ro.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ro.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/ro/live_streams.sii) | [72fm.com/radio/ro](https://72fm.com/radio/ro) |
| 🇷🇺 | [Russia](https://alondrilich.github.io/radio-playlists/country/ru/) | 300 of 2433 | [ru.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ru.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/ru/live_streams.sii) | [72fm.com/radio/ru](https://72fm.com/radio/ru) |
| 🇷🇼 | [Rwanda](https://alondrilich.github.io/radio-playlists/country/rw/) | 8 | [rw.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/rw.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/rw/live_streams.sii) | [72fm.com/radio/rw](https://72fm.com/radio/rw) |
| 🇸🇲 | [San Marino](https://alondrilich.github.io/radio-playlists/country/sm/) | 5 | [sm.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/sm.m3u) | — | [72fm.com/radio/sm](https://72fm.com/radio/sm) |
| 🇸🇦 | [Saudi Arabia](https://alondrilich.github.io/radio-playlists/country/sa/) | 60 | [sa.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/sa.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/sa/live_streams.sii) | [72fm.com/radio/sa](https://72fm.com/radio/sa) |
| 🇸🇳 | [Senegal](https://alondrilich.github.io/radio-playlists/country/sn/) | 32 | [sn.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/sn.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/sn/live_streams.sii) | [72fm.com/radio/sn](https://72fm.com/radio/sn) |
| 🇷🇸 | [Serbia](https://alondrilich.github.io/radio-playlists/country/rs/) | 300 of 357 | [rs.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/rs.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/rs/live_streams.sii) | [72fm.com/radio/rs](https://72fm.com/radio/rs) |
| 🇸🇬 | [Singapore](https://alondrilich.github.io/radio-playlists/country/sg/) | 61 | [sg.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/sg.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/sg/live_streams.sii) | [72fm.com/radio/sg](https://72fm.com/radio/sg) |
| 🇸🇰 | [Slovakia](https://alondrilich.github.io/radio-playlists/country/sk/) | 121 | [sk.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/sk.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/sk/live_streams.sii) | [72fm.com/radio/sk](https://72fm.com/radio/sk) |
| 🇸🇮 | [Slovenia](https://alondrilich.github.io/radio-playlists/country/si/) | 124 | [si.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/si.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/si/live_streams.sii) | [72fm.com/radio/si](https://72fm.com/radio/si) |
| 🇿🇦 | [South Africa](https://alondrilich.github.io/radio-playlists/country/za/) | 186 | [za.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/za.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/za/live_streams.sii) | [72fm.com/radio/za](https://72fm.com/radio/za) |
| 🇰🇷 | [South Korea](https://alondrilich.github.io/radio-playlists/country/kr/) | 106 | [kr.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/kr.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/kr/live_streams.sii) | [72fm.com/radio/kr](https://72fm.com/radio/kr) |
| 🇪🇸 | [Spain](https://alondrilich.github.io/radio-playlists/country/es/) | 300 of 1188 | [es.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/es.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/es/live_streams.sii) | [72fm.com/radio/es](https://72fm.com/radio/es) |
| 🇱🇰 | [Sri Lanka](https://alondrilich.github.io/radio-playlists/country/lk/) | 63 | [lk.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/lk.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/lk/live_streams.sii) | [72fm.com/radio/lk](https://72fm.com/radio/lk) |
| 🇱🇨 | [St. Lucia](https://alondrilich.github.io/radio-playlists/country/lc/) | 13 | [lc.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/lc.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/lc/live_streams.sii) | [72fm.com/radio/lc](https://72fm.com/radio/lc) |
| 🇻🇨 | [St. Vincent \& Grenadines](https://alondrilich.github.io/radio-playlists/country/vc/) | 12 | [vc.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/vc.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/vc/live_streams.sii) | [72fm.com/radio/vc](https://72fm.com/radio/vc) |
| 🇸🇷 | [Suriname](https://alondrilich.github.io/radio-playlists/country/sr/) | 6 | [sr.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/sr.m3u) | — | [72fm.com/radio/sr](https://72fm.com/radio/sr) |
| 🇸🇪 | [Sweden](https://alondrilich.github.io/radio-playlists/country/se/) | 233 | [se.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/se.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/se/live_streams.sii) | [72fm.com/radio/se](https://72fm.com/radio/se) |
| 🇨🇭 | [Switzerland](https://alondrilich.github.io/radio-playlists/country/ch/) | 300 of 515 | [ch.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ch.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/ch/live_streams.sii) | [72fm.com/radio/ch](https://72fm.com/radio/ch) |
| 🇸🇾 | [Syria](https://alondrilich.github.io/radio-playlists/country/sy/) | 24 | [sy.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/sy.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/sy/live_streams.sii) | [72fm.com/radio/sy](https://72fm.com/radio/sy) |
| 🇹🇼 | [Taiwan](https://alondrilich.github.io/radio-playlists/country/tw/) | 171 | [tw.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/tw.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/tw/live_streams.sii) | [72fm.com/radio/tw](https://72fm.com/radio/tw) |
| 🇹🇿 | [Tanzania](https://alondrilich.github.io/radio-playlists/country/tz/) | 17 | [tz.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/tz.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/tz/live_streams.sii) | [72fm.com/radio/tz](https://72fm.com/radio/tz) |
| 🇹🇭 | [Thailand](https://alondrilich.github.io/radio-playlists/country/th/) | 96 | [th.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/th.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/th/live_streams.sii) | [72fm.com/radio/th](https://72fm.com/radio/th) |
| 🇹🇬 | [Togo](https://alondrilich.github.io/radio-playlists/country/tg/) | 6 | [tg.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/tg.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/tg/live_streams.sii) | [72fm.com/radio/tg](https://72fm.com/radio/tg) |
| 🇹🇹 | [Trinidad \& Tobago](https://alondrilich.github.io/radio-playlists/country/tt/) | 22 | [tt.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/tt.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/tt/live_streams.sii) | [72fm.com/radio/tt](https://72fm.com/radio/tt) |
| 🇹🇳 | [Tunisia](https://alondrilich.github.io/radio-playlists/country/tn/) | 48 | [tn.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/tn.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/tn/live_streams.sii) | [72fm.com/radio/tn](https://72fm.com/radio/tn) |
| 🇹🇷 | [Türkiye](https://alondrilich.github.io/radio-playlists/country/tr/) | 300 of 652 | [tr.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/tr.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/tr/live_streams.sii) | [72fm.com/radio/tr](https://72fm.com/radio/tr) |
| 🇺🇲 | [U.S. Outlying Islands](https://alondrilich.github.io/radio-playlists/country/um/) | 25 | [um.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/um.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/um/live_streams.sii) | — |
| 🇻🇮 | [U.S. Virgin Islands](https://alondrilich.github.io/radio-playlists/country/vi/) | 7 | [vi.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/vi.m3u) | — | [72fm.com/radio/vi](https://72fm.com/radio/vi) |
| 🇺🇬 | [Uganda](https://alondrilich.github.io/radio-playlists/country/ug/) | 112 | [ug.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ug.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/ug/live_streams.sii) | [72fm.com/radio/ug](https://72fm.com/radio/ug) |
| 🇺🇦 | [Ukraine](https://alondrilich.github.io/radio-playlists/country/ua/) | 274 | [ua.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ua.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/ua/live_streams.sii) | [72fm.com/radio/ua](https://72fm.com/radio/ua) |
| 🇦🇪 | [United Arab Emirates](https://alondrilich.github.io/radio-playlists/country/ae/) | 300 of 620 | [ae.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ae.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/ae/live_streams.sii) | [72fm.com/radio/ae](https://72fm.com/radio/ae) |
| 🇬🇧 | [United Kingdom](https://alondrilich.github.io/radio-playlists/country/gb/) | 300 of 1943 | [gb.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/gb.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/gb/live_streams.sii) | [72fm.com/radio/gb](https://72fm.com/radio/gb) |
| 🇺🇸 | [United States](https://alondrilich.github.io/radio-playlists/country/us/) | 300 of 6555 | [us.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/us.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/us/live_streams.sii) | [72fm.com/radio/us](https://72fm.com/radio/us) |
| 🇺🇾 | [Uruguay](https://alondrilich.github.io/radio-playlists/country/uy/) | 124 | [uy.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/uy.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/uy/live_streams.sii) | [72fm.com/radio/uy](https://72fm.com/radio/uy) |
| 🇺🇿 | [Uzbekistan](https://alondrilich.github.io/radio-playlists/country/uz/) | 10 | [uz.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/uz.m3u) | — | [72fm.com/radio/uz](https://72fm.com/radio/uz) |
| 🇻🇦 | [Vatican City](https://alondrilich.github.io/radio-playlists/country/va/) | 13 | [va.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/va.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/va/live_streams.sii) | [72fm.com/radio/va](https://72fm.com/radio/va) |
| 🇻🇪 | [Venezuela](https://alondrilich.github.io/radio-playlists/country/ve/) | 160 | [ve.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ve.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/ve/live_streams.sii) | [72fm.com/radio/ve](https://72fm.com/radio/ve) |
| 🇻🇳 | [Vietnam](https://alondrilich.github.io/radio-playlists/country/vn/) | 28 | [vn.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/vn.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/vn/live_streams.sii) | [72fm.com/radio/vn](https://72fm.com/radio/vn) |
| 🇾🇪 | [Yemen](https://alondrilich.github.io/radio-playlists/country/ye/) | 14 | [ye.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/ye.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/ye/live_streams.sii) | [72fm.com/radio/ye](https://72fm.com/radio/ye) |
| 🇿🇲 | [Zambia](https://alondrilich.github.io/radio-playlists/country/zm/) | 80 | [zm.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/zm.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/zm/live_streams.sii) | [72fm.com/radio/zm](https://72fm.com/radio/zm) |
| 🇿🇼 | [Zimbabwe](https://alondrilich.github.io/radio-playlists/country/zw/) | 23 | [zw.m3u](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/countries/zw.m3u) | [live_streams.sii](https://raw.githubusercontent.com/AlonDrilich/radio-playlists/main/ets2/zw/live_streams.sii) | [72fm.com/radio/zw](https://72fm.com/radio/zw) |

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
