const express = require('express');
const AuthCotroller = require('../../controllers/AuthCotroller');
const CategoryController = require('../../controllers/CategoryController');
const BookController = require('../../controllers/BookController');
router = express.Router();

//Manager User
router.get(
    '/quan-ly-nguoi-dung/:id',
    AuthCotroller.checkLogin,
    AuthCotroller.isAdmin,
    AuthCotroller.indexUser_Cpanel,
);

//Manage Category
router.get(
    '/quan-ly-danh-muc',
    AuthCotroller.checkLogin,
    AuthCotroller.isAdmin,
    CategoryController.getAllCategories_Cpanel,
);

router.get(
    '/quan-ly-sach',
    AuthCotroller.checkLogin,
    AuthCotroller.isAdmin,
    BookController.cpanel_getAllBook,
);
module.exports = router;
