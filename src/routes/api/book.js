'use strict';
const bookController = require('../../controllers/BookController');
const { Book } = require('../../models/Book');
const AuthController = require( '../../controllers/AuthCotroller' );
const express = require('express'),
    router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to the books')
});

router.get('/getAllBook',bookController.getBooks);
router.get('/:id/getAllBookAuthor', bookController.getBookByIdAuthor);
router.get('/:id/getBookByIdCategory', bookController.getBookByIdCategory);
router.get('/getBooksByNumberRead', bookController.getBooksByNumberRead);
router.get('/:name/getBookByName', bookController.searchBook);
module.exports = router;