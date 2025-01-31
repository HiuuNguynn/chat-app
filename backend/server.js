import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
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
        origin: "*",
        methods: ["GET", "POST"],
    },
});

// Middleware
app.use(express.json());
app.use(cookieParser());

const startServer = async () => {
    try {
        await connectToMongoDB(); // Đảm bảo kết nối MongoDB trước khi sử dụng models

        // Routes
        app.use("/api/auth", authRoutes);
        app.use("/api/messages", messageRoutes);
        app.use("/api/users", userRoutes);

        // Serve frontend
        const __dirname = path.resolve();
        app.use(express.static(path.join(__dirname, "/frontend/dist")));

        app.get("*", (req, res) => {
            res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
        });

        const PORT = process.env.PORT || 5000;
        server.listen(PORT, () => {
            console.log(`🚀 Server Running on port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error);
    }
};

startServer();
