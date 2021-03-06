const validator = require('./validator');
const { check } = require('express-validator');
const Category = require('app/models/category');


class categoryValidator extends validator {
    
    handle() {
        return [
            check('name')
                .isLength({ min : 3 })
                .withMessage('فیلد تایتل نمیتواند کمتر از 3 کاراکتر باشد')
                .custom(async(value , { req }) => {
                       if(req.query._method === 'put'){
                          let category = await Category.findById(req.params.id);
                          if(category.name === value) return;
                       }
                       let category = await Category.findOne({ name : value });
                       if(category){
                           throw new Error('چنین دسته ای با این عنوان قبلا ایحاد شده است')
                       }

                }),
                 
            check('parent')
                .not().isEmpty()
                .withMessage('فیلد پدر دسته نمیتواند خالی باشد')

        ]
    }

  
}

module.exports = new categoryValidator();