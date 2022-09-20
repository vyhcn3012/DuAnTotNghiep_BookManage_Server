'use strict';
const { Service } = require('../../system/services/Service');
const autoBind = require('auto-bind');
const { HttpResponse } = require('../../system/helpers/HttpResponse');

const config = require('../../config/config').getConfig();

class NotificationService extends Service {
    constructor(model) {
        super(model);
        this.model = model;
        autoBind(this);
    }

    async createNotification(body){
        try {
            console.log("===> body", body);
            const item = await this.model.create(body);
                if (item) {
                    return new HttpResponse(item);
                }
            throw new Error('Có lỗi, bạn có thể thử lại sau');
        } catch (error) {
            throw new Error(error.message || 'Có lỗi, bạn có thể thử lại sau');
        }
    }
}

module.exports = { NotificationService };