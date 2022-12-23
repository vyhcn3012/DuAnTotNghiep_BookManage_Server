'use strict';
const { Service } = require('../../system/services/Service');
const autoBind = require('auto-bind');
const config = require('../../config/config').getConfig();
const { HttpResponse } = require('../../system/helpers/HttpResponse');
const { UserBookService } = require('./UserBookService');
const { UserBook } = require('../models/UserBook');
const { Auth } = require('../models/Auth');
const { Notification } = require('../models/Notification');
const { NotificationService } = require('./NotificationService');
const notification = new NotificationService(new Notification().getInstance());
const userBookService = new UserBookService(new UserBook().getInstance());
const { CartService } = require('../services/CartService');
const { Cart } = require('../models/Cart');
const cartService = new CartService(new Cart().getInstance());
const bcrypt = require('bcryptjs');
const request = require('request');
var path = require('path');
const ALLOWED_FORMATS = ['image/jpeg', 'image/png', 'image/jpg'];
const DatauriParser = require('datauri/parser');
const parser = new DatauriParser();
const formatBufferTo64 = (file) =>
    parser.format(path.extname(file.originalname).toString(), file.buffer);
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'cao-ng-fpt-polytechnic',
    api_key: '811123551641114',
    api_secret: '6DMIjAlUUCS8tRoJrDNSd_yqqCg',
});
const cloudinaryUpload = (file) => cloudinary.uploader.upload(file);
class UserService extends Service {
    constructor(model) {
        super(model);
        this.model = model;
        autoBind(this);
    }

    async insert(data) {
        //console.log("===> model", data);
        try {
            const item = await this.model.create(data);
            const account = await this.model.findById(item._id).populate({
                path: 'department',
                populate: {
                    path: 'unit',
                    select: 'name _id',
                },
            });

            if (account) {
                return account;
            }
            throw new Error('Có lỗi, bạn có thể thử lại sau');
        } catch (errors) {
            //throw new Error('Có lỗi, bạn có thể thử lại sau', errors);;
        }
    }
    async insertNumberphone(body) {
        try {
            const { phoneUser, passwordUser, token_fcm } = body;
            const phone = await this.model.findOne({ phone: phoneUser });
            if (phone) {
                return {data: 'Số điện thoại đã tồn tại', statusCode: 400, error: true }
            }
            const hash = await bcrypt.hash(
                passwordUser,
                await bcrypt.genSalt(10),
            );
            const data = {
                fcmtokens: token_fcm ? [token_fcm] : [],
                name: ' ',
                email: ' ',
                phone: phoneUser,
                passwordUser: hash,
                permission: 'user',
                typeLogin: 'phone',
                wallet: 0,
            };
            const item = await this.model.create(data);
            return new HttpResponse(item);
        } catch (error) {
            throw error;
        }
    }
    async loginNumberphone(body) {
        try {
            const { phoneUser } = body;
            const data = await this.model.findOne({ phone: phoneUser });
            if (!data) {
                return null;
            }
            return new HttpResponse(data);
        } catch (error) {
            throw new Error('Có lỗi, bạn có thể thử lại sau nhen');
        }
    }

    async getCountreadBook(id) {
        try {
            //$project: { count: { $size:"$historyBookRead" }}
            const readbook = await this.model.findById(id, {
                count: { $size: '$historyBookRead' },
            });
            if (!readbook) {
                const error = new Error('Không tìm thấy ');
                error.statusCode = 404;
                throw error;
            }
        
            return new HttpResponse(readbook);
        } catch (errors) {
            throw errors;
        }
    }

    async getAllUsersChat(_id) {
        try {
            const accounts = await this.model
                .find({ _id: { $ne: _id } })
                .select(['email', 'name', 'image', '_id']);

            return new HttpResponse(accounts);
        } catch (e) {
            throw e;
        }
    }

    async getAllUsers() {
        try {
            const accounts = await this.model
                .find({ role: { $nin: [config.ROLE_USER.ADMIN, config.ROLE_USER.SUPER_ADMIN] } })
            return new HttpResponse(accounts);
        } catch (e) {
            throw e;
        }
    }

    async findByEmail(email) {
        return this.model
            .findByEmail(email)
            .populate({
                path: 'notification',
                populate: {
                    path: 'chapter',
                    select: 'title _id',
                },
            })
            .populate({
                path: 'notification',
                populate: {
                    path: 'book',
                    select: 'name image _id',
                },
            });
    }

