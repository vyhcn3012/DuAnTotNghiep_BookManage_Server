const autoBind = require('auto-bind');
const { Controller } = require('../../system/controllers/Controller');
const { Message } = require('../models/Message');
const { MessageService } = require('../services/MessageService');
const messageService = new MessageService(new Message().getInstance());

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
            const { _id } = req.account;
            const { room, message } = req.body;
            const response = await this.service.sendMessage(message, room, _id);
            await res.status(response.statusCode).json(response);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new MessageController(messageService);
