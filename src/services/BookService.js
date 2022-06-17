'use strict';
const autoBind = require('auto-bind');
const { HttpResponse } = require('../../system/helpers/HttpResponse');
const mongoose = require('mongoose');
const { Service } = require('../../system/services/Service');
const { UserService } = require('./UserService');
class BookService extends Service{
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
            const book = await this.model
                .find(query)
                .sort(sortBy)
                .skip(skip)
                .limit(limit)
               
            // console.log(deps)
            return book;
        } catch (errors) {
            throw errors;
        }

    }

    async getBookById(id) {
            try {
                const book = await this.model.find({'account._id':id})  
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
    async getBookByIdCategory(id) {
        try {
            const book = await this.model.find({'categoryId':id})  
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
    

    async cpanel_GetbyId(id) {
        try {
            const book = await this.model.findById(id);
             
            if (!book) {
                const error = new Error('Không tìm thấy cuốn sách này');
                error.statusCode = 404;
                throw error;
            }
            // console.log(deps)
            return book;
        } catch (errors) {
            throw errors;
        }
      
    }

    async updateBook(id,data){
        try {
            return await super.update( id,data );
        } catch ( error ) {
            throw error;
        }
    }
    async deleteBook(id){
        try {
            return await super.delete(id);
        } catch ( error ) {
            throw error;
        }
    }





}
module.exports = { BookService };