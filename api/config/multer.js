const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("./aws");
require("dotenv").config();;


module.exports =  multer({
    fileSize: 15 *  1024 * 1024,
    fileFilter:(req, file, cb)=>{
        const array = file.originalname.split(".")
        const extension = array[array.length-1];
      
        if (extension == "png" || extension == "jpg" || extension == "jfif") cb(null, true);
        else {
            cb(new Error("Images of JPEG and PNG formats are only accepted"), false);
        }
    },
    storage: multerS3({
      s3,
      bucket: 'blogapi1408',
      acl: 'public-read',
    //   contentType:"image/jpeg",
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
        const array = file.originalname.split(".")
        const extension = array[array.length-1];
        cb(null, Date.now()+"-"+file.originalname)
      }
    })
  })