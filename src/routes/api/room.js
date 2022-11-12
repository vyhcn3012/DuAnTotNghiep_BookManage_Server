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

module.exports = router;
