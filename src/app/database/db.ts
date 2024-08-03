import { Client } from "pg";

// Use the connection string provided by Supabase
const POSTGRES_URI = process.env.NEXT_PUBLIC_DB_URI;

const connection = {
  isConnected: 0,
  client: null,
};

export const connect = async () => {
  if (connection.isConnected) {
    return connection.client;
  }

  if (!POSTGRES_URI) {
    throw new Error(
      "Please define the NEXT_PUBLIC_DB_URI environment variable inside .env"
    );
  }

  // Create a new PostgreSQL client
  const client = new Client({
    connectionString: POSTGRES_URI,
  });

  try {
    await client.connect();
    console.log("Connected to PostgreSQL");
    connection.isConnected = 1;
    connection.client = client;
    return client;
  } catch (error) {
    console.error("Error connecting to PostgreSQL:", error);
    throw new Error("Failed to connect to the database");
  }
};

export const disconnect = async () => {
  if (connection.isConnected === 0 || !connection.client) return;

  try {
    await connection.client.end();
    console.log("Disconnected from PostgreSQL");
  } catch (error) {
    console.error("Error disconnecting from PostgreSQL:", error);
  }

  connection.isConnected = 0;
  connection.client = null;
};

export * as db from "./db";
export { connection };
