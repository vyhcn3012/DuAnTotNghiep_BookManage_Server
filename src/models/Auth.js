const async = require('hbs/lib/async');
const moogoose = require('mongoose');
const { Schema } = require('mongoose');
const jwt = require('jsonwebtoken'),
    config = require('../../config/config').getConfig(),
    jwtKey = config.JWT_SECRET,
    jwtExpirySeconds = config.JWT_TOKEN_LIFETIME;

class Auth {
    static instance = null;
    initAuth() {
        const schema = new Schema({
            'token': {
                'type': String,
                'required': true,
            },
            'user': {
                'type': Schema.Types.ObjectId,
                'required': true,
                'ref': 'user'
            }
        }, { 'timestamps': true } );

        schema.static.generateToken = async function( user ){
            try{
                const token = await jwt.sign({
                    '_id': user._id.toString(),
                    'email': user.email,
                    'phone': user.phone,
                    'name': user.name,
                    'password': user.password,
                    'permission': user.permission,
                    'avatar': user.avatar,
                    'bookmark': user.bookmark,
                    'payervice': user.payervice,
                    'favoritebooks': user.favoritebooks
                }, jwtKey, {
                    'algorithm': 'HS256',
                    'expiresIn': jwtExpirySeconds,
                });

                return token;
            }catch(e){
                throw e;
            }
        };

        schema.statics.decodeToken = async function(token){
            try{
                return await jwt.verify( token, jwtKey);
            }catch( e ){
                throw e;
            }
        };
    }

    getInstance() {
        if (!Auth.instance) {
            this.initSchema();
            Auth.instance = mongoose.model( 'auth' );
        }        
        return Auth.instance;
    }
}

module.exports = { Auth };