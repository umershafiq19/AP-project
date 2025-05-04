// pages/api/posts/[username].js
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Post from "@/models/Post"; // make sure this exists

export default async function handler(req, res) {
  const { username } = req.query;

  try {
    await dbConnect();

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch posts from the Post collection using user._id
    const posts = await Post.find({ userId: user._id }).lean();

    return res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