    async getTimeRead(id) {
        try {
            const book = await this.model.find(
                { _id: id },
                { _id: 0, timeReadBook: 1 },
            );
            if (!book) {
                const error = new Error('Không tìm thấy cuốn sách này');
                error.statusCode = 404;
                throw error;
            }

            return new HttpResponse(book);
        } catch (errors) {
            throw errors;
        }
    }
    async findauthorAcess(authorAcess, page, limit) {
        try {
            const author = await this.model.find({ authorAcess: authorAcess }).skip((page - 1) * limit)
            .limit(limit);;
            if (!author) {
                const error = new Error('Không tìm thấy này');
                error.statusCode = 404;
                throw error;
            }

            return new HttpResponse(author);
        } catch (errors) {
            throw errors;
        }
    }
    async agreeAccess(id) {
        try {
            const data = {
                role: config.ROLE_USER.AUTHOR,
                authorAcess: config.AUTHOR_ACCOUNT_STATUS.ACTIVE,
            };

            const author = await this.model.findByIdAndUpdate(id, data);
            if (!author) {
                const error = new Error('Không tìm thấy này');
                error.statusCode = 404;
                throw error;
            }

            return new HttpResponse(author);
        } catch (errors) {
            throw errors;
        }
    }
    async AccessAuthor(id) {
        try {
            const data = {
                authorAcess: config.AUTHOR_ACCOUNT_STATUS.PENDING,
            };
            const author = await this.model.findByIdAndUpdate(id, data);
            if (!author) {
                const error = new Error('Không tìm thấy này');
                error.statusCode = 404;
                throw error;
            }
            return new HttpResponse(author);
        } catch (errors) {
            throw errors;
        }
    }
    async refuseAccess(id) {
        try {
            const data = {
                authorAcess: config.AUTHOR_ACCOUNT_STATUS.CLOSE,
            };
            const author = await this.model.findByIdAndUpdate(id, data);
            if (!author) {
                const error = new Error('Không tìm thấy này');
                error.statusCode = 404;
                throw error;
            }

            return new HttpResponse(author);
        } catch (errors) {
            throw errors;
        }
    }
    async getFavoriteBooks(id) {
        try {
            const book = await this.model
                .find({ _id: id }, { _id: 0, favoritebooks: 1 })
                .populate({
                    path: 'favoriteBooks',
                    populate: {
                        path: 'idBook',
                    },
                });
            // console.log(">>>> 120 ", book);
            if (!book) {
                const error = new Error('Không tìm thấy cuốn sách này');
                error.statusCode = 404;
                throw error;
            }
            return new HttpResponse(book);
        } catch (errors) {
            throw errors;
        }
    }

    async getCountPayBook() {
        try {
            let response = [];
            let dayTime = 0;
           
            const allUser = await this.model.find();
            for(const element of allUser){
                for(const readtime of element.timeReadBook){
                    for (const month of readtime.detailsyear) {
                        for (const day of month.detailsmonth) {
                            if(day.time){
                                dayTime+=day.time;
                            }
                        }  
                    }
                }
                const data = {
                    id: element._id,
                    name: element.name,
                    timeRead: dayTime,
                    historyBookRead: element.historyBookRead.length,
                    email: element.email,
                    image: element.image,
                   
                }
                response.push(data);
                dayTime = 0;
            }
            response.sort((a, b) => b.timeRead - a.timeRead).splice(10);
            return new HttpResponse(response);
        } catch (errors) {
            throw errors;
        }
    }


    async postFavoriteBooks(id, idBook) {
        try {
            const check = await this.model.find({
                $and: [{ _id: id }, { 'favoriteBooks.idBook': idBook }],
            });
            if (check.length === 0) {
                const book = await this.model.findByIdAndUpdate(id, {
                    $push: { favoriteBooks: { idBook } },
                });
                return new HttpResponse(book);
            }
            return new HttpResponse('Sách đã được thêm vào yêu thích rồi');
        } catch (errors) {
            throw errors;
        }
    }

    async deleteFavoriteBooks(id, idBook) {
        try {
            const book = await this.model.findByIdAndUpdate(id, { $pull: {favoriteBooks:{idBook: idBook} } } );
            return new HttpResponse(book);
        } catch (errors) {
            throw errors;
        }
    }

