import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load biến môi trường từ .env

const connectToMongoDB = async () => {
	try {
		const usersDB = await mongoose.createConnection(process.env.MONGO_USERS_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("✅ Connected to USERS MongoDB");

		const messagesDB = await mongoose.createConnection(process.env.MONGO_MESSAGES_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("✅ Connected to MESSAGES MongoDB");

		// Lưu kết nối vào global
		global.usersDB = usersDB;
		global.messagesDB = messagesDB;
		
		return { usersDB, messagesDB };
	} catch (error) {
		console.log("❌ Error connecting to MongoDB:", error.message);
		process.exit(1);
	}
};

export default connectToMongoDB;
