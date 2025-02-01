import mongoose from "mongoose";
import { connectToMongoDB, messagesDB } from "../db/connectToMongoDB.js";

// Đảm bảo MongoDB đã kết nối trước khi sử dụng
await connectToMongoDB();

if (!messagesDB) {
    throw new Error("❌ MongoDB MESSAGES connection has not been initialized.");
}

// Định nghĩa schema cho Conversation
const conversationSchema = new mongoose.Schema(
    {
        participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        lastMessage: { type: String, default: "" },
        updatedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

// Tạo model Conversation từ messagesDB
const Conversation = messagesDB.model("Conversation", conversationSchema);

export default Conversation;
