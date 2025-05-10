import dbConnect from '@/lib/dbConnect';
import Conversation from '@/models/conversation';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const conversations = await Conversation.find({}).sort({ updatedAt: -1 });
      res.status(200).json(conversations);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch conversations' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  };
}
