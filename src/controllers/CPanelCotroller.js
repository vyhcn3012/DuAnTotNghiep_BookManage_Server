const autoBind = require('auto-bind')


class CPanelController {
    constructor(){
        autoBind(this)
    }

    async index(req, res, next){
        try{
            res.render('auth/login')
        }catch(e){
            console.log(e)
        }
    }
}


module.exports = new CPanelController()
