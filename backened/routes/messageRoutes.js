const express =require('express');
const { protect } = require('../middlewares/authMiddleware');
const {sendMessage, allMessages} = require("../controllers/messageControllers");
// First route is to send message and second route is to fetch messages >>>>>>>>>>>
const router = express.Router();

// Route for sending the messages .>
router.route('/').post(protect, sendMessage);

// Route for fetch all chats associated with single chat >>>>
router.route('/:chatId').get(protect, allMessages);

module.exports= router