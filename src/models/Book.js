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
                'required': true,
            },
            'password': {
                'type': String,
                'required': true,
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
            'payservices': {
                'type': String,
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
        if (!Book.instance) {
            this.initSchema();
            Book.instance = mongoose.model( 'book' );
        }        
        return Book.instance;
    }
}

module.exports = { Book };