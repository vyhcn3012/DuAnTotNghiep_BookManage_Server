'use strict';
const { Service } = require('../../system/services/Service');
const autoBind = require('auto-bind');
const config = require('../../config/config').getConfig();

const request = require('request');

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
                tentheloai, 
                hinhAnh,
                moTa ,
            }
           
            const item = await this.model.create( data );
            return new HttpResponse( item );
            
            
            
        } catch ( error ) {
            throw new Error('Có lỗi, bạn có thể thử lại sau nhen');;
        }
    }

 
}

module.exports = { CategoryService };