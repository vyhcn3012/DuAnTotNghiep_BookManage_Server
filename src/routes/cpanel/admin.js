const express = require('express');
const AuthCotroller = require('../../controllers/AuthCotroller');
const CategoryController = require('../../controllers/CategoryController');
const BookController = require('../../controllers/BookController');
const router = require('./home');

//Manager User
router.get(
    '/quan-ly-nguoi-dung/:id',
    AuthCotroller.checkLogin,
    AuthCotroller.isAdmin,
    AuthCotroller.indexUser_Cpanel,
);
router.get('/quan-ly-nguoi-dung/chi-tiet/:id',
    AuthCotroller.checkLogin,
    AuthCotroller.isAdmin,
    AuthCotroller.detailUser_Cpanel);


//Manage Category
router.get(
    '/quan-ly-danh-muc',
    AuthCotroller.checkLogin,
    AuthCotroller.isAdmin,
    CategoryController.getAllCategories_Cpanel,
);
router.get(
    '/quan-ly-danh-muc/:id',
    AuthCotroller.checkLogin,
    AuthCotroller.isAdmin,
    CategoryController.updateCategories_Cpanel,
);


//Manage Book
router.get(
    '/quan-ly-sach',
    AuthCotroller.checkLogin,
    AuthCotroller.isAdmin,
    BookController.cpanel_getAllBook,
);
router.get('/quan-ly-sach/:id', 
    AuthCotroller.checkLogin,
    AuthCotroller.isAdmin,
    BookController.cpanel_updateBookForAdmin);
    

//Manage Charts
router.get(
    '/quan-ly-thong-ke',
    AuthCotroller.checkLogin,
    AuthCotroller.isAdmin,
    AuthCotroller.indexCharts_Cpanel,
);

router.get(
    '/quan-ly-thong-ke/thong-ke-thoi-gian-doc-sach',
    AuthCotroller.checkLogin,
    AuthCotroller.isAdmin,
    AuthCotroller.indexChartsReading_Cpanel,
);

module.exports = router;
