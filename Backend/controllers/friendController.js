// controllers/friendController.js
const FriendRequestModel = require('../models/FriendReuest'); // your model name/path
const UserModel = require('../models/User'); // adjust path

// send friend request
exports.sendRequest = async (req, res) => {
  try {
    const sender = req.user.id;
    const { receiverId } = req.body;
    if (!receiverId) return res.status(400).json({ success: false, msg: 'receiverId is required' });
    if (sender === receiverId) return res.status(400).json({ success: false, msg: 'Cannot send request to yourself' });

    // check receiver exists
    const receiver = await UserModel.findById(receiverId);
    if (!receiver) return res.status(404).json({ success: false, msg: 'Receiver not found' });

    // check already connected
    const senderDoc = await UserModel.findById(sender);
    if (senderDoc.connections && senderDoc.connections.includes(receiverId)) {
      return res.status(400).json({ success: false, msg: 'Already connected' });
    }

    // check existing request in either direction
    const existing = await FriendRequestModel.findOne({
      $or: [
        { sender, receiver: receiverId },
        { sender: receiverId, receiver: sender }
      ],
      status: { $in: ['pending', 'accepted'] }
    });

    if (existing) {
      if (existing.status === 'pending') return res.status(400).json({ success: false, msg: 'Request already pending' });
      if (existing.status === 'accepted') return res.status(400).json({ success: false, msg: 'Already connected' });
    }

    const request = await FriendRequestModel.create({ sender, receiver: receiverId });
    // populate sender for frontend convenience
    await request.populate('sender', 'fullName currentPosition email');

    return res.json({ success: true, msg: 'Request sent', request });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, msg: 'Server error', error: err.message });
  }
};

// get incoming (pending) requests where current user is receiver
exports.getIncomingRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const requests = await FriendRequestModel.find({ receiver: userId, status: 'pending' })
      .populate('sender', 'fullName currentPosition email skills')
      .sort({ createdAt: -1 });

    return res.json({ success: true, requests });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, msg: 'Server error', error: err.message });
  }
};

// get outgoing pending requests (optional)
exports.getOutgoingRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const requests = await FriendRequestModel.find({ sender: userId, status: 'pending' })
      .populate('receiver', 'fullName currentPosition email skills')
      .sort({ createdAt: -1 });

    return res.json({ success: true, requests });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, msg: 'Server error', error: err.message });
  }
};

// accept request (only receiver may accept)
exports.acceptRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { requestId } = req.body;
    if (!requestId) return res.status(400).json({ success: false, msg: 'requestId is required' });

    const request = await FriendRequestModel.findById(requestId);
    if (!request) return res.status(404).json({ success: false, msg: 'Request not found' });
    if (request.receiver.toString() !== userId) return res.status(403).json({ success: false, msg: 'Not authorized' });

    request.status = 'accepted';
    await request.save();

    // update both users' connections (use $addToSet to avoid duplicates)
    await UserModel.findByIdAndUpdate(request.sender, { $addToSet: { connections: request.receiver } });
    await UserModel.findByIdAndUpdate(request.receiver, { $addToSet: { connections: request.sender } });

    await request.populate('sender', 'fullName currentPosition email');
    await request.populate('receiver', 'fullName currentPosition email');

    return res.json({ success: true, msg: 'Request accepted', request });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, msg: 'Server error', error: err.message });
  }
};

// reject request (only receiver may reject)
exports.rejectRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { requestId } = req.body;
    if (!requestId) return res.status(400).json({ success: false, msg: 'requestId is required' });

    const request = await FriendRequestModel.findById(requestId);
    if (!request) return res.status(404).json({ success: false, msg: 'Request not found' });
    if (request.receiver.toString() !== userId) return res.status(403).json({ success: false, msg: 'Not authorized' });

    request.status = 'rejected';
    await request.save();

    return res.json({ success: true, msg: 'Request rejected', request });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, msg: 'Server error', error: err.message });
  }
};
