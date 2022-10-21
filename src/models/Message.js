const mongoose = require( 'mongoose' );
const { Schema } = require( 'mongoose' );
const uniqueValidator = require( 'mongoose-unique-validator' );

class Message {
    static instance = null;
    initSchema() {
        const schema = new Schema({
            'message': {
                'type': String,
                'required': true,
            },
            users: Array,
            'sender':{
                'type': Schema.Types.ObjectId,
                'required': true,
                'ref':'user',
            },
        }, { 'timestamps': true } );

        schema.plugin( uniqueValidator );
        try {
            mongoose.model( 'message', schema );
        } catch ( e ) {
            throw e;
        }
    }

    getInstance() {
        if (!Message.instance) {
            this.initSchema();
            Message.instance = mongoose.model( 'message' );
        }        
        return Message.instance;
    }
}

module.exports = { Message };