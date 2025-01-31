import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";

dotenv.config(); // Load biến môi trường

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.use(express.static(path.join(path.resolve(), "/frontend/dist")));

app.get("*", (req, res) => {
	res.sendFile(path.join(path.resolve(), "frontend", "dist", "index.html"));
});

server.listen(PORT, async () => {
	const { usersDB, messagesDB } = await connectToMongoDB();
	if (!usersDB || !messagesDB) {
		console.error("❌ MongoDB connection failed. Exiting...");
		process.exit(1);
	}
	console.log(`🚀 Server Running on port ${PORT}`);
});
