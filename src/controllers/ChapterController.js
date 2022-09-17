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

const chapterService = new ChapterService(new Chapter().getInstance());
const commentService = new CommentService(new Comment().getInstance());
const bookService = new BookService(new Book().getInstance());
const categoryService = new CategoryService(new Category().getInstance());

class ChapterController extends Controller{
    constructor(service) {
        super(service);
        autoBind(this);
    }

    async cpanel_insertChapterBook(req, res, next) {
        try {
            const {id} = req.params;
            const book = await bookService.get(id);
            console.log("book", book);
            return res.render('author/insertChapter', {book : book});
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new ChapterController(chapterService);