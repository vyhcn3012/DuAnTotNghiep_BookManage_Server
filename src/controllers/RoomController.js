const autoBind = require('auto-bind');
const { Controller } = require('../../system/controllers/Controller');
const { Account } = require('../models/Account');
const { Room } = require('../models/Room');
const { RoomService } = require('../services/RoomService');
const { UserService } = require('../services/UserService');

const roomService = new RoomService(new Room().getInstance());
const userService = new UserService(new Account().getInstance());
class RoomController extends Controller {
    constructor(service) {
        super(service);
        autoBind(this);
    }

    async createRoom(req, res, next) {
        try {
            const { name, file, users } = req.body;
            const dataUsers =  JSON.parse(users)
            console.log(dataUsers);
            const createdBy = req.account._id;
            // users.push(createdBy);
            let urlImage;
            if(file){
                urlImage = await userService.createImage(
                    'data:image/jpeg;base64,' + file,
                );
            }
            const response = await roomService.createRoom({
                name,
                image: urlImage ? urlImage.data.url : '',
                users: dataUsers,
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

    async addMember(req, res, next) {
        try {
            const { roomId, userId } = req.body;
            const response = await this.service.addMember(roomId, userId);
            await res.status(response.statusCode).json(response);
        } catch (e) {
            next(e);
        }
    }

    async removeMember(req, res, next) {
        try {
            const { _id } = req.account;
            const { roomId, userId } = req.body;
            const response = await this.service.removeMember(
                roomId,
                userId,
                _id,
            );
            await res.status(response.statusCode).json(response);
        } catch (e) {
            next(e);
        }
    }

    async updateRoom(req, res, next) {
        try {
            const { roomId, name, file } = req.body;
            const urlImage = await UserService.createImage(
                'data:image/jpeg;base64,' + file,
            );
            const response = await this.service.updateRoom(
                roomId,
                name,
                urlImage,
            );
            await res.status(response.statusCode).json(response);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new RoomController(roomService);
