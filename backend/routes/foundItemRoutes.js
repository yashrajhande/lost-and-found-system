const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const verifyToken = require('../middleware/authMiddleware');
const { addFoundItem } = require('../controllers/foundItemController');

router.post('/', verifyToken, upload.single('image'), addFoundItem);

module.exports = router;
