// pages/api/users/index.js
import clientPromise from "@/lib/mongodb"; // make sure this file exists

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("social-media");

    if (req.method === "GET") {
      const users = await db.collection("users").find({}).toArray();
      res.status(200).json(users);
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
