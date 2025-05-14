
import clientPromise from "@/lib/mongodb";
import mongoose from "mongoose";
import Conversation from "@/models/conversation";
import Message from "@/models/Message";
import User from "@/models/User"; 

export default async function handler(req, res) {
  const { userId } = req.query;
  if (mongoose.connection.readyState === 0) {
  const client = await clientPromise;
  await mongoose.connect(process.env.MONGODB_URI);
}
  if (req.method === "GET") {
    try {
      
      const conversations = await Conversation.find({
        participants: { $in: [userId] }, 
      }).populate("participants"); 
      
     const populatedConversations = await Promise.all(
  conversations.map(async (conversation) => {
    const lastMessage = await Message.findOne({ 
      conversationId: conversation._id 
    }).sort({ timestamp: -1 });

    const otherUser = conversation.participants.find(
      (participant) => participant._id.toString() !== userId
    );

    return {
      ...conversation.toObject(),
      lastMessage: lastMessage ? lastMessage.content : "No messages yet",
      avatar: otherUser?.avatar || null,
      username: otherUser?.username || "Unknown",
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
