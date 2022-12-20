const express = require('express');
const AuthCotroller = require('../../controllers/AuthCotroller');
const BookController = require('../../controllers/BookController');
const ChapterController = require('../../controllers/ChapterController');
router = express.Router();

router.get(
    '/them-sach',
    AuthCotroller.checkLogin,
    AuthCotroller.isAuthor,
    BookController.cpanel_insertBook,
);
router.get(
    '/:id/them-chuong-sach',
    AuthCotroller.checkLogin,
    AuthCotroller.isAuthor,
    ChapterController.cpanel_insertChapterBook,
);
router.get('/quan-ly-sach', AuthCotroller.checkLogin, AuthCotroller.isAuthor, BookController.cpanel_authorManagerBook);
router.get('/quan-ly-sach/:id', AuthCotroller.checkLogin, AuthCotroller.isAuthor, BookController.cpanel_updateBook);
router.get('/quan-ly-chuong/:id', AuthCotroller.checkLogin, AuthCotroller.isAuthor, ChapterController.cpanel_authorManagerChapter);
router.get('/quan-ly-chuong/sua/:idChapter', AuthCotroller.checkLogin, AuthCotroller.isAuthor, ChapterController.cpanel_updateChapterBook);

module.exports = router;
