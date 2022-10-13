'use strict';
const AuthController = require( '../../controllers/AuthCotroller' );
const CartController = require('../../controllers/CartController');
const MediaController = require('../../controllers/MediaController');
const express = require('express'),
    router = express.Router();
var multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
        'storage': storage,
        // 'storage': multer.memoryStorage(),
        'limits': {
            'fileSize': 1080 * 1920 * 5
        },
        fileFilter: function (req, file, callback) {
            const allowedExtensions = new RegExp(/.(jpg|png|jpeg|gif)$/gi);
            if (!allowedExtensions.test(file.originalname)) return callback(null, false);
            return callback(null, true);
        }
      });
 const singleUpload = upload.single("file");
router.get('/', (req, res) => {
    res.send('Welcome to the books')
});


router.post('/upImage',[singleUpload], MediaController.createImage);


module.exports = router;