import mongoose from "mongoose";
import { connectToMongoDB } from "../db/connectToMongoDB.js";

// Kết nối MongoDB trước khi sử dụng messagesDB
const { messagesDB } = await connectToMongoDB();

if (!messagesDB) {
    throw new Error("MongoDB MESSAGES connection has not been initialized.");
}

const conversationSchema = new mongoose.Schema(
    {
        participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        lastMessage: { type: String, default: "" },
    },
    { timestamps: true }
);

const Conversation = messagesDB.model("Conversation", conversationSchema);
export default Conversation;
