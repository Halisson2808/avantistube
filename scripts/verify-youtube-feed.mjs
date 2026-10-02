import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { pathToFileURL, fileURLToPath } from 'node:url';

process.env.TZ = 'America/Cuiaba';
const project = fileURLToPath(new URL('../', import.meta.url));
const require = createRequire(`${project}/package.json`);
const ts = require('typescript');
const source = readFileSync(`${project}/src/lib/youtube-feed.ts`, 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
const { getFeedPeriods, fetchChannelFeed } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
const { getFeedVideoPage } = await import(pathToFileURL(`${project}/api/_youtube-feed.mjs`));
const video = (videoId, publishedAt, viewCount = 1) => ({ videoId, publishedAt, viewCount, title: videoId });
const now = new Date('2026-09-30T16:00:00-04:00');
const periods = getFeedPeriods([
  video('today-low', '2026-09-30T04:00:00Z', 3),
  video('today-high', '2026-09-30T18:00:00Z', 100),
  video('today-high', '2026-09-30T18:00:00Z', 100),
  video('yesterday', '2026-09-30T03:59:59Z', 10),
  video('week-start', '2026-09-24T04:00:00Z', 50),
  video('rest', '2026-09-24T03:59:59Z', 70),
  video('month-start', '2026-09-01T04:00:00Z', 90),
  video('too-old', '2026-09-01T03:59:59Z', 1000),
  video('future', '2026-10-01T00:00:00Z', 1000),
  video('invalid', 'invalid', 1000),
  { ...video('deleted', '2026-09-30T12:00:00Z', 1000), isDeleted: true },
], now);
assert.deepEqual(periods.map(row => row.map(item => item.videoId)), [
  ['today-high', 'today-low'], ['yesterday'], ['week-start'],
]);
assert.deepEqual(getFeedPeriods([], now), [[], [], []]);

const calls = [];
const cutoff = '2026-09-01T04:00:00Z';
const makeItem = (id, date) => ({ contentDetails: { videoId: id, videoPublishedAt: date } });
const page = await getFeedVideoPage(async path => {
  calls.push(path);
  if (path.startsWith('/playlistItems')) return { items: [makeItem('new', '2026-09-29T12:00:00Z'), makeItem('old', '2026-08-15T12:00:00Z')], nextPageToken: 'second' };
  return { items: [{ id: 'new', snippet: { title: 'New video', publishedAt: '2026-09-29T12:00:00Z', thumbnails: { high: { url: 'high.jpg' } } }, statistics: { viewCount: '42' }, contentDetails: { duration: 'PT1M' } }] };
}, 'UC1234567890123456789012', cutoff);
assert.equal(page.nextPageToken, 'second');
assert.equal(page.videos[0].viewCount, 42);
assert.equal(page.videos[0].thumbnailUrl, 'high.jpg');
// Primeira página: os 7 mais recentes entram mesmo fora do período (Monitoramento).
assert.ok(calls[1].includes('old'));
const oldPage = await getFeedVideoPage(async () => ({ items: [makeItem('old', '2026-08-15T00:00:00Z')], nextPageToken: 'third' }), 'UC1234567890123456789012', cutoff, 'second');
assert.equal(oldPage.nextPageToken, undefined);
assert.deepEqual(oldPage.videos, []);

let requests = 0;
globalThis.fetch = async url => {
  requests++;
  const second = new URL(url, 'https://test.local').searchParams.has('pageToken');
  return new Response(JSON.stringify({ videos: second ? [video('duplicate', cutoff), video('last', cutoff)] : Array.from({ length: 50 }, (_, i) => video(i === 0 ? 'duplicate' : `id-${i}`, cutoff)), nextPageToken: second ? undefined : 'page2' }));
};
const all = await fetchChannelFeed('UC1234567890123456789012', cutoff);
assert.equal(requests, 2);
assert.equal(all.length, 51);
globalThis.fetch = async () => new Response('{}', { status: 503 });
await assert.rejects(fetchChannelFeed('channel', cutoff));
globalThis.fetch = async () => new Response(JSON.stringify({ videos: [], nextPageToken: 'repeated' }));
await assert.rejects(fetchChannelFeed('channel', cutoff), /paginação/);
console.log('PASS: calendar boundaries, ranking, deduplication, future/deleted exclusion, API cutoff, >50 uploads, request errors and pagination loop protection.');





await import('./verify-youtube-feed-stability.mjs');
