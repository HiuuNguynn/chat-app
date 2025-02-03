import express from "express";
import mongoose from "mongoose";
import Message from "../models/message.model.js";

const router = express.Router();

router.get("/:conversationId", async (req, res) => {
  const { conversationId } = req.params;
  console.log("📡 API Request nhận được:", conversationId);

  // Kiểm tra ObjectId hợp lệ của MongoDB
  if (!mongoose.Types.ObjectId.isValid(conversationId)) {
    console.error("❌ ERROR: Conversation ID không hợp lệ:", conversationId);
    return res.status(400).json({ error: "❌ Invalid conversation ID format" });
  }

  try {
    const messages = await Message.find({ conversationId });
    console.log("📨 Tin nhắn tìm thấy:", messages);
    res.json(messages);
  } catch (error) {
    console.error("🔥 LỖI khi lấy tin nhắn:", error.message);
    res.status(500).json({ error: "❌ Internal server error" });
  }
});

export default router;
