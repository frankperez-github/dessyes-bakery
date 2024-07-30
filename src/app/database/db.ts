import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";

const MONGO_URI = process.env.NEXT_PUBLIC_DB_URI;

const connection = {
    isConnected: 0,
};

export const connect = async () => {
    if (connection.isConnected) {
        return { 
            client: mongoose.connection, 
            bucket:  new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
                bucketName: "images",
            }
        )};
    }

    if (!MONGO_URI) {
        throw new Error("Please define the NEXT_PUBLIC_DB_URI environment variable inside .env");
    }

    await mongoose.connect(MONGO_URI);
    const db = mongoose.connection.db;
    const bucket = new mongoose.mongo.GridFSBucket(db, {
        bucketName: "images",
    });
    connection.isConnected = mongoose.connection.readyState;

    return{ client: mongoose.connection, bucket }
}

export const disconnect = async () => {
    if (connection.isConnected === 0) return;

    await mongoose.disconnect();
    connection.isConnected = 0;
}

export * as db from "./db";
export { connection };
