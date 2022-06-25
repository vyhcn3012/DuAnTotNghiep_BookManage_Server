const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

class Chapter {
    static instance = null;
    initSchema() {
        const schema = new Schema({
            'bookId': {
                'type': Schema.Types.ObjectId,
                'required': true,
                'ref': 'book'
            },
            'title': {
                'type': String,
                'required': false,
            },
            'image': {
                'type': String,
                'required': false,
            },
            'releasedDate': {
                'type': Date,
                'required': false,
            },
            'htmlChapter': {
                'type': String,
                'required': false,
            },
            'linkSound': {
                'type': String,
                'required': false,
            },
            'comment': {
                'type': [{
                    '_id': {
                        'type': Schema.Types.ObjectId,
                        'required': true,
                    },
                    'userName': {
                        'type': String,
                        'required': false,
                    },
                    'image': {
                        'type': String,
                        'required': false,
                    },
                    'content': {
                        'type': String,
                        'required': false,
                    },
                    'evaluate': {
                        'type': Number,
                        'required': false,
                    },
                    'time': {
                        'type': Date,
                        'required': false,
                    },
                }],
                'required': false,
            },
            'permission': {
                'type': Number,
                'required': false,
            },
            'price': {
                'type': Number,
                'required': false,
            },
        }, { 'timestamps': false } );
        schema.plugin(uniqueValidator);

        try {
            mongoose.model( 'chapter', schema );
        } catch ( e ) {
           
        }
    }

    getInstance() {
        if (!Chapter.instance) {
            this.initSchema();
            Chapter.instance = mongoose.model( 'chapter' );
        }        
        return Chapter.instance;
    }
}

model.exports = { Chapter };
