import mongoose from "mongoose";

//define the connection cache type
type MongooseCache = {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

//extend the global object to include our mongoose cache
declare global {
    //eslint-disable-next-line no-var, vars-on-top
    var mongooseCache: MongooseCache | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}


//initialize the cache on the global object to persist across hot reloads in development
let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongoose) {
    global.mongoose = cached;
}

/**
 * Establishes a connection to MongoDB using Mongoose
 * Caches the connection to prevent multiple connections during development with hot reloads
 * @returns A promise that resolves to the Mongoose connection
 */
async function connectDB(): Promise<typeof mongoose> {
    //return existing connection if it exists
    if (cached.conn) {
        return cached.conn;
    }

    //create a new connection promise if one doesn't already exist
    if (!cached.promise) {
        const options = {
            bufferCommands: false, // disable mongoose buffering to fail fast if not connected
        }
        //create a new connection promise
        cached.promise = mongoose.connect(MONGODB_URI!, options);
    }

    try {
        //wait for the connection promise to resolve and cache the connection
        cached.conn = await cached.promise;
    } catch (error) {
        //reset the cache on error to allow retries
        cached.promise = null;
        throw error;
    }

    return cached.conn;
}

export default connectDB;