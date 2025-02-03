import express from "express";
import mongoose from "mongoose";
import Message from "../models/message.model.js"; // Keep this import at the top

const router = express.Router();

/**
 * 📩 Lấy tin nhắn theo Conversation ID
 */router.get("/:conversationId", async (req, res) => {
  const { conversationId } = req.params;
  console.log("📡 API Request nhận được:", conversationId);

  // Kiểm tra ObjectId hợp lệ của MongoDB
  if (!mongoose.Types.ObjectId.isValid(conversationId)) {
    console.error("❌ ERROR: Conversation ID không hợp lệ:", conversationId);
    return res.status(400).json({ error: "❌ Invalid conversation ID format" });
  }

  try {
    // Tìm tất cả các tin nhắn của cuộc trò chuyện và sắp xếp theo thời gian tạo
    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
    console.log("📨 Tin nhắn tìm thấy:", messages);

    if (messages.length === 0) {
      return res.status(404).json({ error: "❌ No messages found for this conversation" });
    }

    res.json(messages); // Trả về danh sách tin nhắn
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

  // Kiểm tra nếu Conversation ID hợp lệ
  if (!mongoose.Types.ObjectId.isValid(conversationId)) {
    return res.status(400).json({ error: "❌ Invalid conversation ID format" });
  }

  // Kiểm tra xem các trường dữ liệu cần thiết có đầy đủ không
  if (!senderId || !text) {
    return res.status(400).json({ error: "❌ Missing sender ID or message text" });
  }

  try {
    // Tạo mới một tin nhắn
    const newMessage = new Message({
      conversationId,
      senderId,
      text,
    });

    await newMessage.save();
    console.log("✅ Tin nhắn đã lưu:", newMessage);

    // Trả về thông tin tin nhắn vừa gửi
    res.status(201).json({ message: "✅ Message sent successfully", newMessage });
  } catch (error) {
    console.error("🔥 LỖI khi gửi tin nhắn:", error.message);
    res.status(500).json({ error: "❌ Internal server error" });
  }
});

export default router;
