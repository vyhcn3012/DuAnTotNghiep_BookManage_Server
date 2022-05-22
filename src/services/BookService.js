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

    async getBooks() {
        const res = await this.model.getAll({ limit: 1000 });
        return new HttpResponse(res);
    }

    async insertBook(data){
        try {
            return await super.insert( data );
        } catch ( error ) {
            throw error;
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