import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  image: String,
  caption: String,
  likes: { type: Number, default: 0 },
  comments: [String],
  
});

export default mongoose.models.Post || mongoose.model("Post", PostSchema);
