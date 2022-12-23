'use strict';
const autoBind = require('auto-bind');
const { HttpResponse } = require('../../system/helpers/HttpResponse');
const mongoose = require('mongoose');
const { Service } = require('../../system/services/Service');
const { BookService } = require('../services/BookService');
const { Book } = require('../models/Book');
const bookService = new BookService(new Book().getInstance());

class CartService extends Service {
    constructor(model) {
        super(model);
        this.model = model;
        autoBind(this);
    }

    async createCart(body) {
        try {
            const item = await this.model.create(body);

            if (item) {
                return new HttpResponse(item);
            }
            throw new Error('Có lỗi, bạn có thể thử lại sau');
        } catch (error) {
            throw new Error(error.message || 'Có lỗi, bạn có thể thử lại sau');
        }
    }

    async getToTalBooks(idUser, month) {
        try {
            var d = new Date();
            const year = d.getFullYear();
            let start = new Date();
            let end = new Date();
            start.setFullYear(2022);
            start.setMonth(month - 1);
            start.setDate(1);
            end.setFullYear(year);
            end.setMonth(month - 1);
            if (
                month == 1 ||
                month == 3 ||
                month == 5 ||
                month == 7 ||
                month == 8 ||
                month == 10 ||
                month == 12
            ) {
                end.setDate(31);
            } else {
                end.setDate(28);
            }
            const userBook = await bookService.getBookById(idUser);
            const data = userBook.data;
            let count = 0;
            for (const element of data) {
                const query = {
                    idBook: element._id,
                    purchaseDate: {
                        $gte: start.toISOString(),
                        $lte: end.toISOString(),
                    },
                };
                const item = await this.model.find(query),
                    total = await this.model.countDocuments(query);
                count = total;
            }
            if (userBook) {
                return new HttpResponse({ totalCount: count });
            }
            throw new Error('Có lỗi, bạn có thể thử lại sau');
        } catch (error) {
            throw new Error(error.message || 'Có lỗi, bạn có thể thử lại sau');
        }
    }

    async getAllTotalPrice12Month() {
        const carts = await this.model.find();
        return carts;
    }
}
module.exports = { CartService };
