import mongoose from 'mongoose';

// Define the schema for a Post
const PostSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to the 'User' model
    required: true
  },
  image: {
    type: String,
    required: true  // The image URL is required
  },
  caption: {
    type: String,
    required: true  // The caption is required
  },
  likes: {
    type: Number,
    default: 0  // Default value for likes is 0
  },
  // Add any other necessary fields for posts (e.g., comments, timestamp)
});

// Ensure we don't re-define the model if it already exists in the mongoose.models object
const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

export default Post;
