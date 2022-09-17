
const express = require('express');
const AuthCotroller = require('../../controllers/AuthCotroller');
const bookController = require('../../controllers/BookController');
const categoryController = require('../../controllers/CategoryController');

router = express.Router()
router.get('/getAllCategories',categoryController.getAllCategories_Cpanel);
router.get('/insertCategories',categoryController.insertCategories_Cpanel);
module.exports = router
