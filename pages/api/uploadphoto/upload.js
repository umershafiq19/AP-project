
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export const config = {
  api: {
    bodyParser: false, 
  },
};


const parseForm = (req) => {
  return new Promise((resolve, reject) => {
    const form = formidable({
      multiples: false,
      uploadDir: path.join(process.cwd(), '/public/uploads'), 
      keepExtensions: true,
    });

    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

 
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
   
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    console.log('Parsing form...');
    const { fields, files } = await parseForm(req);

    console.log('Parsed fields:', fields);
    console.log('Parsed files:', files);

    const caption = fields.caption?.[0];
    const file = files.image?.[0];

    if (!file || !caption) {
      console.error('Missing fields:', { file, caption });
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const imagePath = `/uploads/${path.basename(file.filepath)}`;

    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }


    const newPost = {
      image: imagePath,
      caption,
      likes: 0,
      createdAt: new Date(),
    };

    
    user.posts.unshift(newPost);
    await user.save();

    console.log('New Post Saved:', newPost);

    return res.status(200).json({ message: 'Upload successful', post: newPost });
  } catch (error) {
    console.error('Error uploading post:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
