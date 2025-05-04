// pages/api/messages/send.js
import clientPromise from "@/lib/mongodb";
import Message from "@/models/message";
import Conversation from "@/models/conversation";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { senderId, receiverId, content } = req.body;

      // Check if a conversation already exists
      let conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] },
      });

      // If no conversation exists, create a new one
      if (!conversation) {
        conversation = new Conversation({
          participants: [senderId, receiverId],
          lastMessage: content,
        });
        await conversation.save();
      } else {
        // Update last message in existing conversation
        conversation.lastMessage = content;
        await conversation.save();
      }

      // Save the new message
      const newMessage = new Message({
        senderId,
        receiverId,
        content,
        timestamp: new Date(),
        conversationId: conversation._id,
      });

      await newMessage.save();
      res.status(201).json(newMessage);
    } catch (error) {
      res.status(500).json({ error: "Failed to send message" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
