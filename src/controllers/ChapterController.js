const autoBind = require('auto-bind');
const { Controller } = require('../../system/controllers/Controller');
const { Book } = require('../models/Book');
const { Chapter } = require('../models/Chapter');
const { Category } = require('../models/Category');
const { Comment } = require('../models/Comment');
const { BookService } = require('../services/BookService');
const {CategoryService} = require('../services/CategoryService');
const {AuthService} = require('../services/AuthService');
const {ChapterService} = require('../services/ChapterService');
const {CommentService} = require('../services/CommentService');
const { JsonWebTokenError } = require('jsonwebtoken');

const chapterService = new ChapterService(new Chapter().getInstance());
const commentService = new CommentService(new Comment().getInstance());
const bookService = new BookService(new Book().getInstance());
const categoryService = new CategoryService(new Category().getInstance());

class ChapterController extends Controller{
    constructor(service) {
        super(service);
        autoBind(this);
    }

    async insertChapterBook(req, res, next) {
        try {
            const {idBook, title, htmlChapter, permission} = req.body;
            console.log(req.body);
            const data = {
                idBook: idBook,
                title: title,
                htmlChapter: htmlChapter,
                permission: permission,
                releasedDate: new Date(),
            }
            const chapter = await chapterService.insertChapterBook(data);
            res.status(200).json(chapter);
        } catch (error) {
            next(error);
        }
    }

    async cpanel_insertChapterBook(req, res, next) {
        try {
            const {id} = req.params;
            const book = await bookService.get(id);
            return res.render('author/insertChapter', 
                {book : book,
                _book: JSON.stringify(book)});
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new ChapterController(chapterService);