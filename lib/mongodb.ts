import { MongoClient, Db } from "mongodb";

const options = {
  maxPoolSize: 10,
  minPoolSize: 5,
  maxIdleTimeMS: 30000,
};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

async function getClient(): Promise<MongoClient> {
  if (clientPromise) {
    return clientPromise;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      "Please define the MONGODB_URI environment variable."
    );
  }

  client = new MongoClient(uri, options);
  clientPromise = client.connect();

  return clientPromise;
}

export async function getDB(): Promise<Db> {
  const client = await getClient();
  return client.db("fittrackerDB");
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