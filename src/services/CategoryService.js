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

 
}

module.exports = { CategoryService };