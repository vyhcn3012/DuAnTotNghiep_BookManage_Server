var multer=require('multer');
var path=require('path');
const autoBind = require('auto-bind');
const ALLOWED_FORMATS = ['image/jpeg', 'image/png', 'image/jpg'];
const DatauriParser = require('datauri/parser');
const parser = new DatauriParser();
const { Controller } = require('../../system/controllers/Controller');
const { MediaService } = require('../services/MediaService');
const formatBufferTo64 = file => parser.format(path.extname(file.originalname).toString(), file.buffer)
const cloudinary = require('cloudinary').v2;
const storage = multer.memoryStorage();
const upload = multer({
  storage
})
const singleUpload = upload.single('image');
class MediaController extends Controller {

    constructor(service) {
        super(service);
        autoBind(this);
    }
    async singleUpload(){
        return singleUpload;
    }

    async createImage(req, res) {
        try {
            const file64 = formatBufferTo64(req.file);
            const uploadResult = cloudinary.uploads(file64.content);
    
            return res.json({cloudinaryId: uploadResult.public_id, url: uploadResult.secure_url});
          } catch(e) {
            return res.status(422).send({message: e.message})
          }
    }
}

module.exports = new MediaController(MediaService);