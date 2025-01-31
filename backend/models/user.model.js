import mongoose from "mongoose";
import { usersDB } from "../db/connectToMongoDB.js";

const userSchema = new mongoose.Schema(
	{
		fullName: { type: String, required: true },
		username: { type: String, required: true, unique: true },
		password: { type: String, required: true, minlength: 6 },
		gender: { type: String, required: true, enum: ["male", "female"] },
		profilePic: { type: String, default: "" },
	},
	{ timestamps: true }
);

// Kiểm tra kết nối USERS MongoDB
if (!usersDB) {
	throw new Error("❌ MongoDB USERS connection has not been initialized.");
}

const User = usersDB.model("User", userSchema);

export default User;
