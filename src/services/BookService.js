const autoBind = require('auto-bind');
const { HttpResponse } = require('../../system/helpers/HttpResponse');
const mongoose = require('mongoose');
const config = require('../../config/config').getConfig();

class BookService {
    constructor(model, userModel) {
        this.model = model;
        this.userService = new UserService(userModel);
        autoBind(this);
    }
}