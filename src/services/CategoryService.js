'use strict';
const { Service } = require('../../system/services/Service');
const autoBind = require('auto-bind');
const config = require('../../config/config').getConfig();
const { HttpResponse } = require("../../system/helpers/HttpResponse");
const request = require('request');
var ObjectId = require('mongodb').ObjectId;
class CategoryService extends Service{
    constructor(model) {
        super(model);
        this.model = model;
        autoBind(this);
    }
    async cpanel_GetAll(query) {
        let { skip, limit, sortBy } = query;

        skip = skip ? Number(skip) : 0;
        limit = limit ? Number(limit) : 10;
        sortBy = sortBy ? sortBy : { 'createdAt': -1 };

        delete query.skip;
        delete query.limit;
        delete query.sortBy;

        // must call redis first

        try {
            const category = await this.model
                .find(query)
                .sort(sortBy)
                .skip(skip)
                .limit(limit)
               
            // console.log(deps)
            return category;
        } catch (errors) {
            throw errors;
        }

    }
    async insertCategory(body) {
        try {
            const {tentheloai,hinhAnh,moTa} = body;
            const data = {
                name:tentheloai, 
                image:hinhAnh,
                description:moTa,
            }       
           
            const item = await this.model.create( data );
            return new HttpResponse( item );          
        } catch ( error ) {
            throw new Error('Có lỗi, bạn có thể thử lại sau nhen');;
        }
    }
    async updateCategory(idBook, name, image, description) {
        try {
            const data = {
                name: name, 
                image: image,
                description: description,
            }       
           
            const item = await this.model.findByIdAndUpdate(idBook, data);
            return new HttpResponse( item );          
        } catch ( error ) {
            throw new Error('Có lỗi, bạn có thể thử lại sau nhen');;
        }
    }

    async getAll() {
        try {
            const category = await this.model.find({});
            return new HttpResponse( category );
        } catch (errors) {
            throw errors;
        }
    }
    async getDetailCategory(idCategory) {
        try {
            const _id = new ObjectId(idCategory);
            const item = await this.model.findById(_id);
            if (!item) {
                const error = new Error("Không tìm thấy thể loại này");
                error.statusCode = 404;
                throw error;
              }
           
            return item;
        } catch ( error ) {
            console.log(error);
        }
    }
    async deletCategory(id) {
        try {
           
            const item = await this.model.findByIdAndDelete(id);
            if (!item) {
                const error = new Error("Không tìm thấy nhà trọ này");
                error.statusCode = 404;
                throw error;
              }
           
            return new HttpResponse( item );
        } catch ( error ) {
            throw new Error('Có lỗi, bạn có thể thử lại sau nhen');
        }
    }

    async findOne(categoryId) {
        try {
            const item = await this.model.findById(categoryId);
            return item;
        } catch ( error ) {
            throw new Error('Có lỗi, bạn có thể thử lại sau nhen');
        }
    }

 
}

module.exports = { CategoryService };