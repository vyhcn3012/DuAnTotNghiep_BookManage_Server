'use strict';
const bookController = require('../../controllers/BookController');
const AuthController = require( '../../controllers/AuthCotroller' );
const express = require('express'),
    router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to the books')
});

router.get('/getAllBook', AuthController.checkLogin,bookController.getBooks);
router.get('/:id/getAllBookAuthor', AuthController.checkLogin, bookController.getBookByIdAuthor);
router.post('/insertCommnet', AuthController.checkLogin, bookController.insertComment);
router.post('/update-book/:id', AuthController.checkLogin, bookController.updateBook);

router.get('/:id/getBookByIdCategory', AuthController.checkLogin, bookController.getBookByIdCategory);
router.get('/getBooksByNumberRead', AuthController.checkLogin, bookController.getBooksByNumberRead);
router.get('/:name/getBookByName', AuthController.checkLogin, bookController.searchBook);

router.post('/getChapterBook',AuthController.checkLogin, bookController.getChapterBook);
router.get('/:id/getCommentChapter', AuthController.checkLogin, bookController.getCommentChapters);

router.post('/insertBook', AuthController.checkLogin, bookController.insertBook);

router.post('/updatePriceBook', AuthController.checkLogin, bookController.updatePriceBook);

module.exports = router;