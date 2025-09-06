import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI must be set in .env.local");
}

const uri = process.env.MONGODB_URI;
let cached: { client?: MongoClient; promise?: Promise<MongoClient> } = (global as any).__mongo_cache || {};

if (!cached.promise) {
    const client = new MongoClient(uri);
    cached.promise = client.connect().then(() => {
        cached.client = client;
        return client;
    });
    (global as any).__mongo_cache = cached;
}

export default async function getClient() {
    const client = (await cached.promise) as MongoClient;
    return client;
}
