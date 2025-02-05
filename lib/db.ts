import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_LOCAL = process.env.MONGODB_LOCAL;
const NODE_ENV = process.env.NODE_ENV;
const DB_NAME = process.env.DB_NAME!;

if(!MONGODB_URI){
    throw new Error("Please Set mongo db uri in env file !")
}

let cached = global.mongoose;

if(!cached){
    cached = global.mongoose = {
        conn : null,
        promise : null
    }
}

export async function connectToDatabase() {
    if(cached.conn){
        return cached.conn;
    }
    if(!cached.promise){
        const opts = {
            bufferCommands : true,
            maxPoolSize : 10,
        }
    
        cached.promise = mongoose.connect(`${MONGODB_LOCAL}/${DB_NAME}`,opts)
        .then(()=>mongoose.connection)
        .catch()
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        throw error;
    }

    return cached.conn;
}