import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectToMongoDB = async () => {
	try {
		// Kết nối MongoDB USERS
		global.usersDB = mongoose.createConnection(process.env.MONGO_USERS_URI);
		console.log("✅ Connected to USERS MongoDB");

		// Kết nối MongoDB MESSAGES
		global.messagesDB = mongoose.createConnection(process.env.MONGO_MESSAGES_URI);
		console.log("✅ Connected to MESSAGES MongoDB");
	} catch (error) {
		console.error("❌ Error connecting to MongoDB:", error.message);
		process.exit(1);
	}
};

export default connectToMongoDB;
