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
            const user = await this.model
                .findById(item._id)
                .populate({
                    path: 'department',
                    populate: {
                        path: 'unit',
                        select: 'name _id'
                    }
                });

            if (user) {
                return (user);
            }
            throw new Error('Có lỗi, bạn có thể thử lại sau');
        } catch (errors) {
            //throw new Error('Có lỗi, bạn có thể thử lại sau', errors);;
        }
    }

    async findByEmail(email) {  
        return this.model.findByEmail(email);
    }

    async findInfoByEmail(_email){
        try{
            let user = await this.findByEmail(_email);
            if(!user){
                throw new Error('Tài khoản không tìm thấy');
            }

            const { name, email, phone, permission, fcmtokens, image, 
                bookmark, payservices, favoritebooks} = user;

            user = {
                name, email, phone, permission, fcmtokens, image, 
                bookmark, payservices, favoritebooks 
            }
        if (user) {
            //console.log("===> user", user);
            return new HttpResponse(user);
        }
        throw new Error('Có lỗi, bạn có thể thử lại sau');
        } catch (e) {
            throw (e);
        }
    }
}

module.exports = { UserService };