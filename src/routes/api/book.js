'use strict';

const express = require('express'),
    router = express.Router();
const AuthController = require('../../controllers/AuthController');
const BookController = require('../../controllers/BookController');



router.get('/get-for-home-page', AuthController.checkLogin, ProductController.getForHomePage);
module.exports = router;