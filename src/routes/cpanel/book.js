
const express = require('express')
const bookController = require('../../controllers/BookController')
router = express.Router()
router.get('/allBook', bookController.cpanel_getAllBook);
module.exports = router
