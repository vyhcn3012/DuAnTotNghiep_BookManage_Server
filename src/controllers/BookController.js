const autoBind = require('auto-bind');
const { Book } = require('../models/Book');
const { BookService } = require('../services/BookService');
const bookService = new BookService(new Book().getInstance());


class BookController extends Controller {

    constructor(service) {
        super(service);
        autoBind(this);
    }

    async getBooks(req, res, next) {
        try {
            const response = await this.service.getBooks();

            await res.status(response.statusCode).json(response);
        } catch (e) {
            next(e);
        }
    }

    async insertBook( req, res, next ) {
        try {
            const data = {
                categoryId: req.body.categoryId || '',
                evaluateId: req.body.evaluateId || '',
                authorId: req.body.authorId || '',
                name: req.body.name || '',
                permission: req.body.permission,
                image: req.body.image,
                description: req.body.description,
                comment: req.body.comment,
                page: req.body.page,
                sound: req.body.sound,
            }

            const bookData = await this.service.insertBook( data );

            await res.status( 200 ).json( bookData );
        } catch ( e ) {
            next( e );
        }
    }


   
    
}

module.exports = new BookController(bookService);