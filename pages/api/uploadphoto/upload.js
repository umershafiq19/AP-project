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
  await dbConnect('social-media');

  if (req.method === 'POST') {
    const token = req.cookies.token;
    
      // Check if token is provided
      if (!token) {
        return res.status(401).json({ error: "Unauthorized. No token found." });
      }
    
      let decoded;
      try {
        // Verify the token and extract user data
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token." });
      }
    const form = new formidable.IncomingForm({
        uploadDir: path.join(process.cwd(), "public/uploads"), // Save files to public/uploads
        keepExtensions: true, // Preserve file extensions
      });
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'Error during file parsing.' });
      }

      const { caption } = fields;
      const imagePath = '/uploads/' + files.image[0].newFilename;

      try {
        const post = new Post({
          userId: new Date().getTime().toString(),
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
