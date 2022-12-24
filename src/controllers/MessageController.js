const autoBind = require('auto-bind');
const { Controller } = require('../../system/controllers/Controller');
const { Message } = require('../models/Message');
const { MessageService } = require('../services/MessageService');
const { UserService } = require('./../services/UserService');
const { Account } = require('./../models/Account');
const messageService = new MessageService(new Message().getInstance());
const userService = new UserService(new Account().getInstance());
class MessageController extends Controller {
    constructor(service) {
        super(service);
        autoBind(this);
    }

    async getMessages(req, res, next) {
        try {
            const { room } = req.body;
            const { _id } = req.account;
            const response = await this.service.getMessages(room, _id);
            await res.status(response.statusCode).json(response);
        } catch (e) {
            next(e);
        }
    }

    async sendMessage(req, res, next) {
        try {
            const { _id, image } = req.account;
            const { room, message, file } = req.body;
            let dataImage;
            if (file) {
                const urlImage = await userService.createImage(
                    'data:image/jpeg;base64,' + file,
                );
                dataImage = {
                    image: urlImage.data.url,
                };
            } else {
               dataImage = '';
            }
            const response = await this.service.sendMessage(message, room, _id, image,dataImage);
            await res.status(response.statusCode).json(response);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new MessageController(messageService);
