const { AuthService } = require('./../services/AuthService');
const { UserService } = require('./../services/UserService');
const config = require('../../config/config').getConfig();
const { Auth } = require('./../models/Auth');
const { Account } = require('./../models/Account');
const authService = new AuthService(new Auth().getInstance(), new Account().getInstance());
const userService = new UserService(new Account().getInstance());
const autoBind = require('auto-bind');
const { OAuth2Client } = require("google-auth-library"),
  client = new OAuth2Client(config.GOOGLE_CLIENT_ID);
class AuthCotroller {
    constructor(service) {
        this.service = service;
        autoBind(this);
    }

    async login(req, res, next) {
        try{
            const { token, token_fcm, } = req.body;
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: config.GOOGLE_CLIENT_ID
            });
            const { name, email, picture } = ticket.getPayload();
            const check_email = config.EMAIL_GOOGLE_TESTING;
            const body = {
                email: email,
                //role: config.USER_ROLE.EMPLOYEE,
                name: name,
                image: picture,
                phone: " ",
                permission: "author",
                bookmark: "",
                wallet: 0,
                favoritebooks: "",
                token_fcm: token_fcm
            }
            const response = await authService.login(body);
            //console.log("body", response);
            await res.status(response.statusCode).json(response);
        }catch(e) {
            console.log('>>>>>>132 login error: ' + e);
            next(e);
        }
    }

    async checkLogin(req, res, next) {
        try {
            const token = this.extractToken(req);

            req.account = await this.service.checkLogin(token);
            console.log("req.account", req.account);
            req.authorized = true;
            req.token = token;
            next();
        } catch (e) {
            next(e);
        }
    }

    async getAuthor(req, res, next) {
        try {
            //console.log("getAuthor" + userService.getAll);
            const response = await userService.getAll({limit:1000});
            const data = response.data.filter(x => x.permission === 'author');
            res.status(response.statusCode).json(data);
        } catch (e) {
            // next(e);
        }
    }
    async getTimeRead(req, res, next) {
        try {
            const { id } = req.params;
            const response = await userService.getTimeRead(id);
            await res.status(response.statusCode).json(response);
        } catch (e) {
            // next(e);
        }
    }

    async getreadBooks(req, res, next) {
        try {
            const { id } = req.params;
            const response = await userService.getreadBook(id);
            await res.status(response.statusCode).json(response);
        
        } catch (errors) {
            throw errors;
        }
    }

    async logout(req, res, next) {
        try {
            const token = this.extractToken(req);
            const { fcmtoken } = req.body;
            req.account = await this.service.checkLogin(token);
            const response = await this.service.logout(token, fcmtoken, req.account);
            await res.status(response.statusCode).json(response);
        } catch (e) {
            next(e);
        }
    }

    extractToken(req) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
            return req.query.token;
        } else if (req.cookies && req.cookies.token) {
            return req.cookies.token;
        }
        return null;
    }

    test(req, res, next) {
        try {
            // const response = await this.service.login( req.body.email, req.body.password );

            res.render('auth/login');
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = new AuthCotroller(authService);
