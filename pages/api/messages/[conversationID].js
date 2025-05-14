// pages/api/messages/[conversationId].js
import dbConnect from "@/lib/dbConnect";
import Message from "@/models/Message";

export default async function handler(req, res) {
  const { conversationId } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await dbConnect();

  try {
    const messages = await Message.find({ conversationId })
      .sort({ timestamp: 1 }); // oldest → newest

    return res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({ message: "Error fetching messages", error });
  }
}
