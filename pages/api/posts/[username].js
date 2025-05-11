import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import { ObjectId } from 'mongodb';

export const config = {
  api: {
    bodyParser: false,  // Disable default body parser because we use formidable
  },
};

export default async function handler(req, res) {
  await dbConnect('social-media');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  // Initialize formidable to handle file uploads
  const form = formidable({
    uploadDir: path.join(process.cwd(), 'public/uploads'),
    keepExtensions: true,
    filename: (name, ext, part, form) => part.originalFilename,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parsing error:', err);
      return res.status(500).json({ error: 'Error parsing the form' });
    }

    // Extract the caption and image from the fields and files
    const caption = fields.caption;
    const image = files.image?.[0] || files.image;

    if (!caption || !image) {
      return res.status(400).json({ error: 'Missing caption or image' });
    }

    const imagePath = '/uploads/' + path.basename(image.filepath);

    try {
      const user = await User.findById(decoded.userId);
      if (!user) return res.status(404).json({ error: 'User not found' });

      // Create new post
      const newPost = {
        _id: new ObjectId(),
        image: imagePath,
        caption,
        likes: 0,
        comments: [],
        createdAt: new Date(),
      };

      // Add post to user's profile
      user.posts.unshift(newPost);
      await user.save();

      // Respond with success
      return res.status(201).json({ message: 'Post created', post: newPost });
    } catch (dbErr) {
      console.error('Database error:', dbErr);
      return res.status(500).json({ error: 'Database error' });
    }
  });
}
