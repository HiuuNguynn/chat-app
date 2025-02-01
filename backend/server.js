import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectToMongoDB } from "./db/connectToMongoDB.js"; // Import đúng kiểu named export
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";
import { app, server } from "./socket/socket.js";

dotenv.config();

const __dirname = path.resolve();
const PORT = process.env.PORT || 5000;

// ✅ Kết nối MongoDB trước khi server lắng nghe
(async () => {
    try {
        await connectToMongoDB(); // Gọi kết nối database trước
        console.log("✅ MongoDB connections established.");

        server.listen(PORT, () => {
            console.log(`🚀 Server Running on port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error.message);
        process.exit(1); // Thoát nếu không thể kết nối database
    }
})();

// ✅ Middleware
app.use(express.json()); 
app.use(cookieParser());

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// ✅ Route kiểm tra server hoạt động
app.get("/", (req, res) => {
    res.send("🔥 API is running! 🔥");
});

// ✅ Cấu hình để phục vụ frontend từ thư mục `/frontend/dist`
app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

// ✅ Xử lý lỗi 404 (Not Found)
app.use((req, res, next) => {
    res.status(404).json({ message: "❌ API route not found" });
});

// ✅ Xử lý lỗi server chung
app.use((err, req, res, next) => {
    console.error("❌ Server Error:", err);
    res.status(500).json({ message: "❌ Internal Server Error" });
});
