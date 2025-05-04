import mongoose from 'mongoose';

const ConversationSchema = new mongoose.Schema({
  participants: [String], // array of usernames or user IDs
  lastMessage: String,
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.models.ConversationSchemaonversationSchemaonversation || mongoose.model('Conversation', ConversationSchema);
