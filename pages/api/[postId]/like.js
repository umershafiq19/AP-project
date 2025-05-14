import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";
import User from "@/models/User";

export default async function handler(req, res) {
  const {
    query: { postId },
    method,
  } = req;

  await dbConnect();

  
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ error: "Invalid Post ID format" });
  }

  switch (method) {
    case "POST":
      try {
        const user = await User.findOne({ "posts._id": postId });
        if (!user) return res.status(404).json({ error: "User or Post not found" });

        const post = user.posts.id(postId);
        post.likes += 1;

        await user.save();
        res.status(200).json({ message: "Liked", likes: post.likes });
      } catch (err) {
        console.error("POST /like error:", err);
        res.status(500).json({ error: "Like failed" });
      }
      break;

    case "DELETE":
      try {
        const user = await User.findOne({ "posts._id": postId });
        if (!user) return res.status(404).json({ error: "User or Post not found" });

        const post = user.posts.id(postId);
        post.likes = Math.max(post.likes - 1, 0);

        await user.save();
        res.status(200).json({ message: "Unliked", likes: post.likes });
      } catch (err) {
        console.error("DELETE /like error:", err);
        res.status(500).json({ error: "Unlike failed" });
      }
      break;

    default:
      res.setHeader("Allow", ["POST", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
