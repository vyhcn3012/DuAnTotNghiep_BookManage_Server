const autoBind = require('auto-bind');
const { Controller } = require('../../system/controllers/Controller');
const { Book } = require('../models/Book');
const { Chapter } = require('../models/Chapter');
const { Category } = require('../models/Category');
const { Comment } = require('../models/Comment');
const { Account } = require('../models/Account');
const { Notification } = require('../models/Notification');
const { BookService } = require('../services/BookService');
const { CategoryService } = require('../services/CategoryService');
const { AuthService } = require('../services/AuthService');
const { ChapterService } = require('../services/ChapterService');
const { CommentService } = require('../services/CommentService');
const { NotificationService } = require('../services/NotificationService');
const { UserService } = require('../services/UserService');

const { JsonWebTokenError } = require('jsonwebtoken');

const userService = new UserService(new Account().getInstance());
const notificationService = new NotificationService(
    new Notification().getInstance(),
);
const chapterService = new ChapterService(new Chapter().getInstance());
const commentService = new CommentService(new Comment().getInstance());
const bookService = new BookService(new Book().getInstance());
const categoryService = new CategoryService(new Category().getInstance());

class ChapterController extends Controller {
    constructor(service) {
        super(service);
        autoBind(this);
    }

    async insertChapterBook(req, res, next) {
        try {
            const { idBook, title, htmlChapter, permission, price } = req.body;
            const { _id } = req.account;
            const chapterNumberMost = await chapterService.getChapterNumber(idBook);
            console.log(chapterNumberMost);
            const data = {
                idBook: idBook,
                title: title,
                htmlChapter: htmlChapter,
                permission: permission,
                price: price,
                releasedDate: new Date(),
                linkAudio : "https://res.cloudinary.com/cao-ng-fpt-polytechnic/video/upload/v1665489148/y2mate.com_-_Ch%C6%B0%C6%A1ng_1_%C4%90%E1%BA%AFc_Nh%C3%A2n_T%C3%A2m_Mu%E1%BB%91n_l%E1%BA%A5y_m%E1%BA%ADt_%C4%91%E1%BB%ABng_ph%C3%A1_t%E1%BB%95_ong_S%C3%A1ch_n%C3%B3i_kinh_doanh_hay_jppygs.mp3",
                // image:"https://res.cloudinary.com/cao-ng-fpt-polytechnic/image/upload/v1671889140/xyhhgg7cmgmm5hieqflo.webp",
                chapterNumber: chapterNumberMost ? chapterNumberMost + 1 : 1,
            };
            const chapter = await chapterService.insertChapterBook(data);

            if (chapter) {
                const dataNotificastion = {
                    book: idBook,
                    chapter: chapter.data._id,
                    content: 'Tác giả mà bạn theo dõi đã thêm chương mới',
                    createdBy: _id,
                    createdAt: new Date(),
                };
                const notification =
                    await notificationService.createNotification(
                        dataNotificastion,
                    );

                if (notification) {
                    const accounts = await userService.insertNotificationToUser(
                        idBook,
                        notification.data._id,
                    );
                    if (accounts) {
                        const FCM = await userService.findFCMTokenById(
                            accounts.data,
                            notification.data._id,
                            _id,
                        );
                    }
                }
            }
            return res.redirect('/cpanel/authors/quan-ly-chuong/' + idBook);
        } catch (error) {
            next(error);
        }
    }

    async cpanel_insertChapterBook(req, res, next) {
        try {
            const { id } = req.params;
            const book = await bookService.get(id);
            return res.render('author/insertChapter', {
                book: book,
                _book: JSON.stringify(book),
            });
        } catch (e) {
            next(e);
        }
    }

    async getChapterDetailsBook(req, res, next) {
        try {
            const { id } = req.params;
            const response = await chapterService.getChapterDetails(id);
            console.log(response);
            await res.status(response.statusCode).json(response);
        } catch (e) {
            next(e);
        }
    }

    async cpanel_authorManagerChapter(req, res, next) {
        try {
            const { id } = req.params;
            const { _id } = req.account;
            const book = await bookService.findOneBookAuthor(id, _id);
            if(book){
                const chapters = await chapterService.getChapterByBook(id);
                const result = chapters.data.map((chapter, index) => {
                    return {
                        ...chapter,
                        index: index + 1,
                    };
                });

                return res.render('author/manageChapter', {
                    chapters: result,
                    book: book,
                });
            }
            return null;
        }catch (e) {
            next(e);
        }
    }

    async deleteChapterBook(req, res, next) {
        try {
            const { id } = req.params;
            const response = await chapterService.deleteChapter(id);
            return res.redirect(`/cpanel/authors/quan-ly-chuong/${response.data.idBook}`);
        } catch (e) {
            next(e);
        }
    }

    async cpanel_updateChapterBook(req, res, next) {
        try {
            const { idChapter } = req.params;
            const chapter = await chapterService.getChapterDetails(idChapter);
         
            return res.render('author/updateChapter', {
                chapter: chapter.data,
            });
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new ChapterController(chapterService);
