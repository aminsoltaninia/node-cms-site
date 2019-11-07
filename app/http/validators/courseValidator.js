const validator = require('./validator');
const { check } = require('express-validator');
const Course = require('app/models/course');
class registerValidator extends validator {
    
    handle() {
        return [
            check('title')
                .isLength({ min : 5 })
                .withMessage('فیلد تایتل نمیتواند کمتر از 5 کاراکتر باشد')
                .custom(async (value)=>{
                    let course = await Course.findOne({slug: this.slug(value)})   
                    if(course)
                      throw new Error('این عنوان دوره قبلا ایجاد شده است');
                }) ,   
            check('type')
                .not().isEmpty()
                .withMessage('فیلد عنوان نمیتواند خالی باشد'),

            check('body')
                .isLength({ min : 20 })
                .withMessage('متن دوره نمیتواند کمتر از 20 کاراکتر باشد '),

            check('price')
                .not().isEmpty()
                .withMessage('فیلد قیمت نمیتواند خالی باشد'),

            
            check('tags')
                .not().isEmpty()
                .withMessage('فیلد تگ نمیتواند خالی باشد')
        ]
    }

    slug(title){
        return title.replace(/([^0-9a-z0-9آ-یA-Z]|-)+/g,"-");
    }
}

module.exports = new registerValidator();