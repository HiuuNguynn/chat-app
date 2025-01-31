import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let usersDB, messagesDB;

const connectToMongoDB = async () => {
	try {
		// Kết nối USERS Database
		usersDB = await mongoose.createConnection(process.env.MONGO_USERS_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			serverSelectionTimeoutMS: 5000, // Giới hạn thời gian chờ kết nối
			tls: true
		});
		console.log("✅ Connected to USERS MongoDB");

		// Kết nối MESSAGES Database
		messagesDB = await mongoose.createConnection(process.env.MONGO_MESSAGES_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			serverSelectionTimeoutMS: 5000,
			tls: true
		});
		console.log("✅ Connected to MESSAGES MongoDB");

		return { usersDB, messagesDB };
	} catch (error) {
		console.error("❌ Error connecting to MongoDB:", error.message);
		process.exit(1);
	}
};

export { connectToMongoDB, usersDB, messagesDB };
