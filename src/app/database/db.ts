import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";

const MONGO_URI = process.env.dbURI;

interface Connection {
    isConnected: number;
    gfs: any; 
    bucket: GridFSBucket | null; 
}

const connection: Connection = {
    isConnected: 0,
    gfs: null,
    bucket: null,
};

export const connect = async () => {
    if (connection.isConnected) {
        return;
    }

    if (mongoose.connections.length > 0) {
        connection.isConnected = mongoose.connections[0].readyState;
        if (connection.isConnected === 1) {
            return;
        }
        await mongoose.disconnect();
    }

    if (!MONGO_URI) {
        throw new Error("Please define the dbURI environment variable inside .env");
    }

    const db = await mongoose.connect(MONGO_URI);
    connection.isConnected = mongoose.connection.readyState;

}

export const disconnect = async () => {
    if (connection.isConnected === 0) return;

    await mongoose.disconnect();
    connection.isConnected = 0;
    connection.bucket = null;
}

export * as db from "./db";
export { connection };
