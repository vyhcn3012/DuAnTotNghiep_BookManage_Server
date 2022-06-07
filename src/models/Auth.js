const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const jwt = require('jsonwebtoken'),
    config = require('../../config/config').getConfig(),
    jwtKey = config.JWT_SECRET,
    jwtExpirySeconds = config.JWT_TOKEN_LIFETIME;

class Auth {
    static instance = null;
    initSchema() {
        const schema = new Schema({
            'token': {
                'type': String,
                'required': true,
            },
            'account': {
                'type': Schema.Types.ObjectId,
                'required': true,
                'ref': 'account'
            }
        }, { 'timestamps': true } );

        schema.statics.generateToken = async function( account ){
            try{
                const token = await jwt.sign({
                    '_id': account._id?.toString() || '',
                    'email': account.email,
                    'phone': account.phone,
                    'name': account.name,
                    'permission': account.permission,
                    'image': account.image,
                    'bookmark': account.bookmark,
                    'wallet': account.wallet,
                    'favoritebooks': account.favoritebooks,
                    'fcmtokens': account.fcmtokens,
                    'historyBookRead': account.historyBookRead || [],
                }, jwtKey, {
                    'algorithm': 'HS256',
                    'expiresIn': jwtExpirySeconds,
                });
                return token;
            }catch(e){
                throw e;
            }
        };

        schema.statics.decodeToken = async function( token ) {
            try {
                return await jwt.verify( token, jwtKey );
            } catch ( e ) {
                throw e;
            }
        };
        try {
            mongoose.model( 'auth', schema );
        } catch ( e ) {
        }
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