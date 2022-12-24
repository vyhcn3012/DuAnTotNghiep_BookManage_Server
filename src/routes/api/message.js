'use strict';
const MessageController = require('../../controllers/MessageController');
const AuthController = require('../../controllers/AuthCotroller');
var multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
        'storage': storage,
        // 'storage': multer.memoryStorage(),
        'limits': {
            'fileSize': 1080 * 1920 * 5
        },
        fileFilter: function (req, file, callback) {
            const allowedExtensions = new RegExp(/.(jpg|png|jpeg|gif|mp3)$/gi);
            if (!allowedExtensions.test(file.originalname)) return callback(null, false);
            return callback(null, true);
        }
      });
const singleUpload = upload.single("file");
const express = require('express'),
    router = express.Router();

router.post(
    '/get-message',
    AuthController.checkLogin,
    MessageController.getMessages,
);
router.post(
    '/send-message',
    [singleUpload],
    AuthController.checkLogin,
    MessageController.sendMessage,
);

module.exports = router;
