import mongoose from "mongoose";
import { messagesDB } from "../db/connectToMongoDB.js";

const messageSchema = new mongoose.Schema(
	{
		sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		content: { type: String, required: true },
	},
	{ timestamps: true }
);

// Kiểm tra kết nối MESSAGES MongoDB
if (!messagesDB) {
	throw new Error("❌ MongoDB MESSAGES connection has not been initialized.");
}

const Message = messagesDB.model("Message", messageSchema);

export default Message;
