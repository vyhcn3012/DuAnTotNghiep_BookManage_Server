const { AuthService } = require('./../services/AuthService');
const authService = new AuthService(new Auth().getInstance(), new User().getInstance());
const { Auth } = require('./../models/Auth');
const { User } = require('./../models/User');
const autoBind = require('auto-bind');
const { OAuth2Client } = require('google-auth-library'), client = new OAuth2Client(config.GOOGLE_CLIENT_ID)
const config = require('../../config/config').getConfig();
class AuthCotroller {
    constructor(service) {
        this.service = service;
        autoBind(this);
    }

    async login(req, res, next) {
        try{
            const { token, unit, token_fcm, } = req.body;
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: config.GOOGLE_CLIENT_ID
            });
            const { name, email, picture } = ticket.getPayload();
            const check_email = config.EMAIL_GOOGLE_TESTING;
            if(check_email == email){
                const body = {
                    email: email,
                    role: config.USER_ROLE,
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
}

module.exports = new AuthController(authService);