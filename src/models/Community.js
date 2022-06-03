const mongoose = require( 'mongoose' );
const { Schema } = require( 'mongoose' );
const uniqueValidator = require( 'mongoose-unique-validator' );

class Community {
    static instance = null;
    initSchema() {
        const schema = new Schema({
            'name': {
                'type': String,
                'required': true,
            },
            'image': {
                'type': String,
                'required': true,
            },
            'describe': {
                'type': String,
                'required': true,
            },
            'numMember': {
                'type': Number,
                'required': true,
            },
            'message': {
                'type': String,
                'required': true,
            },
            'dateReleased': {
                'type': Date,
                'required': true,
            },
        }, { 'timestamps': true } );

        schema.plugin( uniqueValidator );
        try {
            mongoose.model( 'community', schema );
        } catch ( e ) {
            throw e;
        }
    }

    getInstance() {
        if (!Community.instance) {
            this.initSchema();
            Community.instance = mongoose.model( 'community' );
        }        
        return Community.instance;
    }
}

module.exports = { Community };