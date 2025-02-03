import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let usersDB = null;
let messagesDB = null;

const connectToMongoDB = async () => {
    try {
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

// Xuất các giá trị đúng
export { connectToMongoDB, usersDB, messagesDB };
