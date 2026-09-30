import type { LatestVideo } from "./youtube-api";

export interface FeedSnapshot {
  channelId: string;
  videos: LatestVideo[];
  fetchedAt: number;
}

let database: Promise<IDBDatabase | null> | undefined;

function openDatabase() {
  if (database) return database;
  database = new Promise<IDBDatabase | null>(resolve => {
    if (typeof indexedDB === "undefined") { resolve(null); return; }
    let done = false;
    const finish = (value: IDBDatabase | null) => {
      if (done) { value?.close(); return; }
      done = true;
      clearTimeout(timer);
      resolve(value);
    };
    const timer = setTimeout(() => finish(null), 2_000);
    try {
      const request = indexedDB.open("avantis-youtube-feed", 1);
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains("channels")) request.result.createObjectStore("channels", { keyPath: "channelId" });
      };
      request.onsuccess = () => finish(request.result);
      request.onerror = () => finish(null);
      request.onblocked = () => finish(null);
    } catch { finish(null); }
  });
  return database;
}

export async function loadFeedSnapshots(channelIds: string[]): Promise<FeedSnapshot[]> {
  const db = await openDatabase();
  if (!db || channelIds.length === 0) return [];
  return new Promise(resolve => {
    let transaction: IDBTransaction;
    try { transaction = db.transaction("channels", "readonly"); } catch { resolve([]); return; }
    const snapshots: FeedSnapshot[] = [];
    const timer = setTimeout(() => { try { transaction.abort(); } catch { /* already complete */ } resolve([]); }, 3_000);
    transaction.oncomplete = () => { clearTimeout(timer); resolve(snapshots); };
    transaction.onerror = transaction.onabort = () => { clearTimeout(timer); resolve([]); };
    const store = transaction.objectStore("channels");
    for (const channelId of channelIds) {
      const request = store.get(channelId);
      request.onsuccess = () => {
        const value = request.result;
        if (value && Array.isArray(value.videos) && Number.isFinite(value.fetchedAt)) snapshots.push(value);
      };
    }
  });
}

export async function saveFeedSnapshot(snapshot: FeedSnapshot): Promise<boolean> {
  const db = await openDatabase();
  if (!db) return false;
  return new Promise(resolve => {
    let transaction: IDBTransaction;
    try { transaction = db.transaction("channels", "readwrite"); } catch { resolve(false); return; }
    const timer = setTimeout(() => { try { transaction.abort(); } catch { /* already complete */ } resolve(false); }, 3_000);
    transaction.oncomplete = () => { clearTimeout(timer); resolve(true); };
    transaction.onerror = transaction.onabort = () => { clearTimeout(timer); resolve(false); };
    try { transaction.objectStore("channels").put(snapshot); } catch { clearTimeout(timer); resolve(false); }
  });
}
