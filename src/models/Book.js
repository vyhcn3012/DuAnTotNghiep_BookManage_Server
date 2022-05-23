const mongoose = require( 'mongoose' );
const { Schema } = require( 'mongoose' );
const uniqueValidator = require( 'mongoose-unique-validator' );

class Book {
    static instance = null;
    initSchema() {
        const schema = new Schema({
            'categoryId': {
                'type': Schema.Types.ObjectId,
                'required': true,
                'ref':'category'

            },
            'evaluateId': {
                'type': Schema.Types.ObjectId,
                'required': true,
                'ref':'evaluate'
            },
            'authorId': {
                'type': Schema.Types.ObjectId,
                'required': true,
                'ref':'author'
            },
            'name': {
                'type': String,
                'required': true,
            },
            'permission': {
                'type': Boolean,
                'required': true,
            },
            'image': {
                'type': String,
                'required': false,
            },
            'description': {
                'type': String,
                'required': true,          
            },
            'comment': {
                'type': [{
                    'userId': {
                        'type': Schema.Types.ObjectId,
                        'required': true,
                    },
                    'content': {
                        'type': String,
                        'required': true,
                    },
                    'numLike': {
                        'type': Number,
                        'required': true,
                    }
                }],
                'required': true,          
            },
            'page': {
                'type': String,
                'required': false,          
            },
            'sound': {
                'type': String,
                'required': false,          
            },
            'numPage': {
                'type': Number,
                'required': false,          
            },
            'numView': {
                'type': Number,
                'required': false,          
            },
        }, { 'timestamps': true } );

        schema.plugin( uniqueValidator );
        try {
            mongoose.model( 'book', schema );
        } catch ( e ) {
           
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