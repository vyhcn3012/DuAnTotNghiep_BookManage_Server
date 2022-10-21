'use strict';
const MessageController = require('../../controllers/MessageController');
const AuthController = require( '../../controllers/AuthCotroller' );

const express = require('express'),
    router = express.Router();
router.post("getMessages", MessageController.getMessages);
module.exports = router;