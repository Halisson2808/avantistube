import assert from 'node:assert/strict';
import ts from 'typescript';
import { readFileSync } from 'node:fs';
import { getFeedVideoPage } from '../api/_youtube-feed.mjs';
const source = readFileSync(new URL('../src/lib/youtube-feed.ts', import.meta.url), 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
const { getFeedChannels, formatPublicationTime, fetchJsonWithDeadline, fetchChannelFeed } = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'));

const channels = [
  { channelId: 'shorts', contentType: 'shorts' },
  { channelId: 'long', contentType: 'longform' },
  { channelId: 'own-short', contentType: 'shorts', isOwnChannel: true },
  { channelId: 'own-unlabelled', isOwnChannel: true },
];
assert.deepEqual(getFeedChannels(channels, false, 'shorts').map(c => c.channelId), ['shorts']);
assert.deepEqual(getFeedChannels(channels, true, 'shorts').map(c => c.channelId), ['shorts', 'own-short']);
assert.deepEqual(getFeedChannels(channels, true, 'longform').map(c => c.channelId), ['long', 'own-unlabelled']);
assert.equal(formatPublicationTime('2026-09-30T11:00:00Z', 'America/Cuiaba'), '07:00');
assert.equal(formatPublicationTime('2026-09-30T04:05:00Z', 'America/Cuiaba'), '00:05');
assert.deepEqual(await getFeedVideoPage(async () => { throw new Error('YouTube API error 404: playlistNotFound'); }, 'UC1234567890123456789012', '2026-09-01'), { videos: [] });
await assert.rejects(getFeedVideoPage(async () => { throw new Error('YouTube API error 403: quotaExceeded'); }, 'UC1234567890123456789012', '2026-09-01'), /403/);

let active = 0;
let peak = 0;
globalThis.fetch = async () => {
  active++;
  peak = Math.max(peak, active);
  await new Promise(resolve => setTimeout(resolve, 10));
  active--;
  return new Response(JSON.stringify({ videos: [] }));
};
await Promise.all(Array.from({ length: 12 }, (_, i) => fetchChannelFeed(`channel-${i}`, '2026-09-01')));
assert.equal(peak, 8);

// Even a transport that ignores AbortSignal must not leave the UI busy forever.
globalThis.fetch = () => new Promise(() => {});
await assert.rejects(fetchJsonWithDeadline('/stalled', 10), /demorou/);
const stalled = await Promise.allSettled(Array.from({ length: 8 }, (_, i) => fetchChannelFeed(`stalled-${i}`, '2026-09-01', undefined, 30)));
assert.ok(stalled.every(result => result.status === 'rejected'));
globalThis.fetch = async () => new Response(JSON.stringify({ videos: [] }));
assert.deepEqual(await fetchChannelFeed('after-timeouts', '2026-09-01'), []);
const controller = new AbortController();
controller.abort();
await assert.rejects(fetchChannelFeed('cancelled', '2026-09-01', controller.signal));

let pageCalls = 0;
globalThis.fetch = async () => {
  pageCalls++;
  return pageCalls === 1
    ? new Response(JSON.stringify({ videos: [{ videoId: 'first-page' }], nextPageToken: 'second' }))
    : new Response('{}', { status: 503 });
};
await assert.rejects(fetchChannelFeed('partial-failure', '2026-09-01'));
assert.equal(pageCalls, 2);
console.log('PASS: restored channel filtering, optional own channels, publication clock, deleted playlists, bounded concurrency, stalled requests, cancellation, slot recovery and rejection of incomplete refreshes.');
