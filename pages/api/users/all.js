// pages/api/users/all.js
import connectDB from "../../../lib/dbConnect";
import dbConnect from "@/lib/dbConnect";
import User from "../../../models/User";

export default async function handler(req, res) {
  await connectDB();

  const currentUserId = req.query.currentUserId;
  try {
    const users = await User.find({ _id: { $ne: currentUserId } }, "username avatar");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error });
  }
}
