// models/Post.js
import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  image: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  }
});

const Post = mongoose.models?.Post || mongoose.model('Post', PostSchema);

export default Post;
