import mongoose from "mongoose";
import { connectToMongoDB } from "../db/connectToMongoDB.js";

// Đảm bảo kết nối MongoDB trước khi sử dụng
let { usersDB } = await connectToMongoDB();
if (!usersDB) {
    throw new Error("MongoDB USERS connection has not been initialized.");
}

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

const User = usersDB.model("User", userSchema);

export default User;
