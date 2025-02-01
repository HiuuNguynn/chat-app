import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        if (!conversationId) return res.status(400).json({ error: "Conversation ID is required." });

        // Kiểm tra kết nối MongoDB
        if (!Conversation.db) {
            throw new Error("MongoDB MESSAGES connection has not been initialized.");
        }

        const conversation = await Conversation.findOne({ _id: conversationId });
        if (!conversation) return res.status(404).json({ error: "Conversation not found" });

        const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: error.message });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { conversationId, senderId, message } = req.body;
        if (!conversationId || !senderId || !message) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Kiểm tra kết nối MongoDB
        if (!Conversation.db) {
            throw new Error("MongoDB MESSAGES connection has not been initialized.");
        }

        const conversation = await Conversation.findOne({ _id: conversationId });
        if (!conversation) return res.status(404).json({ error: "Conversation not found" });

        const newMessage = new Message({
            conversationId,
            senderId,
            message,
        });

        await newMessage.save();

        // Cập nhật thời gian cập nhật của cuộc trò chuyện
        conversation.updatedAt = Date.now();
        await conversation.save();

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: error.message });
    }
};
