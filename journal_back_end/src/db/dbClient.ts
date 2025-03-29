import { MongoClient, Db } from "mongodb";

console.log(process.env.DATABASE_URL);
export const client = new MongoClient(process.env.DATABASE_URL ?? "", {});

client.on("connectionPoolCreated", (event) =>
    console.log("connection pool created", event)
);

client.on("connectionPoolClosed", (event) => {
    console.log("Connection pool closed", event);
});

client.on("connectionPoolCleared", (event) => {
    console.log("connection pool cleared", event);
});

client.on("connectionCreated", (event) => {
    console.log("connection created", event);
});

client.on("connectionClosed", (event) => {
    console.log("connection closed", event);
});

let db: Db | null;

export async function connectDatabase(): Promise<void> {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        db = client.db(process.env.DATABASE_NAME);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export function getDatabase(): Db {
    if (!db) {
        throw new Error("Database not connected");
    }
    return db;
}

export async function closeDatabaseConnection(): Promise<void> {
    return client.close();
}
