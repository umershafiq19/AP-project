// /pages/api/messages/start.js
import dbConnect from '@/lib/dbConnect';
import Conversation from '@/models/Conversation';
import Message from '@/models/Message';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { recipient, message } = req.body;
  const sender ='alicej'; // Replace with logged-in user logic

  try {
    await dbConnect();

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [sender, recipient] }
    });

    if (!conversation) {
      // Create new conversation
      conversation = await Conversation.create({
        participants: [sender, recipient],
        lastMessage: message,
        timestamp: new Date()
      });
    }

    // Create the first message
    const newMessage = await Message.create({
      conversationId: conversation._id,
      sender,
      text: message,
      timestamp: new Date()
    });

    res.status(200).json({ conversationId: conversation._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
