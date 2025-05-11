import jwt from 'jsonwebtoken';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';

export default async function handler(req, res) {
  await dbConnect('social-media');

  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('username');

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ username: user.username });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}
