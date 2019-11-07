const validator = require('./validator');
const { check } = require('express-validator');

class resetPasswordValidator extends validator {
    
    handle() {
        return [
            check('email')
                .isEmail()
                .withMessage('فیلد ایمیل معتبر نیست'),
           
            check('token')
                 .not().isEmpty()
                 .withMessage('فیلد توکن نباید خالی باشد'),

            check('password')
                 .isLength({ min : 8 })
                 .withMessage('فیلد پسورد نمیتواند کمتر از 8 کاراکتر باشد')        
        ]
    }
}

module.exports = new resetPasswordValidator();