    async resetPassword(phoneUser, passwordUser) {
        try {
            const hash = await bcrypt.hash(
                passwordUser,
                await bcrypt.genSalt(10),
            );
            const data = {
                passwordUser: hash,
            }
            const user = await this.model.findOneAndUpdate({phone:phoneUser},data);
            if (user) {
                return new HttpResponse('Đã reset thành công');
            }
            return new HttpResponse('Không tìm thấy user');
        } catch (errors) {
            throw errors;
        }
    }

    async postFollowBooks(id, idBook) {
        try {
            const check = await this.model.find({
                $and: [{ _id: id }, { 'followBooks.idBook': idBook }],
            });
            if (check.length === 0) {
                const book = await this.model.findByIdAndUpdate(id, {
                    $push: { followBooks: { idBook } },
                });

                return new HttpResponse(book);
            }
            return new HttpResponse('Sách đã thêm vào theo dõi');
        } catch (errors) {
            throw errors;
        }
    }

    async getReadingBooks(id) {
        try {
            const book = await this.model
                .find({ _id: id }, { _id: 0, historyBookRead: 1 })
                .populate({
                    path: 'historyBookRead',
                    populate: {
                        path: 'idBook',
                    },
                });

            if (!book) {
                const error = new Error('Không tìm thấy cuốn sách này');
                error.statusCode = 404;
                throw error;
            }

            return new HttpResponse(book);
        } catch (errors) {
            throw errors;
        }
    }

    async postChapterBought(idUser, idChapter,totalPrice) {
        try {
            let count = 0;
            let chapters = [];
            let allPurchase = [];
            for (const element of idChapter) {
                for (const element1 of element.idChapter) {
                    const check = await this.model.find({
                        'payBook.idChapter': element1,
                        _id: idUser,
                    });
                    if (check.length === 0) {
                        const data = {
                            idChapter: element1,
                        };
                        chapters.push(data);
                        await this.model.findByIdAndUpdate(idUser, {
                            $push: { payBook: data },
                        });
                    }
                }
                if(chapters.length !== 0){
                    allPurchase.push({
                        idBook: element.idBook,
                        chapters: chapters,
                    });
                    chapters = [];
                }
            }
            if(allPurchase.length !== 0){
                const body = {
                    allPurchase,
                    purchaseDate: new Date(),
                    totalPrice: totalPrice,
                }
                const idcart = await cartService.createCart(body);
                await this.purchaseCart(idUser,idcart.data._id);
            }
            return new HttpResponse('Success');
        } catch (e) {
            throw e;
        }
    }

    async postIdReadingBooks(id, idBook) {
        try {
            const check = await this.model.find({
                'historyBookRead.idBook': idBook,
            });
            if (check.length === 0) {
                const book = await this.model.findByIdAndUpdate(id, {
                    $push: { historyBookRead: { idBook } },
                });
                return new HttpResponse(book);
            }
            return new HttpResponse('Đã và đang đọc');
        } catch (errors) {
            throw errors;
        }
    }

    async findInfoById(_id) {
        try {
            const account = await this.model.findById(_id);
            if (!account) {
                const error = new Error('Không tìm thấy tài khoản này');
                error.statusCode = 404;
                throw error;
            }
            return new HttpResponse(account);
        } catch (errors) {
            throw errors;
        }
    }

    async insertNotificationToUser(book, notification) {
        try {
            const bookFavorite = await this.model.find({
                'favoriteBooks.idBook': book,
            });
            const _id = bookFavorite.map(({ _id }) => _id);
            const accounts = await this.model.updateMany(
                { _id: { $in: _id } },
                { $push: { notification: notification } },
            );
            if (!accounts) {
                throw new Error('Tài khoản không tìm thấy');
            }
            return new HttpResponse(_id);
        } catch {
            throw errors;
        }
    }

    async findInfoByEmail(_email) {
        try {
            let account = await this.findByEmail(_email);
            if (!account) {
                throw new Error('Tài khoản không tìm thấy');
            }

            const {
                _id,
                name,
                email,
                phone,
                permission,
                fcmtokens,
                image,
                bookmark,
                wallet,
                favoritebooks,
                notification,
                role,
            } = account;

            account = {
                _id,
                name,
                email,
                phone,
                permission,
                fcmtokens,
                image,
                bookmark,
                wallet,
                favoritebooks,
                notification,
                role,
            };
            if (account) {
                return new HttpResponse(account);
            }
            throw new Error('Có lỗi, bạn có thể thử lại sau');
        } catch (e) {
            throw e;
        }
    }

