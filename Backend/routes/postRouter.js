const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middlewares/authMiddleware'); // JWT middleware
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Create post
router.post('/add',auth, upload.single('image'), postController.createPost);
router.get('/feed', postController.getFeed);


module.exports = router;
