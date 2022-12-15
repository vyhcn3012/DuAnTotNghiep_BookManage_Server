const autoBind = require('auto-bind');
const { Controller } = require('../../system/controllers/Controller');
const { CartService } = require('../services/CartService');
const { Cart } = require('../models/Cart');


const cartService = new CartService(new Cart().getInstance());

class CartController extends Controller{
    constructor(service) {
        super(service);
        autoBind(this);
    }
    async createCart(req, res, next) {
        try {
            const {idBook, idChapter, purchaseDate}=req.body;
            const body = {
                idBook,
                idChapter,
                purchaseDate,
            }
            const response = await this.service.createCart(body);
          
            await res.status(response.statusCode).json(response);
        } catch (e) {
            // next(e);
        }
    }

    async getToTalBooks(req, res, next) {
        try {
            const { month, idUser }=req.body;
            // const idUser=req.account._id;
          
            const response = await this.service.getToTalBooks(idUser, month);
            await res.status(response.statusCode).json(response);
        } catch (e) {
            // next(e);
        }
    }
}

module.exports = new CartController(cartService);