'use strict';
const AuthController = require( '../../controllers/AuthCotroller' );
const express = require('express'),
    router = express.Router();
const passport = require('passport');
router.get('/', (req, res) => {
    res.send('Welcome to the auth')
});

router.post( '/login', AuthController.login );
router.post( '/logout', AuthController.logout );
router.get( '/logoutWeb',AuthController.checkLogin, AuthController.logoutWeb );
module.exports = router;