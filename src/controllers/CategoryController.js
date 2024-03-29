const autoBind = require('auto-bind');
const { Controller } = require('../../system/controllers/Controller');
const { Category } = require('../models/Category');
const { CategoryService } = require('../services/CategoryService');
const categoryService = new CategoryService(new Category().getInstance());

class CategoryController extends Controller {

    constructor(service) {
        super(service);
        autoBind(this);
    }


    async getCategories(req, res, next) {
        try {
            const response = await this.service.getAll({ limit: 1000 });
            return res.status(response.statusCode).json(response);
        } catch (e) {
            // next(e);
        }
    }
    async cpanel_getAllCategories(req, res, next){
        const allCategories = await this.service.cpanel_GetAll({ limit: 1000 });
        res.render('book/insertbook', {allCategories: allCategories});
        
    }
    async getAllCategories_Cpanel(req, res, next){
        const allCategories = await this.service.cpanel_GetAll({ limit: 1000 });
        const data = allCategories.map((item, index) => {
            return {
                ...item.toObject(),
                index: index + 1,
            };
        });
        res.render('admin/manage-category/index.hbs', {allCategories: data});
    }
    async insertCategories_Cpanel(req, res, next){
        res.render('category/insert');     
    }
    async updateCategories_Cpanel(req, res, next){
        const { id } = req.params;
        const response = await this.service.getDetailCategory(id);
        res.render('admin/manage-category/detail-category.hbs', {data: response});     
    }

    async insertCategory(req, res, next) {
        try {
            const {body} = req;
            const response = await this.service.insertCategory(body);
            return res.status(response.statusCode).json(response);
        } catch (e) {
            next(e);
        }
    }
    async updateCategory(req, res, next) {
        try {
            const { name, image, description } = req.body;
            const { id } = req.params;
            const response = await this.service.updateCategory(id, name, image, description);
            return res.redirect('/cpanel/admins/quan-ly-danh-muc/' + id)
        } catch (e) {
            next(e);
        }
    }
    async deletCategory(req, res, next) {
        try {
          const { id } = req.params;
          console.log(id);
          const response = await this.service.deletCategory(id);
          return res.redirect('/cpanel/admins/quan-ly-danh-muc');
        } catch (e) {
          console.log(e);
        }
      }
}

module.exports = new CategoryController(categoryService);