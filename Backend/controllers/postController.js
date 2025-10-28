const PostModel = require('../models/Post');
const UserModel = require('../models/User');


// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { text, image, fullName, currentPosition } = req.body;
    const userId = req.user.id; // from JWT middleware

    let imagePath = null;
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    const newPost = new PostModel({
      user: userId,
      text,
      image: imagePath,
      fullName,
      currentPosition
    });

    await newPost.save();
    res.status(201).json({ success: true, post: newPost });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch feed (latest posts, lazy load support)
exports.getFeed = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || 8, 10);
    const cursor = req.query.cursor;

    const query = {};

    if (cursor) {
      const decoded = JSON.parse(Buffer.from(cursor, 'base64').toString('utf8'));
      const createdAt = new Date(decoded.createdAt);
      query.$or = [
        { createdAt: { $lt: createdAt } },
        { createdAt, _id: { $lt: decoded._id } }
      ];
    }

    let posts = await PostModel.find(query)
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit + 1)
      .populate('user', 'fullName avatar currentPosition')
      .lean();

    const hasNext = posts.length > limit;
    if (hasNext) posts = posts.slice(0, limit);

    const last = posts[posts.length - 1];
    const nextCursor = hasNext && last
      ? Buffer.from(JSON.stringify({ createdAt: last.createdAt, _id: last._id })).toString('base64')
      : null;

    res.json({ success: true, posts, nextCursor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
};
