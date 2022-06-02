const autoBind = require('auto-bind');
const { Controller } = require('../../system/controllers/Controller');
const { Book } = require('../models/Book');
const { BookService } = require('../services/BookService');
const CategoryController = require('./CategoryController');


const bookService = new BookService(new Book().getInstance());


class BookController extends Controller{
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
      
        res.render('book/tablebook', {datas:allBook});
        
    }
    async cpanel_getbyIdBook(req, res, next){
      
        const { id }= req.params;
        const byIdBook = await this.service.cpanel_GetbyId(id);
        const categories=await CategoryController.getCategories();
      
        res.render('book/updatebook', {datas:byIdBook,categories:categories});
      
        
    }
    async cpanel_insertBook(req, res, next) {
        try {
            // if (req.cookies && req.cookies.token) {
            //     console.log(req.cookies.token)
            //     res.redirect('/cpanel/events');
            //     return;
            // }
                let data = {
                    name: "name",
                    permission: false,
                    image:"sdada",
                    description:"sdasda",
                    linkPage:"hihi",
                    linkSound:"sound",
                }
                const response = await this.service.insert( data );
                console.log(response);
                await res.status( 200 ).json( response );    
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = new BookController(bookService);