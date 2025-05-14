import dbConnect from "@/lib/dbConnect";
import Message from "@/models/Message";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  await dbConnect();

  try {
    const { senderId, receiverId, content, timestamp } = req.body;

    const message = await Message.create({
      senderId,
      receiverId,
      content,
      timestamp,
    });

    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send message" });
  }
}
