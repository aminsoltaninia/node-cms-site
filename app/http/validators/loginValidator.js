const Validtor = require('./validator');
const {check} = require('express-validator');

class loginValidator extends Validtor {
    
    handle(){
         return [
           
            check('email')
              
                .isEmail()
                .withMessage('فیلد ایمیل  باشد')  ,

            check('password')
             
                .isLength({min:8})
                .withMessage('پسورد کمتر از 8 کرکتر نباشد')     
         ]
    }
}

module.exports = new loginValidator();