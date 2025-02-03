import express from "express";
import mongoose from "mongoose";
import Message from "../models/message.model.js";

const router = express.Router();

/**
 * 📩 Lấy tin nhắn theo Conversation ID
 */
router.get("/:conversationId", async (req, res) => {
  const { conversationId } = req.params;
  console.log("📡 API Request nhận được:", conversationId);

  // Kiểm tra ObjectId hợp lệ của MongoDB
  if (!mongoose.Types.ObjectId.isValid(conversationId)) {
    console.error("❌ ERROR: Conversation ID không hợp lệ:", conversationId);
    return res.status(400).json({ error: "❌ Invalid conversation ID format" });
  }

  try {
    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 }); // Sắp xếp tin nhắn theo thời gian
    console.log("📨 Tin nhắn tìm thấy:", messages);
    res.json(messages);
  } catch (error) {
    console.error("🔥 LỖI khi lấy tin nhắn:", error.message);
    res.status(500).json({ error: "❌ Internal server error" });
  }
});

/**
 * 📝 Gửi tin nhắn mới trong cuộc trò chuyện
 */
router.post("/send/:conversationId", async (req, res) => {
  const { conversationId } = req.params;
  const { senderId, text } = req.body;

  console.log("📩 Đang gửi tin nhắn tới:", conversationId);
  console.log("👤 Người gửi:", senderId);
  console.log("✉️ Nội dung:", text);

  // Kiểm tra ID hợp lệ
  if (!mongoose.Types.ObjectId.isValid(conversationId)) {
    return res.status(400).json({ error: "❌ Invalid conversation ID format" });
  }
  if (!senderId || !text) {
    return res.status(400).json({ error: "❌ Missing sender ID or message text" });
  }

  try {
    const newMessage = new Message({
      conversationId,
      senderId,
      text,
    });

    await newMessage.save();
    console.log("✅ Tin nhắn đã lưu:", newMessage);
    res.status(201).json({ message: "✅ Message sent successfully", newMessage });
  } catch (error) {
    console.error("🔥 LỖI khi gửi tin nhắn:", error.message);
    res.status(500).json({ error: "❌ Internal server error" });
  }
});

export default router;
