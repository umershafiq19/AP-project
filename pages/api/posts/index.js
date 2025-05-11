// pages/api/posts/index.js

import formidable from "formidable";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";

export const config = {
  api: {
    bodyParser: false, // Disable default body parsing to handle file uploads
  },
};

export default async function handler(req, res) {
  await dbConnect("social-media");

  // Handle only POST method
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

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

  // Formidable configuration to handle file uploads
  const form = new formidable.IncomingForm({
    uploadDir: path.join(process.cwd(), "public/uploads"), // Save files to public/uploads
    keepExtensions: true, // Preserve file extensions
  });

  form.parse(req, async (err, fields, files) => {
    // Error handling for form parsing issues
    if (err) return res.status(500).json({ error: "Form parsing error." });

    // Destructure caption and file from the form data
    const { caption } = fields;
    const image = files.image?.[0] || files.image; // Files may be in an array

    // Validate that caption and image are provided
    if (!caption || !image) {
      return res.status(400).json({ error: "Missing caption or image." });
    }

    // Get the path of the uploaded image
    const imagePath = "/uploads/" + path.basename(image.filepath);

    try {
      // Find the user by decoded userId
      const user = await User.findById(decoded.userId);
      if (!user) return res.status(404).json({ error: "User not found." });

      // Create the new post object
      const newPost = {
        _id: new Date().getTime().toString(), // Use timestamp as ID
        image: imagePath.toString(), // Store the relative path of the image
        caption: caption.toString(),
        likes: 0, // Initial likes set to 0
        comments: [], // Initial comments as empty array
        createdAt: new Date(), // Set the creation date
      };

      // Prepend the new post to the user's posts array
      user.posts.unshift(newPost);
      
      // Save the user with the updated posts array
      await user.save();

      return res.status(201).json({ message: "Post created", post: newPost });
    } catch (dbErr) {
      console.error(dbErr);
      return res.status(500).json({ error: "Database error" });
    }
  });
}
