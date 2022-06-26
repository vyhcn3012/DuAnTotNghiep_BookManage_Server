"use strict";
const autoBind = require("auto-bind");
const { HttpResponse } = require("../../system/helpers/HttpResponse");
const mongoose = require("mongoose");
const { Service } = require("../../system/services/Service");

class ChapterService extends Service{
    constructor(model) {
        super(model);
        this.model = model;
        autoBind(this);
    }

    async getChapterBook(_id) {
        try{
            const chapter = await this.model.find({"book.idBook": _id});
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
}

module.exports = { ChapterService };