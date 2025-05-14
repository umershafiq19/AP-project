// pages/api/posts/[id]/like.js
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  await dbConnect();

  const {
    query: { id },
    method,
  } = req;

  // Get user from cookie token
  const token = await getToken({ req });
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  const userId = token.sub;

  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (method === "POST") {
      // Add like if not already liked
      if (!post.likes.includes(userId)) {
        post.likes.push(userId);
        await post.save();
      }
      return res.status(200).json({ message: "Liked" });
    } else if (method === "DELETE") {
      // Remove like if already liked
      post.likes = post.likes.filter(uid => uid.toString() !== userId);
      await post.save();
      return res.status(200).json({ message: "Unliked" });
    } else {
      res.setHeader("Allow", ["POST", "DELETE"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}
