"use strict";
const autoBind = require("auto-bind");
const { HttpResponse } = require("../../system/helpers/HttpResponse");
const mongoose = require("mongoose");
const { Service } = require("../../system/services/Service");
const {Account} = require("../models/Account");
const { NotificationService } = require("./NotificationService");
const { Notification } = require("../models/Notification");
const { UserService } = require("./UserService");
const notificationService = new NotificationService(new Notification().getInstance());
const userService = new UserService(new Account().getInstance());
class ChapterService extends Service{
    constructor(model) {
        super(model);
        this.model = model;
        autoBind(this);
    }

    async getChapterBook(id,idUser) {
        try{
            const chapter = await this.model.find({"idBook": id});
            const userChaper= await userService.findInfoById({"_id": idUser});
            const data=userChaper.data.payBook;
            let statusChapter=[];
            for (const element of chapter) {
                for (const element1 of data) { 
                  if(element._id.toString()==element1.idChapter.toString()){
                    const data = {
                        isPay:true,
                        element
                    }
                    statusChapter.push(data);
                  }else{
                    const data = {
                        isPay:false,
                        element
                    }
                    statusChapter.push(data);
                  }
                }
            }
            return new HttpResponse(statusChapter);
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