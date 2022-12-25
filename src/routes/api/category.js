'use strict';
const categoryController = require('../../controllers/CategoryController');
const AuthController = require( '../../controllers/AuthCotroller' );
const express = require('express'),
    router = express.Router();
router.get('/', (req, res) => {
    res.send('Welcome to the categories')
});
router.get('/getAllCategories', AuthController.checkLogin, categoryController.getCategories);
router.post('/insertCategory', AuthController.checkLogin, categoryController.insertCategory);
router.post('/:id', AuthController.checkLogin, categoryController.updateCategory);
router.get('/:id/deleteCategory', AuthController.checkLogin, categoryController.deletCategory);
module.exports = router;