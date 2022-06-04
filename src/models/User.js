const mongoose = require( 'mongoose' );
const { Schema } = require( 'mongoose' );
const uniqueValidator = require( 'mongoose-unique-validator' );

class User {
    static instance = null;
    initSchema() {
        const schema = new Schema({
            'name': {
                'type': String,
                'required': true,
            },
            'email': {
                'type': String,
                'required': true,
            },
            'phone': {
                'type': String,
                'required': false,
            },
            'permission': {
                'type': String,
                'required': true,
            },
            'fcmtokens': {
                'type': [{
                    'type': String,
                    'required': false,
                }],
                'required': false,
            },
            'image': {
                'type': String,
                'required': false,
            },
            'bookmark': {
                'type': String,
                'required': false,          
            },
            'wallet': {
                'type': Number,
                'required': false,          
            },
            'favoritebooks': {
                'type': String,
                'required': false,          
            },
        }, { 'timestamps': true } );

        schema.statics.findByEmail = function( email ) {
            return this.findOne( { 'email': email } );
        };
        schema.plugin( uniqueValidator );
        try {
            mongoose.model( 'user', schema );
        } catch ( e ) {
            throw e;
        }
    }

    getInstance() {
        if (!User.instance) {
            this.initSchema();
            User.instance = mongoose.model( 'user' );
        }        
        return User.instance;
    }
}

module.exports = { User };