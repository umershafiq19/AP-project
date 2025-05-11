import fs from 'fs';
import path from 'path';
import formidable from 'formidable'; // Handles form data parsing
import Post from '@/models/Post';
import dbConnect from '@/lib/dbConnect';


export const config = {
  api: {
    bodyParser: false, // Disable default body parsing
  },
};

const handler = async (req, res) => {
  await dbConnect();

  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(process.cwd(), '/public/uploads');
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'Error during file parsing.' });
      }

      const { caption } = fields;
      const imagePath = '/uploads/' + files.image[0].newFilename;

      try {
        const post = new Post({
          userId: 'YOUR_USER_ID',
          image: imagePath,
          caption: caption,
          likes: 0,
        });

        await post.save();
        res.status(201).json({ message: 'Post created successfully.', post });
      } catch (error) {
        res.status(500).json({ error: 'Error saving to database.' });
      }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed.' });
  }
};

export default handler;
