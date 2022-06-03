'use strict';

const AuthorController = require('../../controllers/AuthorController');
const express = require('express'),
    router = express.Router();
router.get('/', (req, res) => {
    res.send('Welcome to the categories')
});
router.get('/getAllAuthor',AuthorController.getAuthor);
module.exports = router;