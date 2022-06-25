'use strict';
const bookController = require('../../controllers/BookController');
const AuthController = require( '../../controllers/AuthCotroller' );
const express = require('express'),
    router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to the books')
});

router.get('/getAllBook',bookController.getBooks);
router.get('/:id/getAllBookAuthor', bookController.getBookByIdAuthor);
router.post('/insertCommnet', bookController.insertComment);
router.get('/getComment', bookController.getComments);

module.exports = router;