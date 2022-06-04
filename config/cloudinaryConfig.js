
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: "cao-ng-fpt-polytechnic",
    api_key: "811123551641114",
    api_secret: "6DMIjAlUUCS8tRoJrDNSd_yqqCg"
  })

module.exports.uploads =(file) =>{
  
        cloudinary.uploader.upload(file)
   
};