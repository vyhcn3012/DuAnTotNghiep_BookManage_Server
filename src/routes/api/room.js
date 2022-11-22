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
