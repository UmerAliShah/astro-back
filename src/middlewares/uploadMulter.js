const multer = require("multer");
// const path = require('node:path');
// var storage = multer.diskStorage({
//     destination: function(req, file, callback) {
//        callback(null, "./src/images");
//     },
//     filename: function (req, file, callback) {
// 		const uniqueSuffix =  '-' +Date.now()
//        callback(null , path.basename(file.originalname,path.extname(file.originalname))+uniqueSuffix+path.extname(file.originalname));
//     }
//  });
module.exports = multer({
  storage: multer.diskStorage({}),
  limits: { fieldSize: 25 * 1024 * 1024 },
});
