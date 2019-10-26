const Validtor = require('./validator');
const {check} = require('express-validator');

class registerValidator extends Validtor {
    
    handle(){
         return [
            check('name')
                .not().isEmpty()
                .withMessage('فیلد نام نمی تواند خالی باشد')
                .isLength({min:5})
                .withMessage('فیلد نام نمی تواند کمتر از 5 کرکتر باشد'),

            check('email')
                .not().isEmpty()
                .withMessage('فیلد ایمیل نمی تواند خالی باشد')
                .isEmail()
                .withMessage('فیلد ایمیل  باشد')  ,

            check('password')
                .not().isEmpty()
                .withMessage('فیلد پسورد نمی تواند خالی باشد')
                .isLength({min:8})
                .withMessage('پسورد کمتر از 8 کرکتر نباشد')     
         ]
    }
}

module.exports = new registerValidator();