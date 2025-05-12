import dbConnect from '@/lib/dbConnect';
import Message from '@/models/Message'; // Correct the path if necessary

export default async function handler(req, res) {
  const { conversationId } = req.query;

  if (req.method === 'GET') {
    await dbConnect();

    try {
      const [senderId, receiverId] = conversationId.split('-'); // Assuming you split the conversationId into senderId and receiverId

      const messages = await Message.find({
        $or: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      }).sort({ timestamp: 1 }); // Sort by timestamp, in case you want the messages in chronological order

      if (messages.length > 0) {
        res.status(200).json(messages);
      } else {
        res.status(404).json({ message: 'No messages found' });
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ message: 'Error fetching messages', error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
