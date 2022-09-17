
const express = require('express');
const AuthCotroller = require('../../controllers/AuthCotroller');


router = express.Router()
router.get('/:id/allUser', AuthCotroller.indexUser_Cpanel);


module.exports = router
