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

    async getMessages(room, _idUser) {
        try {
            const messages = await this.model
                .find({ room: room })
                .populate('user')
                .sort({ updatedAt: 1 });
            const projectedMessages = messages.map((msg) => {
                return {
                    fromSelf: msg.user._id.toString() === _idUser,
                    message: msg.message.text,
                    createdAt: msg.createdAt,
                    name: msg.user.name,
                    avatar: msg.user.image,
                    image: msg.image,
                };
            });

            return new HttpResponse(projectedMessages);
        } catch (e) {
            throw new Error('Có lỗi, bạn có thể thử lại sau');
        }
    }

    async sendMessage(message, room, _idUser, image, dataImage) {
        try {
            const data = await this.model.create({
                message: { text: message },
                room: room,
                user: _idUser,
                avatar: image,
                createdAt: new Date(),
                image: dataImage,
                
            });

            return new HttpResponse(data);
        } catch (e) {
            console.log(e);
            throw new Error('Có lỗi, bạn có thể thử lại sau');
        }
    }
}

module.exports = { MessageService };
