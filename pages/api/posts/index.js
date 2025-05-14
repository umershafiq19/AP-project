

import formidable from "formidable";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";

export const config = {
  api: {
    bodyParser: false, 
  },
};

export default async function handler(req, res) {
  await dbConnect("social-media");


  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized. No token found." });
  }

  let decoded;
  try {
  
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }

  
  const form = new formidable.IncomingForm({
    uploadDir: path.join(process.cwd(), "public/uploads"), 
    keepExtensions: true, 
  });

  form.parse(req, async (err, fields, files) => {

    if (err) return res.status(500).json({ error: "Form parsing error." });

   
    const { caption } = fields;
    const image = files.image?.[0] || files.image; 


    if (!caption || !image) {
      return res.status(400).json({ error: "Missing caption or image." });
    }

    
    const imagePath = "/uploads/" + path.basename(image.filepath);

    try {
     
      const user = await User.findById(decoded.userId);
      if (!user) return res.status(404).json({ error: "User not found." });

    
      const newPost = {
        _id: new Date().getTime().toString(), 
        image: imagePath.toString(), 
        caption: caption.toString(),
        likes: 0, 
        comments: [], 
        createdAt: new Date(), 
      };

    
      user.posts.unshift(newPost);
      
      
      await user.save();

      return res.status(201).json({ message: "Post created", post: newPost });
    } catch (dbErr) {
      console.error(dbErr);
      return res.status(500).json({ error: "Database error" });
    }
  });
}
