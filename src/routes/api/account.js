'use strict';
const express = require('express'),
    router = express.Router();
const AuthController = require( '../../controllers/AuthCotroller' );

router.get('/', (req, res) => {
    res.send('Welcome to the auth')
});

router.get('/allAuthor', AuthController.getAuthor);
router.get('/:id/getTimeRead', AuthController.getTimeRead);
router.get('/:id/allReadBooks', AuthController.getreadBooks);
router.get('/:id/getFavoriteBooks', AuthController.getFavoriteBooks);
router.get('/:id/getReadingBooks', AuthController.getReadingBooks);
router.get('/:id/getDetailAuthor', AuthController.getDetailAuthor);

router.post('/postChapterBought', AuthController.postChapterBought);
router.post('/agreeAccess', AuthController.agreeAccess);
router.post('/refuseAccess', AuthController.refuseAccess);
router.post('/postIdReadingBooks', AuthController.postIdReadingBooks);
router.post('/postFavoriteBooks', AuthController.postFavoriteBooks);
router.post('/postFollowBooks', AuthController.postFollowBooks);

router.post('/registerNumberPhone', AuthController.insertNumberphone);
router.post('/loginNumberPhone', AuthController.loginNumberphone);

router.post('/accessAuthor',AuthController.checkLogin, AuthController.AccessAuthor);
module.exports = router;