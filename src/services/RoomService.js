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
}

module.exports = { RoomService };
