// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: String,
  avatar: String,
  bio: String,
  followers: Number,
  following: Number,
  // add other fields if needed
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
