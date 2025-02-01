import mongoose from "mongoose";
import dotenv from "dotenv";

// Load biến môi trường từ file .env
dotenv.config();

let usersDB = null;
let messagesDB = null;

const connectToMongoDB = async () => {
    try {
        if (!process.env.MONGO_USERS_URI || !process.env.MONGO_MESSAGES_URI) {
            throw new Error("❌ Missing MongoDB URIs in .env file!");
        }

        if (!usersDB) {
            usersDB = await mongoose.createConnection(process.env.MONGO_USERS_URI, {
                serverSelectionTimeoutMS: 5000,
                tls: true,
            });
            console.log("✅ Connected to USERS MongoDB");
        }

        if (!messagesDB) {
            messagesDB = await mongoose.createConnection(process.env.MONGO_MESSAGES_URI, {
                serverSelectionTimeoutMS: 5000,
                tls: true,
            });
            console.log("✅ Connected to MESSAGES MongoDB");
        }

        return { usersDB, messagesDB };
    } catch (error) {
        console.error("❌ Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
};

export { connectToMongoDB, usersDB, messagesDB };
