'use strict';

const CommentController = require('../../controllers/CommentController');
const AuthController = require( '../../controllers/AuthCotroller' );
const express = require('express'),
    router = express.Router();
router.get('/', (req, res) => {
    res.send('Welcome to the categories')
});
router.post('/postComment', AuthController.checkLogin, CommentController.postComment);

router.post('/getCommentChapters', AuthController.checkLogin, CommentController.getCommentChapters);

module.exports = router;