'use strict';
const { Service } = require('../../system/services/Service');
const autoBind = require('auto-bind');
const { HttpResponse } = require('../../system/helpers/HttpResponse');

const config = require('../../config/config').getConfig();

class RoomService extends Service {
    constructor(model) {
        super(model);
        this.model = model;
        autoBind(this);
    }

    async getRooms(_id) {
        try {
            const item = await this.model.find({ users: { $in: [_id] } });
            if (item) {
                return new HttpResponse(item);
            }
            throw new Error('Có lỗi, bạn có thể thử lại sau');
        } catch (error) {
            throw new Error(error.message || 'Có lỗi, bạn có thể thử lại sau');
        }
    }

    async addMember(roomId, userId) {
        try {
            const item = await this.model.findOne({ _id: roomId });
            const users = item.users;

            if (users.includes(userId)) {
                throw new Error('Người dùng đã tồn tại trong phòng');
            }

            users.push(userId);
            const response = await this.model.updateOne(
                { _id: roomId },
                { users: users },
            );
            if (response) {
                return new HttpResponse(response);
            }
            throw new Error('Có lỗi, bạn có thể thử lại sau');
        } catch (error) {
            throw new Error(error.message || 'Có lỗi, bạn có thể thử lại sau');
        }
    }

    async removeMember(roomId, userId, idLeader) {
        try {
            const item = await this.model.findOne({ _id: roomId });
            if (idLeader == item.createdBy) {
                const users = item.users;
                if (!users.includes(userId)) {
                    throw new Error('Người dùng không tồn tại trong phòng');
                }

                const index = users.indexOf(userId);
                if (index > -1) {
                    users.splice(index, 1);
                }

                const response = await this.model.updateOne(
                    { _id: roomId },
                    { users: users },
                );
                if (response) {
                    return new HttpResponse(response);
                }
            }
            throw new Error('Ban không có quyền xóa thành viên');
        } catch (error) {
            throw new Error(error.message || 'Có lỗi, bạn có thể thử lại sau');
        }
    }

    async updateRoom(roomId, name, image) {
        try {
            if (!name && !image) {
                throw new Error('Bạn chưa nhập thông tin');
            }

            if (name && !image) {
                const response = await this.model.updateOne(
                    { _id: roomId },
                    { name: name },
                );

                if (response) {
                    return new HttpResponse(response);
                }
            }

            if (!name && image) {
                //
            }
        } catch (error) {
            throw new Error(error.message || 'Có lỗi, bạn có thể thử lại sau');
        }
    }
}

module.exports = { RoomService };
