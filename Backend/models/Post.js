const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "users", required: true },
  text: { type: String },
  image: { type: String },
  likes: [{ type: Schema.Types.ObjectId, ref: "users" }]
}, { timestamps: true });

const PostModel = mongoose.model("posts", postSchema);
module.exports = PostModel;
