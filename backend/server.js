import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import { connectToMongoDB } from "./db/connectToMongoDB.js"; // Sửa lỗi import
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Cấu hình CORS để tránh lỗi frontend
    methods: ["GET", "POST"]
  }
});

const __dirname = path.resolve();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

// Kết nối MongoDB trước khi khởi động server
connectToMongoDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server Running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err.message);
  });

// Xử lý Socket.IO (tùy chỉnh)
io.on("connection", (socket) => {
  console.log("🔌 A user connected:", socket.id);
  
  socket.on("disconnect", () => {
    console.log("🔌 A userdsa disconnected:", socket.id);
  });
});

export { app, server };
