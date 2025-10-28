// routes/friendRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const friendController = require('../controllers/friendController');

router.post('/request', auth, friendController.sendRequest);                      // send request
router.get('/requests/incoming', auth, friendController.getIncomingRequests);   // get incoming pending requests
router.get('/requests/outgoing', auth, friendController.getOutgoingRequests);   // optional: outgoing
router.post('/accept', auth, friendController.acceptRequest);                   // accept
router.post('/reject', auth, friendController.rejectRequest);                   // reject

module.exports = router;
