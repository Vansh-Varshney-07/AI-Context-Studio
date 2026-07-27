import { openDB, type DBSchema, type IDBPDatabase } from "idb";

interface AssetStoreSchema extends DBSchema {
  assets: {
    key: string;
    value: {
      id: string;
      kind: string;
      title: string;
      description: string;
      category?: string;
      tags: string[];
      favorite: boolean;
      pinned: boolean;
      content: unknown;
      metadata: Record<string, string>;
      createdAt: string;
      updatedAt: string;
    };
    indexes: { "by-kind": string; "by-category": string; "by-updated": string };
  };
  keys: {
    key: string;
    value: {
      id: string;
      providerId: string;
      encryptedKey: string;
      createdAt: string;
    };
  };
  exports: {
    key: string;
    value: {
      id: string;
      name: string;
      assets: string[];
      format: "json" | "markdown" | "zip";
      createdAt: string;
    };
    indexes: { "by-created": string };
  };
}

let dbInstance: IDBPDatabase<AssetStoreSchema> | null = null;

export async function getDB(): Promise<IDBPDatabase<AssetStoreSchema>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<AssetStoreSchema>("ai-context-studio", 1, {
    upgrade(db) {
      const assetStore = db.createObjectStore("assets", { keyPath: "id" });
      assetStore.createIndex("by-kind", "kind");
      assetStore.createIndex("by-category", "category");
      assetStore.createIndex("by-updated", "updatedAt");

      db.createObjectStore("keys", { keyPath: "id" });

      const exportStore = db.createObjectStore("exports", { keyPath: "id" });
      exportStore.createIndex("by-created", "createdAt");
    },
  });

  return dbInstance;
}

export interface Asset {
  id: string;
  kind: string;
  title: string;
  description: string;
  category?: string;
  tags: string[];
  favorite: boolean;
  pinned: boolean;
  content: unknown;
  metadata: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export async function saveAsset(asset: Asset): Promise<void> {
  const db = await getDB();
  await db.put("assets", asset);
}

export async function getAsset(id: string): Promise<Asset | undefined> {
  const db = await getDB();
  return db.get("assets", id);
}

export async function getAllAssets(): Promise<Asset[]> {
  const db = await getDB();
  return db.getAll("assets");
}

export async function getAssetsByKind(kind: string): Promise<Asset[]> {
  const db = await getDB();
  return db.getAllFromIndex("assets", "by-kind", kind);
}

export async function getAssetsByCategory(category: string): Promise<Asset[]> {
  const db = await getDB();
  return db.getAllFromIndex("assets", "by-category", category);
}

export async function getRecentAssets(limit = 20): Promise<Asset[]> {
  const db = await getDB();
  const all = await db.getAllFromIndex("assets", "by-updated");
  return all
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit);
}

export async function getPinnedAssets(): Promise<Asset[]> {
  const db = await getDB();
  const all = await db.getAll("assets");
  return all.filter((a) => a.pinned).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export async function getFavoriteAssets(): Promise<Asset[]> {
  const db = await getDB();
  const all = await db.getAll("assets");
  return all.filter((a) => a.favorite).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export async function deleteAsset(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("assets", id);
}

export async function searchAssets(query: string): Promise<Asset[]> {
  const db = await getDB();
  const all = await db.getAll("assets");
  const q = query.toLowerCase();
  return all.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      a.tags.some((t) => t.toLowerCase().includes(q)) ||
      a.category?.toLowerCase().includes(q)
  );
}

export interface StoredKey {
  id: string;
  providerId: string;
  encryptedKey: string;
  createdAt: string;
}

export async function saveKey(providerId: string, encryptedKey: string): Promise<void> {
  const db = await getDB();
  const id = `${providerId}-${Date.now()}`;
  await db.put("keys", { id, providerId, encryptedKey, createdAt: new Date().toISOString() });
}

export async function getKeysForProvider(providerId: string): Promise<StoredKey[]> {
  const db = await getDB();
  const all = await db.getAll("keys");
  return all.filter((k) => k.providerId === providerId);
}

export async function deleteKey(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("keys", id);
}
