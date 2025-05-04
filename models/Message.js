// models/Message.js
import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
  senderId: String,
  receiverId: String,
  content: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});
export default mongoose.models.Message || mongoose.model("Message", messageSchema);
