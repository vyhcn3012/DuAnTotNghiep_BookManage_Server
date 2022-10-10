const mongoose = require( 'mongoose' );
const { Schema } = require( 'mongoose' );
const uniqueValidator = require( 'mongoose-unique-validator' );

class Cart {
    static instance = null;
    initSchema() {
        const schema = new Schema({
            'idBook': {
                'type': Schema.Types.ObjectId,
                'required': false,
            },
            'idChapter': {
                'type': Schema.Types.ObjectId,
                'required': false,
            },
            'purchaseDate': {
                'type': Date,
                'required': false,
            },
           
        }, { 'timestamps': true } );

        schema.plugin( uniqueValidator );
        try {
            mongoose.model( 'cart', schema );
        } catch ( e ) {
           
        }
    }

    getInstance() {
        if (!Cart.instance) {
            this.initSchema();
            Cart.instance = mongoose.model( 'cart' );
        }        
        return Cart.instance;
    }
}

module.exports = { Cart };