import { MongoClient, Db } from "mongodb";
import { getConfig } from './config';

const options = {
  maxPoolSize: 10,
  minPoolSize: 5,
  maxIdleTimeMS: 30000,
};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

/**
 * Lazy initialization — getClient() is only called at request time,
 * never at module import time. This makes Docker builds safe because
 * MONGODB_URI is only read when a real request comes in.
 */
async function getClient(): Promise<MongoClient> {
  if (clientPromise) {
    return clientPromise;
  }

  const { mongodb } = getConfig();

  client = new MongoClient(mongodb.uri, options);
  clientPromise = client.connect();

  return clientPromise;
}

export async function getDB(): Promise<Db> {
  const client = await getClient();
  const { mongodb } = getConfig();
  return client.db(mongodb.dbName);
}

export async function testConnection(): Promise<boolean> {
  try {
    const client = await getClient();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ MongoDB connected");
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}