    async findFCMTokenById(_id, notification_id, user_id) {
        try {
            const id = _id.length;
          
            for (let i = 0; i < _id.length; i++) {
                let account = await this.model.findById(_id[i]);
                if (!account) {
                    throw new Error('Tài khoản không tìm thấy');
                }
                const fcm = account.fcmtokens[account.fcmtokens.length - 1];
                const response = notification.sendFCM(
                    fcm,
                    user_id,
                    notification_id,
                );
                // return new HttpResponse(response);
            }
        } catch (e) {
            throw e;
        }
    }

    async registerChapter(chapterId, userId, userEmail) {
        try {
            let oneChapter = await eventService.get(eventId);
            if (!oneChapter || !oneChapter.data.available) {
                throw new Error('Không tìm thấy chương truyện này');
            }
            oneChapter = oneChapter.data;

            const checkRegister = await userBookService.findByQuery({
                event: eventId,
                user: userId,
                status: { $gte: config.USER_EVENT_STATUS.REGISTER },
            });
            if (checkRegister && checkRegister.length > 0) {
                return new HttpResponse(checkRegister[0]);
            }

            let userBook = {
                user: userId,
                chapter: chapterId,
                status: config.USER_BOOK_STATUS.REGISTER,
                available: true,
                createdAt: new Date(),
                createdBy: userId,
                updatedAt: new Date(),
                updatedBy: userId,
                registerAt: new Date(),
                notes: '',
            };

            const item = await userBookService.insert(userBook);

            if (item) {
                return new HttpResponse(item);
            }
            throw new Error('Có lỗi, bạn có thể thử lại sau');
        } catch (error) {
            console.log('>>>>>>>>>>>>user register event error: ', error);
            throw new Error(error.message || 'Có lỗi, bạn có thể thử lại sau');
        }
    }

    async changeReadTimeBook(id, body) {
        try {
            const userReadTime = await this.model.findById(id);
            const timeReadBookUser = userReadTime.timeReadBook;
            const { time } = body;
            var d = new Date();
            const options = { month: 'long' };
            const month = new Intl.DateTimeFormat('en-US', options).format(d);
            const day = d.getDate();
            const year = d.getFullYear();
            let checkMonth=0;
            let checkDay=0;
            let checkYear=0;
            if (timeReadBookUser.length == 0) {
                const detailsmonth = {
                    day: day,
                    time: time,
                };
                let detailmonth = [];
                detailmonth.push(detailsmonth);
                const detailsyear = {
                    month: month,
                    detailsmonth: detailmonth,
                };
                let detailYear = [];
                detailYear.push(detailsyear);
                const data = {
                    createYear: year,
                    detailsyear: detailYear,
                };
                const item = await this.model.findByIdAndUpdate(id, {
                    $push: { timeReadBook: data },
                });
                if (item) {
                    return new HttpResponse(item);
                }
                throw new Error('Có lỗi, bạn có thể thử lại sau');
            }
            for (const element of timeReadBookUser) {
                if (element.createYear == year) {
                    checkYear = 1;
                    for (const element1 of element.detailsyear) {
                        if (element1.month === month) {
                            checkMonth = 1;
                            for (const element2 of element1.detailsmonth) {
                                if (element2.day === day) {
                                    checkDay = 1;
                                    if(element2.time==undefined){
                                        element2.time=0;
                                    }
                                    const times = time + element2.time;
                                    const item =
                                        await this.model.findByIdAndUpdate(
                                            id,
                                            {
                                                $set: {
                                                    'timeReadBook.$[i].detailsyear.$[j].detailsmonth.$[k].time':
                                                        times,
                                                },
                                            },
                                            {
                                                arrayFilters: [
                                                    { 'i.createYear': year },
                                                    { 'j.month': month },
                                                    { 'k.day': day },
                                                ],
                                            },
                                        );
                                    if (item) {
                                        return new HttpResponse(item);
                                    }
                                    throw new Error(
                                        'Có lỗi, bạn có thể thử lại sau',
                                    );
                                }
                            }
                            if(checkDay == 0){
                                const detailsmonth = {
                                    day: day,
                                    time: time,
                                };
                                const item =
                                    await this.model.findByIdAndUpdate(
                                        id,
                                        {
                                            $push: {
                                                'timeReadBook.$[i].detailsyear.$[j].detailsmonth':
                                                    detailsmonth,
                                            },
                                        },
                                        {
                                            arrayFilters: [
                                                { 'i.createYear': year },
                                                { 'j.month': month },
                                            ],
                                        },
                                    );
                                if (item) {
                                    return new HttpResponse(item);
                                }
                                throw new Error(
                                    'Có lỗi, bạn có thể thử lại sau',
                                );
                            }
                        }
                    }
                    if(checkMonth==0){
                        const detailsmonth = {
                            day: day,
                            time: time,
                        };
                        let detailmonth = [];
                        detailmonth.push(detailsmonth);
                        const detailsyear = {
                            month: month,
                            detailsmonth: detailmonth,
                        };
                        const item = await this.model.findByIdAndUpdate(
                            id,
                            {
                                $push: {
                                    'timeReadBook.$[i].detailsyear':
                                        detailsyear,
                                },
                            },
                            {
                                arrayFilters: [{ 'i.createYear': year }],
                            },
                        );
                        if (item) {
                            return new HttpResponse(item);
                        }
                        throw new Error('Có lỗi, bạn có thể thử lại sau');
                    } 
                }
            }
            if(checkYear==0){
                const detailsmonth = {
                    day: day,
                    time: time,
                };
                let detailmonth = [];
                detailmonth.push(detailsmonth);
                const detailsyear = {
                    month: month,
                    detailsmonth: detailmonth,
                };
                let detailYear = [];
                detailYear.push(detailsyear);
                const data = {
                    createYear: year,
                    detailsyear: detailYear,
                };
                const item = await this.model.findByIdAndUpdate(id, {
                    $push: { timeReadBook: data },
                });
                if (item) {
                    return new HttpResponse(item);
                }
                throw new Error('Có lỗi, bạn có thể thử lại sau');
            }
        } catch (error) {
            throw new Error(error.message || 'Có lỗi, bạn có thể thử lại sau');
        }
    }

