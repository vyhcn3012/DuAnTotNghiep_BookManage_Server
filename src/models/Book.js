const mongoose = require( 'mongoose' );
const { Schema } = require( 'mongoose' );
const uniqueValidator = require( 'mongoose-unique-validator' );

class Book {
    static instance = null;
    initSchema() {
        const schema = new Schema({
            'categoryId': {
                'type': Schema.Types.ObjectId,
                'required': false,
                'ref':'category'
            },
            'evaluateId': {
                'type': [{
                    '_id': {
                        'type': Schema.Types.ObjectId,
                        'required': true,
                    },
                    'bookId': {
                        'type': Schema.Types.ObjectId,
                        'required': true,
                    },
                    'numEval': {
                        'type': Number,
                        'required': true,
                    },
                    'sumEval': {
                        'type': Number,
                        'required': true,
                    },
                }],
                'required': false,
            },
            'author': {
                'type':  [{
                    '_id': {
                        'type': Schema.Types.ObjectId,
                        'required': true,
                    },
                    'permission': {
                        'type': Number,
                        'required': true,
                    },
                }],
                'required': false,
                'ref':'author'
            },
            'releasedDate': {
                'type': Date,
                'required': false,
            },
            'name': {
                'type': String,
                'required': true,
            },
            'image': {
                'type': String,
                'required': true,
            },
            'introduction': {
                'type': String,
                'required': true,
            },
            'overview': {
                'type': Number,
                'required': true,
            },
            'numSumRead': {
                'type': Number,
                'required': true,          
            },
            'chapter': {
                'type': [{
                    '_id': {
                        'type': Schema.Types.ObjectId,
                        'required': true,
                    },
                    'title': {
                        'type': String,
                        'required': true,
                    },
                    'image': {
                        'type': String,
                        'required': true,
                    },
                    'releasedDate': {
                        'type': Date,
                        'required': true,
                    },
                    'htmlChapter': {
                        'type': String,
                        'required': true,
                    },
                    'linkSound': {
                        'type': String,
                        'required': true,
                    },
                    'comment': {
                        'type': [{
                            '_id': {
                                'type': Schema.Types.ObjectId,
                                'required': true,
                            },
                            'userName': {
                                'type': String,
                                'required': true,
                            },
                            'image': {
                                'type': String,
                                'required': true,
                            },
                            'content': {
                                'type': String,
                                'required': true,
                            },
                            'evaluate': {
                                'type': Number,
                                'required': true,
                            },
                            'time': {
                                'type': String,
                                'required': true,
                            },
                        }],
                        'required': false,          
                    },
                    'permission': {
                        'type': Number,
                        'required': true,
                    },
                    'price': {
                        'type': Number,
                        'required': true,
                    },
                }],
                'required': false,          
            },
            'isPrice': {
                'type': Number,
                'required': true,
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