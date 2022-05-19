'use strict';
const { Service } = require('../../system/services/Service');
const autoBind = require('auto-bind');
const config = require('../../config/config').getConfig();

const request = require('request');

class UserService extends Service{
    constructor(model) {
        super(model);
        this.model = model;
        autoBind(this);
    }

    async insert(data) {
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
            throw new Error('Có lỗi, bạn có thể thử lại sau');;
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

            const { name, email, phone, password, permission, fcmtokens, image, 
                bookmark, payservices, favoritebooks} = user;

            user = {
                name, email, phone, password, permission, fcmtokens, image, 
                bookmark, payservices, favoritebooks 
            }
        if (user) {
            return new HttpResponse(user);
        }
        throw new Error('Có lỗi, bạn có thể thử lại sau');
        } catch (e) {
            throw (e);
        }
    }
}

module.exports = { UserService };