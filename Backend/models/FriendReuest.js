const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const friendRequestSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: "users", required: true },
  receiver: { type: Schema.Types.ObjectId, ref: "users", required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending"
  }
}, { timestamps: true });

const FriendRequestModel = mongoose.model("friendrequests", friendRequestSchema);
module.exports = FriendRequestModel;


// Send Request
// const FriendRequest = require("./models/FriendRequest");

// // send a friend request
// const sendRequest = async (senderId, receiverId) => {
//   const request = new FriendRequest({ sender: senderId, receiver: receiverId });
//   await request.save();
//   return request;
// };

// Accept Request
// const acceptRequest = async (requestId) => {
//   const request = await FriendRequest.findById(requestId);
//   if (!request) throw new Error("Request not found");

//   request.status = "accepted";
//   await request.save();

//   // also update users' connections
//   await User.findByIdAndUpdate(request.sender, { $addToSet: { connections: request.receiver } });
//   await User.findByIdAndUpdate(request.receiver, { $addToSet: { connections: request.sender } });

//   return request;
// };


// Reject Request
// const rejectRequest = async (requestId) => {
//   const request = await FriendRequest.findById(requestId);
//   if (!request) throw new Error("Request not found");

//   request.status = "rejected";
//   await request.save();
//   return request;
// };
