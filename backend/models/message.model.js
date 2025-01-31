import mongoose from "mongoose";
import { connectToMongoDB } from "../db/connectToMongoDB.js";

// Đảm bảo kết nối MongoDB trước khi sử dụng
let { messagesDB } = await connectToMongoDB();
if (!messagesDB) {
    throw new Error("MongoDB MESSAGES connection has not been initialized.");
}

const messageSchema = new mongoose.Schema(
    {
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

const Message = messagesDB.model("Message", messageSchema);

export default Message;
