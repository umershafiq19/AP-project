import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: String,
  avatar: String,
  bio: String,
  followers: { type: Number, default: 0 },
  following: { type: Number, default: 0 },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
});

// Avoid redefining the model on hot reloads in dev
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
