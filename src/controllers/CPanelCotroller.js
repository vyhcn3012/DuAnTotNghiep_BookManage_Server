const autoBind = require('auto-bind')


class CPanelController {
    constructor(){
        autoBind(this)
    }

    async index(req, res, next){
        try{
            res.render('index')
        }catch(e){
            console.log(e)
        }
    }
}


module.exports = new CPanelController()
