const express = require('express');
const AuthCotroller = require('../../controllers/AuthCotroller');

router = express.Router();
router.get(
    '/quan-ly-nguoi-dung/:id',
    AuthCotroller.checkLogin,
    AuthCotroller.indexUser_Cpanel,
);

module.exports = router;
