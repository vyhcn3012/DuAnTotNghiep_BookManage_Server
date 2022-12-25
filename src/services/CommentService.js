"use strict";
const autoBind = require("auto-bind");
const { HttpResponse } = require("../../system/helpers/HttpResponse");
const mongoose = require("mongoose");
const { Service } = require("../../system/services/Service");

class CommentService extends Service{
    constructor(model) {
        super(model);
        this.model = model;
        autoBind(this);
    }

    async getCommentChapters(_id) {
        try{
            const comment = await this.model.find({"idChapter": _id});
            // const comment = await this.model.find({"chapter.idChapter": _id});
            if(!comment){
                const error = new Error("Không tìm thấy bình luận");
                error.statusCode = 404;
                throw error;
            }
            return new HttpResponse(comment);
        }catch(errors){
            throw errors;
        }
    }

    async getCommentBooks(_id) {
        try{
            const comments = await this.model.find({ "idBook": _id });
            if(comments.length == 0){
                return null;
            }

            return comments;
        }catch(errors){
            throw errors;
        }
    }

}

module.exports = { CommentService };