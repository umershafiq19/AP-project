// pages/api/posts.js

import { connectToDatabase } from '../../lib/mongodb';

export default async function handler(req, res) {
  const { username } = req.query; // assuming you're passing the username in the query

  const { db } = await connectToDatabase();

  const posts = await db.collection('posts').find({ username }).toArray();

  res.status(200).json(posts);
}
