'use strict';
const autoBind = require('auto-bind');
const { HttpResponse } = require('../../system/helpers/HttpResponse');
const mongoose = require('mongoose');
const { Service } = require('../../system/services/Service');
const config = require('../../config/config').getConfig();

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