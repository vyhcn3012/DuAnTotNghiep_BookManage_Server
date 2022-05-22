const bookController = require('../../controllers/BookController');

const express = require('express'),
    router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to the books')
});

router.get('/getAllBook', (req, res) => {
    bookController.getBooks();
});

module.exports = router;