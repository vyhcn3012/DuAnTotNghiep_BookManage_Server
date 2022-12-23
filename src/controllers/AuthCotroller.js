const { AuthService } = require('./../services/AuthService');
const { UserService } = require('./../services/UserService');
const { CartService } = require('./../services/CartService');
const config = require('../../config/config').getConfig();
const { Auth } = require('./../models/Auth');
const { Account } = require('./../models/Account');
const { Cart } = require('./../models/Cart');

const authService = new AuthService(
    new Auth().getInstance(),
    new Account().getInstance(),
);
const cartService = new CartService(new Cart().getInstance());
const userService = new UserService(new Account().getInstance());
const stripe = require('stripe')(
    'sk_test_51LksFaBV28KdDJtDghRwcFhArVGvyu9jl05AZt3xHUOxY8C9FQ1NlIAZv7XxtQopv6pBDpZB3hYHVc7zGB13KNxS00BwXKTRh7',
);
const autoBind = require('auto-bind');
const bcrypt = require('bcryptjs');
const { MediaService } = require('../services/MediaService');

const { OAuth2Client } = require('google-auth-library'),
    client = new OAuth2Client(config.GOOGLE_CLIENT_ID);
var ObjectId = require('mongodb').ObjectId;

class AuthCotroller {
    constructor(service) {
        this.service = service;
        autoBind(this);
    }

