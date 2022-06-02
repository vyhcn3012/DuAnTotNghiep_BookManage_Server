'use strict';
const {UserService} = require('./UserService');
const autoBind = require('auto-bind');
const { HttpResponse } = require('../../system/helpers/HttpResponse');
const mongoose = require('mongoose');
const config = require('../../config/config').getConfig();

class AuthService {
    constructor(model, userModel) {
        this.model = model;
        this.userService = new UserService(userModel);
        autoBind(this);
    }

    async login(body){
        const { name, email, phone, permission, image, bookmark, payservices,
            favoritebooks, token_fcm } = body;

        try {
            let user = await this.userService.findByEmail(email);
            if(!user){
                const data = {
                    fcmtokens: token_fcm ? [token_fcm] : [],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    createdBy: null,
                    updatedBy: null,
                    name, email, phone, permission, image, bookmark, payservices,
                    favoritebooks
                }
                user = await this.register(data);
            }
            if(token_fcm) {
                let checkFCM = user.fcmtokens.filter(i => i == token_fcm)[0];
                //console.log("===> checkFCM", checkFCM);
                if (!checkFCM && token_fcm){
                    user.fcmtokens = [...user.fcmtokens, token_fcm];
                    user.fcmtokens = user.fcmtokens.slice(Math.max(user.fcmtokens.lenght - 3, 0));
                    await this.userService.update(user._id, {fcmtokens: user.fcmtokens});
                }
            }
            let cacheUser = await this.userService.findInfoByEmail(email);
            cacheUser = cacheUser.data;
            //console.log("===> cacheUser", cacheUser);

            const token = await this.model.generateToken(cacheUser);
            await this.model.create({ token, 'user': new mongoose.mongo.ObjectId(cacheUser._id) });
            const tokenData = await this.model.findOne({ 'token': token });

            const _tokenData = {
                _id: tokenData._id,
                token: tokenData.token,
                user: cacheUser,
            }
            return new HttpResponse(_tokenData);
        } catch (e) {
            console.log('>>>>>>>>79 Auth service error: ', e);
            throw e;
        }
    }

    async register(data) {
        try {
            return await this.userService.insert(data);
        } catch (error) {
            throw error;
        }
    }

    async checkLogin(token) {
        try {
            // Check if the token is in the Database
            const tokenInDB = await this.model.countDocuments({ token });
            if (!tokenInDB) {
                const error = new Error('Token không đúng');

                error.statusCode = 401;
                throw error;
            }
            // Check the token is a valid JWT
            const user = await this.model.decodeToken(token);
            if (!user) {
                const error = new Error('Token không đúng');

                error.statusCode = 401;
                throw error;
            }
            
            // Check the Extracted user is active in DB
            let userFromDb = await this.userService.findInfoByEmail(user.email);
            
            if (userFromDb.data) {
                return userFromDb.data;
            }
            const error = new Error('Token không đúng');

            error.statusCode = 401;
            throw error;

        } catch (e) {
            const error = new Error('Token không đúng');

            error.statusCode = 401;
            throw error;
        }
    }
}

module.exports = { AuthService };