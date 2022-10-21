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
        try{
            const { from, to } = req.body;
            const response = await this.service.getMessages(from, to);
            await res.status(response.statusCode).json(response);
        }catch(e){
            next(e);
        }
    }
}

module.exports = new MessageController(messageService);