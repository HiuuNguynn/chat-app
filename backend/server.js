import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import { connectToMongoDB } from "./db/connectToMongoDB.js";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Cấu hình CORS tránh lỗi frontend
    methods: ["GET", "POST"],
  },
});

const __dirname = path.resolve();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// Định tuyến API
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// Serve frontend (React/Vue)
app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

// 🚀 **Kết nối MongoDB trước khi khởi động server**
connectToMongoDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server Running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err.message);
  });

// 🔌 **Xử lý Socket.IO**
io.on("connection", (socket) => {
  console.log("🔌 A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔌 A user disconnected:", socket.id);
  });
});

// ✅ **API Debugging - Check Conversation ID**
app.get('/api/messages/:conversationId', async (req, res) => {
  const { conversationId } = req.params;
  console.log("📡 API Request nhận được:", conversationId);

  // Kiểm tra ObjectId hợp lệ của MongoDB
  if (!mongoose.Types.ObjectId.isValid(conversationId)) {
    return res.status(400).json({ error: "❌ Invalid conversation ID format" });
  }

  try {
    const messages = await Message.find({ conversationId });
    res.json(messages);
  } catch (error) {
    console.error("🔥 Error fetching messages:", error.message);
    res.status(500).json({ error: "❌ Internal server error" });
  }
});

export { app, server };
