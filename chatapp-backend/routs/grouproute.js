const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupcontroller');
// const authMiddleware = require('../middleware/auth'); // this extracts req.userId
const verifyToken = require('../confige/auth');

router.get('/joined', verifyToken, groupController.getJoinedGroups);
router.get('/messages/:groupId', groupController.getGroupMessages);

module.exports = router;
