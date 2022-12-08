const express = require('express');
const AuthCotroller = require('../../controllers/AuthCotroller');
const BookController = require('../../controllers/BookController');
const ChapterController = require('../../controllers/ChapterController');
router = express.Router();

router.get(
    '/them-sach',
    AuthCotroller.checkLogin,
    BookController.cpanel_insertBook,
);
router.get(
    '/:id/them-chuong-sach',
    AuthCotroller.checkLogin,
    ChapterController.cpanel_insertChapterBook,
);
router.get('/quan-ly-sach', AuthCotroller.checkLogin, BookController.cpanel_authorManagerBook);
router.get('/quan-ly-sach/:id', AuthCotroller.checkLogin, BookController.cpanel_updateBook);
router.get('/quan-ly-chuong/:id', AuthCotroller.checkLogin, ChapterController.cpanel_authorManagerChapter);
router.get('/test', ChapterController.test);

module.exports = router;
