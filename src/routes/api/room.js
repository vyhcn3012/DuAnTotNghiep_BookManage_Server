'use strict';
const RoomController = require('../../controllers/RoomController');
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
    '/create-room',
    [singleUpload],
    AuthController.checkLogin,
    RoomController.createRoom,
);
router.get('/get-rooms', AuthController.checkLogin, RoomController.getRooms);
router.post('/add-member', AuthController.checkLogin, RoomController.addMember);
router.post(
    '/remove-member',
    AuthController.checkLogin,
    RoomController.removeMember,
);
router.post(
    '/update-room',
    AuthController.checkLogin,
    RoomController.updateRoom,
);

module.exports = router;
