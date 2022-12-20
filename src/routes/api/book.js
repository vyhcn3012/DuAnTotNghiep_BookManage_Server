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
router.post('/update-book/:id', AuthController.checkLogin, bookController.updateBook);

router.get('/:id/getBookByIdCategory', bookController.getBookByIdCategory);
router.get('/getBooksByNumberRead', bookController.getBooksByNumberRead);
router.get('/:name/getBookByName', bookController.searchBook);

router.post('/getChapterBook',AuthController.checkLogin, bookController.getChapterBook);
router.get('/:id/getCommentChapter', bookController.getCommentChapters);

router.post('/insertBook', AuthController.checkLogin, bookController.insertBook);

router.post('/updatePriceBook', bookController.updatePriceBook);

module.exports = router;