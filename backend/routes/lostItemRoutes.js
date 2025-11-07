const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const verifyToken = require('../middleware/authMiddleware');
const { addLostItem } = require('../controllers/lostItemController');

// POST /api/lost — add lost item
router.post('/', verifyToken, upload.single('image'), addLostItem);

module.exports = router;
