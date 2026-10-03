// Tells IndexNow (via Bing, which shares it with the other IndexNow engines) that the site was updated.
// Only the index page is sent: Bing's webmaster tools advise against batch submissions of whole sites,
// and the index links to every country and genre page, so the crawler finds the rest from there.
// The key file docs/d4fa494ef57c3c0f1500efdd4c367576.txt is written by build.mjs.
const KEY = 'd4fa494ef57c3c0f1500efdd4c367576';
const HOST = 'alondrilich.github.io';
const urlList = [`https://${HOST}/radio-playlists/`];
const res = await fetch('https://www.bing.com/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/radio-playlists/${KEY}.txt`, urlList }),
  signal: AbortSignal.timeout(15_000),
});
console.log(`IndexNow: ${urlList.length} URL → ${res.status}`);
// 200 and 202 both mean the submission was accepted; anything else should show up as a failed step.
if (res.status !== 200 && res.status !== 202) {
  console.error(`IndexNow was not accepted: ${(await res.text()).slice(0, 300)}`);
  process.exitCode = 1;
}
