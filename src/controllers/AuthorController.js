const autoBind = require('auto-bind');
const { Controller } = require('../../system/controllers/Controller');
const { Author } = require('../models/Author');
const { AuthorService } = require('../services/AuthorService');
const { BookService } = require('../services/BookService');

const authorService = new AuthorService(new Author().getInstance());

class AuthorController extends Controller {

    constructor(service) {
        super(service);
        autoBind(this);
    }


    async getAuthor(req, res, next) {
        try {
            const response = await this.service.getAllAuthor({ limit: 1000});
          
            await res.status(response.statusCode).json(response);
        } catch (e) {
            // next(e);
        }
    }
}

module.exports = new AuthorController(authorService);