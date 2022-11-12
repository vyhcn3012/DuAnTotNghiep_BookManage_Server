const autoBind = require('auto-bind');
const { Controller } = require('../../system/controllers/Controller');
const { Room } = require('../models/Room');
const { RoomService } = require('../services/RoomService');

const roomService = new RoomService(new Room().getInstance());

class RoomController extends Controller {
    constructor(service) {
        super(service);
        autoBind(this);
    }

    async createRoom(req, res, next) {
        try {
            const { name, user } = req.body;
            console.log('===> name', name, user);
            const response = await this.service.insert(name, user);
            await res.status(response.statusCode).json(response);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new RoomController(roomService);
