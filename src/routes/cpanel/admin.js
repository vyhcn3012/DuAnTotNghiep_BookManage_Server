const express = require('express');
const AuthCotroller = require('../../controllers/AuthCotroller');
const CategoryController = require('../../controllers/CategoryController');

router = express.Router();

//Manager User
router.get(
    '/quan-ly-nguoi-dung/:id',
    AuthCotroller.checkLogin,
    AuthCotroller.indexUser_Cpanel,
);

//Manage Category
router.get(
    '/quan-ly-danh-muc',
    AuthCotroller.checkLogin,
    CategoryController.getAllCategories_Cpanel,
);

module.exports = router;
