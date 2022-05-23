const autoBind = require('auto-bind');
const { Controller } = require('../../system/controllers/Controller');
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
            const response = await this.service.getAll({ limit: 1000 });

            await res.status(response.statusCode).json(response);
        } catch (e) {
            // next(e);
        }
    }
    async cpanel_getAllBook(req, res, next){
        const allBook = await this.service.cpanel_GetAll({ limit: 1000 });
        console.log(allBook);
        res.render('book/tablebook', {datas:allBook});
        
    }
    async cpanel_insertBook(req, res, next) {
        try {
            // if (req.cookies && req.cookies.token) {
            //     console.log(req.cookies.token)
            //     res.redirect('/cpanel/events');
            //     return;
            // }
            try {
         
                const data = {
                    categoryId: req.body.categoryId || '',
                    evaluateId: req.body.evaluateId || '',
                    authorId: req.body.authorId || '',
                    name: req.body.name || '',
                    permission: req.body.permission,
                    image: req.body.image,
                    description: req.body.description,
                    page: req.body.page,
                    sound: req.body.sound,
                }
    
                const bookData = await this.service.insert( data );
    
                await res.status( 200 ).json( bookData );
            } catch ( e ) {
                next( e );
            }
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = new BookController(bookService);