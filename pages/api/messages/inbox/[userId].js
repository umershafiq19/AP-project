// pages/api/messages/inbox/[userId].js
import clientPromise from "@/lib/mongodb";
import mongoose from "mongoose";
import Conversation from "@/models/conversation";
import Message from "@/models/message";
import User from "@/models/user"; // Add user model import for avatar/username

export default async function handler(req, res) {
  const { userId } = req.query;

  if (req.method === "GET") {
    try {
      // Fetch conversations for the user
      const conversations = await Conversation.find({
        participants: { $in: [userId] }, // Find conversations involving the user
      }).populate("participants"); // Populate the participants to get their details

      // Get the last message for each conversation
      const populatedConversations = await Promise.all(
        conversations.map(async (conversation) => {
          const lastMessage = await Message.findOne({ 
            conversationId: conversation._id 
          }).sort({ timestamp: -1 }); // Get the most recent message

          const otherUser = conversation.participants.find(
            (participant) => participant !== userId
          );

          return {
            ...conversation.toObject(),
            lastMessage: lastMessage ? lastMessage.content : "No messages yet",
            avatar: otherUser.avatar, // Assuming otherUser has an avatar field
            username: otherUser.username,
          };
        })
      );

      res.status(200).json(populatedConversations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
