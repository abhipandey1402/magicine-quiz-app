import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI must be set in .env.local");
}

const uri: string = process.env.MONGODB_URI;

// Extend NodeJS.Global to store cached Mongo connection
declare global {
    // eslint-disable-next-line no-var
    var __mongo_cache:
        | { client?: MongoClient; promise?: Promise<MongoClient> }
        | undefined;
}

const cached =
    global.__mongo_cache ||
    (global.__mongo_cache = { client: undefined, promise: undefined });

if (!cached.promise) {
    const client = new MongoClient(uri);
    cached.promise = client.connect().then(() => {
        cached.client = client;
        return client;
    });
}

export default async function getClient(): Promise<MongoClient> {
    return cached.promise!;
}
