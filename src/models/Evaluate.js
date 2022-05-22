const mongoose = require( 'mongoose' );
const { Schema } = require( 'mongoose' );
const uniqueValidator = require( 'mongoose-unique-validator' );

class Evaluate {
    static instance = null;
    initSchema() {
        const schema = new Schema({
            'bookId': {
                'type': Schema.Types.ObjectId,
                'required': true,

            },
            'numEval': {
                'type': Number,
                'required': false,          
            },
            'sumEval': {
                'type': Number,
                'required': false,          
            },
        }, { 'timestamps': true } );

        schema.plugin( uniqueValidator );
        try {
            mongoose.model( 'evaluate', schema );
        } catch ( e ) {
            throw e;
        }
    }

    getInstance() {
        if (!Evaluate.instance) {
            this.initSchema();
            Evaluate.instance = mongoose.model( 'evaluate' );
        }        
        return Evaluate.instance;
    }
}

module.exports = { Evaluate };