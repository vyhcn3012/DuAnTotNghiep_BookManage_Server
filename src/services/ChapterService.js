"use strict";
const autoBind = require("auto-bind");
const { HttpResponse } = require("../../system/helpers/HttpResponse");
const mongoose = require("mongoose");
const { Service } = require("../../system/services/Service");
const {Account} = require("../models/Account");
const { UserService } = require("./UserService");
const { BookService } = require("./BookService");
const { Book } = require("../models/Book");

const bookService = new BookService(new Book().getInstance());
const userService = new UserService(new Account().getInstance());
class ChapterService extends Service{
    constructor(model) {
        super(model);
        this.model = model;
        autoBind(this);
    }

    async getChapterBook(id,idUser) {
        try{
            const book = await bookService.get(id);
          
            const chapter = await this.model.find({"idBook": id});
            const userChaper= await userService.findInfoById({"_id": idUser});
            const data=userChaper.data.payBook;
            let statusChapter=[];
            let count = 0;
            let dataChapter;
          
            for (const element of chapter) {
                
                const idChapter=element._id;
                
                for (const element2 of data) { 
                    const idChapterOfpayBook=element2.idChapter;
                    if(idChapter==idChapterOfpayBook){
                       count=1;
                    }
                }
                if(count==1){
                    if(element?.linkAudio && element?.htmlChapter){
                        dataChapter = {
                            isPay:true,
                            idChapter:element._id,
                            chapterNumber:element.chapterNumber,
                            title:element.title,
                            price:element.price,
                            canRead:true,
                            canListen:true,
                        }
                    }else if(element?.linkAudio){
                        dataChapter = {
                            isPay:true,
                            idChapter:element._id,
                            chapterNumber:element.chapterNumber,
                            title:element.title,
                            price:element.price,
                            canRead:false,
                            canListen:true,
                        }
                    }else if(element?.htmlChapter){
                        dataChapter = {
                            isPay:true,
                            idChapter:element._id,
                            chapterNumber:element.chapterNumber,
                            title:element.title,
                            price:element.price,
                            canRead:true,
                            canListen:false,
                        }
                    }
                    statusChapter.push(dataChapter);
                    count =0;
                }else{
                    if(book.isPrice===0){
                        if(element?.linkAudio && element?.htmlChapter){
                            dataChapter = {
                                isPay:true,
                                idChapter:element._id,
                                chapterNumber:element.chapterNumber,
                                title:element.title,
                                price:element.price,
                                canRead:true,
                                canListen:true,
                            }
                        }else if(element?.linkAudio){
                            dataChapter = {
                                isPay:true,
                                idChapter:element._id,
                                chapterNumber:element.chapterNumber,
                                title:element.title,
                                price:element.price,
                                canRead:false,
                                canListen:true,
                            }
                        }else if(element?.htmlChapter){
                            dataChapter = {
                                isPay:true,
                                idChapter:element._id,
                                chapterNumber:element.chapterNumber,
                                title:element.title,
                                price:element.price,
                                canRead:true,
                                canListen:false,
                            }
                        }
                    }else{
                        if(element?.linkAudio && element?.htmlChapter){
                            dataChapter = {
                                isPay:false,
                                idChapter:element._id,
                                chapterNumber:element.chapterNumber,
                                title:element.title,
                                price:element.price,
                                canRead:true,
                                canListen:true,
                            }
                        }else if(element?.linkAudio){
                            dataChapter = {
                                isPay:false,
                                idChapter:element._id,
                                chapterNumber:element.chapterNumber,
                                title:element.title,
                                price:element.price,
                                canRead:false,
                                canListen:true,
                            }
                        }else if(element?.htmlChapter){
                            dataChapter = {
                                isPay:false,
                                idChapter:element._id,
                                chapterNumber:element.chapterNumber,
                                title:element.title,
                                price:element.price,
                                canRead:true,
                                canListen:false,
                            }
                        }
                    }
                   
                    statusChapter.push(dataChapter);
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
    async getChapterDetails(id) {
        try {
            const item = await this.model.findById(id);
            if (!item) {
                const error = new Error("Không tìm thấy chương này");
                error.statusCode = 404;
                throw error;
              }
           
            return new HttpResponse( item );
        } catch ( error ) {
            throw new Error('Có lỗi, bạn có thể thử lại sau nhen');
        }
    }

    async getChapterByBook(idBook) {
        try {
            const item = await this.model.find({idBook: idBook});
            if (!item) {
                return null;
            }

            return new HttpResponse( item );
        }catch(error) {
            throw new Error('Có lỗi, bạn có thể thử lại sau nhen');
        }
    }

    async deleteChapter(ChapterId) {
        try {
            const item = await this.model.findByIdAndDelete(ChapterId);
            if (!item) {
                const error = new Error("Không tìm thấy chương này");
                error.statusCode = 404;
                throw error;
              }
           
            return new HttpResponse( item );
        } catch ( error ) {
            throw new Error('Có lỗi, bạn có thể thử lại sau nhen');
        }
    }

    async getChapterNumber(idBook) {
        try {
            const item = await this.model.find({idBook: idBook}).sort({chapterNumber: -1}).limit(1);
            if (item.length === 0) {
                return null;
            }

            return item[0].chapterNumber;
        }catch(error) {
            throw new Error('Có lỗi, bạn có thể thử lại sau nhen');
        }
    }
}

module.exports = { ChapterService };