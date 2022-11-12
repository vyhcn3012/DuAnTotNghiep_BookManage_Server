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
            const { name, image, users } = req.body;
            const createdBy = req.account._id;
            users.push(createdBy);
            const response = await this.service.insert({
                name,
                image,
                users,
                createdBy,
                createdAt: new Date(),
            });
            await res.status(response.statusCode).json(response);
        } catch (e) {
            next(e);
        }
    }

    async getRooms(req, res, next) {
        try {
            const { _id } = req.account;
            const response = await this.service.getRooms(_id);
            await res.status(response.statusCode).json(response);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new RoomController(roomService);
