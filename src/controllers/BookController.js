const autoBind = require('auto-bind');
const { Controller } = require('../../system/controllers/Controller');
const { Book } = require('../models/Book');
const { Chapter } = require('../models/Chapter');
const { Category } = require('../models/Category');
const { Comment } = require('../models/Comment');
const { BookService } = require('../services/BookService');
const { CategoryService } = require('../services/CategoryService');
const { AuthService } = require('../services/AuthService');
const { ChapterService } = require('../services/ChapterService');
const { CommentService } = require('../services/CommentService');
const { UserService } = require('../services/UserService');
const { Account } = require('../models/Account');
const chapterService = new ChapterService(new Chapter().getInstance());
const commentService = new CommentService(new Comment().getInstance());
const bookService = new BookService(new Book().getInstance());
const categoryService = new CategoryService(new Category().getInstance());
const userService = new UserService(new Account().getInstance());
class BookController extends Controller {
    constructor(service) {
        super(service);
        autoBind(this);
    }
    async getBooks(req, res, next) {
        try {
            const { _id } = req.account;
            const dataUser = await userService.findByIdAndCountPriceBook(_id);
            const response = await this.service.getAll({ limit: 1000 });
            for(const book of response.data){
                for(const chapter of dataUser.payBook){
                    if(book._id == chapter.idChapter.idBook){
                        book.isPrice -= chapter.idChapter.price;
                    }
                }
            }
          
            await res.status(response.statusCode).json(response);
        } catch (e) {
            // next(e);
        }
    }

    async getChapterBook(req, res, next) {
        try {
            const { idBook } = req.body;
            const { _id } = req.account;
            const response = await chapterService.getChapterBook(idBook, _id);
            await res.status(response.statusCode).json(response);
        } catch (e) {
            next(e);
        }
    }

    async updatePriceBook(req, res, next) {
        try {
            const { idBook } = req.body;
            let price = 0;
            const item = await chapterService.getChapterByBook(idBook);
            for(const chapter of item.data){
               price += chapter.price;
            }
            const data = {
              isPrice: price
            }
            const response = await this.service.updatePriceBook(idBook,data);
            await res.status(response.statusCode).json(response);
        } catch (e) {
            next(e);
        }
    }

    async getBooksByNumberRead(req, res, next) {
        try {
            const sortBy = { numSumRead: -1 };
            const response = await this.service.getAll({
                limit: 1000,
                sortBy: sortBy,
            });
            await res.status(response.statusCode).json(response);
        } catch (e) {
            // next(e);
        }
    }

    async searchBook(req, res, next) {
        try {
            const { name } = req.params;
            const response = await this.service.getAll({
                limit: 1000,
                name: name,
            });
            await res.status(response.statusCode).json(response);
        } catch (e) {
            // next(e);
        }
    }

    async insertBook(req, res, next) {
        try {
            const { body } = req;
            const { _id } = req.account;
            let { image, name, categoryId, introduction, isPrice } = body;
            const data = {
                image: image,
                name: name,
                categoryId: categoryId,
                introduction: introduction,
                isPrice: isPrice,
                account: _id,
                view:Math.floor(Math.random() * 100+1),
                evalute:Math.floor(Math.random() * 5 +1),
                releasedDate: new Date(),
            };
            const response = await this.service.createBook(data);
            await res.status(response.statusCode).json(response);
        } catch (e) {
            next(e);
        }
    }

    async getBookByIdAuthor(req, res, next) {
        try {
            const { id } = req.params;
            const response = await this.service.getBookById(id);
            return res.status(response.statusCode).json(response);
        } catch (e) {
            // next(e);
        }
    }
    async getBookByIdCategory(req, res, next) {
        try {
            const { id } = req.params;
            const response = await this.service.getBookByIdCategory(id);

            await res.status(response.statusCode).json(response);
        } catch (e) {
            // next(e);
        }
    }

    async getCommentChapters(req, res, next) {
        try {
            const { id } = req.params;
            const response = await commentService.getCommentChapters(id);
            await res.status(response.statusCode).json(response);
        } catch (e) {
            // next(e);
        }
    }

    async insertComment(req, res, next) {
        try {
            const { post, userName, image, id, idChapter } = req.body;

            const data = {
                id: id,
                idChapter: idChapter,
                userName: userName,
                image: image,
                content: post,
                time: new Date(),
            };

            const response = await bookService.insertComment(data);
            await res.status(response.statusCode).json(response);
        } catch (e) {
            // next(e);
        }
    }

    async cpanel_getAllBook(req, res, next) {
        const allBook = await this.service.cpanel_GetAll({ limit: 1000 });
        const { role } = req.account;
        res.render('admin/manage-book/index', { datas: allBook, [role]: role });
    }

    async cpanel_chart(req, res, next) {
        res.render('chart/chart');
    }

    async cpanel_getbyIdBook(req, res, next) {
        const { id } = req.params;
        const byIdBook = await this.service.cpanel_GetbyId(id);
        const categories = await categoryService.getAll();
       
        res.render('book/updatebook', {
            datas: byIdBook,
            categories: categories.data,
        });
    }

    async cpanel_insertBook(req, res, next) {
        try {
            const categories = await categoryService.getAll();
            return res.render('author/insertBook', { categories: categories.data });
        } catch (e) {
            console.log(e);
        }
    }

    async cpanel_authorManagerBook(req, res, next) {
        try {
            const { _id } = req.account;
            const response = await this.service.cpanel_authorManagerBook(_id);
            await res.render('author/managerBook', { data: response, user: req.account });
        } catch (e) {
            console.log(e);
        }
    }

    async cpanel_updateBook(req, res, next) {
        try {
            const { id } = req.params;
            const { _id, role } = req.account;
            const book = await this.service.findOneBookAuthor(id, _id, role);
            const category = await categoryService.findOne(book.categoryId);
            return res.render('author/detailBook', {data: book, category: category});
        } catch (e){
            console.log(e);
        }
    }

    async cpanel_updateBookForAdmin(req, res, next) {
        try {
            const { id } = req.params;
            const { _id, role } = req.account;
            const book = await this.service.findOneBookAuthor(id, _id, role);
            const category = await categoryService.findOne(book.categoryId);
            return res.render('admin/manage-book/detail-book.hbs', {data: book, category: category});
        } catch (e){
            console.log(e);
        }
    }

    async updateBook(req, res, next) {
        try {
            const { id } = req.params;
            const { _id } = req.account;
            let { image, name, overview } = req.body;

            const data = {
                image: image,
                name: name,
                overview: overview,
            };
            const response = await this.service.updateBook(id, data);
            return res.redirect('/cpanel/authors/quan-ly-sach/' + id);
        } catch (e) {
            next(e);
        }
    }
    
}

module.exports = new BookController(bookService);