    async getReadTimeBook(_id) {
        try {
            const account = await this.model.findById(_id);
            const timeReadBook = account.timeReadBook;
            let days;
            let months;
            let years;
            for (const year of timeReadBook) {
                for (const month of year.detailsyear) {
                    for (const day of month.detailsmonth) {
                         days = {
                            ...days,
                            [day.day]: day.time,
                        };
                    }
                    months = {
                        ...months,
                        [month.month]: days,
                    };
                    days = {};
                }
                years = {
                    ...years,
                    [year.createYear]: months,
                };
                months = {};
               
            }
            return new HttpResponse(years);
        } catch (errors) {
            throw errors;
        }
    }

    async purchaseCart(idUser, idCart) {
        try {
            const data = {
                idCart,
            };
            const item = await this.model.findByIdAndUpdate(idUser, {
                $push: { purchaseHistory: data },
            });
            if (item) {
                return new HttpResponse(item);
            }
            throw new Error('Có lỗi, bạn có thể thử lại sau');
        } catch (errors) {
            throw errors;
        }
    }

    async getpurchaseCart(idUser) {
        try {
            const item = await this.model
                .findOne({ _id: idUser }, { purchaseHistory: 1 })
                .populate({
                    path: 'purchaseHistory',
                    populate: {
                        path: 'idCart',
                        populate: {
                            path: 'allPurchase',
                            populate: {
                                path: 'chapters',
                                populate: {
                                    path: 'idChapter',select:'_id title idBook chapterNumber price',
                                    populate: {
                                        path: 'idBook',select:'name image introduction', 
                                    },
                                },
                            },
                        },
                    },
                });
                let details =[];
                let response =[];
                let dataChapter;
                let dataBook;
                let chapters = [];
                item.purchaseHistory.map((item)=>{
                    if(item.idCart !==null){
                        item.idCart.allPurchase.map((item2)=>{
                            item2.chapters.map((item3,index)=>{
                                dataChapter = {
                                    nameChapter:item3.idChapter.title,
                                    chapterNumber:item3.idChapter.chapterNumber,
                                    price:item3.idChapter.price,
                                }
                                if(index==0){
                                    dataBook = {
                                        idBook:item3.idChapter.idBook._id,
                                        imageBook:item3.idChapter.idBook.image,
                                        nameBook:item3.idChapter.idBook.name,
                                        introductionBook:item3.idChapter.idBook.introduction,
                                    }
                                }
                                chapters.push(dataChapter);
                            })
                            details.push({...dataBook,chapters});
                            chapters = [];
                        })
                        response.push({
                            idCart:item.idCart._id,
                            allProduct:details,
                            purchaseDate:item.idCart.purchaseDate,
                            totalPrice:item.idCart.totalPrice,
                        });
                        details = [];
                    }
                });
            if (item) {
                return new HttpResponse(response);
            }
            throw new Error('Có lỗi, bạn có thể thử lại sau');
        } catch (errors) {
            throw errors;
        }
    }

