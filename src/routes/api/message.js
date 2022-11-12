'use strict';
const MessageController = require('../../controllers/MessageController');
const AuthController = require('../../controllers/AuthCotroller');

const express = require('express'),
    router = express.Router();

router.post(
    '/get-message',
    AuthController.checkLogin,
    MessageController.getMessages,
);
router.post(
    '/send-message',
    AuthController.checkLogin,
    MessageController.sendMessage,
);

module.exports = router;
