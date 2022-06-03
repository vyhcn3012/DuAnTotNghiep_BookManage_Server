'use strict';
const { Service } = require('../../system/services/Service');
const autoBind = require('auto-bind');
const config = require('../../config/config').getConfig();
const request = require('request');
const { HttpResponse } = require('../../system/helpers/HttpResponse');
const { BookService } = require('./BookService');
class AuthorService extends Service{
    constructor(model,bookModel) {
        super(model);
        this.model = model;
        this.bookService=new BookService(bookModel);
        autoBind(this);
    }
    async getAllAuthor(query) {
        let { skip, limit, sortBy } = query;
       
        skip = skip ? Number(skip) : 0;
        limit = limit ? Number(limit) : 10;
        sortBy = sortBy ? sortBy : { 'createdAt': -1 };

        delete query.skip;
        delete query.limit;
        delete query.sortBy;

        // must call redis first

        try {
         
            const author = await this.model
                .find(query)
                .sort(sortBy)
                .skip(skip)
                .limit(limit)
                return new HttpResponse( author);
        } catch (errors) {
            throw errors;
        }

    }

 
}

module.exports = { AuthorService };