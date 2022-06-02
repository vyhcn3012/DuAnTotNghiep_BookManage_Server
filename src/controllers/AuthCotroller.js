const { AuthService } = require('./../services/AuthService');
const config = require('../../config/config').getConfig();
const { Auth } = require('./../models/Auth');
const { User } = require('./../models/User');
const authService = new AuthService(new Auth().getInstance(), new User().getInstance());
const autoBind = require('auto-bind');
const { OAuth2Client } = require('google-auth-library'), client = new OAuth2Client(config.GOOGLE_CLIENT_ID);
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
            if(check_email == email){
                const body = {
                    email: email,
                    name: name,
                    image: picture,
                    phone: '0919560820',
                    token_fcm: token_fcm,
                }
                const response = await authService.login(body);
                await res.status(response.statusCode).json(response);
            }
        }catch(e) {
            console.log('>>>>>>132 login error: ' + e);
            next(e);
        }
    }

    async checkLogin(req, res, next) {
        try {
            const token = this.extractToken(req);

            req.user = await this.service.checkLogin(token);
            req.authorized = true;
            req.token = token;
            next();
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
