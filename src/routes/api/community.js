'use strict';
const CommunityController = require('../../controllers/CommunityController');
const AuthController = require( '../../controllers/AuthCotroller' );
const express = require('express'),
    router = express.Router();
router.get('/', (req, res) => {
    res.send('Welcome to the categories')
});
router.get('/getAllCommunity', AuthController.checkLogin, CommunityController.getAllCommunity);
router.get('/:account/getAllCommunityOfUser', AuthController.checkLogin, CommunityController.getAllCommunityOfUser);
module.exports = router;