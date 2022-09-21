"use strict";
const autoBind = require("auto-bind");
const { HttpResponse } = require("../../system/helpers/HttpResponse");
const mongoose = require("mongoose");
const { Service } = require("../../system/services/Service");
const {Account} = require("../models/Account");
const { NotificationService } = require("./NotificationService");
const { Notification } = require("../models/Notification");
const notificationService = new NotificationService(new Notification().getInstance());
class ChapterService extends Service{
    constructor(model) {
        super(model);
        this.model = model;
        autoBind(this);
    }

    async getChapterBook(_id) {
        try{
            const chapter = await this.model.find({"idBook": _id});
            if(!chapter){
                const error = new Error("Không tìm thấy chương này");
                error.statusCode = 404;
                throw error;
            }
            return new HttpResponse(chapter);
        }catch(errors){
            throw errors;
        }
    }

    async insertChapterBook(body){
        try {
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

module.exports = { ChapterService };