    async login(req, res, next) {
        try {
            const { token, token_fcm } = req.body;
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: config.GOOGLE_CLIENT_ID,
            });
            const { name, email, picture } = ticket.getPayload();
            const check_email = config.EMAIL_GOOGLE_TESTING;
            const body = {
                email: email,
                name: name,
                image: picture,
                phone: ' ',
                permission: 'author',
                bookmark: '',
                wallet: 0,
                favoritebooks: '',
                token_fcm: token_fcm,
            };
            const response = await authService.login(body);
            await res.status(response.statusCode).json(response);
        } catch (e) {
            console.log('>>>>>>132 login error: ' + e);
            next(e);
        }
    }

    async getAuthor(req, res, next) {
        try {
            const response = await userService.getAuthor();
            res.status(response.statusCode).json(response);
        } catch (e) {
            // next(e);
        }
    }
    async getDetailAuthor(req, res, next) {
        try {
            const { id } = req.params;
            const response = await userService.get(id);
            res.status(response.statusCode).json(response);
        } catch (e) {
            // next(e);
        }
    }
    async getTimeRead(req, res, next) {
        try {
            const { id } = req.account;
            const response = await userService.getTimeRead(id);
            await res.status(response.statusCode).json(response);
        } catch (e) {
            // next(e);
        }
    }

    async changeReadTimeBook(req, res, next) {
        try {
            const { _id } = req.account;
            const { body } = req;
            const response = await userService.changeReadTimeBook(_id, body);
            await res.status(response.statusCode).json(response);
        } catch (e) {
            // next(e);
        }
    }

    async getReadTimeBook(req, res, next) {
        try {
            const { id } = req.params;
            const response = await userService.getReadTimeBook(id);
            await res.status(response.statusCode).json(response);
        } catch (e) {
            // next(e);
        }
    }

    async getreadBooks(req, res, next) {
        try {
            const { id } = req.params;
            const response = await userService.getCountreadBook(id);
            await res.status(response.statusCode).json(response);
        } catch (errors) {
            throw errors;
        }
    }
    async getFavoriteBooks(req, res, next) {
        try {
            const { id } = req.params;
            const response = await userService.getFavoriteBooks(id);
            await res.status(response.statusCode).json(response);
        } catch (errors) {
            throw errors;
        }
    }

    async getReadingBooks(req, res, next) {
        try {
            const { id } = req.params;
            const response = await userService.getReadingBooks(id);
            await res.status(response.statusCode).json(response);
        } catch (errors) {
            throw errors;
        }
    }

    async getPayBook(req, res, next) {
        try {
            const { id } = req.params;
            const response = await userService.getPayBook(id);
            await res.status(response.statusCode).json(response);
        } catch (errors) {
            throw errors;
        }
    }

    async postIdReadingBooks(req, res, next) {
        try {
            const { idBook } = req.body;
            const { _id } = req.account;
            const response = await userService.postIdReadingBooks(_id, idBook);
            await res.status(response.statusCode).json(response);
        } catch (errors) {
            throw errors;
        }
    }

    async postChapterBought(req, res, next) {
        try {
            const { idChapter, totalPrice } = req.body;
            const { _id } = req.account;
            const response = await userService.postChapterBought(
                _id,
                idChapter,
                totalPrice,
            );

            await res.status(response.statusCode).json(response);
        } catch (e) {
            next(e);
        }
    }

    async postFavoriteBooks(req, res, next) {
        try {
            const { idBook } = req.body;
            const { _id } = req.account;
            const response = await userService.postFavoriteBooks(_id, idBook);
            await res.status(response.statusCode).json(response);
        } catch (e) {
            next(e);
        }
    }

    async deleteFavoriteBooks(req, res, next) {
        try {
            const { idBook } = req.body;
            const { _id } = req.account;
            const response = await userService.deleteFavoriteBooks(_id, idBook);
            await res.status(response.statusCode).json(response);
        } catch (e) {
            next(e);
        }
    }

    async postFollowBooks(req, res, next) {
        try {
            const { id, idBook } = req.body;
            const response = await userService.postFollowBooks(id, idBook);
            await res.status(response.statusCode).json(response);
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const token = this.extractToken(req);
            const { fcmtoken } = req.body;
            req.account = await this.service.checkLogin(token);
            const response = await this.service.logout(
                token,
                fcmtoken,
                req.account,
            );
            await res.status(response.statusCode).json(response);
        } catch (e) {
            next(e);
        }
    }

    async logoutWeb(req, res, next) {
        try {
            const token = this.extractToken(req);
            const { fcmtoken } = req.account;
            req.account = await this.service.checkLogin(token);
            const response = await this.service.logout(
                token,
                fcmtoken,
                req.account,
            );
            await res.status(response.statusCode).json(response);
        } catch (e) {
            next(e);
        }
    }

    async isAdmin(req, res, next) {
        try {
            const { role } = req.account;
            if (
                role == config.ROLE_USER.ADMIN ||
                role == config.ROLE_USER.SUPER_ADMIN
            ) {
                next();
            } else {
                return res.redirect('/cpanel/home');
            }
        } catch (e) {
            next(e);
        }
    }

    async isAuthor(req, res, next) {
        try {
            const { role } = req.account;
            if (
                role == config.ROLE_USER.AUTHOR ||
                role == config.ROLE_USER.AUTHOR
            ) {
                next();
            } else {
                return res.redirect('/cpanel/home');
            }
        } catch (e) {
            next(e);
        }
    }

    async checkLogin(req, res, next) {
        try {
            const token = this.extractToken(req);
            const response = await this.service.checkLogin(token);
            req.account = response;
            req.authorized = true;
            req.token = token;
            next();
        } catch (e) {
            next(e);
        }
    }

    extractToken(req) {
        if (
            req.headers.authorization &&
            req.headers.authorization.split(' ')[0] === 'Bearer'
        ) {
            return req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
            return req.query.token;
        } else if (req.cookies && req.cookies.token) {
            return req.cookies.token;
        }
        return null;
    }

    async creatPaymentIntent(req, res, next) {
        try {
            const { amount, currency } = req.body;
            const payableAmount = parseInt(amount) * 100;
            const paymentIntent = await stripe.paymentIntents.create({
                amount: payableAmount,
                currency: currency, // put your currency
            });
            const clientSecret = await paymentIntent.client_secret;
            await res.status(200).json({ clientSecret });
        } catch (e) {
            next(e);
        }
    }

    async indexUser_Cpanel(req, res, next) {
        try {
            const { id } = req.params;
            const { role } = req.account;
            const { page = 1, limit = 10 } = req.query;
            const checkStatus = { 1: 'Hoạt động', 2: 'Chặn' };

            if (id == 1) {
                const response = await userService.findAll(page, limit);
                const countDocument =
                    Math.round(response.data.total / limit) + 1;
                const arr = [];
                for (let i = 1; i <= countDocument; i++) {
                    arr.push(i);
                }
                const data = response.data.users.map((item, index) => {
                    return {
                        index: index + 1,
                        _id: item._id,
                        name:
                            item.name.trim() == ''
                                ? 'Chưa cập nhật'
                                : item.name,
                        email:
                            item.email.trim() == '' ? item.phone : item.email,
                        phone: item.phone,
                        role: item.role,
                        image:
                            item.image == null
                                ? 'https://cdn-icons-png.flaticon.com/512/1946/1946429.png'
                                : item.image,
                        createdAt: item.createdAt,
                        updatedAt: item.updatedAt,
                        authorAcess: item.authorAcess,
                        statusPage: 1,
                        status: checkStatus[item.status],
                    };
                });

                res.render('admin/manager-user/index.hbs', {
                    [role]: role,
                    data: data,
                    idData: JSON.stringify(id),
                    statusPage: 1,
                    next: parseInt(page) + 1,
                    back: parseInt(page) == 1 ? 1 : parseInt(page) - 1,
                    count: arr,
                });
            } else if (id == 2) {
                const response = await userService.findauthorAcess(
                    config.AUTHOR_ACCOUNT_STATUS.PENDING,
                    page,
                    limit,
                );
                const data = response.data.map((item, index) => {
                    return {
                        index: index + 1,
                        _id: item._id,
                        name:
                            item.name.trim() == ''
                                ? 'Chưa cập nhật'
                                : item.name,
                        email:
                            item.email.trim() == '' ? item.phone : item.email,
                        phone: item.phone,
                        role: item.role,
                        image:
                            item.image == null
                                ? 'https://cdn-icons-png.flaticon.com/512/1946/1946429.png'
                                : item.image,
                        createdAt: item.createdAt,
                        updatedAt: item.updatedAt,
                        authorAcess: item.authorAcess,
                        status: checkStatus[item.status],
                        statusPage: 2,
                    };
                });

                res.render('admin/manager-user/index.hbs', {
                    [role]: role,
                    data: data,
                    idData: JSON.stringify(id),
                    statusPage: 2,
                    next: parseInt(page) + 1,
                    back: parseInt(page) == 1 ? 1 : parseInt(page) - 1,
                });
            }
        } catch (e) {
            console.log(e);
        }
    }
    async agreeAccess(req, res, next) {
        try {
            const { idUser } = req.body;
            const response = await userService.agreeAccess(idUser);
            return res.status(response.statusCode).json(response);
        } catch (e) {
            console.log(e);
        }
    }
    async AccessAuthor(req, res, next) {
        try {
            const { id, status } = req.params;
            if (status == config.AUTHOR_ACCOUNT_STATUS.CLOSE) {
                await userService.AccessAuthor(id);
                return res.redirect('/cpanel/home/man-hinh-chinh');
            } else if (status == config.AUTHOR_ACCOUNT_STATUS.PENDING) {
                return res.redirect('/cpanel/home/man-hinh-chinh');
            } else if (status == config.AUTHOR_ACCOUNT_STATUS.ACTIVE) {
                return res.redirect('/cpanel/authors/quan-ly-sach');
            }
        } catch (e) {
            console.log(e);
        }
    }

    async adminAccessAuthor(req, res, next) {
        try {
            const { id, status } = req.params;
            await userService.adminAccessAuthor(id, status);
            return res.redirect(
                '/cpanel/admins/quan-ly-nguoi-dung/2?page=1&limit=10',
            );
        } catch (e) {
            next(e);
        }
    }

    async refuseAccess(req, res, next) {
        try {
            const { idUser } = req.body;
            const response = await userService.refuseAccess(idUser);
            return res.status(response.statusCode).json(response);
        } catch (e) {
            console.log(e);
        }
    }
    async getAllUsers(req, res, next) {
        try {
            const response = await userService.getAllUsers();
            return res.status(response.statusCode).json(response);
        } catch (e) {
            console.log(e);
        }
    }
    
    async insertNumberphone(req, res, next) {
        try {
            const { body } = req;
            const response = await userService.insertNumberphone(body);
            console.log(response);
            return res.status(response.statusCode).json(response);
        } catch (e) {
            console.log(e);
        }
    }

    async resetPassword(req, res, next) {
        try {
            const { phoneUser, passwordUser } = req.body;
            const response = await userService.resetPassword(
                phoneUser,
                passwordUser,
            );
            return res.status(response.statusCode).json(response);
        } catch (e) {
            console.log(e);
        }
    }
    async loginNumberphone(req, res, next) {
        try {
            const { body } = req;
            const { passwordUser } = req.body;

            const response = await authService.loginNumberphone(body);
            if (response.data === 'Số điện thoại này chưa đăng ký') {
                return res.status(response.statusCode).json(response);
            }
            const checkPassword = await bcrypt.compare(
                passwordUser,
                response.data.account.passwordUser,
            );
            if (checkPassword) {
                return res.status(response.statusCode).json(response);
            } else {
                return res.status(response.statusCode).json({
                    message: 'Mật khẩu không đúng',
                });
            }
        } catch (e) {
            console.log(e);
        }
    }

    async getAllUsersChat(req, res, next) {
        try {
            const { _id } = req.account;
            console.log(_id);
            const response = await userService.getAllUsersChat(_id);
            return res.status(response.statusCode).json(response);
        } catch (e) {
            next(e);
        }
    }

    async getCountPayBook(req, res, next) {
        try {
            const response = await userService.getCountPayBook();
            return res.status(response.statusCode).json(response);
        } catch (e) {
            next(e);
        }
    }

    async getpurchaseCart(req, res, next) {
        try {
            const idUser = req.account._id;
            const response = await userService.getpurchaseCart(idUser);
            await res.status(response.statusCode).json(response);
        } catch (e) {
            console.log(e);
        }
    }
    async getChangeProfile(req, res, next) {
        try {
            const idUser = req.account._id;
            const { name, file } = req.body;
            let data;
            if (file) {
                const urlImage = await userService.createImage(
                    'data:image/jpeg;base64,' + file,
                );
                data = {
                    image: urlImage.data.url,
                    name,
                };
            } else {
                data = {
                    name,
                };
            }

            const response = await userService.getChangeProfile(idUser, data);
            await res.status(response.statusCode).json(response);
        } catch (e) {
            console.log(e);
        }
    }

    async creatAudio(req, res, next) {
        try {
            const idUser = req.account._id;
            const { name } = req.body;

            const urlImage = await userService.createAudio(req.file);

            const data = {
                image: urlImage.data.url,
                name,
            };
            const response = await userService.getChangeProfile(idUser, data);
            await res.status(response.statusCode).json(response);
        } catch (e) {
            console.log(e);
        }
    }

    async getProfile(req, res, next) {
        try {
            const { _id } = req.account;
            const response = await userService.getProfile(_id);
            const token = await authService.findtoken(_id);

            const data = {
                ...response,
                token: token,
            };
            return res.status(response.statusCode).json(data);
        } catch (e) {
            return res.status(500).json({
                message: 'Lỗi server',
            });
        }
    }

    async adminChangeStatus(req, res, next) {
        try {
            const { id, status } = req.params;
            await userService.adminChangeStatus(id, status);
            return res.redirect(
                '/cpanel/admins/quan-ly-nguoi-dung/1?page=1&limit=10',
            );
        } catch (e) {
            next(e);
        }
    }

    async indexCharts_Cpanel(req, res, next) {
        try {
            const carts = await cartService.getAllTotalPrice12Month();
            const { timeOf = 'month', time = '2022', monthQuery = '12' } = req.query;
            
            const totals = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            const daysArr = [0];

            const defautlMonths = [ "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12" ];
            const defautlDays = [];

            for(let i = 1; i <= 31; i++){
                defautlDays.push(i);
            }
            if(timeOf == config.CHART_STATUS.FOR_YEAR){
                for (const cart of carts) {
                    const month = new Date(cart.purchaseDate).getMonth();
                    totals[month] += parseInt(cart.totalPrice);
                }
            }else if(timeOf == config.CHART_STATUS.FOR_MONTH){
                for (const cart of carts) {
                    const month = new Date(cart.purchaseDate).getMonth() + 1;
                    const day = new Date(cart.purchaseDate).getDate();
                    if(month == monthQuery){
                        if(cart.totalPrice){
                            console.log(parseInt(cart.totalPrice));
                            daysArr[day - 1] += parseFloat(cart.totalPrice);
                        }
                    }
                }
            }

            console.log(daysArr);

            return res.render('admin/charts/chart_total_12_month.hbs', {
                _chartData: timeOf == config.CHART_STATUS.FOR_YEAR ? JSON.stringify(totals) : JSON.stringify(daysArr),
                _labelsData: timeOf == config.CHART_STATUS.FOR_YEAR ? JSON.stringify(defautlMonths) : JSON.stringify(defautlDays),
            });
        } catch (e) {
            next(e);
        }
    }

    async detailUser_Cpanel(req, res, next) {
        try{
            const { id } = req.params;
            const { timeOf = 'year', time = '2022', monthQuery = '12' } = req.query;
            const result = await userService.findById(id);
            const checkRole = { 1: 'Nguời dùng', 2: 'Tác giả', 99: 'Quản trị viên', 100: 'Thần'};
            const checkStatus = { 1: 'Hoạt động', 2: 'Chặn' };

            const defautlMonths = [ "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12" ];
            const monthsArr = [ "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12" ];
            const defautlDays = [];
            const defautlOptions = ["Theo năm", "Theo tháng"];

            for(let i = 1; i <= 31; i++){
                defautlDays.push(i);
            }

            const data = {
                ...result.toObject(),
                phone: result.phone.trim() === '' ? 'Chưa cập nhật' : result.phone,
                role: checkRole[result.role],
                status: checkStatus[result.status],
            }
            const month12Arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            const daysArr = [];
            const checkMonth = { 'January': 1, 'February': 2, 'March': 3, 'April': 4, 'May': 5, 'June': 6, 'July': 7, 'August': 8, 'September': 9, 'October': 10, 'November': 11, 'December': 12};
            const yearReadingBooks = data.timeReadBook;

            if(timeOf == config.CHART_STATUS.FOR_YEAR){
                for(const yearReadingBook of yearReadingBooks){
                    const monthReadingBooks = yearReadingBook.detailsyear;
                    if(yearReadingBook.createYear == time){
                        for(const monthReadingBook of monthReadingBooks){
                            const month = checkMonth[monthReadingBook.month];
                            for(const book of monthReadingBook.detailsmonth){
                                if(book.time){
                                    month12Arr[month - 1] += parseInt(book.time) / 60;
                                }
                            }
                        }
                    }
                }
            }else if(timeOf == config.CHART_STATUS.FOR_MONTH){
                for(const yearReadingBook of yearReadingBooks){
                    const monthReadingBooks = yearReadingBook.detailsyear;
                    if(yearReadingBook.createYear == time){
                        for(const monthReadingBook of monthReadingBooks){
                            const month = checkMonth[monthReadingBook.month];
                            if(month == monthQuery){
                                for(const book of monthReadingBook.detailsmonth){
                                    if(book.time){
                                        daysArr[book.day - 1] = parseInt(book.time) / 60;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            delete monthsArr[monthQuery - 1];
            return res.render('admin/manager-user/detail-user.hbs', {
                data: data,
                _chartData: timeOf == config.CHART_STATUS.FOR_YEAR ? JSON.stringify(month12Arr) : JSON.stringify(daysArr),
                timeOf: timeOf,
                _labelsData: timeOf == config.CHART_STATUS.FOR_YEAR ? JSON.stringify(defautlMonths) : JSON.stringify(defautlDays),
                _id: JSON.stringify(id),
                monthsArr: monthsArr,
                monthQuery: "Tháng " + monthQuery,
                defautlOption: timeOf == config.CHART_STATUS.FOR_YEAR ? defautlOptions[1] : defautlOptions[0],
                optionSelected: timeOf == config.CHART_STATUS.FOR_YEAR ? defautlOptions[0] : defautlOptions[1],
            });
        }catch (e) {
            next(e);
        }
    }
}

module.exports = new AuthCotroller(authService);
