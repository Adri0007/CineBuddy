
const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config({ path: "./config.env" })

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.DB, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let database

module.exports = {
    connectToServer: async () => {
        try {
            await client.connect(); // ✅ This actually connects the client
            database = client.db("CineBuddy");
            console.log("Successfully connected to MongoDB.");
        } catch (err) {
            console.error("MongoDB connection failed:", err);
            throw err; // optional: fail fast if DB is unavailable
        }
    },
    getDB: () => {
        if (!database) {
            throw new Error("Database not initialized. Call connectToServer first.");
        }
        return database;
    }
};
