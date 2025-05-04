// pages/api/posts/[username].js
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export default async function handler(req, res) {
  const { username } = req.query;

  try {
    await dbConnect();

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the embedded posts array
    return res.status(200).json(user.posts || []);
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
