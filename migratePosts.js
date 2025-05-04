// migratePosts.js
import mongoose from 'mongoose';
import User from './models/User.js';
import Post from './models/Post.js';

const MONGODB_URI = 'mongodb://localhost:27017/social-media'; // replace with your URI

async function migratePosts() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const users = await User.find({});

  const postDocs = [];

  for (const user of users) {
    if (user.posts && user.posts.length > 0) {
      for (const post of user.posts) {
        postDocs.push({
          userId: user._id,
          image: post.image,
          caption: post.caption,
          likes: post.likes,
        });
      }
    }
  }

  if (postDocs.length > 0) {
    await Post.insertMany(postDocs);
    console.log(`${postDocs.length} posts migrated successfully.`);
  } else {
    console.log('No posts to migrate.');
  }

  await mongoose.disconnect();
}

migratePosts().catch((err) => {
  console.error('Migration failed:', err);
});
