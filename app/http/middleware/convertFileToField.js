const User = require('app/models/user');
const middleware = require('./middleware');

class convertFileToField extends middleware {
    
    handle(req , res ,next) {
       
        console.log(req.file);
        if (!req.file)// age file mojod nabood
            req.body.images = undefined;
        else
         req.body.images = req.file.originalname;

        next();
    }

}


module.exports = new convertFileToField();