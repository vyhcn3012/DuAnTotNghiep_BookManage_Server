const mongoose = require( 'mongoose' );
const { Schema } = require( 'mongoose' );
const uniqueValidator = require( 'mongoose-unique-validator' );

class Cart {
    static instance = null;
    initSchema() {
        const schema = new Schema({
            'allPurchase': {
                'type': [
                    {
                        'idBook': {
                            'type': Schema.Types.ObjectId,
                            'required': false,
                            'ref': 'book'
                        },
                        'chapters': {
                            'type': [
                                {
                                    'idChapter': {
                                        'type': Schema.Types.ObjectId,
                                        'required': true,
                                        'ref':'chapter'
                                    },
                                }
                            ],
                            'required': false,
                        },
                    }
                ],
                'required': false,
            },
            'purchaseDate': {
                'type': Date,
                'required': false,
            },
            'totalPrice': {
                'type': String,
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