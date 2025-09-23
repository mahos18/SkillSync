const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: "users", required: true },
  receiver: { type: Schema.Types.ObjectId, ref: "users", required: true },
  content: { type: String },
  attachment: { type: String }
}, { timestamps: true });

const MessageModel = mongoose.model("messages", messageSchema);
module.exports = MessageModel;
