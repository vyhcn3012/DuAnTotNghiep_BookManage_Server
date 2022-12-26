'use strict';
const express = require('express'),
    router = express.Router();
const AuthController = require( '../../controllers/AuthCotroller' );
var multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
        'storage': storage,
        // 'storage': multer.memoryStorage(),
        'limits': {
            'fileSize': 1080 * 1920 * 5
        },
        fileFilter: function (req, file, callback) {
            const allowedExtensions = new RegExp(/.(jpg|png|jpeg|gif|mp3)$/gi);
            if (!allowedExtensions.test(file.originalname)) return callback(null, false);
            return callback(null, true);
        }
      });
const singleUpload = upload.single("file");
router.get('/', (req, res) => {
    res.send('Welcome to the auth')
});

router.get('/allAuthor', AuthController.checkLogin, AuthController.getAuthor);
router.get('/getTimeRead', AuthController.checkLogin, AuthController.checkLogin, AuthController.getTimeRead);
router.get('/:id/allReadBooks', AuthController.checkLogin, AuthController.getreadBooks);
router.get('/:id/getFavoriteBooks', AuthController.checkLogin, AuthController.getFavoriteBooks);
router.get('/:id/getReadingBooks', AuthController.checkLogin, AuthController.getReadingBooks);
router.get('/:id/getDetailAuthor', AuthController.checkLogin, AuthController.getDetailAuthor);
router.get('/:id/getReadTimeBook', AuthController.checkLogin, AuthController.getReadTimeBook);
router.get('/getCountTop10', AuthController.checkLogin, AuthController.getCountPayBook);
router.get('/getpurchaseCart', AuthController.checkLogin, AuthController.getpurchaseCart);
router.get('/getAllUsers', AuthController.checkLogin, AuthController.getAllUsers);

router.post('/postChapterBought',AuthController.checkLogin, AuthController.postChapterBought);
router.post('/agreeAccess', AuthController.checkLogin, AuthController.agreeAccess);
router.post('/refuseAccess', AuthController.checkLogin, AuthController.refuseAccess);
router.post('/postIdReadingBooks',AuthController.checkLogin, AuthController.postIdReadingBooks);
router.post('/postFavoriteBooks',AuthController.checkLogin, AuthController.postFavoriteBooks);
router.post('/postFollowBooks', AuthController.checkLogin, AuthController.postFollowBooks);
router.post('/resetPassword',  AuthController.resetPassword);
router.post('/registerNumberPhone', AuthController.insertNumberphone);
router.post('/loginNumberPhone', AuthController.loginNumberphone);
router.post('/changeReadTimeBook',AuthController.checkLogin, AuthController.changeReadTimeBook);
router.get('/xin-quyen-tac-gia/:id/:status', AuthController.checkLogin, AuthController.AccessAuthor);
router.get('/cap-quyen-tac-gia/:id/:status', AuthController.checkLogin, AuthController.adminAccessAuthor);
router.get('/thay-doi-trang-thai/:id/:status', AuthController.checkLogin, AuthController.adminChangeStatus);
router.post('/creatPaymentIntent', AuthController.checkLogin, AuthController.creatPaymentIntent);
router.post('/getChangeProfile',[singleUpload],AuthController.checkLogin, AuthController.getChangeProfile);
router.get('/profile', AuthController.checkLogin, AuthController.getProfile);
router.delete('/deleteFavoriteBooks', AuthController.checkLogin, AuthController.deleteFavoriteBooks);

router.get('/get-all-users-chat', AuthController.checkLogin, AuthController.getAllUsersChat);
module.exports = router;