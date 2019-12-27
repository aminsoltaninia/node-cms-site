const validator = require('./validator');
const { check } = require('express-validator');
const Permission = require('app/models/permission');


class permissionValidator extends validator {
    
    handle() {
        return [
            check('name')
                .isLength({ min : 3 })
                .withMessage('فیلد تایتل نمیتواند کمتر از 3 کاراکتر باشد')
                .custom(async(value , { req }) => {
                       if(req.query._method === 'put'){
                          let permission = await Permission.findById(req.params.id);
                          if(permission.name === value) return;
                       }
                       let permission = await Permission.findOne({ name : value });
                       if(permission){
                           throw new Error('چنین اجازه دسترسی  با این عنوان قبلا ایحاد شده است')
                       }

                }),
                 
            check('label')
                .not().isEmpty()
                .withMessage('فیلد توضیح  نمیتواند خالی باشد')

        ]
    }

  
}

module.exports = new permissionValidator();