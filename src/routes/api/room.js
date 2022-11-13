'use strict';
const RoomController = require('../../controllers/RoomController');
const AuthController = require('../../controllers/AuthCotroller');
const express = require('express'),
    router = express.Router();

router.post(
    '/create-room',
    AuthController.checkLogin,
    RoomController.createRoom,
);
router.get('/get-rooms', AuthController.checkLogin, RoomController.getRooms);

module.exports = router;
