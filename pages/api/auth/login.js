//pages/api/auth/login.js
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';
export default async function handler(req, res) {
  await dbConnect('social-media');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=${86400}`);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}