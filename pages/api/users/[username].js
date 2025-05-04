// pages/api/users/[username].js
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User"; // Mongoose model

export default async function handler(req, res) {
  const { username } = req.query;

  await dbConnect();

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Server error" });
  }
}
