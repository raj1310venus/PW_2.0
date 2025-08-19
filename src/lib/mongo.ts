// Optional MongoDB connector. Falls back to undefined if MONGODB_URI is not set
// or if the 'mongodb' package is not installed yet.

import type { MongoClient, Db, Collection, Document } from "mongodb";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function getMongoDb(): Promise<Db | null> {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || "pricewar";
  if (!uri) return null;
  try {
    if (!cachedClient) {
      const mod = (await import("mongodb")) as typeof import("mongodb");
      const { MongoClient: MC } = mod;
      cachedClient = new MC(uri, { ignoreUndefined: true });
      await cachedClient.connect();
      cachedDb = cachedClient.db(dbName);
    }
    return cachedDb!;
  } catch (e) {
    console.warn("MongoDB unavailable, using in-memory store.", e);
    return null;
  }
}

export async function getCollection<T extends Document = Document>(name: string): Promise<Collection<T> | null> {
  const db = await getMongoDb();
  return db ? db.collection<T>(name) : null;
}