    async getChangeProfile(id, data) {
        try {
            const item = await this.model.findByIdAndUpdate(id, data);
            if (item) {
                return new HttpResponse(item);
            }
            throw new Error('Có lỗi, bạn có thể thử lại sau');
        } catch (errors) {
            throw errors;
        }
    }

    async createImage(file) {
        try {
            if (!file) {
                throw new Error('Image is not presented!');
            }

            const uploadResult = await cloudinaryUpload(file);
            const response = {
                cloudinaryId: uploadResult.public_id,
                url: uploadResult.secure_url,
            };
            return new HttpResponse(response);
        } catch (e) {
            throw e;
        }
    }

    async getAuthor() {
        try {
            const item = await this.model.find({
                role: config.ROLE_USER.AUTHOR,
            });

            const data = item.map((item) => {
                return {
                    _id: item._id,
                    name: item.name,
                    avatar: item.image,
                    aboutAuthor: item.aboutAuthor,
                };
            });

            if (item) {
                return new HttpResponse(data);
            }
            throw new Error('Có lỗi, bạn có thể thử lại sau');
        } catch (errors) {
            throw errors;
        }
    }

    async createAudio(file) {
        try {
            if (!file) {
                throw new Error('Image is not presented!');
            }
            let audioUrl;
            const file64 = formatBufferTo64(file);
            const fName = file.originalname.split('.')[0];
            const cloudinaryUploadAudio = await cloudinary.uploader.upload(
                file64.content,
                {
                    resource_type: 'video',
                    public_id: `AudioUploads/${fName}`,
                },

                // Send cloudinary response or catch error
                (err, audio) => {
                    audioUrl = audio;
                },
            );

            const response = {
                cloudinaryId: audioUrl.public_id,
                url: audioUrl.secure_url,
            };
            return new HttpResponse(response);
        } catch (e) {
            throw e;
        }
    }

    async findAll(page, limit) {
        try {
            const item = await this.model
                .find({})
                .skip((page - 1) * limit)
                .limit(limit);
            const count = await this.model.countDocuments();

            const result = {
                users: item,
                total: count,
            }
            if (item) {
                return new HttpResponse(result);
            }
            throw new Error('Có lỗi, bạn có thể thử lại sau');
        } catch (errors) {
            throw errors;
        }
    }

    async getProfile(userId) {
        try {
            const item = await this.model.findById(userId).populate({
                path: 'notification',
                populate: {
                    path: 'chapter',
                    select: 'title _id',
                },
            })
            .populate({
                path: 'notification',
                populate: {
                    path: 'book',
                    select: 'name image _id',
                },
            });
        
            if (item) {
                return new HttpResponse(item);
            }
            throw new Error('Có lỗi, bạn có thể thử lại sau');
        } catch (errors) {
            throw errors;
        }
    }

    async adminAccessAuthor(idUser, authorAcess){
        try {
            if(authorAcess == config.AUTHOR_ACCOUNT_STATUS.ACTIVE){
                await this.model.findByIdAndUpdate(idUser, {authorAcess:authorAcess, role: config.ROLE_USER.AUTHOR});
                return true;
            }else if(authorAcess == config.AUTHOR_ACCOUNT_STATUS.CLOSE){
                await this.model.findByIdAndUpdate(idUser, {authorAcess:authorAcess, role: config.ROLE_USER.USER});
                return true;
            }
        } catch (error) {
            throw error;
        }
    }

    async adminChangeStatus(idUser, status){
        try {
            await this.model.findByIdAndUpdate(idUser, {status:status});
            return true;
        } catch (error) {
            console.log(error);
        }
    }

    async findById(email) {
        try {
            const item = await this.model.findOne({ email: email });
            if (!item) {
                console.log('User not found');
            }
            return item;
        } catch (errors) {
            throw errors;
        }
    }
}

module.exports = { UserService };
