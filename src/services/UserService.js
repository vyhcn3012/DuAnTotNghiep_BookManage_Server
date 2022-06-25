'use strict';
const { Service } = require('../../system/services/Service');
const autoBind = require('auto-bind');
const config = require('../../config/config').getConfig();
const { HttpResponse } = require('../../system/helpers/HttpResponse');

const request = require('request');

class UserService extends Service{
    constructor(model) {
        super(model);
        this.model = model;
        autoBind(this);
    }

    async insert(data) {
        //console.log("===> model", data);
        try {
            const item = await this.model.create(data);
            const account = await this.model
                .findById(item._id)
                .populate({
                    path: 'department',
                    populate: {
                        path: 'unit',
                        select: 'name _id'
                    }
                });

            if (account) {
                return (account);
            }
            throw new Error('Có lỗi, bạn có thể thử lại sau');
        } catch (errors) {
            //throw new Error('Có lỗi, bạn có thể thử lại sau', errors);;
        }
    }

    async getreadBook(id) {
        try {
            //$project: { count: { $size:"$historyBookRead" }}
            const readbook = await this.model.findById( id, { count: { $size:"$historyBookRead" } });
            if (!readbook) {
                const error = new Error('Không tìm thấy ');
                error.statusCode = 404;
                throw error;
            }
            console.log(id);
            return new HttpResponse( readbook);
        } catch (errors) {
            throw errors;
        }
    }

    async findByEmail(email) {  
        return this.model.findByEmail(email);
    }

    async getTimeRead(id) {
        try {
            const book = await this.model.find({'_id':id},{timeReadBook: 1})  
            if (!book) {
                const error = new Error('Không tìm thấy cuốn sách này');
                error.statusCode = 404;
                throw error;
            }
         
            console.log(book);
            return new HttpResponse( book);
        } catch (errors) {
            throw errors;
        }
}

    async findInfoByEmail(_email){
        try{
            let account = await this.findByEmail(_email);
            if(!account){
                throw new Error('Tài khoản không tìm thấy');
            }

            const { _id ,name, email, phone, permission, fcmtokens, image, 
                bookmark, wallet, favoritebooks} = account;

            account = {
                _id ,name, email, phone, permission, fcmtokens, image, 
                bookmark, wallet, favoritebooks 
            }
        if (account) {
            //console.log("===> user", user);
            return new HttpResponse(account);
        }
        throw new Error('Có lỗi, bạn có thể thử lại sau');
        } catch (e) {
            throw (e);
        }
    }
}

module.exports = { UserService };