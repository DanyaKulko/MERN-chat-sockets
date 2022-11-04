const router = require('express').Router();
const authMiddleware = require('../middlewares/auth.middleware');
const {getAllChats, getChat} = require("../controllers/chatController");

router.get('/getChats', authMiddleware, getAllChats)
router.get('/getChat', authMiddleware, getChat)

module.exports = router;