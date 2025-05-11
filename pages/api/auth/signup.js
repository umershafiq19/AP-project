import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, email, password, name, gender, dob } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      return res.status(400).json({ error: 'Email or username already exists' });
    }

    const user = new User({ username, email, password, name, gender, dob });
    await user.save();

    return res.status(201).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
