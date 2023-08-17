import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
 {
  user: {
   type: mongoose.Schema.Types.ObjectId,
   ref: "User", // Reference to the User model
   required: true,
  },
  post: {
   type: mongoose.Schema.Types.ObjectId,
   ref: "Post", // Reference to the Post model
   required: true,
  },
  text: {
   type: String,
   required: true,
  },
  likes: {
   type: Map,
   of: Boolean,
  },
  createdAt: {
   type: Date,
   default: Date.now,
  },
 },
 {
  timestamps: true,
 }
);

const Comment = mongoose.model("Comment", CommentSchema);

export default Comment;
