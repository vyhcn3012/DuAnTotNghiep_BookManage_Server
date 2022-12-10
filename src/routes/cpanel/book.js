const express = require('express');
const AuthCotroller = require('../../controllers/AuthCotroller');
const bookController = require('../../controllers/BookController');
const categoryController = require('../../controllers/CategoryController');

router = express.Router();
router.get(
    '/allBook',
    AuthCotroller.checkLogin,
    AuthCotroller.isAdmin,
    bookController.cpanel_getAllBook,
);
router.get('/insertBook', categoryController.cpanel_getAllCategories);
router.post('/allBook', bookController.cpanel_insertBook);
router.get('/:id/updateBook', bookController.cpanel_getbyIdBook);
router.get('/chart', bookController.cpanel_chart);

module.exports = router;
