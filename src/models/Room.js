const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

class Room {
    static instance = null;
    initSchema() {
        const schema = new Schema(
            {
                name: {
                    type: String,
                    required: true,
                },
                image: {
                    type: String,
                    required: false,
                },
                user: {
                    type: [Schema.Types.ObjectId],
                    required: true,
                    ref: 'account',
                },
                createdBy: {
                    type: Schema.Types.ObjectId,
                    required: true,
                    ref: 'account',
                },
                createdAt: {
                    type: Date,
                    required: false,
                },
            },
            { timestamps: false },
        );
        schema.plugin(uniqueValidator);

        try {
            mongoose.model('room', schema);
        } catch (e) {}
    }

    getInstance() {
        if (!Room.instance) {
            this.initSchema();
            Room.instance = mongoose.model('room');
        }
        return Room.instance;
    }
}

module.exports = { Room };
