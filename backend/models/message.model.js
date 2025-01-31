import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
	{
		sender: { type: String, required: true },
		receiver: { type: String, required: true },
		content: { type: String, required: true },
	},
	{ timestamps: true }
);

// Kiểm tra xem global.messagesDB có tồn tại không trước khi sử dụng
const Message = global.messagesDB ? global.messagesDB.model("Message", messageSchema) : mongoose.model("Message", messageSchema);

export default Message;
