
import clientPromise from "@/lib/mongodb";
import mongoose from "mongodb";

export default async function handler(req, res) {
  const { username } = req.query;

  if (req.method !== "GET") {
    return res.status(405).end("Method Not Allowed");
  }

  try {
    const client = await clientPromise;
    const db = client.db("social-media"); 

    const user = await db.collection("users").findOne(
      { username },
      { projection: { password: 0 } } 
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ ...user, posts: user.posts || [] });
  } catch (err) {
    console.error("Failed to fetch user profile:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
