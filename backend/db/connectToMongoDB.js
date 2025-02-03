import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectToMongoDB = async () => {
  try {
    // Kết nối USERS Database
    const usersDB = mongoose.createConnection(process.env.MONGO_USERS_URI);
    console.log("✅ Connected to USERS MongoDB");

    // Kết nối MESSAGES Database
    const messagesDB = mongoose.createConnection(process.env.MONGO_MESSAGES_URI);
    console.log("✅ Connected to MESSAGES MongoDB");

    return { usersDB, messagesDB };
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};
