'use strict';
const bookController = require('../../controllers/BookController');
const { Book } = require('../../models/Book');
const AuthController = require( '../../controllers/AuthCotroller' );
const express = require('express'),
    router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to the books')
});

router.get('/getAllBook', AuthController.checkLogin, bookController.getBooks);

module.exports = router;