import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const project = fileURLToPath(new URL('../', import.meta.url));
const require = createRequire(`${project}/package.json`);
const ts = require('typescript');
const source = readFileSync(`${project}/src/lib/video-favorites.ts`, 'utf8');
const js = ts.transpileModule(source, {compilerOptions: {target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext}}).outputText;
globalThis.fetch = () => { throw new Error('Network forbidden in offline favorites tests'); };
const {createFavoritesStore} = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
const values = new Map();
let fail = false;
const storage = {getItem: key => values.get(key) || null, setItem: (key, value) => {
  if (fail) throw new Error('Storage full');
  values.set(key, value);
}};
const video = {videoId: 'abcdefghijk', title: 'Vídeo de teste', channelId: 'UCexample', channelName: 'Canal de teste',
  publishedAt: '2025-01-01T12:00:00Z', thumbnailUrl: 'thumbnail.jpg', viewCount: 123};
const store = createFavoritesStore('user-a', () => storage);
let notifications = 0;
const unsubscribe = store.subscribe(() => notifications++);
assert.deepEqual(store.getSnapshot(), []);
assert.equal(store.toggle(video), true);
assert.equal(store.has(video.videoId), true);
assert.equal(notifications, 1);
const stable = store.getSnapshot();
assert.equal(store.getSnapshot(), stable, 'Snapshot must be referentially stable for React');
const restored = createFavoritesStore('user-a', () => storage);
assert.equal(restored.has(video.videoId), true, 'Must survive page reload');
assert.equal(restored.getSnapshot()[0].title, video.title);
assert.equal(restored.getSnapshot()[0].publishedAt, video.publishedAt, 'No 30-day expiry');
assert.equal(createFavoritesStore('user-b', () => storage).getSnapshot().length, 0, 'Accounts isolated');
fail = true;
assert.throws(() => store.toggle(video), /Storage full/);
assert.equal(store.has(video.videoId), true, 'Failed write must not remove saved video');
assert.equal(notifications, 1);
fail = false;
assert.equal(store.toggle(video), false, 'Second click removes same video from any source');
assert.equal(store.has(video.videoId), false);
restored.notify();
assert.equal(restored.has(video.videoId), false, 'Another tab reflects removal');
values.set('user-a', JSON.stringify([{...video, savedAt: '2026-10-01T12:00:00Z'}, {...video, savedAt: '2026-10-01T13:00:00Z'}, null, {videoId: 'invalid'}]));
store.notify();
assert.equal(store.getSnapshot().length, 1, 'Same video must not duplicate');
assert.equal(store.getSnapshot()[0].savedAt, '2026-10-01T13:00:00Z');
values.set('user-a', '{broken');
store.notify();
assert.equal(store.has(video.videoId), true, 'Corrupted storage preserves last valid snapshot');
unsubscribe();
assert.throws(() => store.toggle({...video, videoId: '../invalid'}), /identificador/);

// Favoritar nunca deve acionar o link de abrir o vídeo, inclusive no modo compacto.
for (const file of ['src/pages/studio/FeedYoutube.tsx', 'src/pages/Monitoramento.tsx', 'src/components/RecentVideoCard.tsx', 'src/pages/studio/FavoriteVideos.tsx']) {
  const text = readFileSync(`${project}/${file}`, 'utf8');
  const ast = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  let count = 0;
  const visit = (node, insideLink = false) => {
    if (ts.isJsxElement(node) && node.openingElement.tagName.getText(ast) === 'a') insideLink = true;
    if (ts.isJsxSelfClosingElement(node) && node.tagName.getText(ast) === 'VideoFavoriteButton') {
      count++;
      assert.equal(insideLink, false, `${file}: favorite button cannot be nested in an anchor`);
    }
    ts.forEachChild(node, child => visit(child, insideLink));
  };
  visit(ast);
  assert.ok(count > 0, `${file}: favorite control required`);
}
const button = readFileSync(`${project}/src/components/VideoFavoriteButton.tsx`, 'utf8');
assert.match(button, /event.preventDefault\(\)/);
assert.match(button, /event.stopPropagation\(\)/);
assert.match(button, /aria-pressed=\{saved\}/);
assert.match(readFileSync(`${project}/src/App.tsx`, 'utf8'), /path="\/youtube\/favoritos"/);
console.log('PASS: favorite save/remove, persistence, account isolation, metadata retention, cross-tab updates, deduplication, storage failure handling, SVG state and independent video links. No network calls.');
