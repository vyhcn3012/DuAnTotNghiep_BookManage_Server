'use strict';
const { Service } = require('../../system/services/Service');
const autoBind = require('auto-bind');
const { HttpResponse } = require('../../system/helpers/HttpResponse');

const config = require('../../config/config').getConfig();

class MessageService extends Service {
    constructor(model) {
        super(model);
        this.model = model;
        autoBind(this);
    }

    async getMessages(from, to) {
        const messages = await this.model.find({
            users: {
                $all: [from, to],
              },
            }).sort({ updatedAt: 1 });

        const projectedMessages = messages.map((msg) => {
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text,
            };
        });

        return new HttpResponse(projectedMessages);
    }
}

module.exports = { MessageService };
