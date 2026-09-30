import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const root = fileURLToPath(new URL('../', import.meta.url));
globalThis.fetch = () => { throw Error('Real network forbidden'); };
const {createYouTubeQuotaGuard} = await import(pathToFileURL(path.join(root, 'api/_youtube-quota.mjs')));
let date = new Date('2026-09-30T12:00:00Z');
let calls = 0;
const guarded = createYouTubeQuotaGuard(() => date);
const exhausted = () => { calls++; return Promise.resolve(new Response(JSON.stringify({error: {errors: [{reason: 'quotaExceeded'}]}}), {status: 403})); };
await assert.rejects(guarded(exhausted), {code: 'YOUTUBE_QUOTA_EXCEEDED', status: 429});
await assert.rejects(guarded(exhausted), {code: 'YOUTUBE_QUOTA_EXCEEDED'});
assert.equal(calls, 1);
date = new Date('2026-10-01T12:00:00Z');
await guarded(async () => { calls++; return new Response('{"items":[]}'); });
assert.equal(calls, 2);
const ordinary = createYouTubeQuotaGuard();
await assert.rejects(ordinary(async () => new Response('forbidden', {status: 403})), /YouTube API error 403/);
await ordinary(async () => new Response('{}'));

const read = file => fs.readFileSync(path.join(root, file), 'utf8');
for (const file of ['src/pages/Monitoramento.tsx', 'src/pages/MeusCanais.tsx']) {
  const page = read(file);
  assert.doesNotMatch(page, /updateSingleChannel|Buscando dados em segundo plano/);
}
const recent = read('src/hooks/use-recent-videos.tsx');
assert.equal((recent.match(/if \(quotaStopped.current\) break/g) || []).length, 2);
assert.match(recent, /if \(updateRunning.current\) return/);
assert.match(read('api/handler.mjs'), /err.code === "YOUTUBE_QUOTA_EXCEEDED" \? 429/);

// Executa a camada de fetch com sessão e transportes simulados.
const require = createRequire(path.join(root, 'package.json'));
const ts = require('typescript');
let auth = read('src/lib/apiAuth.ts').replace(/import[^;]+;/g, '');
auth = 'const supabase = {auth: {getSession: async () => ({data: {session: {access_token: "fake"}}}), refreshSession: async () => ({data: {session: {access_token: "fake"}}})}};\n' + auth;
const js = ts.transpileModule(auth, {compilerOptions: {target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext}}).outputText;
let requests = 0;
globalThis.window = {location: {origin: 'http://offline.test'}, setTimeout: callback => {callback(); return 0;},
  fetch: async () => {requests++; return new Response('{}', {status: 500});}};
const {installApiAuthFetch} = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'));
installApiAuthFetch();
await window.fetch('/api/youtube/feed-videos?channelId=fake');
assert.equal(requests, 1, 'YouTube 500 must not be repeated');
await window.fetch('/api/videos');
assert.equal(requests, 4, 'Database reads retain transient retries');
console.log('PASS: no automatic YouTube retries, quota stop, daily guard reset, background captures removed, manual-only batching. All transports mocked.');
