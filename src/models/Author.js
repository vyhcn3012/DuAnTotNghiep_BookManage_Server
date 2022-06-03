const mongoose = require( 'mongoose' );
const { Schema } = require( 'mongoose' );
const uniqueValidator = require( 'mongoose-unique-validator' );

class Author {
    static instance = null;
    initSchema() {
        const schema = new Schema({
            'name': {
                'type': String,
                'required': true,
            },
            'phone': {
                'type': Number,
                'required': true,
            },
            'email': {
                'type': String,
                'required': true,
            },
            'token': {
                'type': String,
                'required': true,
            },
            'address': {
                'type': String,
                'required': true,
            },
            'birthday': {
                'type': Date,
                'required': true,
            },
            'image': {
                'type': String,
                'required': true,
            },
            'overview': {
                'type': Number,
                'required': true,
            },
            'aboutAuthor': {
                'type': String,
                'required': true,
            },
        }, { 'timestamps': true } );

        schema.plugin( uniqueValidator );
        try {
            mongoose.model( 'author', schema );
        } catch ( e ) {
            throw e;
        }
    }

    getInstance() {
        if (!Author.instance) {
            this.initSchema();
            Author.instance = mongoose.model( 'author' );
        }        
        return Author.instance;
    }
}

module.exports = { Author };