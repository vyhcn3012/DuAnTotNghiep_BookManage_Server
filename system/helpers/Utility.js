'use strict';
const config = require('../../config/config').getConfig();

module.exports.checkRole = (a) =>{
    if(a == 1){
        var result = "";
    }else if(a == 2){
        var result = "hidden";
    }
    return result;
}